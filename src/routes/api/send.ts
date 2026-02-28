import { createFileRoute } from '@tanstack/react-router'
import nodemailer from 'nodemailer'

import type { ContactInfo, ContactResponse } from '@/server/routes/api/types/contact'

import { normalizeString } from '@/utils/string'

const RATE_LIMIT_WINDOW_MS = 3 * 60 * 1000
const recentByEmail = new Map<string, number>()

function createJsonResponse(status: number, data: unknown): Response {
  return Response.json(data, { status })
}

async function readJsonBody<T>(request: Request): Promise<T | undefined> {
  try {
    return (await request.json()) as T
  } catch {
    return undefined
  }
}

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_FROM,
      pass: process.env.SMTP_PASSWORD,
    },
  })
}

export const Route = createFileRoute('/api/send')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await readJsonBody<ContactInfo>(request)
        const { name, email, subject, message } = body ?? {}

        if (!name || !email || !subject || !message) {
          return createJsonResponse(400, {
            message: 'Missing required fields.',
          } satisfies ContactResponse)
        }

        const normalizedEmail = normalizeString(email)
        const now = Date.now()
        const lastSendAt = recentByEmail.get(normalizedEmail)

        if (lastSendAt && now - lastSendAt < RATE_LIMIT_WINDOW_MS) {
          return createJsonResponse(429, {
            message: 'Please wait a few minutes before sending again.',
          } satisfies ContactResponse)
        }

        recentByEmail.set(normalizedEmail, now)

        try {
          const info = await createTransporter().sendMail({
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
                  <br>${normalizedEmail}
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

          return createJsonResponse(200, { message: info.response } satisfies ContactResponse)
        } catch (error) {
          recentByEmail.delete(normalizedEmail)
          console.error('Error sending email:', error)
          return createJsonResponse(500, {
            message: 'Error sending email.',
          } satisfies ContactResponse)
        }
      },
    },
  },
})
