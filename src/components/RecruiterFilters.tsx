import { RecruiterFilters as RecruiterFiltersType } from '../types';

interface RecruiterFiltersProps {
  filters: RecruiterFiltersType;
  onFiltersChange: (filters: RecruiterFiltersType) => void;
  onRank: () => void;
  isLoading: boolean;
  canRank: boolean;
}

const AVAILABLE_SKILLS = [
  'React', 'Angular', 'Vue.js', 'TypeScript', 'JavaScript', 
  'Node.js', 'Python', 'Java', 'C#', '.NET',
  'AWS', 'Azure', 'Docker', 'Kubernetes', 
  'MongoDB', 'PostgreSQL', 'MySQL', 'GraphQL'
];

const AVAILABLE_LOCATIONS = [
  'Remote', 'New York', 'San Francisco', 'Boston', 'Seattle', 'Austin', 'Chicago'
];

/**
 * Recruiter Filters Component
 * Provides UI for setting candidate filters
 */
export default function RecruiterFilters({
  filters,
  onFiltersChange,
  onRank,
  isLoading,
  canRank
}: RecruiterFiltersProps) {
  
  const toggleSkill = (skill: string) => {
    const newSkills = filters.skills.includes(skill)
      ? filters.skills.filter(s => s !== skill)
      : [...filters.skills, skill];
    onFiltersChange({ ...filters, skills: newSkills });
  };

  const toggleLocation = (location: string) => {
    const newLocations = filters.locations.includes(location)
      ? filters.locations.filter(l => l !== location)
      : [...filters.locations, location];
    onFiltersChange({ ...filters, locations: newLocations });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Recruiter Filters</h2>
      
      {/* Skills Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Required Skills
        </label>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_SKILLS.map(skill => (
            <button
              key={skill}
              onClick={() => toggleSkill(skill)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filters.skills.includes(skill)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Experience Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Minimum Experience (years)
        </label>
        <input
          type="number"
          min="0"
          max="20"
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          value={filters.minimumExperience}
          onChange={(e) => onFiltersChange({
            ...filters,
            minimumExperience: parseInt(e.target.value) || 0
          })}
        />
      </div>

      {/* Location Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Locations
        </label>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_LOCATIONS.map(location => (
            <button
              key={location}
              onClick={() => toggleLocation(location)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filters.locations.includes(location)
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {location}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Leave empty to include all locations
        </p>
      </div>

      {/* Salary Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Max Salary Budget ($)
        </label>
        <input
          type="number"
          min="0"
          step="1000"
          placeholder="e.g., 130000"
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          value={filters.salaryMax || ''}
          onChange={(e) => onFiltersChange({
            ...filters,
            salaryMax: e.target.value ? parseInt(e.target.value) : undefined
          })}
        />
        <p className="text-xs text-gray-500 mt-1">
          Leave empty for no salary constraint
        </p>
      </div>

      {/* Rank Button */}
      <button
        onClick={onRank}
        disabled={!canRank || isLoading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? '⏳ Ranking...' : '🚀 Rank Candidates'}
      </button>
    </div>
  );
}
