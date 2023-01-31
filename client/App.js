import "./app.css";

export function App() {
  function onButtonClick() {
    alert("hello world!");
  }

  return <button onClick={onButtonClick}>Click me!</button>;
}
