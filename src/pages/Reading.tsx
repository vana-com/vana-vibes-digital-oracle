import TarotReading from "@/components/TarotReading";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// This allows us to show the cool loading states in TarotReading
const MIN_LOADING_TIME = 4000;

const Reading = () => {
  const navigate = useNavigate();

  // Load data from sessionStorage for persistence across refreshes
  const initialData = (() => {
    const storedData = sessionStorage.getItem("tarot-linkedin-data");
    if (storedData) {
      try {
        return JSON.parse(storedData);
      } catch (e) {
        return null;
      }
    }
    return null;
  })();

  const [linkedinData, setLinkedinData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedData = sessionStorage.getItem("tarot-linkedin-data");

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setLinkedinData(parsedData);
        setTimeout(() => setIsLoading(false), MIN_LOADING_TIME);
        return;
      } catch (error) {
        console.error("Error parsing data:", error);
      }
    }

    // Redirect if no data
    navigate("/");
  }, [navigate]);

  // Avoid flicker when immediately redirecting due to missing data
  if (!initialData) {
    return null;
  }

  return <TarotReading linkedinData={linkedinData} isLoading={isLoading} />;
};

export default Reading;
