import React from 'react';

interface ContactModalProps {
  contactId: string;
  open: boolean;
  onClose: () => void;
}

export default function ContactModal({ contactId, open, onClose }: ContactModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-semibold">Contact Profile</h2>
        <p>Contact ID: {contactId}</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}