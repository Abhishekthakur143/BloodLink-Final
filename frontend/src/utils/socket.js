import { io } from 'socket.io-client';
import store from '../redux/store';
 
 const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});
 
// ── User ke room mein join karo (login ke baad call karo) ──────────
export const joinUserRoom = (userId) => {
  if (userId) {
    socket.emit('join-room', `user_${userId}`);
  }
};
 
// ── Room leave karo (logout ke baad) ──────────────────────────────
export const leaveUserRoom = (userId) => {
  if (userId) {
    socket.emit('leave-room', `user_${userId}`);
  }
};
 
export default socket;