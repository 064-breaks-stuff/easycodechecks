import { route } from "@react-router/dev/routes";
import { pages } from "./content/pages.js";

function pageModule(page) {
  if (page.id === "home") return "routes/home.jsx";
  if (page.id === "request-a-quote") return "routes/quote.jsx";
  return "routes/page.jsx";
}

export default [
  ...pages.map((page) => route(page.path, pageModule(page), { id: `page-${page.id}` })),
  route("*", "routes/not-found.jsx", { id: "not-found" }),
];
