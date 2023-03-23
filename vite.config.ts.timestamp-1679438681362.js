// vite.config.ts
import { defineConfig } from "vite";
import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";

// src/manifest.ts
import { defineManifest } from "@crxjs/vite-plugin";
var manifest_default = defineManifest({
  name: "Pawn Party",
  description: "This extension hides a combination of the chess pieces on the board, making parts of the position invisible to the player. ",
  version: "1.1.3",
  manifest_version: 3,
  icons: {
    "16": "img/img-16.png",
    "38": "img/img-38.png",
    "48": "img/img-48.png",
    "148": "img/img-148.png"
  },
  content_scripts: [
    {
      matches: ["https://lichess.org/training/*"],
      js: ["browser-polyfill.js", "src/content/index.tsx"]
    }
  ],
  permissions: [
    "storage"
  ],
  background: {
    service_worker: "src/background/index.ts",
    type: undfenide
  }
});

// vite.config.ts
var vite_config_default = defineConfig(({ mode }) => {
  return {
    build: {
      emptyOutDir: true,
      outDir: "build",
      rollupOptions: {
        output: {
          chunkFileNames: "assets/chunk-[hash].js"
        }
      }
    },
    plugins: [crx({ manifest: manifest_default }), react()]
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic3JjL21hbmlmZXN0LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHsgY3J4IH0gZnJvbSAnQGNyeGpzL3ZpdGUtcGx1Z2luJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuXG5pbXBvcnQgbWFuaWZlc3QgZnJvbSAnLi9zcmMvbWFuaWZlc3QnXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XG4gIHJldHVybiB7XG4gICAgYnVpbGQ6IHtcbiAgICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxuICAgICAgb3V0RGlyOiAnYnVpbGQnLFxuICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICBjaHVua0ZpbGVOYW1lczogJ2Fzc2V0cy9jaHVuay1baGFzaF0uanMnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuXG4gICAgcGx1Z2luczogW2NyeCh7IG1hbmlmZXN0IH0pLCByZWFjdCgpXSxcbiAgfVxufSlcbiIsICJpbXBvcnQgeyBkZWZpbmVNYW5pZmVzdCB9IGZyb20gJ0Bjcnhqcy92aXRlLXBsdWdpbidcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lTWFuaWZlc3Qoe1xuICBuYW1lOiAnUGF3biBQYXJ0eScsXG4gIGRlc2NyaXB0aW9uOlxuICAgICdUaGlzIGV4dGVuc2lvbiBoaWRlcyBhIGNvbWJpbmF0aW9uIG9mIHRoZSBjaGVzcyBwaWVjZXMgb24gdGhlIGJvYXJkLCBtYWtpbmcgcGFydHMgb2YgdGhlIHBvc2l0aW9uIGludmlzaWJsZSB0byB0aGUgcGxheWVyLiAnLFxuXG4gIHZlcnNpb246ICcxLjEuMycsXG4gIG1hbmlmZXN0X3ZlcnNpb246IDMsXG4gIGljb25zOiB7XG4gICAgJzE2JzogJ2ltZy9pbWctMTYucG5nJyxcbiAgICAnMzgnOiAnaW1nL2ltZy0zOC5wbmcnLFxuICAgICc0OCc6ICdpbWcvaW1nLTQ4LnBuZycsXG4gICAgJzE0OCc6ICdpbWcvaW1nLTE0OC5wbmcnLFxuICB9LFxuICAvLyBhY3Rpb246IHtcbiAgLy8gICBkZWZhdWx0X3BvcHVwOiAncG9wdXAuaHRtbCcsXG4gIC8vICAgZGVmYXVsdF9pY29uOiAnaW1nL2xvZ28tNDgucG5nJyxcbiAgLy8gfSxcbiAgLy8gb3B0aW9uc19wYWdlOiAnb3B0aW9ucy5odG1sJyxcbiAgY29udGVudF9zY3JpcHRzOiBbXG4gICAge1xuICAgICAgbWF0Y2hlczogWydodHRwczovL2xpY2hlc3Mub3JnL3RyYWluaW5nLyonXSxcbiAgICAgIGpzOiBbJ2Jyb3dzZXItcG9seWZpbGwuanMnLCAnc3JjL2NvbnRlbnQvaW5kZXgudHN4J10sXG4gICAgfSxcbiAgXSxcbiAgLy8gd2ViX2FjY2Vzc2libGVfcmVzb3VyY2VzOiBbXG4gIC8vICAge1xuICAvLyAgICAgcmVzb3VyY2VzOiBbJ2ltZy9pbWctMTYucG5nJywgJ2ltZy9pbWctMzgucG5nJywgJ2ltZy9pbWctNDgucG5nJywgJ2ltZy9pbWctMTQ4LnBuZyddLFxuICAvLyAgICAgbWF0Y2hlczogW10sXG4gIC8vICAgfSxcbiAgLy8gXSxcbiAgcGVybWlzc2lvbnM6IFtcbiAgICAnc3RvcmFnZScsIC8vIEFsbG93cyBhY2Nlc3MgdG8gdGhlIGJyb3dzZXIncyBzdG9yYWdlIEFQSVxuICBdLFxuICBiYWNrZ3JvdW5kOiB7XG4gICAgc2VydmljZV93b3JrZXI6ICdzcmMvYmFja2dyb3VuZC9pbmRleC50cycsXG4gICAgdHlwZTogdW5kZmVuaWRlLFxuICB9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBQSxTQUFTLG9CQUFvQjtBQUM3QixTQUFTLFdBQVc7QUFDcEIsT0FBTyxXQUFXOzs7QUNGbEIsU0FBUyxzQkFBc0I7QUFFL0IsSUFBTyxtQkFBUSxlQUFlO0FBQUEsRUFDNUIsTUFBTTtBQUFBLEVBQ04sYUFDRTtBQUFBLEVBRUYsU0FBUztBQUFBLEVBQ1Qsa0JBQWtCO0FBQUEsRUFDbEIsT0FBTztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLEVBQ1Q7QUFBQSxFQU1BLGlCQUFpQjtBQUFBLElBQ2Y7QUFBQSxNQUNFLFNBQVMsQ0FBQyxnQ0FBZ0M7QUFBQSxNQUMxQyxJQUFJLENBQUMsdUJBQXVCLHVCQUF1QjtBQUFBLElBQ3JEO0FBQUEsRUFDRjtBQUFBLEVBT0EsYUFBYTtBQUFBLElBQ1g7QUFBQSxFQUNGO0FBQUEsRUFDQSxZQUFZO0FBQUEsSUFDVixnQkFBZ0I7QUFBQSxJQUNoQixNQUFNO0FBQUEsRUFDUjtBQUNGLENBQUM7OztBRGhDRCxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUN4QyxTQUFPO0FBQUEsSUFDTCxPQUFPO0FBQUEsTUFDTCxhQUFhO0FBQUEsTUFDYixRQUFRO0FBQUEsTUFDUixlQUFlO0FBQUEsUUFDYixRQUFRO0FBQUEsVUFDTixnQkFBZ0I7QUFBQSxRQUNsQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFFQSxTQUFTLENBQUMsSUFBSSxFQUFFLDJCQUFTLENBQUMsR0FBRyxNQUFNLENBQUM7QUFBQSxFQUN0QztBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
