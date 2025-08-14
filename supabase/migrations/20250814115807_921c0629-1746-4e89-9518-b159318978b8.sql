-- Create tarot_cards table to store card data and image URLs
CREATE TABLE public.tarot_cards (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  suit TEXT,
  number INTEGER,
  arcana TEXT NOT NULL CHECK (arcana IN ('major', 'minor')),
  keywords TEXT[] NOT NULL DEFAULT '{}',
  meaning_upright TEXT NOT NULL,
  meaning_reversed TEXT NOT NULL,
  symbolism TEXT[] NOT NULL DEFAULT '{}',
  element TEXT,
  astrology TEXT,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tarot_cards ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (since tarot cards are public data)
CREATE POLICY "Tarot cards are publicly readable" 
ON public.tarot_cards 
FOR SELECT 
USING (true);

-- Create policy for service role to manage cards
CREATE POLICY "Service role can manage tarot cards" 
ON public.tarot_cards 
FOR ALL
USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text)
WITH CHECK ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_tarot_cards_updated_at
BEFORE UPDATE ON public.tarot_cards
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert Major Arcana cards with placeholder image URLs (you can update these with actual URLs)
INSERT INTO public.tarot_cards (id, name, arcana, keywords, meaning_upright, meaning_reversed, symbolism, element, astrology, image_url) VALUES
('fool', 'The Fool', 'major', ARRAY['new beginnings', 'innocence', 'adventure', 'potential'], 'New beginnings, innocence, adventure, freedom, originality', 'Recklessness, carelessness, negligence, foolishness', ARRAY['white rose', 'precipice', 'small bag', 'dog'], 'Air', 'Uranus', '/lovable-uploads/a19db11e-f873-402b-ac9d-6d01a9e8d4f4.png'),
('magician', 'The Magician', 'major', ARRAY['manifestation', 'willpower', 'creation', 'skill'], 'Manifestation, willpower, desire, creation, skill, ability', 'Manipulation, cunning, trickery, wasted talent', ARRAY['infinity symbol', 'wand', 'altar', 'red roses'], 'Air', 'Mercury', '/lovable-uploads/138d70ba-e8b1-48d1-abbb-23afd99b6233.png'),
('high-priestess', 'The High Priestess', 'major', ARRAY['intuition', 'subconscious', 'mystery', 'spirituality'], 'Intuition, sacred knowledge, divine feminine, subconscious mind', 'Secrets, disconnected from intuition, withdrawal', ARRAY['moon crown', 'scroll', 'pillars', 'pomegranates'], 'Water', 'Moon', '/lovable-uploads/4affbc8b-6b19-4342-adf0-2793f5382c7b.png'),
('empress', 'The Empress', 'major', ARRAY['femininity', 'beauty', 'nature', 'abundance'], 'Femininity, beauty, nature, nurturing, abundance', 'Creative block, dependence on others, smothering', ARRAY['venus symbol', 'crown of stars', 'wheat', 'waterfall'], 'Earth', 'Venus', '/lovable-uploads/5c10d349-f981-4b39-b307-a3e9f9b589b1.png'),
('emperor', 'The Emperor', 'major', ARRAY['authority', 'structure', 'control', 'fatherhood'], 'Authority, establishment, structure, father figure', 'Domination, excessive control, tyranny, rigidity', ARRAY['throne', 'ram heads', 'orb', 'scepter'], 'Fire', 'Aries', '/lovable-uploads/608fb09f-a2f1-4a90-b1d1-dacf6aeb8c01.png'),
('hierophant', 'The Hierophant', 'major', ARRAY['spirituality', 'conformity', 'tradition', 'institutions'], 'Spiritual wisdom, religious beliefs, conformity, tradition', 'Personal beliefs, freedom, challenging tradition', ARRAY['papal cross', 'two pillars', 'keys', 'crown'], 'Earth', 'Taurus', '/lovable-uploads/711f1182-139b-4d8e-9b34-c613b583795d.png'),
('lovers', 'The Lovers', 'major', ARRAY['love', 'harmony', 'relationships', 'values'], 'Love, harmony, relationships, values alignment, choices', 'Disharmony, imbalance, misalignment of values', ARRAY['angel', 'tree of knowledge', 'tree of life', 'mountain'], 'Air', 'Gemini', '/lovable-uploads/71fbc844-178f-4342-9418-e34556e830ef.png'),
('chariot', 'The Chariot', 'major', ARRAY['control', 'willpower', 'success', 'determination'], 'Control, willpower, success, determination, direction', 'Self-discipline, opposition, lack of direction', ARRAY['sphinxes', 'star crown', 'city', 'chariot'], 'Water', 'Cancer', '/lovable-uploads/79f70ff7-ac20-49f0-b6d9-fceb783ab17c.png'),
('strength', 'Strength', 'major', ARRAY['strength', 'courage', 'patience', 'control'], 'Strength, courage, patience, control, compassion', 'Self-doubt, lack of confidence, lack of self-discipline', ARRAY['infinity symbol', 'lion', 'flower crown', 'white robe'], 'Fire', 'Leo', '/lovable-uploads/7f6abb79-06b0-4830-92d9-b52e38b9c82d.png'),
('hermit', 'The Hermit', 'major', ARRAY['soul searching', 'seeking truth', 'inner guidance'], 'Soul searching, seeking truth, inner guidance, introspection', 'Isolation, loneliness, withdrawal, paranoia', ARRAY['lantern', 'staff', 'mountain peak', 'star'], 'Earth', 'Virgo', '/lovable-uploads/9d593bf0-ed48-444c-b258-ad1725f839c3.png'),
('wheel-of-fortune', 'Wheel of Fortune', 'major', ARRAY['good luck', 'karma', 'life cycles', 'destiny'], 'Good luck, karma, life cycles, destiny, turning point', 'Bad luck, lack of control, clinging to control', ARRAY['wheel', 'sphinx', 'snake', 'anubis'], 'Fire', 'Jupiter', '/lovable-uploads/a1d7902c-0234-434d-b553-8f8811fe6c2d.png'),
('justice', 'Justice', 'major', ARRAY['justice', 'fairness', 'truth', 'cause and effect'], 'Justice, fairness, truth, cause and effect, law', 'Unfairness, lack of accountability, dishonesty', ARRAY['scales', 'sword', 'crown', 'pillars'], 'Air', 'Libra', '/lovable-uploads/a81850ee-d2ec-483a-970a-b01f4fbc0d66.png'),
('hanged-man', 'The Hanged Man', 'major', ARRAY['suspension', 'restriction', 'letting go', 'sacrifice'], 'Suspension, restriction, letting go, sacrifice', 'Martyrdom, indecision, delay, resistance', ARRAY['tree', 'halo', 'crossed legs', 'hands behind back'], 'Water', 'Neptune', '/lovable-uploads/aaa1cb07-332b-4865-8457-4905424c5284.png'),
('death', 'Death', 'major', ARRAY['endings', 'beginnings', 'change', 'transformation'], 'Endings, beginnings, change, transformation, transition', 'Resistance to change, personal transformation, inner purging', ARRAY['skeleton', 'armor', 'white horse', 'flag'], 'Water', 'Scorpio', '/lovable-uploads/ad20572a-dd87-4480-84b8-c6961887ddd2.png'),
('temperance', 'Temperance', 'major', ARRAY['balance', 'moderation', 'patience', 'purpose'], 'Balance, moderation, patience, purpose, meaning', 'Imbalance, excess, self-healing, re-alignment', ARRAY['angel', 'cups', 'water', 'triangle'], 'Fire', 'Sagittarius', '/lovable-uploads/c9f510f2-3511-45ef-94fd-4225a8ab1b2f.png'),
('devil', 'The Devil', 'major', ARRAY['shadow self', 'attachment', 'addiction', 'restriction'], 'Shadow self, attachment, addiction, restriction, sexuality', 'Releasing limiting beliefs, exploring dark thoughts, detachment', ARRAY['baphomet', 'chains', 'naked figures', 'pentagram'], 'Earth', 'Capricorn', '/lovable-uploads/cfd9fd7c-db49-49c6-88aa-1a87e1bc07ef.png'),
('tower', 'The Tower', 'major', ARRAY['sudden change', 'upheaval', 'chaos', 'revelation'], 'Sudden change, upheaval, chaos, revelation, awakening', 'Personal transformation, fear of change, averting disaster', ARRAY['lightning', 'crown', 'falling figures', 'flames'], 'Fire', 'Mars', '/lovable-uploads/d0cb33d7-d2ef-4f3e-bfa2-08d5cbc7378e.png'),
('star', 'The Star', 'major', ARRAY['hope', 'faith', 'purpose', 'renewal'], 'Hope, faith, purpose, renewal, spirituality', 'Lack of faith, despair, self-trust, disconnection', ARRAY['seven stars', 'water', 'naked woman', 'bird'], 'Air', 'Aquarius', '/lovable-uploads/d9fdc57b-75f8-4d9b-ad28-755a7a774c83.png'),
('moon', 'The Moon', 'major', ARRAY['illusion', 'fear', 'anxiety', 'subconscious'], 'Illusion, fear, anxiety, subconscious, intuition', 'Release of fear, repressed emotion, inner confusion', ARRAY['moon', 'wolf', 'dog', 'crayfish'], 'Water', 'Pisces', '/lovable-uploads/ded73efa-6c8b-4f3d-b5c4-9067efb9f23e.png'),
('sun', 'The Sun', 'major', ARRAY['positivity', 'fun', 'warmth', 'success'], 'Positivity, fun, warmth, success, vitality', 'Inner child, feeling down, overly optimistic', ARRAY['sun', 'child', 'white horse', 'sunflowers'], 'Fire', 'Sun', '/lovable-uploads/e15531d5-18a4-45cc-a2ed-884a6d0280f6.png'),
('judgement', 'Judgement', 'major', ARRAY['judgement', 'rebirth', 'inner calling', 'absolution'], 'Judgement, rebirth, inner calling, absolution', 'Self-doubt, inner critic, ignoring the call', ARRAY['angel', 'trumpet', 'cross', 'rising figures'], 'Fire', 'Pluto', '/lovable-uploads/e462e07c-469e-4e28-b33f-34cd118856f7.png'),
('world', 'The World', 'major', ARRAY['completion', 'integration', 'accomplishment', 'travel'], 'Completion, integration, accomplishment, travel', 'Seeking personal closure, short-cut to success', ARRAY['wreath', 'four creatures', 'dancing figure', 'infinity'], 'Earth', 'Saturn', '/lovable-uploads/00cbef68-6257-457d-85cd-a60de156d72f.png');