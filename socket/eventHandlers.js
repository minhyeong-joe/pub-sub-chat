import { EVENTS } from "./contracts.js";

export const sendMessage = (socket, message) => {
	const { content, username } = message;
	const payload = {
		content,
		username,
		timestamp: new Date(),
	};
	socket.broadcast.emit(EVENTS.RECEIVE_MESSAGE, payload);
};
