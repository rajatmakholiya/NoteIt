import { Router } from 'express';
import { createNote, getNotes, deleteNote } from '../controllers/noteController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/', protect, createNote);

router.get('/', protect, getNotes);

router.delete('/:id', protect, deleteNote);

export default router;