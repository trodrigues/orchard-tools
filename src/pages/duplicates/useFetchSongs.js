import { useState, useEffect, useRef } from "react";
import { orchardDb } from "../../db";

async function getSongsPage(musickit, nextPath) {
  const developerToken = musickit ? musickit.api.library.developerToken : "";
  const userToken = musickit ? musickit.api.library.userToken : "";

  const response = await fetch("https://api.music.apple.com" + nextPath, {
    cache: "no-cache",
    headers: {
      authorization: "Bearer " + developerToken,
      "music-user-token": userToken,
    },
  });
  const json = await response.json();
  return {
    searchResults: json.data,
    next: json.next,
  };
}

export default function useFetchSongs(musickit) {
  const [jobstate, setJobState] = useState("notstarted");
  const fetchedResults = useRef(0);
  const [next, setNext] = useState("/v1/me/library/songs?limit=100");

  useEffect(() => {
    function fetchPage(nextPath) {
      console.log("fetching " + Date.now());
      return new Promise((resolve, reject) => {
        setTimeout(async () => {
          try {
            const { searchResults, next } = await getSongsPage(
              musickit,
              nextPath
            );
            fetchedResults.current += searchResults.length;
            console.log(
              "fetched " + searchResults.length,
              fetchedResults.current
            );

            if (searchResults.length === 0) {
              return reject(new Error("Zero results"));
            }
            if (!next) {
              return reject(new Error("No next"));
            }

            searchResults.forEach((song) => {
              /*
              const atr = song.attributes;
              console.log(
                `${atr.artistName} - ${atr.name} [${atr.albumName}] - ${song.id}`
              );
              */
              const mergedSong = {
                id: song.id,
                href: song.href,
                type: song.type,
                ...song.attributes,
              };
              orchardDb.songs.add(mergedSong);
            });
            resolve(
              "/v1/me/library/songs?limit=100&offset=" + fetchedResults.current
            );
          } catch (error) {
            debugger;
            // if error is 504 try again
            // check other errors too
            console.error(error);
            await orchardDb.jobstate.update("fetch-duplicate-songs", {
              state: "failed",
              errorname: error.name,
              errormessage: error.message,
            });
            setJobState("failed");
            reject(error);
          }
        }, 10);
      });
    }

    async function runLoop() {
      await orchardDb.jobstate.update("fetch-duplicate-songs", {
        state: jobstate,
      });

      if (jobstate === "running") {
        const returnedNext = await fetchPage(next);
        setNext(returnedNext);
      }
    }

    runLoop();
  }, [jobstate, setJobState, next, setNext, musickit]);

  return [jobstate, setJobState];
}
