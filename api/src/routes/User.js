import {Router} from 'express';
import UserController from '../controllers/UserController';

const router = Router();

router.get('/', UserController.getAll );
router.get('/:id', UserController.getById );
router.put('/:id', UserController.update );
router.post('/', UserController.create );
router.delete('/:id', UserController.delete);

export default router;