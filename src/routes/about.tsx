import { createFileRoute, useRouter } from '@tanstack/react-router'
import { JSX, useState, type FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'

export const Route = createFileRoute('/about')({
  component: AboutRoute,
})

function AboutRoute(): JSX.Element {
  const router = useRouter()
  const message = (router.options.context as any)?.initialData?.message as string | undefined

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')

  const mutation = useMutation<{ message: string }, Error, { name: string; email: string; subject: string; message: string }>({
    mutationFn: async (payload) => {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to send message')
      return res.json()
    },
  })

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    mutation.mutate({ name, email, subject, message: content })
  }

  return (
    <div>
      <h1>ABOUT</h1>
      <p>This blog is built using React and SSR via Vite + Express.</p>
      {message && (
        <p>
          <strong>Server message:</strong> {message}
        </p>
      )}

      <section style={{ marginTop: '1rem' }}>
        <h2>Contact Me</h2>
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: '0.5rem', maxWidth: 480 }}>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
          <textarea
            placeholder="Message"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            required
          />
          <div>
            <button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Sending…' : 'Send'}
            </button>
          </div>
        </form>
        {mutation.isSuccess && <p>Message sent: {mutation.data.message}</p>}
        {mutation.isError && <p style={{ color: 'red' }}>Failed to send message.</p>}
      </section>
    </div>
  )
}
