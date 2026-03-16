import { Server } from "socket.io";
import { EVENTS } from "./contracts.js";
import { sendMessage } from "./eventHandlers.js";

const createSocketServer = (httpServer) => {
	const io = new Server(httpServer, {
		cors: {
			origin: "*",
		},
	});

	io.on("connection", (socket) => {
		console.log("A user connected: " + socket.id);

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
