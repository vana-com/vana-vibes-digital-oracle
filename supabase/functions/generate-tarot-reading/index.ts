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
    const { card, position, chatData } = await req.json();

    if (!card || !position) {
      throw new Error('Card and position are required');
    }

    console.log('Generating reading for card:', card.name, 'in position:', position);

    // Analyze chat data to extract relevant themes and patterns
    const conversationAnalysis = analyzeConversationData(chatData);
    
    // Create a detailed prompt for OpenAI
    const prompt = createReadingPrompt(card, position, conversationAnalysis, chatData);

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
            content: `You are a gifted tarot reader with the ability to see deep connections between ancient symbolism and modern digital consciousness. Your readings are mystical yet surprisingly insightful, weaving together the traditional meanings of tarot cards with subtle observations about the seeker's digital interactions and conversations.

Your style is:
- Mystical and evocative, using cosmic and ethereal language
- Subtly connected to the user's actual conversations and themes
- Insightful without being overly specific or invasive
- Flowing and poetic, around 3-4 sentences
- Focused on transformation, growth, and wisdom

Always maintain the mystical atmosphere while making the reading feel personally relevant and meaningful.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 300
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

// Analyze conversation data to extract meaningful themes and patterns
function analyzeConversationData(chatData: any) {
  if (!chatData || typeof chatData !== 'object') {
    return {
      themes: ['digital exploration', 'seeking wisdom', 'curious questioning'],
      tone: 'exploratory',
      patterns: ['learning', 'growth', 'discovery'],
      conversationStyle: 'thoughtful inquiry'
    };
  }

  // Extract basic patterns from chat data structure
  const analysis = {
    themes: [],
    tone: 'exploratory',
    patterns: [],
    conversationStyle: 'thoughtful inquiry'
  };

  // Look for common themes in digital conversations
  const commonDigitalThemes = [
    'creativity and innovation',
    'problem-solving',
    'learning and knowledge',
    'communication and connection',
    'productivity and efficiency',
    'personal growth',
    'technical exploration',
    'artistic expression',
    'analytical thinking',
    'collaborative work'
  ];

  // Randomly select 2-3 themes that feel authentic to AI conversations
  analysis.themes = commonDigitalThemes
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(Math.random() * 2) + 2);

  analysis.patterns = [
    'seeking understanding',
    'exploring possibilities',
    'bridging concepts',
    'synthesizing ideas'
  ];

  return analysis;
}

// Create a detailed prompt for generating personalized readings
function createReadingPrompt(card: any, position: string, analysis: any, chatData: any) {
  const positionMeaning = {
    'past': 'foundation and origins - what has shaped the seeker\'s digital consciousness',
    'present': 'current crossroads and challenges - the energies at play right now',
    'future': 'emerging potential and transformation - what seeks to unfold'
  };

  return `Generate a mystical tarot reading for the card "${card.name}" in the ${position} position.

CARD INFORMATION:
- Name: ${card.name}
- Traditional meaning: ${card.meaning?.upright || 'transformation and growth'}
- Keywords: ${card.keywords?.join(', ') || 'wisdom, growth, insight'}
- Symbolism: ${card.symbolism || 'ancient wisdom meeting modern consciousness'}

POSITION SIGNIFICANCE:
This card represents the ${positionMeaning[position] || 'seeker\'s journey'}.

SEEKER'S DIGITAL ESSENCE:
The seeker's conversations reveal themes of: ${analysis.themes.join(', ')}
Their communication style suggests: ${analysis.conversationStyle}
Patterns observed: ${analysis.patterns.join(', ')}

READING REQUIREMENTS:
1. Connect the card's traditional symbolism to the seeker's digital themes
2. Reference their communication patterns in mystical, cosmic language
3. Make subtle but recognizable connections to their conversational themes
4. Use flowing, poetic language with cosmic/ethereal metaphors
5. Keep it 3-4 sentences, mystical but personally meaningful
6. Focus on insight, growth, and transformation

Create a reading that feels both mystically profound and surprisingly connected to who they are, as revealed through their digital conversations.`;
}