'use client';

import React from 'react';
import { RankedCandidate } from '@/types';
import CandidateCard from './CandidateCard';

interface CandidateListProps {
  candidates: RankedCandidate[];
}

/**
 * Candidate List Component
 * Displays ranked list of candidates
 */
export default function CandidateList({ candidates }: CandidateListProps) {
  if (candidates.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Ranked Candidates</h2>
        <div className="text-center py-12 text-gray-500">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <p className="text-lg font-medium mb-2">No candidates ranked yet</p>
          <p className="text-sm">
            Enter a job description and click "Rank Candidates" to see results
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">🏆 Ranked Candidates</h2>
        <span className="text-sm text-gray-500">
          {candidates.length} candidate{candidates.length !== 1 ? 's' : ''} found
        </span>
      </div>
      
      <div className="space-y-4">
        {candidates.map((candidate, index) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            rank={index + 1}
          />
        ))}
      </div>
    </div>
  );
}