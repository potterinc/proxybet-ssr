import express, {Application} from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import DatabaseConnection from './configs/server.config';

// Initializing server application
const app: Application = express();

// Server middleware
app.use(cors({origin: '*'}));
app.use(helmet());
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

new DatabaseConnection();
export default app;