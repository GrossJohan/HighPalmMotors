import express from 'express';
import { createSession, deleteSession } from '../controllers/Session';

const router = express.Router();

router.post('/', createSession);
router.delete('/', deleteSession);

export default router;
