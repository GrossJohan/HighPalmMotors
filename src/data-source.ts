import { Offer } from './models/Offer';

require('dotenv').config();
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './models/User';
import { Vehicle } from './models/Vehicle';
import { Appointment } from './models/Appointment';

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as any,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Vehicle, Offer, Appointment],
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
