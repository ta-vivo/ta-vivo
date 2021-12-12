import express from 'express';
import userRoutes from '../routes/User';
import TaskRoutes from '../routes/Task';
// Initialization
let router = express.Router();

// Routes
router.use('/users', userRoutes);
router.use('/tasks', TaskRoutes);

export default router;