import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
	try {
		const data = await resend.emails.send({
			from: 'Maria Adriana <hello@maria-adriana.com>',
			to: ['delivered@resend.dev'],
			subject: 'Contact request',
			react: () => <h1>hello</h1>
		});

		return Response.json(data);
	} catch (error) {
		return Response.json({ error });
	}
}
