import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(json());

// Routes
app.get('/', (req, res) => {
    res.send('AWGEI Backend is Running');
});

export default app;


