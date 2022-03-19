import { useRef } from "react";
import { getRequest } from "../../utils/appleMusicApi";
import { getXmlExports } from "./actions/xmlexports";
import { createPlaylistActions } from "./actions/playlists";
import { createSearchActions } from "./actions/search";
import useFetchSongs from "./useFetchSongs";
import findDuplicates from "./findDuplicates";
import "./Duplicates.css";

function Action({ action, children }) {
  return (
    <div>
      <button onClick={() => action()}>{children}</button>
    </div>
  );
}

export default function Duplicates({ musickit }) {
  const [jobstate, setJobState] = useFetchSongs(musickit);
  const missing = useRef([]);
  const doubles = useRef([]);

  const {
    getPlaylists,
    createDuplicatesPlaylist,
    addToDuplicatesPlaylist,
    addToPlaylists,
  } = createPlaylistActions(musickit);
  const { searchForAlbums } = createSearchActions(musickit, doubles, missing);

  async function getMyStorefront() {
    const storefront = await getRequest(musickit, "/v1/me/storefront");
    console.log(storefront);
  }

  return (
    <div>
      <h2>Detect dupes</h2>
      <p>Current job state: {jobstate}</p>

      <div className="Duplicates-actions">
        <div>
          <button
            onClick={() => {
              setJobState("running");
            }}
          >
            Fetch songs
          </button>
          <button onClick={() => setJobState("stopped")}>Stop fetching</button>
        </div>

        <Action action={findDuplicates}>Find duplicates</Action>
        <Action action={createDuplicatesPlaylist}>Create Playlist</Action>
        <Action action={getPlaylists}>Get Playlists</Action>
        <Action action={addToDuplicatesPlaylist}>Remove duplicates</Action>
        <Action action={getXmlExports}>Get XML data</Action>
        <Action action={getMyStorefront}>Get storefront</Action>
        <Action action={searchForAlbums}>Search for albums</Action>
        <Action action={addToPlaylists}>Add to playlists</Action>
      </div>
    </div>
  );
}
