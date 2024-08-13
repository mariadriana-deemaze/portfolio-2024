import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
	try {
		const data = await resend.emails.send({
			from: 'Maria Adriana <hello@maria-adriana.com>',
			to: ['delivered@resend.dev'],
			subject: 'Contact request',
			html: 'Hello'
		});

		return NextResponse.json({ data });
	} catch (error) {
		return NextResponse.json({ data: null });
	}
}
