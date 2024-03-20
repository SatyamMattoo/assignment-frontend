import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";
import Submissions from "./pages/Submissions";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/submissions" element={<Submissions />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
