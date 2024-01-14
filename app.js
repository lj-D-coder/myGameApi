import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import http from "http";
import authRouter from './routes/auth.js';
import routes from './routes/route.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


const app = express();
const server = http.createServer(app);

app.use(express.json()); //to parse parse json
app.use(cors());

const port = process.env.PORT; // You can change the port as needed
dotenv.config();
const db_connect = process.env.DB_CONNECT;


const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = dirname(currentFilePath);

// Serve static files
app.use('/uploads', express.static(path.join(currentDir, '/uploads')));

//Routes 
app.use('/auth',authRouter);
app.use('/',routes);


// Erron handling
app.use((err, req, res, next) =>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status (statusCode).json ({
    success: false,
    statusCode,
    message,
    });
});


mongoose
    .connect(db_connect)
    .then(()=>{
        console.log('App connected  to database');
        server.listen(port, () => {
            console.log(`Server is running on port ${port}`);
          });
    })
    .catch((error)=>{
        console.log(error);
    })



