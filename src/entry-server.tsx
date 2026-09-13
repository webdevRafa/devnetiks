import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";
import { renderSeoHead } from "./seo";
export { INDEXABLE_PATHS, PRERENDER_PATHS, SITE_URL } from "./seo";

export function render(pathname: string) {
  return {
    html: renderToString(<StaticRouter location={pathname}><App /></StaticRouter>),
    head: renderSeoHead(pathname),
  };
}
