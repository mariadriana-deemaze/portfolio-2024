import type { translations as enTranslations } from './en';

type TranslationTree = typeof enTranslations;

type Join<Prefix extends string, Key extends string> = Prefix extends '' ? Key : `${Prefix}.${Key}`;

type NestedTranslationKey<T, Prefix extends string = ''> = T extends string
	? never
	: {
			[Key in keyof T & string]: T[Key] extends string
				? Join<Prefix, Key>
				: T[Key] extends readonly unknown[]
					? Join<Prefix, Key>
					: Join<Prefix, Key> | NestedTranslationKey<T[Key], Join<Prefix, Key>>;
		}[keyof T & string];

type Locale = 'en' | 'pt';

type TranslationKey = NestedTranslationKey<TranslationTree>;

export type { Locale, TranslationKey, TranslationTree };
