# pub-sub-chat

Experimental chat app using multiple websocket instances + Redis pub/sub for chat app at scale.

## Setup

```bash
npm install
```

## Running

### Single instance

```bash
npm run dev
```

Open `http://localhost:3000` in multiple browser tabs. Messages will flow between all tabs.

### Multiple instances

Start two separate instances in two terminals:

```bash
# Terminal 1
PORT=3000 npm run dev

# Terminal 2
PORT=3001 npm run dev
```

Open `http://localhost:3000` in one tab and `http://localhost:3001` in another. Messages sent from one instance will **not** appear in the other — each server only broadcasts to its own connected clients.

This demonstrates the problem that Redis pub/sub solves.
