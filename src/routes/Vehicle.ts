import express from 'express';
import { createVehicle } from '../controllers/Vehicle';

const router = express.Router();

router.post('/', createVehicle);

export default router;
