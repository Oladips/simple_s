const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDatabase = require('./db/connection');
const userRoutes = require('./routes/user_route');
const authRoutes = require('./routes/auth_route');
const livestreamRoutes = require('./routes/livestream_route');
const productRoutes = require('./routes/product_routes');
const connectSocket = require('./socket/socke_connetion');
const orderRoutes = require('./routes/order_routes');
const livekitRoutes = require('./routes/livekit_route');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/livestreams', livestreamRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/livekit', livekitRoutes);
// Test Route
app.get('/api/ping', (req, res) => {
  res.send('pong');
});

connectDatabase();
connectSocket();

// Start server
app.listen(PORT, () => {
  console.log(`🚀 BendDownSelect API running on port ${PORT}`);
});
