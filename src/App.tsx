import "./styles.css";
import Node from "./components/Node";
import Timer from "./components/Timer";

export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>test svg</h2>
      <div>
        <Timer radius={100} initialtime={15} timeunit={1} />
        <Timer radius={50} initialtime={30} timeunit={1} />
        <Timer radius={50} initialtime={45} timeunit={1} />
        <Timer radius={50} initialtime={45} timeunit={60} />
        <Timer radius={50} initialtime={60} timeunit={60} />
        <Timer radius={50} initialtime={61} timeunit={60} />
        <Node x={100} y={100} label="B" />
      </div>
    </div>
  );
}
