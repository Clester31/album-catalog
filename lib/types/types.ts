export interface CatalogType {
    id: string,
    userId: string,
    catalogTitle: string,
    catalogDescription: string,
    catalogColor: string,
    entry: EntryType[]
}

export interface EntryType {
    id: string
    catalogId: string,
    entryArtist: string,
    entryCoverArt: string,
    entryExternalId: string,
    entryRating: number,
    entryReleaseDate: string,
    entryReview: string,
    entryTitle: string,
    Track: TrackType[]
}

export interface TrackType {
    id: number
    entryId: string
    trackDuration: number
    trackRating: number
    trackReview: string
    trackTitle: string
}