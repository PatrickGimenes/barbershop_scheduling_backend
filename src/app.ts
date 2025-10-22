import express from 'express';
import cors from 'cors';
import clientRoutes from './routes/clientRoute';

const app = express();

app.use(cors());

app.use(express.json());

app.get('/', (_, res) => res.send('Funcionando'));

app.use('/clientes', clientRoutes);

export default app;
