"use client"
import { io } from "socket.io-client";

// ✅ Use WebSocket URL from environment variable
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000";

export const socket = io(SOCKET_URL);