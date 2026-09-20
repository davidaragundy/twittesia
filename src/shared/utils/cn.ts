// Where shadcn's own registry items look for `cn`: `components.json` points its `utils` alias
// here, so a component added by the CLI resolves through this file. Everything written by hand
// imports `cn` from the package directly.
export { cn } from "cn";
