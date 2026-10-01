'use client';

import { useState, useEffect } from 'react';
import NoteItem from './components/NoteItem';

interface Note {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [warning, setWarning] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error('Failed to parse notes from localStorage', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    if (!title.trim()) {
      setWarning('');
      return;
    }

    const exists = notes.some(
      (note) => note.title.toLowerCase() === title.trim().toLowerCase() && note.id !== editingId
    );

    if (exists) {
      setWarning('A note with this exact title already exists.');
    } else {
      setWarning('');
    }
  }, [title, notes, editingId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    if (editingId) {
      setNotes(
        notes.map((note) =>
          note.id === editingId
            ? { ...note, title: title.trim(), description: description.trim() }
            : note
        )
      );
      setEditingId(null);
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        title: title.trim(),
        description: description.trim(),
        createdAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      };
      setNotes([newNote, ...notes]);
    }

    setTitle('');
    setDescription('');
    setWarning('');
  };

  const handleEdit = (note: Note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setDescription(note.description);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setTitle('');
      setDescription('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setWarning('');
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto">
        
        <header className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-[#f8fafc] tracking-wider drop-shadow-[0_0_12px_rgba(255,30,56,0.4)]">
            Note Application
          </h1>
          <p className="text-[#94a3b8] text-sm mt-1 font-mono">Exercise 3 • Rhian Gwapo :3</p>
        </header>

        <div className="bg-[#131620] rounded-2xl shadow-xl border border-[#1e2230] p-6 sm:p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-[#f8fafc] tracking-wide">
              {editingId ? 'Edit Existing Note' : 'Create New Note'}
            </h2>
            {editingId && (
              <span className="text-xs font-semibold px-3 py-1 bg-[#ff1e38]/10 text-[#ff1e38] rounded-full border border-[#ff1e38]/30 font-mono shadow-[0_0_8px_rgba(255,30,56,0.2)]">
                Editing Mode
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-1.5 font-mono">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title..."
                required
                className="w-full px-4 py-3 rounded-xl bg-[#181b28] border border-[#2d3548] focus:outline-none focus:ring-2 focus:ring-[#ff1e38] focus:border-[#ff1e38] text-[#f8fafc] placeholder-[#64748b] text-sm transition-all"
              />
              {warning && (
                <div className="mt-2 text-[#ff1e38] text-xs font-medium bg-[#ff1e38]/10 px-3 py-2 rounded-xl border border-[#ff1e38]/30">
                  {warning}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-1.5 font-mono">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write your note description here..."
                rows={4}
                required
                className="w-full px-4 py-3 rounded-xl bg-[#181b28] border border-[#2d3548] focus:outline-none focus:ring-2 focus:ring-[#ff1e38] focus:border-[#ff1e38] text-[#f8fafc] placeholder-[#64748b] text-sm resize-none transition-all"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className={`flex-1 font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-lg ${
                  editingId 
                    ? 'bg-amber-500 hover:bg-amber-400 text-[#090a0f] shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                    : 'bg-gradient-to-r from-[#ff1e38] to-[#ff526b] text-white hover:brightness-110 shadow-[0_0_15px_rgba(255,30,56,0.4)]'
                }`}
              >
                {editingId ? 'Save Changes' : 'Add Note'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-[#1e2230] hover:bg-[#282d40] text-[#94a3b8] hover:text-[#f8fafc] font-semibold py-3 px-6 rounded-xl text-sm transition-all border border-[#1e2230]"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-extrabold text-[#f8fafc] tracking-wide flex items-center gap-2">
            Your Notes 
            <span className="text-xs font-mono bg-[#131620] text-[#ff1e38] border border-[#1e2230] px-2.5 py-0.5 rounded-full ml-1">
              {notes.length}
            </span>
          </h2>
          {notes.length > 0 && (
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search notes..."
              className="w-full sm:w-60 px-4 py-2.5 rounded-xl bg-[#131620] border border-[#1e2230] focus:outline-none focus:ring-2 focus:ring-[#ff1e38] text-[#f8fafc] placeholder-[#64748b] text-sm shadow-sm transition-all"
            />
          )}
        </div>

        {filteredNotes.length === 0 ? (
          <div className="text-center py-16 bg-[#131620] rounded-2xl border border-dashed border-[#1e2230] p-8">
            <p className="text-[#f8fafc] font-medium text-sm">No notes found</p>
            <p className="text-[#94a3b8] text-xs mt-1">Get started by creating a new note above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredNotes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
