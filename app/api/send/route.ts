import { NextRequest, NextResponse } from 'next/server';
import { CreateEmailResponse, Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

export async function POST(req: NextRequest): Promise<NextResponse<ContactResponse>> {
	const data: ContactInfo = await req.json();

	try {
		const email = await resend.emails.send({
			to: 'hello@maria-adriana.com',
			from: 'hello@maria-adriana.com',
			subject: `Contact request: ${data.subject}`,
			html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
					<html lang="en">
						<head>
							<meta charset="utf-8">
							<meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
							</head>
						<body>
						<div class="container" style="margin-left: 20px;margin-right: 20px;">
							<h3>You've got a new mail from ${data.name}, their email is:
								<br> ✉️${data.email}
							</h3>
							<div style="font-size: 16px;">
								<p>Message:</p>
								<p>${data.message}</p>
								<br>
							</div>
							
							<img src="#" class="logo-image" style="height: 50px;width: 50px;border-radius: 5px;overflow: hidden;">
							
							<p class="footer" style="font-size: 16px;padding-bottom: 20px;border-bottom: 1px solid #D1D5DB;">
								Regards,
								<br>Maria Adriana
								<br>Software Developer
							</p>
						
						</div>
						</body>
					</html>
	  `
		});

		if (email.error) {
			throw new Error(email.error.message);
		}

		return NextResponse.json({ data: email, message: 'Sucessfully submitted.' });
	} catch (error) {
		return NextResponse.json({ data: null, message: 'Error sending email.' });
	}
}
