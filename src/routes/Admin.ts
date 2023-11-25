import express from 'express';
import { createAdminSession } from '../controllers/Admin';

const router = express.Router();

router.post('/', createAdminSession);

export default router;
