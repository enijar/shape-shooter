import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <Link to="/play">Play Now!</Link>
    </main>
  );
}
