export async function getRequest(musickit, path) {
  const developerToken = musickit ? musickit.api.library.developerToken : "";
  const userToken = musickit ? musickit.api.library.userToken : "";

  const response = await fetch("https://api.music.apple.com" + path, {
    cache: "no-cache",
    method: "GET",
    headers: {
      authorization: "Bearer " + developerToken,
      "music-user-token": userToken,
    },
  });
  const json = await response.json();
  return json;
}

export async function postRequest(musickit, path, data) {
  const developerToken = musickit ? musickit.api.library.developerToken : "";
  const userToken = musickit ? musickit.api.library.userToken : "";

  try {
    const response = await fetch("https://api.music.apple.com" + path, {
      cache: "no-cache",
      method: "POST",
      headers: {
        authorization: "Bearer " + developerToken,
        "music-user-token": userToken,
        "content-type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    console.log("POST", response);
  } catch (err) {
    console.error(err);
  }
}
