import type { Locale, TranslationKey, TranslationTree } from './types';

const DEFAULT_LOCALE: Locale = 'en';

async function loadTranslations(locale: Locale): Promise<TranslationTree> {
	switch (locale) {
		case 'pt': {
			const mod = await import('./pt');
			return mod.translations;
		}
		default: {
			const mod = await import('./en');
			return mod.translations;
		}
	}
}

function resolve(obj: unknown, path: string): unknown {
	let current = obj;
	for (const key of path.split('.')) {
		if (current == null || typeof current !== 'object') return undefined;
		current = (current as Record<string, unknown>)[key];
	}
	return current;
}

function t(
	translations: TranslationTree,
	key: TranslationKey,
	params?: Record<string, string | number>
): string {
	const value = resolve(translations, key);
	if (typeof value !== 'string') return key;
	if (!params) return value;
	return value.replace(/\{\{(\w+)\}\}/g, (_, k: string) => String(params[k] ?? `{{${k}}}`));
}

function setLocaleCookie(locale: Locale) {
	document.cookie = `locale=${locale};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
}

export { DEFAULT_LOCALE, loadTranslations, setLocaleCookie, t };
