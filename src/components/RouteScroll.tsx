import { useLayoutEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export default function RouteScroll() {
  const { pathname, hash } = useLocation();
  const navigation = useNavigationType();
  useLayoutEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    else if (navigation !== "POP") window.scrollTo(0, 0);
  }, [pathname, hash, navigation]);
  return null;
}
