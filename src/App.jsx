import { useState, useEffect } from "react";
import { Navigation } from "./components/navigation";
import Home  from './pages/Home/home';
import { Footer } from './components/footer';


import JsonData from "./data/data.json";
import SmoothScroll from "smooth-scroll";
import "./App.css";

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const App = () => {
  const [landingPageData, setLandingPageData] = useState({});
  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

  return (
    <div>
      <Navigation />
      <Home data={landingPageData} />
      <Footer />
    </div>
  );
};

export default App;
