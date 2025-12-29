import { Candidate, RecruiterFilters } from '../types';

/**
 * Filters candidates based on hard requirements
 * Candidates who don't meet these criteria are removed from consideration
 * 
 * @param candidates - Array of all candidates
 * @param filters - Recruiter-defined filters
 * @returns Filtered array of candidates who meet all hard requirements
 */
export function filterCandidates(
  candidates: Candidate[], 
  filters: RecruiterFilters
): Candidate[] {
  return candidates.filter(candidate => {
    // Filter 1: Minimum experience requirement
    // Remove candidates with less experience than required
    if (candidate.yearsOfExperience < filters.minimumExperience) {
      return false;
    }
    
    // Filter 2: Location requirement
    // If specific locations are required, candidate must be in one of them
    if (filters.locations.length > 0) {
      if (!filters.locations.includes(candidate.location)) {
        return false;
      }
    }
    
    // Filter 3: Salary budget constraint
    // Remove candidates whose salary expectations exceed budget
    if (filters.salaryMax && candidate.salaryExpectation) {
      if (candidate.salaryExpectation > filters.salaryMax) {
        return false;
      }
    }
    
    // Candidate passed all filters
    return true;
  });
}
