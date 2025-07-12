import express from 'express';
import bodyParser from 'body-parser';
import authRouter from './routes/auth.js';
import partyRouter from './routes/party.js';
import userRouter from './routes/user.js';

const app = express();
app.use(bodyParser.json());
app.use(authRouter);
app.use(partyRouter);
app.use(userRouter);

export default app;
