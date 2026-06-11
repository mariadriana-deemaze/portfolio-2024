import nodemailer from 'nodemailer';
import { z } from 'zod';
import { getEnv } from '@/lib/env';
import {
	CONTACT_FIELD_MAX,
	type ContactInfo,
	type ContactResponse
} from '@/server/routes/api/types/contact';
import { normalizeString } from '@/utils/string';

import { buildContactEmailHtml } from './template';

const RATE_LIMIT_WINDOW_MS = 3 * 60 * 1000;
const recentByEmail = new Map<string, number>();

const contactInfoSchema = z.object({
	email: z.email().max(CONTACT_FIELD_MAX.email),
	message: z.string().trim().min(1).max(CONTACT_FIELD_MAX.message),
	name: z.string().trim().min(1).max(CONTACT_FIELD_MAX.name),
	subject: z.string().trim().min(1).max(CONTACT_FIELD_MAX.subject)
});

const honeypotSchema = z.object({
	website: z.string().trim().max(0).optional()
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

export async function handleSendPost(request: Request): Promise<Response> {
	const body = await request.json();

	if (!hasValidHoneypot(body)) {
		return Response.json(
			{
				message: 'Missing required fields.'
			} satisfies ContactResponse,
			{ status: 400 }
		);
	}

	const contactInfo = getValidatedContactInfo(body);

	if (!contactInfo) {
		return Response.json(
			{
				message: 'Missing required fields.'
			} satisfies ContactResponse,
			{ status: 400 }
		);
	}

	const normalizedEmail = normalizeString(contactInfo.email);
	const now = Date.now();
	const lastSendAt = recentByEmail.get(normalizedEmail);

	if (lastSendAt && now - lastSendAt < RATE_LIMIT_WINDOW_MS) {
		return Response.json(
			{
				message: 'Please wait a few minutes before sending again.'
			} satisfies ContactResponse,
			{ status: 429 }
		);
	}

	recentByEmail.set(normalizedEmail, now);
	setTimeout(() => {
		if (recentByEmail.get(normalizedEmail) === now) recentByEmail.delete(normalizedEmail);
	}, RATE_LIMIT_WINDOW_MS);

	try {
		const env = getEnv();
		const safeSubject = contactInfo.subject.replace(/[\r\n]/g, ' ');
		await createTransporter().sendMail({
			from: env.SMTP_FROM,
			to: env.SMTP_TO,
			subject: `Contact request: ${safeSubject}`,
			html: buildContactEmailHtml({
				name: contactInfo.name,
				email: normalizedEmail,
				message: contactInfo.message
			})
		});

		return Response.json({ message: 'Message sent successfully.' } satisfies ContactResponse, {
			status: 200
		});
	} catch (error) {
		recentByEmail.delete(normalizedEmail);
		console.error('Error sending email:', error);

		return Response.json(
			{
				message: 'Error sending email.'
			} satisfies ContactResponse,
			{ status: 500 }
		);
	}
}
