import { JSX } from "react"

export interface AboutProps {
  message?: string
}

export default function About({ message }: AboutProps): JSX.Element {
  return (
    <div>
      <h1>ABOUT</h1>
      <p>This blog is built using React and SSR via Vite + Express.</p>
      {message && (
        <p>
          <strong>Server message:</strong> {message}
        </p>
      )}
    </div>
  )
}

