import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import userRoutes from './routes/userRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
// import imageRoutes from './routes/imageRoutes.js';

import errorHandler from './middleware/errorHandler.js';
import logger from './middleware/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger);

app.get('/', (req, res) => {
  res.send('Welcome to the TomGuard Backend API!');
});

app.use('/users', userRoutes);
app.use('/profiles', profileRoutes);
// app.use('/images', imageRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

export default app;
