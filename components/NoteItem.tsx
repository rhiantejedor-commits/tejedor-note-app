'use client';

import React from 'react';

interface Note {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

interface NoteItemProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export default function NoteItem({ note, onEdit, onDelete }: NoteItemProps) {
  return (
    <div className="bg-[#131620] p-6 rounded-2xl shadow-xl border border-[#1e2230] flex flex-col justify-between transition-all hover:border-[#ff1e38]/50">
      <div>
        <div className="flex justify-between items-start gap-3 mb-3">
          <h3 className="text-base font-bold text-[#f8fafc] break-words">
            {note.title}
          </h3>
          <span className="text-xs font-mono text-[#ff1e38] bg-[#090a0f] border border-[#1e2230] px-2.5 py-1 rounded-full whitespace-nowrap shadow-sm">
            {note.createdAt}
          </span>
        </div>
        <p className="text-[#94a3b8] text-sm mb-6 whitespace-pre-wrap break-words">
          {note.description}
        </p>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-[#1e2230]">
        <button
          onClick={() => onEdit(note)}
          className="px-3.5 py-1.5 text-xs font-semibold bg-[#ff1e38]/10 text-[#ff1e38] border border-[#ff1e38]/30 rounded-lg hover:bg-[#ff1e38]/20 transition-all shadow-[0_0_8px_rgba(255,30,56,0.15)]"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(note.id)}
          className="px-3.5 py-1.5 text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-all"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
