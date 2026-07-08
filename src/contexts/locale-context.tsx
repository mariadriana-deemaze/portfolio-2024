import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import {
	DEFAULT_LOCALE,
	loadTranslations,
	setLocaleCookie,
	t as translateFn
} from '@/translations';
import { translations as enTranslations } from '@/translations/en';
import type { Locale, TranslationKey, TranslationTree } from '@/translations/types';

interface LocaleContextValue {
	locale: Locale;
	t: (key: TranslationKey, params?: Record<string, string | number>) => string;
	setLocale: (locale: Locale) => void;
	translations: TranslationTree;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function LocaleProvider({ children }: { children: ReactNode }) {
	const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
	const [translations, setTranslations] = useState<TranslationTree>(enTranslations);

	useEffect(() => {
		const cookie = document.cookie.split('; ').find((c) => c.startsWith('locale='));
		if (!cookie) return;
		const val = cookie.split('=')[1];
		if (val !== 'en' && val !== 'pt') return;
		if (val === DEFAULT_LOCALE) return;
		setLocaleState(val);
		loadTranslations(val)
			.then(setTranslations)
			.catch(() => undefined);
	}, []);

	useEffect(() => {
		document.documentElement.lang = locale;
	}, [locale]);

	const setLocale = useCallback((newLocale: Locale) => {
		setLocaleCookie(newLocale);
		setLocaleState(newLocale);
		loadTranslations(newLocale)
			.then(setTranslations)
			.catch(() => undefined);
	}, []);

	const t = useCallback(
		(key: TranslationKey, params?: Record<string, string | number>) =>
			translateFn(translations, key, params),
		[translations]
	);

	const value = useMemo(
		() => ({ locale, t, setLocale, translations }),
		[locale, t, setLocale, translations]
	);

	return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

function useLocale(): LocaleContextValue {
	const ctx = useContext(LocaleContext);
	if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
	return ctx;
}

export { LocaleProvider, useLocale };
