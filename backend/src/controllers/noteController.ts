import { Request, Response } from 'express';
import Note from '../models/Note';

interface AuthRequest extends Request {
    userId?: string;
}

export const createNote = async (req: AuthRequest, res: Response) => {
  const { title, content } = req.body;
  try {
    const newNote = new Note({
      userId: req.userId,
      title,
      content,
    });
    const note = await newNote.save();
    res.status(201).json(note);
  } catch (err: any) {
    res.status(500).send('Server Error');
  }
};

export const getNotes = async (req: AuthRequest, res: Response) => {
  try {
    const notes = await Note.find({ userId: req.userId });
    res.json(notes);
  } catch (err: any) {
    res.status(500).send('Server Error');
  }
};

export const deleteNote = async (req: AuthRequest, res: Response) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
        return res.status(404).json({ msg: 'Note not found' });
    }
    
    if (note.userId.toString() !== req.userId) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await Note.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Note removed' });
  } catch (err: any) {
    res.status(500).send('Server Error');
  }
};