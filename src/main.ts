import { PORT, EXPRESS } from './libs/constants';
import cors from 'cors';
import { RouterManager } from './Routers/routerManager';
import { getCorsOrigin } from './libs/corsSetUp';
import errorHandler from './libs/Handler/errorHandler';

const app = EXPRESS();


app.use(cors({
    origin: getCorsOrigin(),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));



app.use(EXPRESS.json());
app.use(EXPRESS.urlencoded({ extended: true }));

app.use('/upload', EXPRESS.static('upload'));



app.use('/', RouterManager);



app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running`);
});