# Dependencias

```sh
bun create vite frontend --template react-ts
cd frontend
```

```sh
bun add -D tailwindcss @tailwindcss/vite
bun add -D shadcn-ui
bun add react-hook-form zod
```

***vite.config.ts***

```ts
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react(),tailwindcss()],
	resolve: {
		alias: {
			"@": "/src",
		},
	},
});
```

**tsconfig.json**

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**src/index.css**

```css
@import "tailwindcss";
@import "tw-animate-css";
```

```sh
bunx shadcn init
bunx --bun shadcn@latest add form input button
```