const express = require('express');
import cors from 'cors'
const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());

const rootRouter = require('./routes/rootRouter');
const userRouter = require('./routes/user');

app.use('/api/v1', rootRouter);
app.use('api/v1/user', userRouter);

app.listen(PORT, ()=>{
    console.log(`listening on http://localhost:${PORT}`);
})