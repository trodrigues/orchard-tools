const tracks = require("./tracks.json");

const kinds = new Set();
tracks.forEach((track) => {
  kinds.add(track.Kind);
});

console.log(kinds);

/**
 Set(8) {
  'Purchased MPEG-4 video file',
  'Purchased AAC audio file',
  'Apple Music AAC audio file',
  'MPEG audio file',
  'Matched AAC audio file',
  'AAC audio file',
  'MPEG-4 audio file',
  'Protected MPEG-4 video file'
}
 */
