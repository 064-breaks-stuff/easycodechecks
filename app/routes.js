import { route } from "@react-router/dev/routes";
import { pages } from "./content/pages.js";

export default [
  ...pages.map((page) =>
    route(page.path, "routes/page.jsx", {
      id: `page-${page.id}`,
    }),
  ),
  route("*", "routes/not-found.jsx", {
    id: "not-found",
  }),
];