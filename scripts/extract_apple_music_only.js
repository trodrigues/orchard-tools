const fs = require("fs");
const tracks = require("./tracks.json");

const appleMusicOnly = tracks.filter((track) => {
  return track.Kind === "Apple Music AAC audio file";
});

fs.writeFileSync("apple_music.json", JSON.stringify(appleMusicOnly));

const artists = new Map();

appleMusicOnly.forEach((track) => {
  let albums = new Set();
  if (artists.has(track.Artist)) {
    albums = artists.get(track.Artist);
  }
  albums.add(track.Album);
  artists.set(track.Artist, albums);
});

const mappedArtists = {};
artists.forEach((val, key) => {
  mappedArtists[key] = Array.from(val);
});

fs.writeFileSync("albums_by_artist.json", JSON.stringify(mappedArtists));
