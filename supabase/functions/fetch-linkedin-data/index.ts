import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface LinkedInProfile {
  id: string;
  localizedFirstName: string;
  localizedLastName: string;
  localizedHeadline?: string;
  profilePicture?: {
    displayImage: string;
  };
}

interface LinkedInPosition {
  title: string;
  companyName: string;
  description?: string;
  timePeriod: {
    startDate: {
      month: number;
      year: number;
    };
    endDate?: {
      month: number;
      year: number;
    };
  };
}

interface LinkedInEducation {
  schoolName: string;
  degreeName?: string;
  fieldOfStudy?: string;
  timePeriod: {
    startDate: {
      month: number;
      year: number;
    };
    endDate?: {
      month: number;
      year: number;
    };
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the user's session from the Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user session to extract LinkedIn access token
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      console.error('User authentication error:', userError);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract LinkedIn access token from user metadata
    const linkedinToken = user.user_metadata?.provider_token;
    if (!linkedinToken) {
      console.error('No LinkedIn token found in user metadata');
      return new Response(
        JSON.stringify({ error: 'No LinkedIn access token found' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching LinkedIn profile data for user:', user.id);

    // Fetch LinkedIn profile data
    const profileResponse = await fetch('https://api.linkedin.com/v2/people/~', {
      headers: {
        'Authorization': `Bearer ${linkedinToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!profileResponse.ok) {
      console.error('LinkedIn profile API error:', profileResponse.status, await profileResponse.text());
      return new Response(
        JSON.stringify({ error: 'Failed to fetch LinkedIn profile' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const profileData: LinkedInProfile = await profileResponse.json();

    // Fetch LinkedIn positions (experience)
    const positionsResponse = await fetch('https://api.linkedin.com/v2/positions', {
      headers: {
        'Authorization': `Bearer ${linkedinToken}`,
        'Content-Type': 'application/json',
      },
    });

    let experienceData = [];
    if (positionsResponse.ok) {
      const positionsData = await positionsResponse.json();
      experienceData = positionsData.elements || [];
    } else {
      console.warn('Failed to fetch LinkedIn positions:', positionsResponse.status);
    }

    // Extract skills from profile headline and description
    const skills = extractSkillsFromText([
      profileData.localizedHeadline || '',
      ...experienceData.map((exp: LinkedInPosition) => exp.description || '')
    ].join(' '));

    // Generate session ID for storing the claim
    const sessionId = crypto.randomUUID();

    // Store the LinkedIn data in our database
    const { error: insertError } = await supabase
      .from('reclaim_linkedin_claims')
      .insert({
        session_id: sessionId,
        headline: profileData.localizedHeadline,
        current_title: experienceData[0]?.title,
        current_company: experienceData[0]?.companyName,
        experience: experienceData,
        skills: skills,
        data: {
          profile: profileData,
          experience: experienceData,
          processed_at: new Date().toISOString()
        },
        status: 'completed'
      });

    if (insertError) {
      console.error('Database insert error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to store LinkedIn data' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Successfully stored LinkedIn data for session:', sessionId);

    // Return the processed data
    const responseData = {
      sessionId,
      profile: {
        name: `${profileData.localizedFirstName} ${profileData.localizedLastName}`,
        headline: profileData.localizedHeadline,
        currentRole: experienceData[0] ? {
          title: experienceData[0].title,
          company: experienceData[0].companyName
        } : null
      },
      experience: experienceData.slice(0, 5), // Limit to recent 5 positions
      skills: skills.slice(0, 20), // Limit to top 20 skills
      summary: generateCareerSummary(profileData, experienceData)
    };

    return new Response(
      JSON.stringify(responseData),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in fetch-linkedin-data function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function extractSkillsFromText(text: string): string[] {
  // Common tech and professional skills patterns
  const skillPatterns = [
    // Programming languages
    /\b(JavaScript|TypeScript|Python|Java|C\+\+|C#|Ruby|PHP|Go|Rust|Swift|Kotlin)\b/gi,
    // Frameworks
    /\b(React|Angular|Vue|Node\.js|Express|Django|Flask|Spring|Laravel|Rails)\b/gi,
    // Technologies
    /\b(AWS|Azure|Docker|Kubernetes|GraphQL|REST|API|SQL|NoSQL|MongoDB|PostgreSQL)\b/gi,
    // Skills
    /\b(Leadership|Management|Strategy|Analytics|Marketing|Sales|Design|UX|UI)\b/gi,
  ];

  const skills = new Set<string>();
  
  skillPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => skills.add(match));
    }
  });

  return Array.from(skills);
}

function generateCareerSummary(profile: LinkedInProfile, experience: LinkedInPosition[]): string {
  const totalYears = calculateTotalExperience(experience);
  const currentRole = experience[0];
  const industries = [...new Set(experience.map(exp => exp.companyName))];

  return `${profile.localizedFirstName} is a ${profile.localizedHeadline || 'professional'} with ${totalYears} years of experience${currentRole ? ` currently working as ${currentRole.title} at ${currentRole.companyName}` : ''}. They have worked across ${industries.length} different ${industries.length === 1 ? 'organization' : 'organizations'}, bringing diverse experience to their role.`;
}

function calculateTotalExperience(experience: LinkedInPosition[]): number {
  const totalMonths = experience.reduce((total, exp) => {
    const start = new Date(exp.timePeriod.startDate.year, exp.timePeriod.startDate.month - 1);
    const end = exp.timePeriod.endDate 
      ? new Date(exp.timePeriod.endDate.year, exp.timePeriod.endDate.month - 1)
      : new Date();
    
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    return total + Math.max(0, months);
  }, 0);

  return Math.floor(totalMonths / 12);
}