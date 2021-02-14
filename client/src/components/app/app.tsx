import React from "react";
import { Switch, Route } from "react-router-dom";
import { AppWrapper } from "./styles";
import Loading from "../loading/loading";

const Play = React.lazy(() => import("../../pages/play/play"));
const Home = React.lazy(() => import("../../pages/home/home"));

export default function App() {
  return (
    <AppWrapper>
      <React.Suspense fallback={<Loading />}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/play" component={Play} />
        </Switch>
      </React.Suspense>
    </AppWrapper>
  );
}
