// Core candidate interface
export interface Candidate {
  id: string;
  name: string;
  skills: string[];
  yearsOfExperience: number;
  location: string;
  salaryExpectation?: number;
  resumeText: string;
}

// Ranked candidate with scoring metadata
export interface RankedCandidate extends Candidate {
  finalScore: number; // Normalized score between 0 and 1
  matchedSkills: string[]; // Skills that match job requirements
  missingSkills: string[]; // Required skills candidate lacks
  experienceFit: boolean; // Whether candidate meets minimum experience
}

// Extracted job description data
export interface JobData {
  requiredSkills: string[];
  preferredSkills: string[];
  minimumExperience: number;
  location: string;
  salaryRange?: {
    min: number;
    max: number;
  };
}

// Recruiter-defined filters
export interface RecruiterFilters {
  skills: string[]; // Required skills filter
  minimumExperience: number; // Minimum years of experience
  locations: string[]; // Acceptable locations
  salaryMax?: number; // Maximum salary budget
}

// API request/response types
export interface RankCandidatesRequest {
  jobDescriptionText: string;
  recruiterFilters: RecruiterFilters;
  candidates: Candidate[];
}

export interface RankCandidatesResponse {
  rankedCandidates: RankedCandidate[];
  totalCandidates: number;
  filteredCount: number;
}