import { Router } from 'express';
import IntegrationController from '../controllers/IntegrationController';
import { verifyToken } from '../middlewares/Auth';

const router = Router();

router.post('/', verifyToken, IntegrationController.create);

export default router;