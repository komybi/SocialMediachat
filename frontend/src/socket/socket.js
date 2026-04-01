import { io } from "socket.io-client";
const ENDPOINT = `http://localhost:9001`;
const socket = io(ENDPOINT, {
	reconnectionDelay: 1000,
	reconnection: true,
	reconnectionAttempts: 10,
	transports: ["websocket"],
	agent: false,
	upgrade: false,
	rejectUnauthorized: false,
});

export default socket;
