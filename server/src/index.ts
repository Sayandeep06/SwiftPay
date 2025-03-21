const express = require('express');
import cors from 'cors'
const app = express();
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;
import userRouter from './routes/user';
import accountRouter from './routes/account'

app.use(cors());
app.use(express.json());




app.use('/api/v1/user', userRouter);
app.use('/api/v1/account', accountRouter);

app.listen(PORT, ()=>{
    console.log(`listening on http://localhost:${PORT}`);
})