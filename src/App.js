import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import injectAndInitMusickit from "./init-musickit";

const kitInjector = injectAndInitMusickit(
  process.env.REACT_APP_MUSICKIT_DEV_TOKEN
);

export default function App() {
  useEffect(kitInjector);

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/users" element={<Users />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  setTimeout(() => {
    let music = window.MusicKit.getInstance();
    let album = music.api.album(1025210938);
    album.then((data) => console.log(data));
  }, 250);
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}
