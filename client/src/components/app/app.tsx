import React from "react";
import { Route, Switch } from "react-router-dom";

const Home = React.lazy(() => import("../../pages/home/home"));
const Play = React.lazy(() => import("../../pages/play/play"));

export default function App() {
  React.useEffect(() => {
    function onContextMenu(event: Event) {
      event.preventDefault();
    }

    window.addEventListener("contextmenu", onContextMenu);
    return () => {
      window.addEventListener("contextmenu", onContextMenu);
    };
  }, []);

  return (
    <React.Suspense fallback="Loading...">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/play" component={Play} />
      </Switch>
    </React.Suspense>
  );
}
