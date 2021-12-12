import { Router } from 'express';
import TaskController from '../controllers/TaskController';

const router = Router();

router.get('/', TaskController.getAll);
router.get('/:id', TaskController.getById);
router.put('/:id', TaskController.update);
router.post('/', TaskController.create);
router.delete('/:id', TaskController.delete);

export default router;