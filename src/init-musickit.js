/* global MusicKit */
let sdk;
export default function initMusickit(fn) {
  if (sdk) {
    fn(sdk.getInstance());
  } else {
    document.addEventListener("musickitloaded", function () {
      MusicKit.configure({
        declarativeMarkup: true,
        developerToken: process.env.REACT_APP_MUSICKIT_DEV_TOKEN,
        app: {
          name: "My Cool Web App",
          build: "1978.4.1",
        },
      });
      sdk = MusicKit;
      fn(sdk.getInstance());
    });
    const musickitTag = document.createElement("script");
    musickitTag.src = "https://js-cdn.music.apple.com/musickit/v1/musickit.js";
    document.head.appendChild(musickitTag);
  }
}
