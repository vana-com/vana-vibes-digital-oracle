import Landing from '@/components/Landing';

const Index = () => {
  const handleDataConnect = (data: any) => {
    // Store in sessionStorage for navigation to reading page
    sessionStorage.setItem('tarot-linkedin-data', JSON.stringify(data));
  };

  return <Landing onDataConnect={handleDataConnect} />;
};

export default Index;
