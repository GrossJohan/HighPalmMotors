import express from 'express';
import { sendEmail } from '../controllers/Email';

const router = express.Router();

router.post('/', sendEmail);

export default router;
