import express, {Express} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fileupload from 'express-fileupload';
import path = require('path');
import router from './router/index';
import AppDataSource from './db';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT;


app.use(cors());
app.use(express.json());
app.use(fileupload());


app.use(express.static(
    path.resolve(__dirname, 'static', 'png')
));
app.use(express.static(
    path.resolve(__dirname, 'static', 'jpg')
))
app.use(express.static(
    path.resolve(__dirname, 'static', 'svg')
))

app.use('/api', router());

app.listen(PORT, async () => {
    try {
        await AppDataSource.initialize();
        console.log(`Сервер запустился на ПОРТЕ-${PORT}`);
          //await AppDataSource.dropDatabase();
        return async () => {
            await AppDataSource.destroy();
        }

    } catch (error) {
        console.log(error);
    }
});