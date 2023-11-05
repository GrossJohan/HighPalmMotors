import express from 'express';
import path from 'path';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

export default app;
