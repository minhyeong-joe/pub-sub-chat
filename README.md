# pub-sub-chat

Experimental chat app using multiple websocket instances + Redis pub/sub for chat app at scale.

## Prerequisites

A running Redis server is required when `USE_PUB_SUB=true`. You can create a free one on Render: https://dashboard.render.com/new/redis

Any Redis server works — copy its URL into `.env` as `REDIS_URL`.

## Setup

```bash
npm install
cp .env.example .env   # then fill in REDIS_URL
```

## Environment Variables

| Variable      | Default | Description                                             |
| ------------- | ------- | ------------------------------------------------------- |
| `PORT`        | `3000`  | Port to listen on                                       |
| `REDIS_URL`   | —       | Redis connection URL (required when `USE_PUB_SUB=true`) |
| `USE_PUB_SUB` | `false` | Set to `true` to enable the Redis pub/sub adapter       |

## Running

### Single instance

```bash
npm run dev
```

Open `http://localhost:3000` in multiple browser tabs. Messages flow between all tabs.

Received message displays sender username, time sent, and latency in ms.

---

### Multiple instances — without pub/sub (the problem)

```bash
# Terminal 1
PORT=3000 USE_PUB_SUB=false npm run dev

# Terminal 2
PORT=3001 USE_PUB_SUB=false npm run dev
```

Open `http://localhost:3000` in one tab and `http://localhost:3001` in another.

**Expected:** messages sent from one instance do **not** appear in the other. Each server only broadcasts to its own connected clients.

---

### Multiple instances — with pub/sub (the solution)

```bash
# Terminal 1
PORT=3000 USE_PUB_SUB=true npm run dev

# Terminal 2
PORT=3001 USE_PUB_SUB=true npm run dev
```

Open `http://localhost:3000` in one tab and `http://localhost:3001` in another.

**Expected:** messages now appear across both instances. The Redis adapter publishes every broadcast to a shared Redis channel — all instances receive it and forward it to their own connected clients.

Received message displays sender username, time sent, and latency in ms. Compare latency within single instance vs across instances via Redis Pub/Sub
