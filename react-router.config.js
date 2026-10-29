import { pages } from "./app/content/pages.js";

export default {
  ssr: false,
  prerender: pages.map((page) => page.path),
};