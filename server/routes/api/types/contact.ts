export const CONTACT_FIELD_MAX = {
	name: 100,
	email: 254,
	subject: 200,
	message: 5000
} as const;

export type ContactInfo = {
	name: string;
	email: string;
	subject: string;
	message: string;
};

export type ContactResponse = {
	message: string;
};
