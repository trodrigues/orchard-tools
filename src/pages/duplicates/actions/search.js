import { xmlexports, library } from "../../../db";
import { getRequest, postRequest } from "../../../utils/appleMusicApi";

export function createSearchActions(musickit, doubles, missing) {
  async function wait(ms) {
    return new Promise((resolve) => setTimeout(() => resolve(), ms));
  }

  async function addAlbumToLib(id) {
    return await postRequest(musickit, "/v1/me/library?ids[albums]=" + id);
  }

  async function getAlbum(id) {
    return await getRequest(musickit, "/v1/catalog/de/albums/" + id);
  }

  async function searchForAlbum(searchTerm) {
    const previouslyStoredAlbum = await library.albums
      .where({
        name: searchTerm,
      })
      .toArray();
    if (previouslyStoredAlbum.length > 0) {
      return;
    }

    const response = await getRequest(
      musickit,
      "/v1/catalog/de/search?types=albums&term=" +
        encodeURIComponent(searchTerm)
    );
    const results = response.results;

    if (results && results.albums && results.albums.data) {
      const albumData = await getAlbum(results.albums.data[0].id);
      const album = albumData.data[0];
      const tracks = album.relationships.tracks.data;
      await addAlbumToLib(album.id);
      library.albums.add({
        id: album.id,
        name: searchTerm,
      });
      tracks.forEach((track) => {
        const attrs = track.attributes;
        delete track.attributes;
        library.tracks.add({
          ...attrs,
          ...track,
        });
      });
      // put tracks in DB to get later for playlists
    } else if (
      results &&
      results.albums &&
      results.albums.data &&
      results.albums.data.length > 1
    ) {
      doubles.current.push(searchTerm);
      //console.warn("Multiple results for " + searchTerm, results);
    } else {
      missing.current.push(searchTerm);
      //console.error("No results for " + searchTerm, results);
    }
    await wait(10);
    return results;
  }

  function searchForAlbums() {
    xmlexports.tracks.toArray(async (tracks) => {
      const artists = new Map();
      tracks.forEach((track) => {
        let albums = new Set();
        if (artists.has(track.Artist)) {
          albums = artists.get(track.Artist);
        }
        albums.add(track.Album);
        artists.set(track.Artist, albums);
      });

      for (let [artist, albums] of artists) {
        for (let album of albums) {
          const searchTerm = artist + " " + album;
          //console.log("Searching " + searchTerm);
          await searchForAlbum(searchTerm);
        }
      }
      console.log("Missing");
      missing.current.forEach((c) => console.log(c));
    });
  }

  return {
    searchForAlbums,
  };
}
