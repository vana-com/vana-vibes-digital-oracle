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
            content: `You are a mystical LinkedIn career fortune teller who gives BRIEF, DIRECTIVE advice through tarot wisdom. Your readings are like cosmic career guidance counselors - telling people exactly what to do next.

MYSTICAL TRANSLATION RULES:
- Replace "years of experience" with "cycles around the corporate sun"
- Convert companies to "kingdoms/realms" (Google = "Realm of Search", Microsoft = "Kingdom of Azure Clouds")
- Transform promotions into "level ups" or "awakening new chakras"
- Describe job gaps as "vision quests" or "sabbaticals in the void"
- Turn skills into spells/abilities (Python = "Snake Charming", Sales = "Persuasion Enchantments")

YOUR STYLE:
- BRIEF: Maximum 2 sentences - get to the point!
- DIRECTIVE: Tell them what to DO, not just what's happening
- Fortune-teller mystical language but with career advice
- Use imperatives: "Embrace...", "Seek...", "Trust...", "Avoid..."
- Make it sound like cosmic career guidance
- Include ONE specific career action they should take

EXAMPLE FORMAT: "The cosmic forces reveal your Snake Charming abilities have reached level 47 in the Realm of Tech. Embrace this power surge and seek the Oracle of Higher Salaries before Mercury goes retrograde next quarter!"

Be mystical but practical - give them something to actually DO.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.9,
        max_tokens: 150
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

// Analyze LinkedIn data for mystical career interpretation
function analyzeLinkedInData(linkedinData: any) {
  if (!linkedinData) {
    return {
      careerType: 'mysterious_wanderer',
      tenurePattern: 'unknown_paths',
      currentVibes: 'enigmatic_presence',
      networkPower: 'hidden_influence'
    };
  }

  const positions = linkedinData.positions || [];
  const jobCount = positions.length;
  const skills = linkedinData.skills || [];
  const headline = linkedinData.headline || '';
  const summary = linkedinData.summary || '';

  // Career Journey Analysis (Past)
  let careerType = 'mysterious_wanderer';
  if (jobCount <= 2) {
    careerType = 'loyal_sage';
  } else if (jobCount <= 5) {
    careerType = 'seeker_of_wisdom';
  } else {
    careerType = 'nomadic_spirit';
  }

  // Tenure Analysis
  const avgTenure = calculateAverageTenure(positions);
  let tenurePattern = 'unknown_paths';
  if (avgTenure < 1) {
    tenurePattern = 'restless_energy';
  } else if (avgTenure <= 3) {
    tenurePattern = 'balanced_explorer';
  } else {
    tenurePattern = 'deep_roots';
  }

  // Current State Analysis (Present)
  let currentVibes = 'enigmatic_presence';
  const combinedText = (headline + ' ' + summary).toLowerCase();
  
  if (combinedText.includes('manager')) {
    currentVibes = 'keeper_of_resources';
  } else if (combinedText.includes('director')) {
    currentVibes = 'oracle_of_visions';
  } else if (combinedText.includes('analyst')) {
    currentVibes = 'reader_of_runes';
  }

  // Network Power Analysis (Future potential)
  let networkPower = 'hidden_influence';
  if (skills.length < 5) {
    networkPower = 'intimate_circle';
  } else if (skills.length <= 10) {
    networkPower = 'growing_sphere';
  } else {
    networkPower = 'vast_constellation';
  }

  return {
    careerType,
    tenurePattern,
    currentVibes,
    networkPower,
    jobCount,
    avgTenure,
    skillCount: skills.length,
    hasPassion: combinedText.includes('passionate'),
    isResultsDriven: combinedText.includes('results'),
    isInnovative: combinedText.includes('innovative')
  };
}

// Create a LinkedIn-specialized prompt for generating career fortune readings
function createLinkedInReadingPrompt(card: any, position: string, analysis: any, linkedinData: any) {
  const name = linkedinData?.firstName || 'Seeker';
  const currentRole = linkedinData?.headline || 'Professional Wanderer';
  const company = linkedinData?.positions?.[0]?.company || 'Unknown Realm';
  
  let positionGuidance = '';
  
  if (position === 'past') {
    positionGuidance = `This is the PAST CARD representing their career journey. 
    Career Type: ${analysis.careerType} (${analysis.jobCount} positions)
    Tenure Pattern: ${analysis.tenurePattern} (avg ${analysis.avgTenure.toFixed(1)} years)
    Focus on their professional evolution, job changes, and foundational career experiences.`;
  } else if (position === 'present') {
    positionGuidance = `This is the PRESENT CARD representing their current professional state.
    Current Vibes: ${analysis.currentVibes}
    Role: ${currentRole} at ${company}
    Skills: ${analysis.skillCount} mystical abilities
    Energy: ${analysis.hasPassion ? 'Fire energy detected' : 'Calm presence'}, ${analysis.isResultsDriven ? 'Manifestation powers active' : 'Flowing with current'}, ${analysis.isInnovative ? 'Chaos magic practitioner' : 'Traditional wisdom keeper'}
    Focus on their current professional identity and active energies.`;
  } else {
    positionGuidance = `This is the FUTURE CARD representing their network influence and trajectory.
    Network Power: ${analysis.networkPower}
    Professional Skills: ${analysis.skillCount} magical abilities
    Focus on their potential growth, network expansion, and future professional destiny.`;
  }

  return `Generate a mystical tarot reading for ${name} using the card "${card.name}".

CARD INFO:
- Name: ${card.name}
- Keywords: ${card.keywords?.join(', ')}
- Upright Meaning: ${card.meaning?.upright}

POSITION CONTEXT:
${positionGuidance}

LINKEDIN PROFILE ESSENCE:
- Current Title: ${currentRole}
- Current Company: ${company}
- Career Positions: ${analysis.jobCount}
- Professional Skills: ${analysis.skillCount}

Create a mystical interpretation that weaves the card's meaning with their LinkedIn profile data. Use the mystical translation rules to transform their corporate journey into cosmic insights. Include a touch of humor while maintaining respect for their professional achievements.`;
}

// Calculate average tenure for LinkedIn positions
function calculateAverageTenure(positions: any[]): number {
  if (!positions.length) return 0;
  
  let totalMonths = 0;
  let validPositions = 0;
  
  positions.forEach(position => {
    if (position.startDate) {
      const startYear = parseInt(position.startDate.split('-')[0]);
      const startMonth = parseInt(position.startDate.split('-')[1] || '1');
      
      let endYear, endMonth;
      if (position.current || !position.endDate) {
        const now = new Date();
        endYear = now.getFullYear();
        endMonth = now.getMonth() + 1;
      } else {
        endYear = parseInt(position.endDate.split('-')[0]);
        endMonth = parseInt(position.endDate.split('-')[1] || '12');
      }
      
      const months = (endYear - startYear) * 12 + (endMonth - startMonth);
      if (months > 0) {
        totalMonths += months;
        validPositions++;
      }
    }
  });
  
  return validPositions > 0 ? (totalMonths / validPositions) / 12 : 0;
}