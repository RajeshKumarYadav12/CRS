'use client';

import React from 'react';
import { RankedCandidate } from '@/types';

interface CandidateCardProps {
  candidate: RankedCandidate;
  rank: number;
}

/**
 * Candidate Card Component
 * Displays a single candidate with their match score and details
 */
export default function CandidateCard({ candidate, rank }: CandidateCardProps) {
const scorePercentage = (candidate.finalScore * 100).toFixed(0);
return (
<div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white">
{/* Header with rank and score */}
<div className="flex items-start justify-between mb-3">
<div className="flex items-center gap-3">
<div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-full font-bold text-lg">
{rank}
</div>
<div>
<h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
<p className="text-sm text-gray-600">
📍 {candidate.location} • 💼 {candidate.yearsOfExperience} years experience
</p>
</div>
</div>
<div className="text-right">
<div className="text-2xl font-bold text-blue-600">
{scorePercentage}%
</div>
<div className="text-xs text-gray-500">Match Score</div>
</div>
</div>

{/* Skills breakdown */}
  <div className="grid grid-cols-2 gap-4 mb-3">
    <div>
      <p className="text-xs font-medium text-gray-500 mb-1">✅ Matched Skills</p>
      <div className="flex flex-wrap gap-1">
        {candidate.matchedSkills.length > 0 ? (
          candidate.matchedSkills.map(skill => (
            <span
              key={skill}
              className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded"
            >
              {skill}
            </span>
          ))
        ) : (
          <span className="text-xs text-gray-400">None</span>
        )}
      </div>
    </div>
    <div>
      <p className="text-xs font-medium text-gray-500 mb-1">❌ Missing Skills</p>
      <div className="flex flex-wrap gap-1">
        {candidate.missingSkills.length > 0 ? (
          candidate.missingSkills.slice(0, 3).map(skill => (
            <span
              key={skill}
              className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded"
            >
              {skill}
            </span>
          ))
        ) : (
          <span className="text-xs text-gray-400">None</span>
        )}
        {candidate.missingSkills.length > 3 && (
          <span className="text-xs text-gray-500">
            +{candidate.missingSkills.length - 3} more
          </span>
        )}
      </div>
    </div>
  </div>

  {/* Status badges */}
  <div className="flex items-center gap-3 text-sm flex-wrap">
    {candidate.experienceFit ? (
      <span className="px-2 py-1 bg-green-100 text-green-700 rounded font-medium">
        ✓ Experience Match
      </span>
    ) : (
      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded font-medium">
        ⚠ Below Min Experience
      </span>
    )}
    {candidate.salaryExpectation && (
      <span className="text-gray-600">
        💰 Salary: ${(candidate.salaryExpectation / 1000).toFixed(0)}k
      </span>
    )}
  </div>

  {/* Resume preview */}
  <div className="mt-3 pt-3 border-t border-gray-200">
    <p className="text-xs text-gray-600 line-clamp-2">
      {candidate.resumeText}
    </p>
  </div>
</div>
);
}