import { Candidate, JobData, RankedCandidate } from '../types';

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

/**
 * Scores a single candidate against extracted job data and recruiter filters
 */
export function scoreCandidate(
  candidate: Candidate,
  jobData: JobData
): RankedCandidate {
  const required = jobData.requiredSkills || [];
  const preferred = jobData.preferredSkills || [];

  // Convert candidate skills to lowercase for case-insensitive matching
  const candidateSkillsLower = candidate.skills.map(s => s.toLowerCase());

  // Match skills (case-insensitive)
  const matchedRequired = required.filter((r: string) => 
    candidateSkillsLower.includes(r.toLowerCase())
  );
  const matchedPreferred = preferred.filter((p: string) => 
    candidateSkillsLower.includes(p.toLowerCase())
  );

  // Return matched skills in their original case from candidate
  const matchedSkillsLower = Array.from(new Set([...matchedRequired, ...matchedPreferred].map(s => s.toLowerCase())));
  const matchedSkills = candidate.skills.filter(skill => 
    matchedSkillsLower.includes(skill.toLowerCase())
  );

  const missingSkills = required.filter((r: string) => 
    !candidateSkillsLower.includes(r.toLowerCase())
  );

  const experienceFit = candidate.yearsOfExperience >= (jobData.minimumExperience || 0);

  // Skill scores
  const requiredSkillScore = required.length ? matchedRequired.length / required.length : 0;
  const preferredSkillScore = preferred.length ? matchedPreferred.length / preferred.length : 0;

  // Experience score: proportion capped at 1
  const experienceScore = jobData.minimumExperience
    ? clamp01(candidate.yearsOfExperience / Math.max(1, jobData.minimumExperience))
    : 1;

  // Location score: exact match or remote counts as full; otherwise 0
  const jobLoc = (jobData.location || '').toLowerCase();
  const candLoc = (candidate.location || '').toLowerCase();
  const locationScore = (jobLoc === 'remote' || candLoc === 'remote')
    ? 1
    : jobLoc && candLoc
    ? jobLoc === candLoc ? 1 : 0
    : 0.5;

  // Salary score: 1 if within range, declines slightly if above; neutral if no data
  let salaryScore = 0.5;
  if (jobData.salaryRange && candidate.salaryExpectation) {
    const { min, max } = jobData.salaryRange;
    const exp = candidate.salaryExpectation;
    if (exp >= min && exp <= max) salaryScore = 1;
    else if (exp > max) salaryScore = clamp01(1 - (exp - max) / Math.max(1, max));
    else if (exp < min) salaryScore = clamp01(exp / Math.max(1, min));
  }

  // Weights for components (sum to ~1)
  const weights = {
    required: 0.5,
    preferred: 0.12,
    experience: 0.2,
    location: 0.12,
    salary: 0.06
  };

  const rawScore =
    weights.required * requiredSkillScore +
    weights.preferred * preferredSkillScore +
    weights.experience * experienceScore +
    weights.location * locationScore +
    weights.salary * salaryScore;

  const finalScore = clamp01(rawScore);

  const ranked: RankedCandidate = {
    ...candidate,
    finalScore,
    matchedSkills,
    missingSkills,
    experienceFit
  };

  return ranked;
}
