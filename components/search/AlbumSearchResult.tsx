/* eslint-disable @next/next/no-img-element */
import { LastFMAlbum } from "@/lib/types/LastFMInfoTypes";

export default function AlbumSearchResult({ album }: { album: LastFMAlbum }) {


  return (
    <div className="flex flex-row p-2 gap-4 justify-between items-center w-xl">
      <div className="flex flex-row gap-4">
        <img
          alt="album-cover"
          src={album.image[1]["#text"] ? album.image[1]["#text"] : "/noimage.jpg"}
          className="w-16 rounded-lg"
        />
        <div className="flex flex-col justify-around w-[24rem]">
          <h1 className="text-xl truncate">{album.name}</h1>
          <p className="text-md text-white/50">{album.artist.name}</p>
        </div>
      </div>
    </div>
  );
}
