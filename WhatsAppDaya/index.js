import express from 'express'
import dotenv from 'dotenv';

const app = express();
dotenv.config({
    path:'./env'
});

import uploadMessage from './routes/whatsapp.route.js'

app.use('/api',uploadMessage);


