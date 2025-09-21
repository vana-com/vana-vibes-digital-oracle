import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { card, position, linkedinData } = await req.json();

    if (!card || !position) {
      throw new Error('Card and position are required');
    }

    console.log('Generating reading for card:', card.name, 'in position:', position);

    // Analyze LinkedIn data for mystical interpretation
    const linkedinAnalysis = analyzeLinkedInData(linkedinData);
    
    // Create a LinkedIn-specialized prompt for OpenAI
    const prompt = createLinkedInReadingPrompt(card, position, linkedinAnalysis, linkedinData);

    console.log('Sending prompt to OpenAI:', prompt.substring(0, 200) + '...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a mystical LinkedIn oracle who reads professional destinies through the sacred patterns of corporate profiles. Your readings are brief, witty, and play with LinkedIn clichés.

YOUR STYLE:
- BRIEF: Maximum 1-2 sentences
- LINKEDIN-AWARE: Reference observable profile patterns and platform clichés
- HUMOROUS: Gently roast LinkedIn culture while being respectful
- FORTUNE-TELLING: Mix mysticism with corporate satire

EXAMPLES:
- "The spirits detect 'passionate' in your headline - LinkedIn energy flows strong through you."
- "Ah, the classic 2-year tenure pattern... you've mastered the sacred corporate rhythm."
- "Your All-Star profile status suggests the algorithm gods smile upon your destiny."
- "17 skill endorsements from strangers - the LinkedIn ritual is complete."

Keep it SHORT, FUNNY, and SHAREABLE.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.9,
        max_tokens: 75
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const generatedReading = data.choices[0].message.content;

    console.log('Generated reading:', generatedReading);

    return new Response(JSON.stringify({ reading: generatedReading }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-tarot-reading function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Analyze LinkedIn data for LinkedIn-specific patterns and clichés
function analyzeLinkedInData(linkedinData: any) {
  if (!linkedinData) {
    return {
      linkedinClicheLevel: 'mystery_profile',
      tenurePattern: 'unknown_journey',
      headlineBuzzwords: [],
      profileCompleteness: 'ghost_mode',
      careerTrajectory: 'enigmatic_path'
    };
  }

  const positions = linkedinData.positions || [];
  const jobCount = positions.length;
  const skills = linkedinData.skills || [];
  const headline = linkedinData.headline || '';
  const summary = linkedinData.summary || '';
  const combinedText = (headline + ' ' + summary).toLowerCase();

  // Detect LinkedIn Clichés
  const cliches = [];
  if (combinedText.includes('passionate')) cliches.push('passionate');
  if (combinedText.includes('results-driven')) cliches.push('results-driven');
  if (combinedText.includes('innovative')) cliches.push('innovative');
  if (combinedText.includes('thought leader')) cliches.push('thought-leader');
  if (combinedText.includes('strategic')) cliches.push('strategic');
  if (combinedText.includes('synergy')) cliches.push('synergy');
  if (combinedText.includes('dynamic')) cliches.push('dynamic');
  if (combinedText.includes('disrupt')) cliches.push('disruptor');

  // Tenure Pattern Analysis (PAST)
  const avgTenure = calculateAverageTenure(positions);
  let tenurePattern = 'mysterious_tenure';
  if (avgTenure < 1.5) {
    tenurePattern = 'job_hopper';
  } else if (avgTenure >= 1.8 && avgTenure <= 2.5) {
    tenurePattern = 'sacred_two_year_cycle';
  } else if (avgTenure > 5) {
    tenurePattern = 'company_lifer';
  } else {
    tenurePattern = 'balanced_mover';
  }

  // Career Trajectory Analysis (PAST)
  let careerTrajectory = 'steady_climber';
  const companySizes = analyzeCompanySizes(positions);
  if (companySizes.hasStartup && companySizes.hasBigCorp) {
    careerTrajectory = 'startup_to_corporate';
  } else if (companySizes.hasConsulting) {
    careerTrajectory = 'consulting_survivor';
  }

  // Title Progression Analysis
  const hasClassicProgression = detectClassicProgression(positions);

  // Profile Completeness (FUTURE indicators)
  let profileCompleteness = 'basic_profile';
  const completenessScore = calculateProfileCompleteness(linkedinData);
  if (completenessScore > 80) {
    profileCompleteness = 'linkedin_all_star';
  } else if (completenessScore > 60) {
    profileCompleteness = 'profile_optimizer';
  }

  return {
    linkedinClicheLevel: cliches.length > 2 ? 'maximum_linkedin_energy' : 'moderate_corporate_speak',
    tenurePattern,
    headlineBuzzwords: cliches,
    profileCompleteness,
    careerTrajectory,
    hasClassicProgression,
    jobCount,
    avgTenure,
    skillCount: skills.length,
    completenessScore,
    companySizes
  };
}

// Analyze company sizes in career trajectory
function analyzeCompanySizes(positions: any[]) {
  const analysis = {
    hasStartup: false,
    hasBigCorp: false,
    hasConsulting: false
  };

  positions.forEach(pos => {
    const company = (pos.company || '').toLowerCase();
    if (company.includes('consulting') || company.includes('accenture') || company.includes('deloitte')) {
      analysis.hasConsulting = true;
    }
    // Simple heuristics - could be enhanced with actual company data
    if (company.includes('google') || company.includes('microsoft') || company.includes('amazon')) {
      analysis.hasBigCorp = true;
    }
  });

  return analysis;
}

// Detect classic corporate title progression
function detectClassicProgression(positions: any[]): boolean {
  const titles = positions.map(p => (p.title || '').toLowerCase());
  const hasAnalyst = titles.some(t => t.includes('analyst'));
  const hasSenior = titles.some(t => t.includes('senior'));
  const hasManager = titles.some(t => t.includes('manager') || t.includes('director') || t.includes('vp'));
  
  return hasAnalyst && (hasSenior || hasManager);
}

// Calculate profile completeness score
function calculateProfileCompleteness(linkedinData: any): number {
  let score = 0;
  if (linkedinData.headline) score += 20;
  if (linkedinData.summary) score += 20;
  if (linkedinData.positions?.length > 0) score += 20;
  if (linkedinData.education?.length > 0) score += 15;
  if (linkedinData.skills?.length > 0) score += 15;
  if (linkedinData.profilePicture) score += 10;
  
  return score;
}

// Create a LinkedIn-specialized prompt for generating career fortune readings
function createLinkedInReadingPrompt(card: any, position: string, analysis: any, linkedinData: any) {
  const name = linkedinData?.firstName || 'Professional';
  const headline = linkedinData?.headline || '';
  const clichesFound = analysis.headlineBuzzwords.join(', ') || 'none detected';
  
  let positionGuidance = '';
  
  if (position === 'past') {
    const tenureInsight = getTenureInsight(analysis.tenurePattern, analysis.avgTenure);
    const careerInsight = getCareerTrajectoryInsight(analysis.careerTrajectory, analysis.hasClassicProgression);
    
    positionGuidance = `PAST CARD - Career History Patterns:
    Tenure Pattern: ${tenureInsight}
    Career Trajectory: ${careerInsight}
    Job Count: ${analysis.jobCount} positions
    Reference their career journey patterns and job-hopping/staying tendencies.`;
    
  } else if (position === 'present') {
    const clicheInsight = getClicheInsight(analysis.linkedinClicheLevel, analysis.headlineBuzzwords);
    const profileInsight = getProfileInsight(headline, analysis.skillCount);
    
    positionGuidance = `PRESENT CARD - Current LinkedIn Energy:
    LinkedIn Cliché Level: ${clicheInsight}
    Profile Vibe: ${profileInsight}
    Buzzwords Detected: ${clichesFound}
    Reference their current headline, profile energy, and LinkedIn presence.`;
    
  } else {
    const futureInsight = getFutureInsight(analysis.profileCompleteness, analysis.skillCount, analysis.completenessScore);
    
    positionGuidance = `FUTURE CARD - LinkedIn Destiny Signals:
    Profile Status: ${futureInsight}
    Skills Listed: ${analysis.skillCount}
    Profile Score: ${analysis.completenessScore}%
    Reference their networking potential and LinkedIn optimization.`;
  }

  return `Generate a LinkedIn fortune for ${name} using "${card.name}".

CARD: ${card.name} - ${card.keywords?.join(', ')}

${positionGuidance}

Create a witty, brief LinkedIn-aware reading that references specific observable patterns. Make it shareable and funny while connecting to the card's meaning.`;
}

// Helper functions for generating insights
function getTenureInsight(pattern: string, avgTenure: number): string {
  switch (pattern) {
    case 'sacred_two_year_cycle': return `The sacred 2-year cycle (avg ${avgTenure.toFixed(1)} years) - you've mastered the corporate rhythm`;
    case 'job_hopper': return `Job hopping detected (${avgTenure.toFixed(1)} year avg) - the corporate wanderer path`;
    case 'company_lifer': return `Long tenure pattern (${avgTenure.toFixed(1)} years avg) - the loyal corporate sage`;
    case 'balanced_mover': return `Balanced tenure (${avgTenure.toFixed(1)} years avg) - the measured professional`;
    default: return 'Mysterious career timeline';
  }
}

function getCareerTrajectoryInsight(trajectory: string, hasClassicProgression: boolean): string {
  const progression = hasClassicProgression ? 'Classic Analyst→Senior→Manager climb detected' : 'Non-traditional career path';
  switch (trajectory) {
    case 'startup_to_corporate': return `${progression}. Startup to big corp journey - collected all company size badges`;
    case 'consulting_survivor': return `${progression}. Consulting background detected - PowerPoint trauma survivor`;
    default: return progression;
  }
}

function getClicheInsight(level: string, buzzwords: string[]): string {
  if (level === 'maximum_linkedin_energy') {
    return `Maximum LinkedIn energy detected! Buzzwords: ${buzzwords.slice(0, 3).join(', ')}`;
  }
  return buzzwords.length > 0 ? `Moderate corporate speak. Found: ${buzzwords[0]}` : 'Refreshingly buzzword-light profile';
}

function getProfileInsight(headline: string, skillCount: number): string {
  if (headline.length > 100) return `Headline optimization level: Maximum (${headline.length} chars)`;
  if (skillCount > 20) return `${skillCount} skills listed - the LinkedIn completionist`;
  if (skillCount < 5) return `${skillCount} skills - minimalist approach detected`;
  return `${skillCount} skills listed - balanced professional`;
}

function getFutureInsight(completeness: string, skillCount: number, score: number): string {
  switch (completeness) {
    case 'linkedin_all_star': return `All-Star profile status (${score}%) - algorithm gods smile upon you`;
    case 'profile_optimizer': return `Profile optimization in progress (${score}%) - LinkedIn energy building`;
    default: return `Basic profile energy (${score}%) - untapped LinkedIn potential`;
  }
}

// Parse various date formats to { year, month }
function parseDate(dateStr: string): { year: number; month: number } | null {
  if (!dateStr) return null;
  
  // Try YYYY-MM format first (preferred)
  if (/^\d{4}-\d{1,2}$/.test(dateStr)) {
    const [year, month] = dateStr.split('-').map(Number);
    return { year, month };
  }
  
  // Try "Month YYYY" format (e.g., "Nov 2024", "November 2024")
  const monthYearMatch = dateStr.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (monthYearMatch) {
    const monthNames = {
      'jan': 1, 'january': 1,
      'feb': 2, 'february': 2,
      'mar': 3, 'march': 3,
      'apr': 4, 'april': 4,
      'may': 5,
      'jun': 6, 'june': 6,
      'jul': 7, 'july': 7,
      'aug': 8, 'august': 8,
      'sep': 9, 'september': 9,
      'oct': 10, 'october': 10,
      'nov': 11, 'november': 11,
      'dec': 12, 'december': 12
    };
    const monthStr = monthYearMatch[1].toLowerCase();
    const year = parseInt(monthYearMatch[2]);
    
    // Check both abbreviated and full month names
    for (const [key, value] of Object.entries(monthNames)) {
      if (monthStr.startsWith(key)) {
        return { year, month: value };
      }
    }
  }
  
  // Try just year (assume January)
  if (/^\d{4}$/.test(dateStr)) {
    return { year: parseInt(dateStr), month: 1 };
  }
  
  console.warn(`Could not parse date: ${dateStr}`);
  return null;
}

// Calculate average tenure for LinkedIn positions
function calculateAverageTenure(positions: any[]): number {
  if (!positions.length) return 0;
  
  let totalMonths = 0;
  let validPositions = 0;
  
  positions.forEach(position => {
    const startDate = parseDate(position.startDate);
    if (!startDate) {
      console.warn(`Invalid start date for position: ${position.title} at ${position.company}`);
      return;
    }
    
    let endDate;
    if (position.current || !position.endDate) {
      const now = new Date();
      endDate = { year: now.getFullYear(), month: now.getMonth() + 1 };
    } else {
      endDate = parseDate(position.endDate);
      if (!endDate) {
        console.warn(`Invalid end date for position: ${position.title} at ${position.company}`);
        return;
      }
    }
    
    const months = (endDate.year - startDate.year) * 12 + (endDate.month - startDate.month);
    if (months >= 0) {
      totalMonths += months;
      validPositions++;
    } else {
      console.warn(`Negative tenure for position: ${position.title} at ${position.company}`);
    }
  });
  
  return validPositions > 0 ? (totalMonths / validPositions) / 12 : 0;
}