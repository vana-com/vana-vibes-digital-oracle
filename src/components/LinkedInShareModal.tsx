import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Linkedin, Copy, Share } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LinkedInShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  readings: string[];
  selectedCards: any[];
  linkedinData: any;
}

export const LinkedInShareModal: React.FC<LinkedInShareModalProps> = ({
  isOpen,
  onClose,
  readings,
  selectedCards,
  linkedinData
}) => {
  const { toast } = useToast();
  const [postText, setPostText] = useState(() => generateLinkedInPost(readings, selectedCards, linkedinData));
  const [isSharing, setIsSharing] = useState(false);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(postText);
      toast({
        title: "Copied!",
        description: "Post text copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please select and copy the text manually",
        variant: "destructive",
      });
    }
  };

  const handleShareToLinkedIn = () => {
    setIsSharing(true);
    const encodedText = encodeURIComponent(postText);
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&title=${encodedText}`;
    
    // Open LinkedIn share in new window
    window.open(shareUrl, '_blank', 'width=600,height=500');
    
    toast({
      title: "Opening LinkedIn...",
      description: "Share window opened in new tab",
    });
    
    setTimeout(() => setIsSharing(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Linkedin className="h-5 w-5 text-blue-600" />
            Share Your Career Fortune
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Card Preview */}
          <div className="grid grid-cols-3 gap-4">
            {selectedCards.map((card, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-4">
                  <div className="w-full aspect-[2/3] bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg mb-2 flex items-center justify-center text-white text-sm font-medium">
                    {card.name}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {index === 0 ? 'Past' : index === 1 ? 'Present' : 'Future'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Editable Post Text */}
          <div className="space-y-2">
            <label className="text-sm font-medium">LinkedIn Post Text</label>
            <Textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              rows={12}
              className="resize-none"
              placeholder="Edit your LinkedIn post..."
            />
            <p className="text-xs text-muted-foreground">
              {postText.length}/3000 characters
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={handleCopyText}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Text
            </Button>
            <Button 
              onClick={handleShareToLinkedIn}
              disabled={isSharing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSharing ? (
                <>
                  <Share className="h-4 w-4 mr-2 animate-pulse" />
                  Opening...
                </>
              ) : (
                <>
                  <Linkedin className="h-4 w-4 mr-2" />
                  Share to LinkedIn
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

function generateLinkedInPost(readings: string[], selectedCards: any[], linkedinData: any): string {
  const name = linkedinData?.firstName || 'Professional';
  const cardNames = selectedCards.map(card => card.name);
  
  const post = `🔮 Just got my LinkedIn Career Fortune reading and the cosmic algorithm is speaking! 

📈 PAST: ${cardNames[0]}
"${readings[0]}"

⚡ PRESENT: ${cardNames[1]} 
"${readings[1]}"

🚀 FUTURE: ${cardNames[2]}
"${readings[2]}"

The LinkedIn spirits have spoken! 😂 Sometimes you need a mystical perspective on your career journey. 

What do the professional planets have in store for you? 

#CareerFortune #LinkedInLife #ProfessionalDevelopment #TarotTuesday #CareerJourney #WorkLifeMystic

✨ Get your own reading at: ${window.location.origin}`;

  return post;
}