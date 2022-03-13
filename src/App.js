import { BrowserRouter as Router, Link } from "react-router-dom";
import "./App.css";

import AppRoutes from "./AppRoutes";

export default function App() {
  return (
    <Router>
      <div className="app">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/duplicates">Duplicates</Link>
            </li>
          </ul>
        </nav>

        <AppRoutes />
      </div>
    </Router>
  );
}
