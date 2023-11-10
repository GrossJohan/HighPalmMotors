require('dotenv').config();
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './models/User';

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as any,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});

AppDataSource.initialize()
  .then(async () => {
    console.log('Database initialized...');
  })
  .catch((err) => {
    console.log('Error initializing database', err);
  });
