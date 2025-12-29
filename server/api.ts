import express from 'express';
import cors from 'cors';
import { extractJobData } from '../src/lib/extractJobData';
import { filterCandidates } from '../src/lib/filterCandidates';
import { scoreCandidate } from '../src/lib/scoreCandidate';
import { normalizeScores } from '../src/lib/normalizeScore';
import type { RankCandidatesRequest, RankCandidatesResponse } from '../src/types';
import candidatesData from '../src/data/candidates.json';

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

/**
 * POST /api/rank-candidates
 * 
 * Ranks candidates based on job description and recruiter filters
 */
app.post('/api/rank-candidates', (req, res) => {
  try {
    const body: RankCandidatesRequest = req.body;
    
    console.log('Received request body:', JSON.stringify(body, null, 2));
    
    // Validate request body
    if (!body.jobDescriptionText || !body.recruiterFilters) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const { jobDescriptionText, recruiterFilters } = body;
    const candidates = body.candidates || candidatesData;
    
    console.log('Recruiter Filters:', recruiterFilters);
    
    // Step 1: Extract job requirements from description
    const jobData = extractJobData(jobDescriptionText);
    
    console.log('Extracted Job Data:', jobData);
    
    // Step 2: Apply hard filters to remove unqualified candidates
    const filteredCandidates = filterCandidates(candidates, recruiterFilters);
    
    console.log('Filtered Candidates Count:', filteredCandidates.length, 'out of', candidates.length);
    console.log('Filtered Candidates:', filteredCandidates.map(c => c.name));
    
    // Step 3: Score remaining candidates
    const scoredCandidates = filteredCandidates.map(candidate =>
      scoreCandidate(candidate, jobData)
    );
    
    // Step 4: Normalize scores (optional, currently a pass-through)
    const normalizedCandidates = normalizeScores(scoredCandidates);
    
    // Step 5: Sort by score descending (highest match first)
    const rankedCandidates = normalizedCandidates.sort(
      (a, b) => b.finalScore - a.finalScore
    );
    
    // Prepare response with metadata
    const response: RankCandidatesResponse = {
      rankedCandidates,
      totalCandidates: candidates.length,
      filteredCount: filteredCandidates.length
    };
    
    return res.json(response);
    
  } catch (error) {
    console.error('Error ranking candidates:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
