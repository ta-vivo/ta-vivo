import { Router } from 'express';
import IntegrationController from '../controllers/IntegrationController';
import { verifyToken } from '../middlewares/Auth';

const router = Router();

router.get('/', verifyToken, IntegrationController.getAll);
router.post('/', verifyToken, IntegrationController.create);
router.delete('/:id', verifyToken, IntegrationController.delete);

export default router;