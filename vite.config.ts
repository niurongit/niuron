import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import fs from "fs";

function getCjsPackages(): string[] {
  const nm = path.resolve(import.meta.dirname, "node_modules");
  const cjsList: string[] = [];

  const skipPrefixes = [
    "@babel/",
    "@jest/",
    "@nodelib/",
    "@rollup/",
    "@tailwindcss/",
    "@esbuild",
    "@react-native/",
    "@replit/",
    "@vitest/",
  ];
  const skipExact = new Set([
    "tsx",
    "typescript",
    "drizzle-kit",
    "postcss",
    "autoprefixer",
    "tailwindcss",
    "esbuild",
    "chokidar",
    "webpack",
    "jest",
    "eslint",
    "prettier",
    "vite",
    "tw-animate-css",
    "lightningcss-linux-x64-gnu",
    "bitcoin-ops",
    "@tailwindcss/oxide-linux-x64-gnu",
    "lightningcss",
    "@ecies/ciphers",
    "@noble/post-quantum",
    "@noble/secp256k1",
  ]);

  function isValidJsEntry(dir: string, main: string): boolean {
    try {
      const full = path.join(dir, main);
      if (!fs.existsSync(full)) return false;
      const ext = path.extname(main).toLowerCase();
      return ext === ".js" || ext === ".cjs" || ext === ".mjs" || ext === "";
    } catch {
      return false;
    }
  }

  function check(dir: string, name: string) {
    if (skipExact.has(name)) return;
    if (skipPrefixes.some((p) => name.startsWith(p))) return;
    try {
      const pkgJson = JSON.parse(
        fs.readFileSync(path.join(dir, "package.json"), "utf8"),
      );
      const hasESM =
        !!pkgJson.module ||
        (pkgJson.exports &&
          JSON.stringify(pkgJson.exports).includes('"import"'));
      if (!hasESM && pkgJson.main && isValidJsEntry(dir, pkgJson.main)) {
        cjsList.push(name);
      }
    } catch (e) {}
  }

  try {
    for (const d of fs.readdirSync(nm)) {
      if (d === ".bin" || d.startsWith(".")) continue;
      if (d.startsWith("@")) {
        try {
          for (const sd of fs.readdirSync(path.join(nm, d))) {
            check(path.join(nm, d, sd), `${d}/${sd}`);
          }
        } catch (e) {}
      } else {
        check(path.join(nm, d), d);
      }
    }
  } catch (e) {}

  return cjsList;
}

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      react: path.resolve(import.meta.dirname, "node_modules/react"),
      "react-dom": path.resolve(import.meta.dirname, "node_modules/react-dom"),
      "dayjs/locale": path.resolve(
        import.meta.dirname,
        "node_modules/dayjs/locale",
      ),
      "dayjs/plugin": path.resolve(
        import.meta.dirname,
        "node_modules/dayjs/plugin",
      ),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  optimizeDeps: {
    include: getCjsPackages(),
    exclude: [
      "ox/tempo",
      "ox/WebAuthnP256",
      "ox/WebCryptoP256",
      "@reown/appkit-scaffold-ui",
    ],
  },
});
