import {Router} from 'express';
import CheckController from '../controllers/CheckController';

const router = Router();

router.get('/', CheckController.getAll );
router.get('/:id', CheckController.getById );
router.put('/:id', CheckController.update );
router.post('/', CheckController.create );
router.delete('/:id', CheckController.delete);

export default router;