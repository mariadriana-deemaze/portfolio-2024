import { normalizeString } from '@/utils/string';

const EMAIL_WINDOW_MS = 3 * 60 * 1000;
const IP_WINDOW_MS = 10 * 60 * 1000;
const IP_MAX_ATTEMPTS = 5;

// Gmail ignores dots in the local part, so a single mailbox can produce an
// unlimited number of distinct-looking addresses. Collapse them to one key.
const DOT_INSENSITIVE_DOMAINS = new Set(['gmail.com', 'googlemail.com']);
const GMAIL_CANONICAL_DOMAIN = 'gmail.com';

const lastSendByEmail = new Map<string, number>();
const attemptsByIp = new Map<string, number[]>();

/**
 * Collapses the aliases of a single mailbox onto one rate-limit key. Only ever
 * used as a map key — the address shown in the notification email stays as the
 * sender typed it.
 */
export function getEmailRateLimitKey(email: string): string {
	const normalized = normalizeString(email);
	const atIndex = normalized.lastIndexOf('@');

	if (atIndex === -1) {
		return normalized;
	}

	const localPart = normalized.slice(0, atIndex);
	const domain = normalized.slice(atIndex + 1);
	const withoutTag = localPart.split('+')[0] ?? localPart;

	if (!DOT_INSENSITIVE_DOMAINS.has(domain)) {
		return `${withoutTag}@${domain}`;
	}

	return `${withoutTag.split('.').join('')}@${GMAIL_CANONICAL_DOMAIN}`;
}

export function isEmailRateLimited(key: string): boolean {
	const lastSendAt = lastSendByEmail.get(key);

	return lastSendAt !== undefined && Date.now() - lastSendAt < EMAIL_WINDOW_MS;
}

export function recordEmailSend(key: string): void {
	const now = Date.now();
	lastSendByEmail.set(key, now);

	setTimeout(() => {
		if (lastSendByEmail.get(key) === now) lastSendByEmail.delete(key);
	}, EMAIL_WINDOW_MS);
}

export function clearEmailSend(key: string): void {
	lastSendByEmail.delete(key);
}

function pruneIpAttempts(now: number): void {
	for (const [key, timestamps] of attemptsByIp) {
		const fresh = timestamps.filter((timestamp) => now - timestamp < IP_WINDOW_MS);

		if (fresh.length === 0) {
			attemptsByIp.delete(key);
		} else {
			attemptsByIp.set(key, fresh);
		}
	}
}

/**
 * Records the attempt and reports whether the address has now exceeded its
 * allowance. Called before the Turnstile round trip so a flood of tokenless
 * submissions cannot be used to hammer siteverify.
 */
export function isIpRateLimited(ip: string): boolean {
	const now = Date.now();
	pruneIpAttempts(now);

	const timestamps = attemptsByIp.get(ip) ?? [];
	timestamps.push(now);
	attemptsByIp.set(ip, timestamps);

	return timestamps.length > IP_MAX_ATTEMPTS;
}
