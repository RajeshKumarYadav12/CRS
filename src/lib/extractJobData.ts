import { JobData } from '../types';

/**
 * Extracts structured job data from free-form job description text
 * Uses keyword matching and regex patterns for extraction
 * 
 * @param jobDescription - Raw job description text
 * @returns Extracted job data including skills, experience, location, and salary
 */
export function extractJobData(jobDescription: string): JobData {
  const text = jobDescription.toLowerCase();
  
  // Common technical skills with proper capitalization mapping
  const skillsMapping: { [key: string]: string } = {
    'react': 'React',
    'angular': 'Angular',
    'vue.js': 'Vue.js',
    'vue': 'Vue.js',
    'typescript': 'TypeScript',
    'javascript': 'JavaScript',
    'node.js': 'Node.js',
    'python': 'Python',
    'java': 'Java',
    'c#': 'C#',
    '.net': '.NET',
    'spring boot': 'Spring Boot',
    'aws': 'AWS',
    'azure': 'Azure',
    'gcp': 'GCP',
    'docker': 'Docker',
    'kubernetes': 'Kubernetes',
    'mongodb': 'MongoDB',
    'postgresql': 'PostgreSQL',
    'mysql': 'MySQL',
    'graphql': 'GraphQL',
    'django': 'Django',
    'fastapi': 'FastAPI',
    'redis': 'Redis',
    'jest': 'Jest',
    'css': 'CSS',
    'html': 'HTML'
  };
  
  const allSkills = Object.keys(skillsMapping);
  const requiredSkills: string[] = [];
  const preferredSkills: string[] = [];
  
  // Extract required vs preferred skills based on context
  allSkills.forEach(skill => {
    const properName = skillsMapping[skill];
    
    // Check for explicit "required" or "must have" indicators
    if (
      text.includes(`required: ${skill}`) || 
      text.includes(`must have ${skill}`) ||
      text.includes(`requires ${skill}`) ||
      text.includes(`require ${skill}`)
    ) {
      requiredSkills.push(properName);
    } 
    // Check for "preferred" or "nice to have" indicators
    else if (
      text.includes(`preferred: ${skill}`) ||
      text.includes(`nice to have ${skill}`) ||
      text.includes(`bonus: ${skill}`) ||
      text.includes(`plus: ${skill}`)
    ) {
      preferredSkills.push(properName);
    }
    // If skill mentioned without context, treat as preferred
    else if (text.includes(skill)) {
      preferredSkills.push(properName);
    }
  });
  
  // Extract minimum years of experience using regex
  // Matches patterns like "3+ years", "5 years of experience", "3+ years experience", etc.
  let minimumExperience = 0;
  
  // Try multiple patterns
  const expPatterns = [
    /(\d+)\+?\s*years?\s*(?:of)?\s*(?:experience)?/i,  // Matches "3+ years", "3 years of experience", "3 years experience", etc.
    /at least\s+(\d+)\s*years?/i,                       // Matches "at least 3 years"
    /minimum\s+(\d+)\s*years?/i                         // Matches "minimum 3 years"
  ];
  
  for (const pattern of expPatterns) {
    const match = pattern.exec(text);
    if (match) {
      minimumExperience = parseInt(match[1]);
      break;
    }
  }
  
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
  // First try to match salary ranges like "$100k-$130k" or "$100,000 - $130,000"
  let salaryRange = undefined;
  const salaryRangeMatch = text.match(/\$(\d+)[k,]?\s*-\s*\$?(\d+)k?/i);
  
  if (salaryRangeMatch) {
    salaryRange = {
      min: parseInt(salaryRangeMatch[1]) * (salaryRangeMatch[1].length <= 3 ? 1000 : 1),
      max: parseInt(salaryRangeMatch[2]) * 1000
    };
  } else {
    // Try to match single salary amounts like "maximum budget of $120,000"
    const singleSalaryMatch = text.match(/(?:budget|salary|up to|maximum).*?\$(\d+)(?:,\d+)?/i);
    if (singleSalaryMatch) {
      const amount = parseInt(singleSalaryMatch[1]);
      // If the number is 3 digits or less, it's likely in thousands
      const salaryValue = singleSalaryMatch[1].length <= 3 ? amount * 1000 : amount;
      salaryRange = {
        min: 0,
        max: salaryValue
      };
    }
  }
  
  return {
    requiredSkills,
    preferredSkills,
    minimumExperience,
    location,
    salaryRange
  };
}
