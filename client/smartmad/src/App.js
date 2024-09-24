import "./App.css";
import React, { useState } from "react";
import Button from "./components/tilbage_knap.js";
import Footer from "./components/footer.js";
import image from "./image.png";
import SimilarRecipes from "./components/lignende_opskrifter_boks.js";
import YouTubeVideo from "./components/video_guide_boks.js";
import Ingredients from "./components/ingredienser_boks.js";
import RecipeButton from "./components/find_opskrifter_knap.js";

function App() {
  const [hasUserTakenAction, setHasUserTakenAction] = useState(false);

  const handleClick = () => {
    setHasUserTakenAction(true);
  };

  return (
    <div className={`App ${hasUserTakenAction ? "has-content" : ""}`}>
      <header className="App-header">
        <img src={image} className="App-logo" alt="logo" />
        <RecipeButton onClick={handleClick}>Find opskrifter</RecipeButton>
      </header>
      {hasUserTakenAction && (
        <div>
          <SimilarRecipes className="similar-recipes"></SimilarRecipes>
          <YouTubeVideo className="youtube-video"></YouTubeVideo>
          <Ingredients className="ingredients"></Ingredients>
        </div>
      )}
      <Footer className="footer"></Footer>
    </div>
  );
}

export default App;
