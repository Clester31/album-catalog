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
    entryListeningDate: string,
    Track: TrackType[]
    createdAt: string
}

export interface TrackType {
    id: number
    entryId: string
    trackDuration: number
    trackOrder: number
    trackRating: number
    trackReview: string
    trackTitle: string
}