import { StaticRouter } from "react-router";
import { HelmetProvider, type HelmetServerState } from "react-helmet-async";
import App from "./App";

export function createApp(
  url: string,
  helmetContext: { helmet?: HelmetServerState }
) {
  return (
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </HelmetProvider>
  );
}
