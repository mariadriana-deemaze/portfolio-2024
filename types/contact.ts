import { CreateEmailResponse } from "resend";

export type ContactInfo = {
	name: string;
	email: string;
	subject: string;
	message: string;
};

export type ContactResponse = {
	data: CreateEmailResponse | null;
	message: string;
};
