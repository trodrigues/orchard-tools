import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import injectMusickit from "./init-musickit";

import Home from "./pages/Home";
import Duplicates from "./pages/Duplicates";

export default function AppRoutes() {
  const navigate = useNavigate();
  useEffect(() => {
    injectMusickit(async (musickit) => {
      if (!musickit.isAuthorized) {
        navigate("/");
      }
    });
  });

  return (
    <Routes>
      <Route path="/duplicates" element={<Duplicates />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
}
