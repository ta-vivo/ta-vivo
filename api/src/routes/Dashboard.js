import { Router } from 'express';
import DashboardController from '../controllers/DashboardController';
import { verifyToken } from '../middlewares/Auth';

const router = Router();

router.get('/', verifyToken, DashboardController.get);

export default router;