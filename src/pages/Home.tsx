import { JSX } from 'react'
import { useQuery } from '@tanstack/react-query'

type NowPlaying = {
  revalidated?: boolean
  now?: number
  data: {
    isPlaying: boolean
    title?: string
    artist?: string
    album?: string
    albumUrl?: string
    albumImageUrl?: string
    songUrl?: string
  }
}

export default function Home(): JSX.Element {
  const { data, isLoading, isError } = useQuery<NowPlaying>({
    queryKey: ['spotify', 'now-playing'],
    queryFn: async () => {
      const res = await fetch('/api/spotify/me/current')
      if (!res.ok) throw new Error('Failed to fetch now playing')
      return res.json()
    },
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
  })

  const np = data?.data

  return (
    <div>
      <h1>HOME</h1>
      <p>Welcome to the homepage of our React Blog!</p>

      <section style={{ marginTop: '1rem' }}>
        <h2>Now Playing on Spotify</h2>
        {isLoading && <p>Loading current track...</p>}
        {isError && <p>Could not load current track.</p>}
        {!isLoading && !isError && (
          np?.isPlaying ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {np.albumImageUrl && (
                <img src={np.albumImageUrl} alt={np.title ?? 'Album Art'} width={64} height={64} />
              )}
              <div>
                <div><strong>{np.title}</strong></div>
                <div>{np.artist}</div>
                {np.songUrl && (
                  <a href={np.songUrl} target="_blank" rel="noreferrer">Open in Spotify</a>
                )}
              </div>
            </div>
          ) : (
            <p>Not playing anything right now.</p>
          )
        )}
      </section>
    </div>
  )
}
