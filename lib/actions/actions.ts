import { LastFMAlbum, LastFMAlbumInfoResponse, LastFMTopAlbumsResponse } from "../types/LastFMInfoTypes";
import { CatalogType, EntryType } from "../types/types";

// creating/fetching catalogs

export async function createNewCatalog(
  name: string,
  description: string,
  color: string,
) {
  const response = await fetch("/api/catalog", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      catalogName: name,
      catalogDescription: description,
      catalogColor: color,
    }),
  });

  if (!response.ok) {
    throw new Error("failed to create catalog");
  }

  const data = await response.json();
  return data as CatalogType;
}

export async function getAllUserCatalogs() {
  const response = await fetch("/api/catalog", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("failed to fetch all user catalogs");
  }

  const data = await response.json();
  return data as CatalogType[];
}

// adding catalog item

export async function addCatalogItem(album: LastFMAlbum, catalogId: string) {
  const albumInfo = await getLastFMAlbumInfo(album.name, album.artist.name)

  const response = await fetch(`/api/catalog/${catalogId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      entryArtist: albumInfo.album.artist,
      entryTitle: albumInfo.album.name,
      entryCoverArt: albumInfo.album.image[4]['#text'],
      entryExternalId: albumInfo.album.mbid,
      entryRating: 0,
      entryReleaseDate: albumInfo.album.wiki?.content?.match(/\d{4}-\d{2}-\d{2}/)?.[0]?.substring(0,4) || "",
      entryReview: "",
      entryTracks: albumInfo.album.tracks.track
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to add item to catalog");
  }

  const data = await response.json();
  return data as EntryType;
}

export async function getCatalogEntries(catalogId: string) {
  const response = await fetch(`/api/catalog/${catalogId}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch catalog entries");
  }

  const data = await response.json();
  return data as EntryType[];
}

// Entries

export async function updateEntryRating(entryId: string, rating: number) {
  const response = await fetch(`/api/entry/${entryId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify({ entryRating: rating })
  });

  if(!response.ok) {
    throw new Error ("failed to update entry rating")
  }

  const data = await response.json();
  return data as EntryType[];
}

export async function updateEntryReview(entryId: string, review: string) {
  const response = await fetch(`/api/entry/${entryId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify({ entryReview: review })
  });

  if(!response.ok) {
    throw new Error ("failed to update entry rating")
  }

  const data = await response.json();
  return data as EntryType[];
}

// Last FM

export async function getLastFMSearchResults(searchQuery: string | null) {
  const response = await fetch(
    `http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${searchQuery}&api_key=${process.env.NEXT_PUBLIC_LASTFM_API_KEY!}&format=json`,
  );
  const data = await response.json();
  return data as LastFMTopAlbumsResponse;
}

export async function getLastFMAlbumInfo(album: string, artist: string) {
  const response = await fetch(
    `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${process.env.NEXT_PUBLIC_LASTFM_API_KEY!}&artist=${artist}&album=${album}&format=json`,
  );
  const data = await response.json();
  return data as LastFMAlbumInfoResponse;
}
