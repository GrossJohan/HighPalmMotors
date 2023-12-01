import express from 'express';
import { deleteTimeSlot, getTimeSlotsByDate } from '../controllers/Timeslot';

const router = express.Router();

router.get('/:date', getTimeSlotsByDate);
router.delete('/:date/:timeRange', deleteTimeSlot);

export default router;
