import express from 'express';
import { servePage } from '../controllers/Page';

const router = express.Router();

router.get('/', servePage);
router.get('/:page', servePage);
router.get('/:page/:subpage', servePage);

export default router;
