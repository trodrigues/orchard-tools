import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import injectMusickit from "./init-musickit";

import Home from "./pages/Home";
import Duplicates from "./pages/duplicates/Duplicates";

export default function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();
  const [musickit, setMusicKit] = useState(null);
  useEffect(() => {
    injectMusickit((musickit) => {
      if (!musickit.isAuthorized && location.pathname !== "/") {
        navigate("/");
      }
      setMusicKit(musickit);
    });
  });

  return (
    <Routes>
      <Route path="/duplicates" element={<Duplicates musickit={musickit} />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
}
