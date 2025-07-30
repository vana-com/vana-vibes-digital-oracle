import Landing from '@/components/Landing';

const Index = () => {
  const handleFileUpload = (data: any) => {
    // Store in sessionStorage for navigation to reading page
    sessionStorage.setItem('tarot-chat-data', JSON.stringify(data));
  };

  return <Landing onFileUpload={handleFileUpload} />;
};

export default Index;
