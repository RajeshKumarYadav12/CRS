import { RankedCandidate } from '../types';

interface CandidateCardProps {
  candidate: RankedCandidate;
  rank: number;
}

/**
 * Candidate Card Component
 * Displays individual candidate information with ranking details
 */
export default function CandidateCard({ candidate, rank }: CandidateCardProps) {
  const scorePercentage = Math.round(candidate.finalScore * 100);
  const scoreColor = scorePercentage >= 80 ? 'bg-green-100 text-green-800' :
                     scorePercentage >= 60 ? 'bg-blue-100 text-blue-800' :
                     scorePercentage >= 40 ? 'bg-yellow-100 text-yellow-800' :
                     'bg-red-100 text-red-800';

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Header with rank and score */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl font-bold text-gray-700">#{rank}</span>
            <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
          </div>
          <p className="text-sm text-gray-600">{candidate.yearsOfExperience} years experience • {candidate.location}</p>
        </div>
        <div className={`${scoreColor} px-4 py-2 rounded-lg font-semibold text-center min-w-max`}>
          <div className="text-sm">Match Score</div>
          <div className="text-2xl">{scorePercentage}%</div>
        </div>
      </div>

      {/* Skills section */}
      <div className="mb-3">
        <div className="text-xs font-semibold text-gray-600 mb-2 uppercase">Matched Skills</div>
        <div className="flex flex-wrap gap-1">
          {candidate.matchedSkills.length > 0 ? (
            candidate.matchedSkills.map(skill => (
              <span key={skill} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                ✓ {skill}
              </span>
            ))
          ) : (
            <span className="text-gray-500 text-xs italic">No matched skills</span>
          )}
        </div>
      </div>

      {/* Missing skills */}
      {candidate.missingSkills.length > 0 && (
        <div className="mb-3">
          <div className="text-xs font-semibold text-gray-600 mb-2 uppercase">Missing Skills</div>
          <div className="flex flex-wrap gap-1">
            {candidate.missingSkills.map(skill => (
              <span key={skill} className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                ✗ {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer with additional info */}
      <div className="flex items-center justify-between text-sm text-gray-600 pt-3 border-t border-gray-200">
        <div className="flex items-center gap-2">
          {candidate.experienceFit && (
            <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-medium">
              ✓ Experience Match
            </span>
          )}
        </div>
        {candidate.salaryExpectation && (
          <div className="text-sm">
            Salary: ${(candidate.salaryExpectation / 1000).toFixed(0)}k
          </div>
        )}
      </div>
    </div>
  );
}
