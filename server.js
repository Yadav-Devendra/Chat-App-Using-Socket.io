const io = require('socket.io')(3000, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const users = new Map();

io.on('connection', socket => {
    console.log(`User connected: ${socket.id}`);

    socket.on('new-user', name => {
        if (users.has(socket.id)) {
            socket.emit('error', 'You have already set your name.');
            return;
        }
        users.set(socket.id, name);
        socket.broadcast.emit('user-connected', name);
        socket.emit('user-joined', name);
        console.log(`User ${name} joined with id: ${socket.id}`);
    });

    socket.on('send-chat-message', message => {
        const name = users.get(socket.id);
        if (!name) {
            socket.emit('error', 'You must set a name first.');
            return;
        }
        socket.broadcast.emit('chat-message', { message, name });
        console.log(`Message from ${name}: ${message}`);
    });

    socket.on('disconnect', () => {
        const name = users.get(socket.id);
        if (name) {
            socket.broadcast.emit('user-disconnected', name);
            users.delete(socket.id);
            console.log(`User ${name} disconnected.`);
        } else {
            console.log(`A socket disconnected: ${socket.id}`);
        }

    });

    socket.on('error', (error) => {
        console.error("Socket Error:", error);
    })
});

console.log('Server started on port 3000');