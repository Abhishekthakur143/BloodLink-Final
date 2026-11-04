const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./db');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(cors());

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB connection error:', err);
    res.status(500).json({ success: false, error: 'Database connection failed' });
  }
});

app.set('io', io);

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/blood-requests', require('./routes/bloodRequestRoutes'));
app.use('/api/donations', require('./routes/donationRoutes'));
app.use('/api/camps', require('./routes/CampRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/sos', require('./routes/sosRoutes'));
app.use('/api/maps', require('./routes/mapRoutes'));

app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
  });

  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => console.log(`Server & Socket.io running on port ${PORT}`));
}

module.exports = app;