/* global MusicKit */
export default function injectAndInitMusickit() {
  document.addEventListener("musickitloaded", function () {
    MusicKit.configure({
      developerToken: "DEVELOPER-TOKEN",
      app: {
        name: "My Cool Web App",
        build: "1978.4.1",
      },
    });
  });
  const musickitTag = document.createElement("script");
  musickitTag.src = "https://js-cdn.music.apple.com/musickit/v1/musickit.js";
  document.head.appendChild(musickitTag);
}
