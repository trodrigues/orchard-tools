import Dexie from "dexie";

export const orchardDb = new Dexie("orchardTools");
orchardDb.version(1).stores({
  songs: "&id, name, albumName, artistName", // Primary key and indexed props
  duplicates: "&id, name, albumName, artistName", // Primary key and indexed props
  jobstate: "++id",
});

export const duplicatesDb = new Dexie("duplicatesDb");
duplicatesDb.version(1).stores({
  duplicates: "&id, name, albumName, artistName", // Primary key and indexed props
});

export const playlists = new Dexie("playlists");
playlists.version(1).stores({
  playlists: "&id, name, albumName, artistName", // Primary key and indexed props
});

export const xmlexports = new Dexie("xmlexports");
xmlexports.version(1).stores({
  tracks: "&id, name, albumName, artistName", // Primary key and indexed props
  playlists: "&id, name", // Primary key and indexed props
});

export const library = new Dexie("library");
library.version(1).stores({
  albums: "&id, name", // Primary key and indexed props
  tracks: "&id, name, albumName, artistName", // Primary key and indexed props
  playlists: "&id, name, albumName, artistName",
});
