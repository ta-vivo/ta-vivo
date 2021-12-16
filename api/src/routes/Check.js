import { Router } from 'express';
import CheckController from '../controllers/CheckController';
import { verifyToken } from '../middlewares/Auth';

const router = Router();

router.get('/', verifyToken, CheckController.getAll);
router.get('/:id', verifyToken, CheckController.getById);
router.get('/:id/logs', verifyToken, CheckController.getLogsByCheckId);
router.put('/:id', verifyToken, CheckController.update);
router.post('/', verifyToken, CheckController.create);
router.delete('/:id', verifyToken, CheckController.delete);

export default router;