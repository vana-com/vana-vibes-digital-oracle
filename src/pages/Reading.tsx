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
    const handleLinkedInAuth = async () => {
      try {
        // Check if user is authenticated (from LinkedIn OAuth callback)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          toast({
            title: "Authentication Error",
            description: "Failed to verify LinkedIn connection.",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        if (session?.user) {
          console.log('User authenticated, fetching LinkedIn data...');
          
          // Call our edge function to fetch LinkedIn data
          const { data, error } = await supabase.functions.invoke('fetch-linkedin-data', {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          });

          if (error) {
            console.error('Error fetching LinkedIn data:', error);
            toast({
              title: "Data Fetch Error",
              description: "Unable to retrieve your LinkedIn profile data.",
              variant: "destructive",
            });
            navigate('/');
            return;
          }

          console.log('LinkedIn data fetched successfully:', data);
          setLinkedinData(data);
          
          // Store in sessionStorage for potential page refreshes
          sessionStorage.setItem('tarot-linkedin-data', JSON.stringify(data));
        } else {
          // Check if data was previously stored in sessionStorage
          const storedData = sessionStorage.getItem('tarot-linkedin-data');
          if (storedData) {
            setLinkedinData(JSON.parse(storedData));
          } else {
            console.log('No authenticated user, redirecting to home');
            navigate('/');
            return;
          }
        }
      } catch (error) {
        console.error('Error in LinkedIn auth flow:', error);
        toast({
          title: "Connection Error",
          description: "An unexpected error occurred while connecting to LinkedIn.",
          variant: "destructive",
        });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    handleLinkedInAuth();
  }, [navigate, toast]);

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