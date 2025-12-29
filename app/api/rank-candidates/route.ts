import { NextRequest, NextResponse } from 'next/server';
import { extractJobData } from '../../../app/lib/extractJobData';
import { filterCandidates } from '../../../app/lib/filterCandidates';
import { scoreCandidate } from '../../../app/lib/scoreCandidate';
import { normalizeScores } from '../../../app/lib/normalizeScore';
import { RankCandidatesRequest, RankCandidatesResponse } from '../../../app/types';

/**
 * POST /api/rank-candidates
 * 
 * Ranks candidates based on job description and recruiter filters
 * 
 * Request body:
 * - jobDescriptionText: string
 * - recruiterFilters: RecruiterFilters
 * - candidates: Candidate[]
 * 
 * Response:
 * - rankedCandidates: RankedCandidate[] (sorted by score descending)
 * - totalCandidates: number
 * - filteredCount: number
 */
export async function POST(request: NextRequest) {
  try {
    const body: RankCandidatesRequest = await request.json();
    
    // Validate request body
    if (!body.jobDescriptionText || !body.recruiterFilters || !body.candidates) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const { jobDescriptionText, recruiterFilters, candidates } = body;
    
    // Step 1: Extract job requirements from description
    const jobData = extractJobData(jobDescriptionText);
    
    // Step 2: Apply hard filters to remove unqualified candidates
    const filteredCandidates = filterCandidates(candidates, recruiterFilters);
    
    // Step 3: Score remaining candidates
    const scoredCandidates = filteredCandidates.map((candidate: any) =>
      scoreCandidate(candidate, jobData)
    );
    
    // Step 4: Normalize scores (optional, currently a pass-through)
    const normalizedCandidates = normalizeScores(scoredCandidates);
    
    // Step 5: Sort by score descending (highest match first)
    const rankedCandidates = normalizedCandidates.sort(
      (a: any, b: any) => b.finalScore - a.finalScore
    );
    
    // Prepare response with metadata
    const response: RankCandidatesResponse = {
      rankedCandidates,
      totalCandidates: candidates.length,
      filteredCount: filteredCandidates.length
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Error ranking candidates:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}