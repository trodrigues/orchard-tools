import { xmlexports } from "../../../db";

export async function getXmlExports() {
  const tracksresponse = await fetch("http://localhost:8080/tracks.json");
  const xmltracks = await tracksresponse.json();
  xmltracks.forEach((track) => {
    xmlexports.tracks.add({
      id: track["Track ID"],
      name: track.Name,
      albumName: track["Album"],
      artistName: track["Artist"],
      ...track,
    });
  });
  const playlistsresponse = await fetch("http://localhost:8080/playlists.json");
  const xmlplaylists = await playlistsresponse.json();
  xmlplaylists.forEach((playlist) => {
    xmlexports.playlists.add({
      id: playlist["Playlist ID"],
      name: playlist.Name,
      ...playlist,
    });
  });
}
