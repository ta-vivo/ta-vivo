import express from 'express';
import userRoutes from '../routes/User';
import TaskRoutes from '../routes/Task';
import CheckRoutes from '../routes/Check';
// Initialization
let router = express.Router();

// Routes
router.use('/users', userRoutes);
router.use('/tasks', TaskRoutes);
router.use('/checks', CheckRoutes);

export default router;