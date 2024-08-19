import SMTPTransport from "nodemailer/lib/smtp-transport";

export type ContactInfo = {
	name: string;
	email: string;
	subject: string;
	message: string;
};

export type ContactResponse = {
	data:  SMTPTransport.SentMessageInfo | null;
	message: string;
};
