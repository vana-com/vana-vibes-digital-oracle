import { useState, useEffect } from 'react';
import TarotReading from '@/components/TarotReading';

const Reading = () => {
  const [chatData, setChatData] = useState(null);

  useEffect(() => {
    // Get data from sessionStorage or state management
    const storedData = sessionStorage.getItem('tarot-chat-data');
    if (storedData) {
      setChatData(JSON.parse(storedData));
    }
  }, []);

  return <TarotReading chatData={chatData} />;
};

export default Reading;