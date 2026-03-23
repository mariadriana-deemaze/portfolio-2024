import nodemailer from 'nodemailer'
import { z } from 'zod'

import type { ContactInfo, ContactResponse } from '@/server/routes/api/types/contact'

import { getEnv } from '@/lib/env'
import { normalizeString } from '@/utils/string'

import { buildContactEmailHtml } from './template'

const RATE_LIMIT_WINDOW_MS = 3 * 60 * 1000
const recentByEmail = new Map<string, number>()

const contactInfoSchema = z.object({
  email: z.string().trim().min(1),
  message: z.string().trim().min(1),
  name: z.string().trim().min(1),
  subject: z.string().trim().min(1),
})

const honeypotSchema = z.object({
  website: z.string().trim().max(0).optional(),
})

function createTransporter() {
  const env = getEnv()

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_FROM,
      pass: env.SMTP_PASSWORD,
    },
  })
}

function hasValidHoneypot(body: unknown): boolean {
  return honeypotSchema.safeParse(body).success
}

function getValidatedContactInfo(body: unknown): ContactInfo | undefined {
  const result = contactInfoSchema.safeParse(body)

  return result.success ? result.data : undefined
}

export async function handleSendPost(request: Request): Promise<Response> {
  const body = await request.json()

  if (!hasValidHoneypot(body)) {
    return Response.json(
      {
        message: 'Missing required fields.',
      } satisfies ContactResponse,
      { status: 400 },
    )
  }

  const contactInfo = getValidatedContactInfo(body)

  if (!contactInfo) {
    return Response.json(
      {
        message: 'Missing required fields.',
      } satisfies ContactResponse,
      { status: 400 },
    )
  }

  const normalizedEmail = normalizeString(contactInfo.email)
  const now = Date.now()
  const lastSendAt = recentByEmail.get(normalizedEmail)

  if (lastSendAt && now - lastSendAt < RATE_LIMIT_WINDOW_MS) {
    return Response.json(
      {
        message: 'Please wait a few minutes before sending again.',
      } satisfies ContactResponse,
      { status: 429 },
    )
  }

  recentByEmail.set(normalizedEmail, now)

  try {
    const env = getEnv()
    const info = await createTransporter().sendMail({
      from: env.SMTP_FROM,
      to: env.SMTP_TO,
      subject: `Contact request: ${contactInfo.subject}`,
      html: buildContactEmailHtml({
        name: contactInfo.name,
        email: normalizedEmail,
        message: contactInfo.message,
      }),
    })

    return Response.json({ message: info.response } satisfies ContactResponse, { status: 200 })
  } catch (error) {
    recentByEmail.delete(normalizedEmail)
    console.error('Error sending email:', error)

    return Response.json(
      {
        message: 'Error sending email.',
      } satisfies ContactResponse,
      { status: 500 },
    )
  }
}
