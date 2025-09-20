import TarotReading from "@/components/TarotReading";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Reading = () => {
  console.log("Reading component mounted");
  const navigate = useNavigate();
  const location = useLocation();

  // Get data immediately from router state or sessionStorage
  const initialData =
    location.state?.linkedinData ||
    (() => {
      const mockData = sessionStorage.getItem("tarot-linkedin-data");
      if (mockData) {
        try {
          return JSON.parse(mockData);
        } catch (e) {
          return null;
        }
      }
      return null;
    })();

  const [linkedinData, setLinkedinData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(!initialData);

  useEffect(() => {
    console.log("Reading useEffect running");

    // Check if data was passed through router state
    const stateData = location.state?.linkedinData;
    console.log("Router state data:", stateData ? "yes" : "no");

    if (stateData) {
      console.log("Using data from router state:", stateData);
      setLinkedinData(stateData);
      setIsLoading(false);
      return;
    }

    // Fallback: check sessionStorage
    const mockData = sessionStorage.getItem("tarot-linkedin-data");
    console.log("Found mockData in storage:", mockData ? "yes" : "no");

    if (mockData) {
      try {
        const parsedData = JSON.parse(mockData);
        console.log("Successfully parsed data from storage:", parsedData);
        setLinkedinData(parsedData);
        setIsLoading(false);
        return;
      } catch (error) {
        console.error("Error parsing data:", error);
      }
    }

    // If no data found anywhere, redirect back to home
    console.log("No data found, redirecting to home");
    navigate("/");
  }, [navigate, location.state]);

  return <TarotReading linkedinData={linkedinData} isLoading={isLoading} />;
};

export default Reading;
