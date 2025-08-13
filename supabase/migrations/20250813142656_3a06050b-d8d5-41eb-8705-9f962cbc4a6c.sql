-- Create a public bucket for tarot card images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('tarot-cards', 'tarot-cards', true);

-- Create policy to allow public read access to tarot card images
CREATE POLICY "Public read access for tarot cards" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'tarot-cards');

-- Create policy to allow authenticated users to upload tarot cards (for admin purposes)
CREATE POLICY "Authenticated users can upload tarot cards" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'tarot-cards' AND auth.role() = 'authenticated');