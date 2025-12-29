import { JobData } from '@/types';

/**
 * Extracts structured job data from free-form job description text
 * Uses keyword matching and regex patterns for extraction
 * 
 * @param jobDescription - Raw job description text
 * @returns Extracted job data including skills, experience, location, and salary
 */
export function extractJobData(jobDescription: string): JobData {
  const text = jobDescription.toLowerCase();
  
  // Common technical skills to search for
  const allSkills = [
    'react', 'angular', 'vue.js', 'vue', 'typescript', 'javascript', 
    'node.js', 'python', 'java', 'c#', '.net', 'spring boot',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'mongodb', 
    'postgresql', 'mysql', 'graphql', 'django', 'fastapi', 'redis',
    'jest', 'css', 'html'
  ];
  
  const requiredSkills: string[] = [];
  const preferredSkills: string[] = [];
  
  // Extract required vs preferred skills based on context
  allSkills.forEach(skill => {
    // Check for explicit "required" or "must have" indicators
    if (
      text.includes(`required: ${skill}`) || 
      text.includes(`must have ${skill}`) ||
      text.includes(`requires ${skill}`) ||
      text.includes(`require ${skill}`)
    ) {
      requiredSkills.push(skill);
    } 
    // Check for "preferred" or "nice to have" indicators
    else if (
      text.includes(`preferred: ${skill}`) ||
      text.includes(`nice to have ${skill}`) ||
      text.includes(`bonus: ${skill}`) ||
      text.includes(`plus: ${skill}`)
    ) {
      preferredSkills.push(skill);
    }
    // If skill mentioned without context, treat as preferred
    else if (text.includes(skill)) {
      preferredSkills.push(skill);
    }
  });
  
  // Extract minimum years of experience using regex
  // Matches patterns like "3+ years", "5 years of experience", etc.
  const expMatch = text.match(/(\d+)\+?\s*years?\s*(of)?\s*experience/i);
  const minimumExperience = expMatch ? parseInt(expMatch[1]) : 0;
  
  // Extract location from common city names or "remote"
  const locations = [
    'remote', 'new york', 'san francisco', 'boston', 
    'seattle', 'austin', 'chicago', 'los angeles', 'denver'
  ];
  const foundLocation = locations.find(loc => text.includes(loc));
  const location = foundLocation 
    ? foundLocation.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : 'Remote';
  
  // Extract salary range using regex
  // Matches patterns like "$100k-$130k" or "$100,000 - $130,000"
  const salaryMatch = text.match(/\$(\d+)[k,]?\s*-\s*\$?(\d+)k?/i);
  const salaryRange = salaryMatch ? {
    min: parseInt(salaryMatch[1]) * (salaryMatch[1].length <= 3 ? 1000 : 1),
    max: parseInt(salaryMatch[2]) * 1000
  } : undefined;
  
  return {
    requiredSkills,
    preferredSkills,
    minimumExperience,
    location,
    salaryRange
  };
}