import React from "react";
import { NavLink } from "react-router-dom";

export default function NavBar() {
  const base = "px-3 py-2 rounded hover:bg-slate-700/40";
  const active = "bg-slate-700/50";
  return (
    <nav className="w-full flex items-center justify-between px-4 py-3 bg-slate-900/70 sticky top-0 border-b border-slate-800">
      <div className="font-bold tracking-wide">
        <NavLink to="/" className="px-2">Aletheia Care</NavLink>
      </div>
      <div className="flex gap-1 text-sm">
        <NavLink to="/file" className={({isActive}) => `${base} ${isActive ? active : ''}`}>File</NavLink>
        <NavLink to="/disclosure" className={({isActive}) => `${base} ${isActive ? active : ''}`}>Disclosure</NavLink>
        <NavLink to="/prime" className={({isActive}) => `${base} ${isActive ? active : ''}`}>Prime</NavLink>
        <NavLink to="/rise" className={({isActive}) => `${base} ${isActive ? active : ''}`}>Rise</NavLink>
      </div>
    </nav>
  );
}

