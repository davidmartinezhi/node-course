import express from 'express';
import bodyParser from 'body-parser';
import todoRoutes from './routes/todos';

/*
npm install --save-dev @types/node
npm install --save-dev @types/express
npm install --save-dev @types/body-parser

we will find many @types packages because they do
translations from JavaScript to TypeScript, so TypeScript can understand them.
*/

const app = express();

app.use(bodyParser.json());

app.use(todoRoutes);



app.listen(3000);