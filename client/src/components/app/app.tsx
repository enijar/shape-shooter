import React from "react";
import { Route, Switch } from "react-router-dom";

const Home = React.lazy(() => import("../../pages/home/home"));
const Play = React.lazy(() => import("../../pages/play/play"));
const SvgPlay = React.lazy(() => import("../../pages/svg-play/svg-play"));

export default function App() {
  return (
    <React.Suspense fallback="Loading...">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/play" component={Play} />
        <Route exact path="/svg-play" component={SvgPlay} />
      </Switch>
    </React.Suspense>
  );
}
