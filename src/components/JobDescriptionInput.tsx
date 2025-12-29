import React from 'react';

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Job Description Input Component
 * Provides textarea for entering or pasting job description text
 */
export default function JobDescriptionInput({ value, onChange }: JobDescriptionInputProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Job Description</h2>
      <textarea
        className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900"
        placeholder="Paste job description here... 

Example: Looking for a React developer with 3+ years experience in TypeScript and Node.js. AWS experience preferred. Remote position. Salary $100k-$130k"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <p className="text-sm text-gray-500 mt-2">
        💡 Tip: Include skills, experience requirements, location, and salary range for best results
      </p>
    </div>
  );
}
