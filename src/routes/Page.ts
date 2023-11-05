import express from 'express';
import { servePage } from '../controllers/Page';

const router = express.Router();

router.get('/', servePage);
router.get('/:page', servePage);

export default router;
