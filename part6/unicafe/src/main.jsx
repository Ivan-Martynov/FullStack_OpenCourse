import ReactDOM from "react-dom/client";
import { createStore } from "redux";
import counterReducer from "./reducers/counterReducer";

const store = createStore(counterReducer);

const App = () => {
  const dispatchClick = (type) => store.dispatch({ type });

  return (
    <div>
      <button onClick={() => dispatchClick("GOOD")}>good</button>
      <button onClick={() => dispatchClick("OK")}>ok</button>
      <button onClick={() => dispatchClick("BAD")}>bad</button>
      <button onClick={() => dispatchClick("RESET")}>reset stats</button>
      <div>good {store.getState().good}</div>
      <div>ok {store.getState().ok}</div>
      <div>bad {store.getState().bad}</div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
const renderApp = () => root.render(<App />);

renderApp();
store.subscribe(renderApp);
