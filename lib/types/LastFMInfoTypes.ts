export type ImageSize = "small" | "medium" | "large" | "extralarge";

export type LastFMImage = {
    "#text": string;
    size: ImageSize;
};

export type LastFMAlbumArtist = {
    mbid: string;
    name: string;
    url: string;
};

export type LastFMAlbum = {
    "@attr": {
        rank: string;
    };
    artist: LastFMAlbumArtist;
    image: LastFMImage[];
    mbid: string;
    name: string;
    playcount: number;
    url: string;
};

export type LastFMTopAlbumsResponse = {
    topalbums: {
        album: LastFMAlbum[];
        "@attr": {
            artist: string;
            page: string;
            perPage: string;
            totalPages: string;
            total: string;
        };
    };
};

export type LastFMTag = {
    url: string;
    name: string;
};

export type LastFMTrackArtist = {
    mbid: string;
    name: string;
    url: string;
};

export type LastFMTrackStreamable = {
    "#text": string;
    fulltrack: string;
};

export type LastFMTrack = {
    "@attr": {
        rank: number;
    };
    artist: LastFMTrackArtist;
    duration: number;
    name: string;
    streamable: LastFMTrackStreamable;
    url: string;
};

export type LastFMWiki = {
    content: string;
    published: string;
    summary: string;
};

export type LastFMAlbumInfo = {
    artist: string;
    image: LastFMImage[];
    listeners: string;
    mbid: string;
    name: string;
    playcount: string;
    tags: {
        tag: LastFMTag[];
    };
    tracks: {
        track: LastFMTrack[];
    };
    url: string;
    wiki?: LastFMWiki;
};

export type LastFMAlbumInfoResponse = {
    album: LastFMAlbumInfo;
};