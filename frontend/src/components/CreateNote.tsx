import React, { useState } from "react";
import { createNote } from "../services/api";

interface CreateNoteProps {
  onNoteCreated: () => void;
  onCancel: () => void;
}

const CreateNote: React.FC<CreateNoteProps> = ({ onNoteCreated, onCancel }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Title and content cannot be empty.");
      return;
    }
    try {
      await createNote({ title, content });
      onNoteCreated();
    } catch (err) {
      setError("Failed to create note.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h3 className="text-xl font-bold text-gray-900 mb-4">New Note</h3>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Note Title"
          />
        </div>
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Write your note here..."
            rows={4}
          ></textarea>
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-2 px-4 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700"
          >
            Save Note
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateNote;
