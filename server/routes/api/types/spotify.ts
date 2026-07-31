export type SpotifyImage = { url: string; height?: number; width?: number };

export type SpotifyExternalUrls = { spotify?: string };

export type SpotifyArtist = { name?: string };

export type SpotifyAlbum = {
	name?: string;
	external_urls?: SpotifyExternalUrls;
	images?: SpotifyImage[];
};

export type SpotifyTrack = {
	name?: string;
	artists?: SpotifyArtist[];
	album?: SpotifyAlbum;
	external_urls?: SpotifyExternalUrls;
};

export type SpotifyCurrentlyPlayingResponse = {
	is_playing?: boolean;
	item?: SpotifyTrack;
};

export type NowPlayingData = {
	album: string | null;
	albumImageUrl: string | null;
	albumUrl: string | null;
	artist: string | null;
	isPlaying: boolean;
	songUrl: string;
	title: string | null;
};

export type SpotifyTokenResponse = {
	access_token: string;
	token_type: string;
	expires_in: number;
	scope: string;
	refresh_token?: string;
};

export type SpotifyTokenError = {
	error: string;
	error_description?: string;
};
