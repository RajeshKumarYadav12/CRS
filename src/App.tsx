import React, { useState } from 'react';
import JobDescriptionInput from './components/JobDescriptionInput';
import RecruiterFilters from './components/RecruiterFilters';
import CandidateList from './components/CandidateList';
import { RecruiterFilters as RecruiterFiltersType, RankedCandidate } from './types';
import { extractJobData } from './lib/extractJobData';
import candidatesData from './data/candidates.json';

/**
 * Main App Component
 * Orchestrates the candidate ranking flow
 */
export default function App() {
  const [jobDescription, setJobDescription] = useState('');
  const [filters, setFilters] = useState<RecruiterFiltersType>({
    skills: [],
    minimumExperience: 0,
    locations: [],
    salaryMax: undefined
  });
  const [rankedCandidates, setRankedCandidates] = useState<RankedCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleJobDescriptionChange = (text: string) => {
    setJobDescription(text);
    
    // Auto-populate filters based on extracted job data
    if (text.trim().length > 0) {
      const jobData = extractJobData(text);
      
      // Debug: log extracted job data
      console.log('Extracted Job Data:', jobData);
      
      // Create new filters from extracted job data
      // This replaces the old filters with newly extracted values
      const newFilters: RecruiterFiltersType = {
        skills: [],  // Reset skills - user will manually select if needed
        locations: [], // Reset locations - will be set below
        minimumExperience: jobData.minimumExperience,
        salaryMax: jobData.salaryRange?.max
      };
      
      // Add location if extracted
      if (jobData.location && jobData.location !== 'Remote') {
        newFilters.locations = [jobData.location];
      } else if (text.toLowerCase().includes('remote')) {
        newFilters.locations = ['Remote'];
      }
      
      console.log('Updated Filters:', newFilters);
      setFilters(newFilters);
    }
  };

  const handleRankCandidates = async () => {
    setIsLoading(true);
    
    try {
      const payload = {
        jobDescriptionText: jobDescription,
        recruiterFilters: filters,
        candidates: candidatesData
      };
      
      console.log('Sending payload:', payload);
      
      // Call API to rank candidates
      const response = await fetch('/api/rank-candidates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to rank candidates');
      }

      const data = await response.json();
      console.log('Response:', data);
      setRankedCandidates(data.rankedCandidates);
    } catch (error) {
      console.error('Error ranking candidates:', error);
      alert('Failed to rank candidates. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const canRank = jobDescription.trim().length > 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎯 Candidate Ranking System
          </h1>
          <p className="text-gray-600">
            Filter and rank candidates based on job requirements and preferences
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Inputs */}
          <div className="lg:col-span-1 space-y-6">
            <JobDescriptionInput
              value={jobDescription}
              onChange={handleJobDescriptionChange}
            />
            
            <RecruiterFilters
              filters={filters}
              onFiltersChange={setFilters}
              onRank={handleRankCandidates}
              isLoading={isLoading}
              canRank={canRank}
            />
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-2">
            <CandidateList candidates={rankedCandidates} />
          </div>
        </div>
      </div>
    </div>
  );
}
