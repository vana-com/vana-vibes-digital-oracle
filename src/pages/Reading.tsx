import { useState, useEffect } from 'react';
import TarotReading from '@/components/TarotReading';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Reading = () => {
  const [linkedinData, setLinkedinData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for mock data in sessionStorage first
    const mockData = sessionStorage.getItem('tarot-linkedin-data');
    
    if (mockData) {
      try {
        const parsedData = JSON.parse(mockData);
        setLinkedinData(parsedData);
        setIsLoading(false);
        return;
      } catch (error) {
        console.error('Error parsing mock data:', error);
      }
    }

    // If no mock data, redirect back to home
    navigate('/');
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-midnight flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="font-amatic text-2xl text-foreground">Channeling your professional aura...</p>
        </div>
      </div>
    );
  }

  return <TarotReading linkedinData={linkedinData} />;
};

export default Reading;