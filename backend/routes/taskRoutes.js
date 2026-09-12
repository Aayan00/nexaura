import { Router } from 'express';
import { taskController } from '../controllers/taskController.js';

const router = Router();

router.get('/', taskController.getTasks);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

router.patch('/:id/start', taskController.startTask);
router.patch('/:id/pause', taskController.pauseTask);
router.patch('/:id/complete', taskController.completeTask);
router.post('/:id/complete', taskController.completeTask);
router.patch('/:id/fail', taskController.failTask);

router.patch('/:id/subtasks/:subtaskId', taskController.toggleSubtask);
router.patch('/:id/subtasks/:subtaskId/toggle', taskController.toggleSubtask);

export default router;
