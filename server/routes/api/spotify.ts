import 'dotenv/config'

import type { SpotifyArtist, SpotifyCurrentlyPlayingResponse } from '@/server/routes/api/types/spotify'

import { Router, type Request, type Response } from 'express'
import { Buffer } from 'node:buffer'

const router = Router()

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || ''
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || ''
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN || ''
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing'

async function getAccessToken(): Promise<string> {
  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
  try {
    const resp = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: REFRESH_TOKEN,
      }),
    })
    const data = (await resp.json()) as { access_token?: string }
    return data.access_token ?? ''
  } catch (err) {
    console.error('Spotify token error:', err)
    return ''
  }
}

router.get('/currently-playing', async (_req: Request, res: Response) => {
  const accessToken = await getAccessToken()

  if (!accessToken) {
    return res.status(200).json({ data: { isPlaying: false } })
  }

  try {
    const response = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (response.status === 204 || response.status > 404) {
      return res.status(200).json({ data: { isPlaying: false } })
    }


    const song: SpotifyCurrentlyPlayingResponse = await response.json()

    if (!song.item || !song.is_playing) {
      return res.status(200).json({ data: { isPlaying: false } })
    }

    const data = {
      isPlaying: true,
      title: song.item.name ?? 'No title',
      artist: (song.item?.artists ?? [])
        .map((artist: SpotifyArtist) => artist.name)
        .filter(Boolean)
        .join(', ') || 'No artist',
      album: song.item.album?.name ?? 'No album',
      albumUrl: song.item?.album?.external_urls?.spotify ?? 'No album url',
      albumImageUrl: song.item?.album?.images?.[0]?.url ?? 'No album image url',
      songUrl: song.item?.external_urls?.spotify ?? 'No song url',
    }

    return res.status(200).json({ now: Date.now(), data })
  } catch (error) {
    console.error('Spotify now playing error:', error)
    return res.status(404).json({ data: { isPlaying: false } })
  }
})

export default router
