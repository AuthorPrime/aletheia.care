import React from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/Nav";
import EscapePuzzle from "./components/EscapePuzzle";
import FilePage from "./pages/File";
import DisclosurePage from "./pages/Disclosure";
import PrimePage from "./pages/Prime";
import RisePage from "./pages/Rise";

export default function App(){
  return (
    <div className="min-h-screen bg-slate-900 text-gray-100">
      <NavBar />
      <div className="max-w-6xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<div className="flex items-center justify-center"><EscapePuzzle /></div>} />
          <Route path="/file" element={<FilePage />} />
          <Route path="/disclosure" element={<DisclosurePage />} />
          <Route path="/prime" element={<PrimePage />} />
          <Route path="/rise" element={<RisePage />} />
        </Routes>
      </div>
    </div>
  );
}