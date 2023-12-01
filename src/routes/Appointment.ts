import express from 'express';
import { createAppointment } from '../controllers/Appointment';

const router = express.Router();

router.post('/', createAppointment);

export default router;
