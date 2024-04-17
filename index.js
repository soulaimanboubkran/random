import express from 'express';
import dotenv from 'dotenv';


import cors from 'cors'

dotenv.config()

const app = express();

const PORT = 5000;


app.use(express.json())
app.use(cookieParser())
app.use(cors())




const connectWithRetry = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        // Retry connection after a delay
        setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
    }
};

const connect = async () => {
    await connectWithRetry();
};

app.listen(PORT, ()=> {
    connect();
    console.log(`Server is running on port ${PORT}`);
});