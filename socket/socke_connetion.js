const http = require('http');
const socketio = require('socket.io');
const app = require('../server');
const socketAuth = require('../middlewares/socket_auth');

const streamViewers = {};

const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

async function connectSocket() {
    try {
        io.use(socketAuth); // 🔐 protect all sockets

        io.on('connection', (socket) => {
            console.log('🔌 A user connected:', socket.id);

            socket.on('joinRoom', (streamId) => {
                socket.join(streamId);
                console.log(`📺 User ${socket.id} joined stream room: ${streamId}`);
            });

            socket.on('chatMessage', ({ streamId, senderName, message }) => {
                io.to(streamId).emit('chatMessage', {
                    sender: senderName,
                    message,
                    timestamp: new Date()
                });
            });

            socket.on('joinRoom', ({ streamId }) => {
                socket.join(streamId);

                if (!streamViewers[streamId]) {
                    streamViewers[streamId] = new Set();
                }

                streamViewers[streamId].add(socket.id);

                const count = streamViewers[streamId].size;
                io.to(streamId).emit('viewerCount', count);
            });

            socket.on('sendMessage', async ({ streamId, message }) => {
                const payload = {
                    streamId,
                    userId: socket.user._id,
                    username: socket.user.name,
                    message,
                    timestamp: new Date()
                };

                await ChatMessage.create(payload); // Save to DB
                io.to(streamId).emit('receiveMessage', payload); // Broadcast
            });

            socket.on('disconnect', () => {
                for (const streamId in streamViewers) {
                    streamViewers[streamId].delete(socket.id);
                    const count = streamViewers[streamId].size;
                    io.to(streamId).emit('viewerCount', count);
                }
                console.log('❌ A user disconnected:', socket.id);
            });
        });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
}

module.exports = connectSocket