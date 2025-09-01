import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Welcome from "../components/Welcome";
import CreateNote from "../components/CreateNote";
import NoteList from "../components/NoteList";

import logo from "../assets/logo2.svg";

const Dashboard: React.FC = () => {
  const [refreshNotes, setRefreshNotes] = useState(false);
  const [showCreateNote, setShowCreateNote] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleNoteAction = () => {
    setRefreshNotes((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="w-50 h-50" />
            <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-indigo-600 font-medium hover:text-indigo-500"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Welcome />
              {showCreateNote ? (
                <CreateNote
                  onNoteCreated={() => {
                    handleNoteAction();
                    setShowCreateNote(false);
                  }}
                  onCancel={() => setShowCreateNote(false)}
                />
              ) : (
                <button
                  onClick={() => setShowCreateNote(true)}
                  className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create Note
                </button>
              )}
            </div>
            <div className="lg:col-span-2 mt-6 lg:mt-0">
              <NoteList
                refresh={refreshNotes}
                onNoteDeleted={handleNoteAction}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
