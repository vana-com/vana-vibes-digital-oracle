import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createShareableImage, downloadImage, CardImage } from '@/utils/imageComposer';

interface LinkedInShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  readings: string[];
  selectedCards: any[];
}

export const LinkedInShareModal: React.FC<LinkedInShareModalProps> = ({
  isOpen,
  onClose,
  readings,
  selectedCards
}) => {
  const { toast } = useToast();
  const [shareableImage, setShareableImage] = useState<string>('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Generate shareable image when modal opens
  useEffect(() => {
    if (isOpen && selectedCards.length > 0 && !shareableImage) {
      generateShareableImage();
    }
  }, [isOpen, selectedCards]);

  const generateShareableImage = async () => {
    try {
      setIsGeneratingImage(true);
      const cardImages: CardImage[] = selectedCards.map(card => ({
        name: card.name,
        image: card.image
      }));
      
      const imageDataUrl = await createShareableImage(cardImages);
      setShareableImage(imageDataUrl);
    } catch (error) {
      console.error('Error generating shareable image:', error);
      toast({
        title: "Image generation failed",
        description: "Please try again",
        variant: "destructive",
        className: "border-green bg-black text-green",
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleDownloadImage = () => {
    if (shareableImage) {
      downloadImage(shareableImage, 'career-fortune-reading.png');
      toast({
        title: "Image downloaded!",
        description: "Your reading has been saved",
        className: "border-green bg-black text-green",
      });
      onClose();
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-black border-green text-green">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green">
            <Download className="h-5 w-5" />
            Download Your Reading
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Preview */}
          <div className="text-center">
            {isGeneratingImage ? (
              <div className="flex flex-col items-center justify-center py-12 bg-black border border-green/20 rounded-lg">
                <Loader2 className="h-8 w-8 animate-spin text-green mb-4" />
                <p className="text-sm text-green/80">Creating your reading image...</p>
              </div>
            ) : shareableImage ? (
              <div className="space-y-4">
                <img 
                  src={shareableImage} 
                  alt="Oracle reading" 
                  className="max-w-full h-auto rounded-lg border-2 border-green/20 shadow-lg mx-auto"
                />
                <p className="text-sm text-green/60">
                  Preview of your oracle reading
                </p>
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-green/60">Unable to generate image</p>
              </div>
            )}
          </div>

          {/* Download Button */}
          <div className="flex gap-3 justify-center">
            <Button 
              onClick={handleDownloadImage}
              disabled={!shareableImage || isGeneratingImage}
              className="bg-green text-black hover:bg-green/80 disabled:opacity-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Image
            </Button>
            <Button 
              onClick={onClose}
              variant="outline"
              className="border-green text-green hover:bg-green hover:text-black"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

