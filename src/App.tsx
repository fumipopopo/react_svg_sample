import "./styles.css";
import Node from "./components/Node";
import Timer from "./components/Timer";
import { useState } from "react";

export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>test svg</h2>
      <div>
        <Timer radius={100} minutes={0} />
        <Timer radius={50} minutes={15} />
        <Timer radius={50} minutes={30} />
        <Timer radius={50} minutes={45} />
        <Timer radius={50} minutes={60} />
        <Timer radius={50} minutes={61} />
        <Node x={100} y={100} label="B" />
      </div>
    </div>
  );
}
