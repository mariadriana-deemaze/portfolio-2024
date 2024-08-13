import querystring from "querystring"
import { SpotifyAccessToken } from './types';
import { NextRequest, NextResponse } from 'next/server';

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';

const basic: string = Buffer.from(`${client_id}:${client_secret}`).toString('base64');


const getAccessToken = async (): Promise<SpotifyAccessToken> => {
	const request: NextRequest = new NextRequest(TOKEN_ENDPOINT, {
		method: 'POST',
		headers: {
			Authorization: `Basic ${basic}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: querystring.stringify({
			grant_type: 'refresh_token',
			refresh_token
		})
	});

	try {
		const response: Response = await fetch(request);
		return await response.json();
	} catch (error) {
		console.error(error);
		return { access_token: 'NO ACCESS' };
	}
};

/**
 * Makes a request to the Spotify API to retrieve the currently playing song for the user.
 */
export const currentlyPlayingSong = async (initialRequest: NextRequest) => {
	const { access_token }: { access_token: string } = await getAccessToken();
	
	const request = new NextRequest(NOW_PLAYING_ENDPOINT, {
		headers: {
			Authorization: `Bearer ${access_token}`
		}
	});

	try {
		const response: Response = await fetch(request);
		return response;
	} catch (error) {
		const response: NextResponse = new NextResponse(null, {
			status: 404
		});
		return response;
	}
};
