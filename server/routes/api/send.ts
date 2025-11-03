import { Router, type Request, type Response } from 'express'
import nodemailer from 'nodemailer'

const router = Router()

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_FROM,
    pass: process.env.SMTP_PASSWORD,
  },
})

router.post('/', async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body ?? {}

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'Missing required fields.' })
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_TO,
      subject: `Contact request: ${subject}`,
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
          <html lang="en">
            <head>
              <meta charset="utf-8">
              <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
            </head>
            <body>
              <div class="container" style="margin-left: 20px;margin-right: 20px;">
                <h3>You've got a new mail from ${name}, their email is:
                  <br> ✉️${email}
                </h3>
                <div style="font-size: 16px;">
                  <p>Message:</p>
                  <p>${message}</p>
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
          </html>`,
    })

    return res.json({ message: info.response })
  } catch (error) {
    console.error('Error sending email:', error)
    return res.status(500).json({ message: 'Error sending email.' })
  }
})

export default router

