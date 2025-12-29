import { RankedCandidate } from '../types';

/**
 * Normalizes scores across a set of candidates
 * Currently a pass-through as individual scores are already 0-1 normalized
 * Can be extended for min-max normalization if needed
 * 
 * @param candidates - Candidates with raw scores
 * @returns Candidates with normalized scores
 */
export function normalizeScores(candidates: RankedCandidate[]): RankedCandidate[] {
  if (candidates.length === 0) return candidates;
  
  // Scores are already normalized to 0-1 range in scoreCandidate
  // This function is a placeholder for potential future normalization strategies
  // such as min-max normalization across all candidates
  
  return candidates;
}

/**
 * Alternative normalization: Min-Max scaling
 * Scales scores to fill the full 0-1 range based on actual min/max
 * Uncomment to use this approach instead
 */
export function normalizeScoresMinMax(candidates: RankedCandidate[]): RankedCandidate[] {
  if (candidates.length === 0) return candidates;
  if (candidates.length === 1) return candidates;
  
  const scores = candidates.map(c => c.finalScore);
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  const range = maxScore - minScore;
  
  if (range === 0) return candidates;
  
  return candidates.map(candidate => ({
    ...candidate,
    finalScore: (candidate.finalScore - minScore) / range
  }));
}
