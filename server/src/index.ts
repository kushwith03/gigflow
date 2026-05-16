import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Basic Route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    message: 'GigFlow API is running'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
