require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const setupSwagger = require('./swagger');

const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const cartRoutes = require('./routes/cartRoutes');
const { generalLimiter, authLimiter } = require('./middlewares/rateLimiter');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(generalLimiter);
app.use('/auth', authLimiter, authRoutes)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(setupSwagger));

app.use('/auth', authRoutes);
app.use('/admins', adminRoutes);
app.use('/users', userRoutes);
app.use('/books', bookRoutes);
app.use('/purchases', purchaseRoutes);
app.use('/cart', cartRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
