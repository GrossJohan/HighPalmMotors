import express from 'express';
import 'reflect-metadata';
import expressEjsLayouts from 'express-ejs-layouts';
import path from 'path';
import pageRouter from './routes/Page';
import userRouter from './routes/User';
import sessionRouter from './routes/Session';
import vehicleRouter from './routes/Vehicle';
import adminRouter from './routes/Admin';
import emailRouter from './routes/Email';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// Template engine
app.use(expressEjsLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/', pageRouter);
app.use('/users', userRouter);
app.use('/sessions', sessionRouter);
app.use('/vehicles', vehicleRouter);
app.use('/admin', adminRouter);
app.use('/email', emailRouter);

export default app;
