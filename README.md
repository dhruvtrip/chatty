## Chatty — Local Chat Room

A fullstack real‑time chat room:

- Backend: Spring Boot 3 (STOMP over WebSocket/SockJS)
- Frontend: React 19 + Vite + React Router + Zustand
- Live messaging via `/topic/public`; client publishes to `/app/chat.addUser` and `/app/chat.sendMessage`

### Features

- **Sign in** with a username (Zustand store)
- **Guarded route** for `/chat` (redirects to `/` if no username)
- **STOMP over SockJS** connection
- **JOIN/CHAT/LEAVE** message types rendered in the room

## Getting Started

### Prerequisites

- Java 21, Maven 3.9+
- Node 20+

### Backend (Spring Boot)

```bash
cd chatty
./mvnw spring-boot:run
# http://localhost:8080
```

### Frontend (Vite + React)

```bash
cd chatty-frontend
npm install
npm run dev
# http://localhost:5173
```

## Architecture

### Backend

- `config/WebSocketConfig.java`
  - App prefix: `/app`
  - Broker prefix: `/topic`
  - STOMP endpoint: `/ws`
- `chat/ChatController.java`
  - `@MessageMapping("/chat.addUser")` → `@SendTo("/topic/public")`
  - `@MessageMapping("/chat.sendMessage")` → `@SendTo("/topic/public")`
- `chat/ChatMessage.java`: `content`, `sender`, `type`
- `chat/MessageType.java`: `CHAT`, `JOIN`, `LEAVE`

### Frontend

- Routes / Pages:
  - `/` → `SignIn`
  - `/chat` → `ChatRoom` (requires `username`)

## Dev Configuration

### Vite Dev Server

`chatty-frontend/vite.config.js`

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: { global: "window" }, // sockjs-client expects global
  server: {
    port: 5173,
    proxy: {
      "/ws": {
        // proxy WebSocket/SockJS calls
        target: "http://localhost:8080",
        ws: true,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
```

### WebSocket URL (dev)

Use the proxy to avoid CORS:

```javascript
// chatty-frontend/src/config/paths.js
export const WEB_SOCKET_URL = "/ws";
```

If you prefer absolute URLs, allow the Vite origin in Spring:

```java
// WebSocketConfig.java
registry.addEndpoint("/ws")
  .setAllowedOriginPatterns("http://localhost:5173")
  .withSockJS();
```

## Usage

1. Open `http://localhost:5173` and enter a username.
2. You’re redirected to `/chat`.
3. You’ll see “username joined”; type and send messages.
4. Open two browsers/tabs to see real‑time updates.

## Scripts

### Frontend

- `npm run dev` — start Vite
- `npm run build` — production build
- `npm run preview` — preview build locally
- `npm run lint` — ESLint

### Backend

- `./mvnw spring-boot:run` — run app
- `./mvnw test` — run tests

## Project Structure

- `chatty/` — Spring Boot backend
  - `config/WebSocketConfig.java`
  - `chat/ChatController.java`, `ChatMessage.java`, `MessageType.java`
- `chatty-frontend/` — React frontend
  - `src/pages/SignIn.jsx`, `src/pages/ChatRoom.jsx`
  - `src/store/useAuthStore.js`
  - `src/config/paths.js`
  - `vite.config.js`
