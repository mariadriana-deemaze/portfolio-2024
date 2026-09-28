import nodemailer from 'nodemailer';
import { z } from 'zod';
import { getEnv } from '@/lib/env';
import {
	CONTACT_FIELD_MAX,
	type ContactInfo,
	type ContactResponse
} from '@/server/routes/api/types/contact';
import { normalizeString } from '@/utils/string';

import {
	clearEmailSend,
	getEmailRateLimitKey,
	isEmailRateLimited,
	isIpRateLimited,
	recordEmailSend
} from './rate-limit';
import { buildContactEmailHtml } from './template';
import { verifyTurnstileToken } from './turnstile';

const TURNSTILE_TOKEN_MAX = 2048;
const UNKNOWN_CLIENT_IP = 'unknown';

const contactInfoSchema = z.object({
	email: z.email().max(CONTACT_FIELD_MAX.email),
	message: z.string().trim().min(1).max(CONTACT_FIELD_MAX.message),
	name: z.string().trim().min(1).max(CONTACT_FIELD_MAX.name),
	subject: z.string().trim().min(1).max(CONTACT_FIELD_MAX.subject)
});

const honeypotSchema = z.object({
	website: z.string().trim().max(0).optional()
});

const turnstileSchema = z.object({
	turnstileToken: z.string().trim().min(1).max(TURNSTILE_TOKEN_MAX)
});

function createTransporter() {
	const env = getEnv();

	return nodemailer.createTransport({
		host: env.SMTP_HOST,
		port: env.SMTP_PORT,
		secure: env.SMTP_PORT === 465,
		auth: {
			user: env.SMTP_FROM,
			pass: env.SMTP_PASSWORD
		}
	});
}

function hasValidHoneypot(body: unknown): boolean {
	return honeypotSchema.safeParse(body).success;
}

function getValidatedContactInfo(body: unknown): ContactInfo | undefined {
	const result = contactInfoSchema.safeParse(body);

	return result.success ? result.data : undefined;
}

function getTurnstileToken(body: unknown): string | undefined {
	const result = turnstileSchema.safeParse(body);

	return result.success ? result.data.turnstileToken : undefined;
}

/**
 * Coolify's proxy appends the address it received from to `x-forwarded-for`, so
 * the rightmost entry is the one it wrote. Anything a client injects itself
 * lands to the left of that, which makes the rightmost the least spoofable
 * value available here.
 */
function getClientIp(request: Request): string {
	const forwardedFor = request.headers.get('x-forwarded-for');

	if (forwardedFor) {
		const entries = forwardedFor.split(',');
		const closest = entries[entries.length - 1]?.trim();

		if (closest) return closest;
	}

	return UNKNOWN_CLIENT_IP;
}

async function parseJsonBody(request: Request): Promise<unknown> {
	try {
		return await request.json();
	} catch {
		return undefined;
	}
}

function badRequest(): Response {
	return Response.json({ message: 'Missing required fields.' } satisfies ContactResponse, {
		status: 400
	});
}

export async function handleSendPost(request: Request): Promise<Response> {
	const body = await parseJsonBody(request);

	if (!hasValidHoneypot(body)) {
		return badRequest();
	}

	const contactInfo = getValidatedContactInfo(body);
	const turnstileToken = getTurnstileToken(body);

	if (!contactInfo || !turnstileToken) {
		return badRequest();
	}

	const clientIp = getClientIp(request);
	const emailKey = getEmailRateLimitKey(contactInfo.email);

	if (isIpRateLimited(clientIp) || isEmailRateLimited(emailKey)) {
		return Response.json(
			{
				message: 'Please wait a few minutes before sending again.'
			} satisfies ContactResponse,
			{ status: 429 }
		);
	}

	if (!(await verifyTurnstileToken(turnstileToken, clientIp))) {
		return Response.json(
			{
				message: 'Anti-spam check failed. Please try again.'
			} satisfies ContactResponse,
			{ status: 400 }
		);
	}

	recordEmailSend(emailKey);

	try {
		const env = getEnv();
		const safeSubject = contactInfo.subject.replace(/[\r\n]/g, ' ');
		await createTransporter().sendMail({
			from: env.SMTP_FROM,
			to: env.SMTP_TO,
			subject: `Contact request: ${safeSubject}`,
			html: buildContactEmailHtml({
				name: contactInfo.name,
				email: normalizeString(contactInfo.email),
				message: contactInfo.message
			})
		});

		return Response.json({ message: 'Message sent successfully.' } satisfies ContactResponse, {
			status: 200
		});
	} catch (error) {
		clearEmailSend(emailKey);
		console.error('Error sending email:', error);

		return Response.json(
			{
				message: 'Error sending email.'
			} satisfies ContactResponse,
			{ status: 500 }
		);
	}
}
