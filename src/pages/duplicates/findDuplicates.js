import { orchardDb, duplicatesDb } from "../../db";

export default function findDuplicates() {
  console.log("finding duplicates");
  orchardDb.songs.toArray((songs) => {
    const duplicates = new Map();
    songs.forEach((song) => {
      if (duplicates.has(song.id)) return false;

      const dupes = songs.filter((dupe) => {
        return (
          song.name === dupe.name &&
          song.artistName === dupe.artistName &&
          song.albumName === dupe.albumName &&
          song.id !== dupe.id
        );
      });

      if (dupes && dupes.length > 0) {
        dupes.forEach((dupe) => {
          duplicates.set(dupe.id, dupe);
          const mergedSong = {
            id: dupe.id,
            href: dupe.href,
            type: dupe.type,
            ...dupe.attributes,
          };
          duplicatesDb.duplicates.add(mergedSong);
        });
      }
    });
    console.log("all dupes", duplicates);
  });
}
