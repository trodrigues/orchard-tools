const fs = require("fs");
const xml = require("./library.json");

const tracks = xml[1].dict[1].dict
  .filter((track) => track.dict)
  .map((t) => {
    return t.dict.reduce((track, field, idx) => {
      if (field.key) {
        const key = field.key[0]["#text"];
        const value = t.dict[idx + 1];
        try {
          let extractedVal;
          if (value.string) {
            extractedVal = value.string[0]["#text"];
          } else if (value.integer) {
            extractedVal = value.integer[0]["#text"];
          }

          track[key] = extractedVal;
        } catch (err) {
          //console.error(t.dict[idx], t.dict[idx + 1]);
        }
      }
      return track;
    }, {});
  })
  .filter((track) => {
    return track.Kind === "Apple Music AAC audio file";
  });

const tracksById = tracks.reduce((tracklist, track) => {
  tracklist[track["Track ID"]] = track;
  return tracklist;
}, {});

const artists = new Map();
tracks.forEach((track) => {
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

const playlists = xml[1].dict[3].array
  .map((pl) => {
    return pl.dict.reduce((newpl, field, idx) => {
      newpl.Artists = newpl.Artists || {};
      if (field.key) {
        const key = field.key[0]["#text"];
        const value = pl.dict[idx + 1];
        try {
          let extractedVal;
          if (value.string) {
            if (value.string.length === 0) {
              //extractedVal = key;
            } else {
              extractedVal = value.string[0]["#text"];
            }
          } else if (value.integer) {
            extractedVal = value.integer[0]["#text"];
          } else if (value.true) {
            extractedVal = true;
          } else if (value.false) {
            extractedVal = false;
          } else if (value.array) {
            extractedVal = value.array
              .map((val) => {
                const trackId = val.dict[1].integer[0]["#text"];
                const track = tracksById[trackId];
                if (track) {
                  newpl.Artists[track.Artist] =
                    newpl.Artists[track.Artist] || new Set();
                  newpl.Artists[track.Artist].add(track.Album);
                }
                return track;
              })
              .filter((val) => val);
            //console.log([0].dict[0].key[0]["#text"]);
            //console.log();
          } else if (value.data) {
          } else {
            console.log("value type: ", key, Object.keys(value), value);
          }

          if (extractedVal) newpl[key] = extractedVal;
        } catch (err) {
          console.log("index", key);
          console.log("val", pl.dict[idx + 1]);
          //console.log("type", typeof pl.dict[idx + 1]);
          console.log(err);
          console.log("---");
        }
      }
      return newpl;
    }, {});
  })
  .map((pl) => {
    const artists = Object.keys(pl.Artists).reduce((artists, artist) => {
      artists[artist] = Array.from(pl.Artists[artist].values());
      return artists;
    }, {});
    return {
      ...pl,
      Artists: artists,
    };
  })
  .filter((pl, idx) => {
    return idx >= 10 && idx <= 39;
  });

fs.writeFileSync("./tracks.json", JSON.stringify(tracks));
fs.writeFileSync("./playlists.json", JSON.stringify(playlists));
fs.writeFileSync("./albums_by_artist.json", JSON.stringify(mappedArtists));

/**
 * Now we can get each playlist id from apple music,
 * then for each of these playlists add the album to lib,
 * get id of each track, add them to playlist
 */
