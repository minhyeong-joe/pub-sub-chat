import { randomUUID } from "node:crypto";
import { Server } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
import { EVENTS } from "./contracts.js";
import { sendMessage } from "./eventHandlers.js";

const createSocketServer = async (httpServer, usePubSub = false) => {
	// instance ID for experimental purpose only
	const instanceId = randomUUID().slice(0, 8);

	const io = new Server(httpServer, {
		cors: {
			origin: "*",
		},
	});

	if (usePubSub) {
		const pubClient = createClient({ url: process.env.REDIS_URL });
		const subClient = pubClient.duplicate();
		await Promise.all([pubClient.connect(), subClient.connect()]);
		io.adapter(createAdapter(pubClient, subClient));
		console.log("Redis pub/sub adapter enabled");
	}

	console.log(`Server instance started: ${instanceId}`);

	io.on("connection", (socket) => {
		console.log("A user connected: " + socket.id);
		socket.emit(EVENTS.SERVER_INFO, { instanceId });

		// debugging logs
		socket.onAny((event, ...args) => {
			console.log(`Received event: ${event} with args:`, args);
		});
		socket.onAnyOutgoing((event, ...args) => {
			console.log(`Emitting event: ${event} with args:`, args);
		});

		socket.on(EVENTS.SEND_MESSAGE, (message) => {
			sendMessage(socket, message);
		});

		socket.on("disconnect", () => {
			console.log("A user disconnected: " + socket.id);
		});
	});
};

export default createSocketServer;
