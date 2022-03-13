/* global MusicKit */
export default function injectAndInitMusickit(musicKitToken) {
  return () => {
    document.addEventListener("musickitloaded", function () {
      MusicKit.configure({
        declarativeMarkup: true,
        developerToken: musicKitToken,
        app: {
          name: "My Cool Web App",
          build: "1978.4.1",
        },
      });
    });
    const musickitTag = document.createElement("script");
    musickitTag.src = "https://js-cdn.music.apple.com/musickit/v1/musickit.js";
    document.head.appendChild(musickitTag);
  };
}
