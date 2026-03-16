import { EVENTS } from "./contracts.js";

export const sendMessage = (socket, message) => {
	const { content, username, clientSentAt } = message;
	const payload = {
		content,
		username,
		timestamp: new Date(),
		clientSentAt,
	};
	socket.broadcast.emit(EVENTS.RECEIVE_MESSAGE, payload);
};
