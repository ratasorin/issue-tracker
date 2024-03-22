import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

installGlobals();

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    tsconfigPaths(),
    remix({
      ignoredRouteFiles: ["**/*.css"],
      assetsBuildDirectory: "public/build",
      watchPaths: ["./src/**/*"],
    }),
  ],
});
