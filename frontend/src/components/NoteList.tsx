import React, { useEffect, useState } from "react";
import { getNotes, deleteNote } from "../services/api";

interface Note {
  _id: string;
  title: string;
  content: string;
}

interface NoteListProps {
  refresh: boolean;
  onNoteDeleted: () => void;
}

const NoteList: React.FC<NoteListProps> = ({ refresh, onNoteDeleted }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const { data } = await getNotes();
        setNotes(data.reverse());
      } catch (error) {
        console.error("Failed to fetch notes", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [refresh]);

  const handleDelete = async (id: string) => {
    try {
      await deleteNote(id);
      onNoteDeleted();
    } catch (error) {
      console.error("Failed to delete note", error);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading notes...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-900">Notes</h3>
      {notes.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-xl shadow-md">
          <p className="text-gray-500">You have no notes yet.</p>
        </div>
      ) : (
        notes.map((note) => (
          <div
            key={note._id}
            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm"
          >
            <div>
              <h4 className="font-semibold text-gray-800">{note.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{note.content}</p>
            </div>
            <button
              onClick={() => handleDelete(note._id)}
              className="p-2 text-gray-400 rounded-full hover:bg-red-100 hover:text-red-600"
              aria-label="Delete note"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default NoteList;
