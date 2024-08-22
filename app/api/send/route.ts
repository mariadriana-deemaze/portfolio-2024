import { ContactInfo, ContactResponse } from '@/types/contact';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

let transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: Number(process.env.SMTP_PORT),
	secure: true,
	auth: {
		user: process.env.SMTP_USER,
		pass:  process.env.SMTP_PASSWORD,
	}
});

export async function POST(req: NextRequest): Promise<NextResponse<ContactResponse>> {
	const data: ContactInfo = await req.json();

	try {

		const email = await transporter.sendMail({
			to: process.env.SMTP_USER,
			from: process.env.SMTP_USER,
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

		if (!email.response.includes("250 OK")) {
			throw new Error(email.response);
		}

		return NextResponse.json({ data: email, message: 'Sucessfully submitted.' });
	} catch (error) {
		return NextResponse.json({ data: null, message: 'Error sending email.' });
	}
}
