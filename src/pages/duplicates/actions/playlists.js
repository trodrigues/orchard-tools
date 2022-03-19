import { duplicatesDb, playlists, xmlexports, library } from "../../../db";
import { getRequest, postRequest } from "../../../utils/appleMusicApi";

export function createPlaylistActions(musickit) {
  function getPlaylists() {
    getRequest(
      musickit,
      "/v1/me/library/playlists?limit=100&include=attributes.name"
    ).then((pls) => {
      pls.data.forEach((pl) => {
        const attrs = pl.attributes;
        delete pl.attributes;
        const mergedPl = {
          ...pl,
          ...attrs,
        };
        playlists.playlists.add(mergedPl);
      });
    });
  }

  function createDuplicatesPlaylist() {
    postRequest(musickit, "/v1/me/library/playlists", {
      attributes: {
        name: "Duplicate songs to remove",
      },
    });
  }

  var dupesToRemove = "p.AWOelCrMmLdX";
  function addToDuplicatesPlaylist() {
    duplicatesDb.duplicates.toArray((songs) => {
      const tracks = songs.map((song) => ({
        id: song.id,
        type: "library-songs",
      }));
      postRequest(
        musickit,
        `/v1/me/library/playlists/${dupesToRemove}/tracks`,
        {
          data: tracks,
        }
      );
    });
  }

  function addToPlaylists() {
    const missingByPl = new Map();
    xmlexports.playlists.toArray(async (playlists) => {
      //console.log(playlists);
      const tracks = await library.tracks.toArray();
      const playlistIds = playlists.map((pl) => {
        const missing = new Map();
        const items = pl["Playlist Items"];
        const trackItems = items.map(async (item) => {
          let track = tracks.find((track) => {
            return (
              track.name.indexOf(item.Name) >= 0 &&
              track.artistName.indexOf(item.Artist) >= 0 &&
              track.albumName.indexOf(item.Album) >= 0
            );
          });
          if (!track) {
            track = tracks.find((track) => {
              return (
                track.name.indexOf(item.Name) >= 0 &&
                track.artistName.indexOf(item.Artist) >= 0
              );
            });
          }
          try {
            return track.id;
          } catch (err) {
            const albums = missing.has(item.Artist)
              ? missing.get(item.Artist)
              : new Set();
            albums.add(item.Album);
            missing.set(item.Artist, albums);
          }
        });
        missingByPl.set(pl.Name, missing);
        return {
          items: trackItems,
          name: pl.Name,
        };
      });
      // retrieve actual playlist ids from Apple Music
      console.log("ids", playlistIds); // TODO add these to each playlist
      console.log("missing", missingByPl); // iterate through these, add albums to lib, add tracks to pls
    });
  }

  return {
    getPlaylists,
    createDuplicatesPlaylist,
    addToDuplicatesPlaylist,
    addToPlaylists,
  };
}
