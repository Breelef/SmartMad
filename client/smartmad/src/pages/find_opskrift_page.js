import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import image from "../image.png";
import {SimilarRecipes} from "../components/lignende_opskrifter_boks.js";
import {YouTubeVideo} from "../components/video_guide_boks.js";
import {Ingredients} from "../components/ingredienser_boks.js";
import {RecipeButton} from "../components/find_opskrifter_knap.js";
import {LogoutButton} from "../components/logout_knap.js";

export const FindOpskriftPage = () => {
    const [hasUserTakenAction, setHasUserTakenAction] = useState(false);

  const handleClick = () => {
    setHasUserTakenAction(true);
  };

  return (
    <div className={`App ${hasUserTakenAction ? "has-content" : ""}`}>
      {!hasUserTakenAction && (
        <header className="App-header">
        <div>
          <LogoutButton />
        </div>
        <img src={image} className="App-logo" alt="logo" />
        <RecipeButton onClick={handleClick}>Find opskrift</RecipeButton>
      </header>
      )}
      {hasUserTakenAction && (
        <div>
          <SimilarRecipes className="similar-recipes"></SimilarRecipes>
          <YouTubeVideo className="youtube-video"></YouTubeVideo>
          <Ingredients className="ingredients"></Ingredients>
        </div>
      )}
    </div>
  );
};
