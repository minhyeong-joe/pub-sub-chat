import express from "express";
import { createServer } from "http";
import createSocketServer from "./socket/connection.js";

const app = express();
app.use(express.static("test_client"));
const httpServer = createServer(app);

createSocketServer(httpServer);

const PORT = process.env.PORT ?? 3000;

httpServer.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
