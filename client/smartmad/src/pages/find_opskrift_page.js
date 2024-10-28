import { useLocation } from 'react-router-dom';
import React, { useState } from 'react';

export const FindOpskriftPage = ({ providedData }) => {


  const [showVideo, setShowVideo] = useState(false);
  const toggleVideo = () => {
    setShowVideo(prevShowVideo => !prevShowVideo);
  };

  const location = useLocation();
  const { data } = location.state;

  const recipeData = data.response.data
  

  return (
    <div className="bg-blue-900 min-h-screen flex flex-col items-center justify-start p-4">
      {/* Back Button */}
      <div className="w-full flex justify-start">
        <button onClick={() => window.history.back()} className="text-white bg-transparent p-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Recipe Title */}
      <h1 className="text-white text-3xl font-bold mt-4">{recipeData.name}</h1>

      {/* Ingredients */}
      <div className="bg-gray-200 max-w-4xl w-full max-w-md mt-6 p-6 rounded-md text-center shadow-lg">
        <h2 className="text-xl font-bold mb-4">Ingredienser</h2>
        <ul className="text-center list-disc list-inside text-left space-y-1">
          {recipeData.ingredients.map((ingredient, index) => (
            <li key={index}>
              {ingredient.value} {ingredient.unit} {ingredient.name}
              {ingredient.comment ? ` (${ingredient.comment})` : ""}
            </li>
          ))}
        </ul>

        {/* Procedure */}
        <h2 className="text-xl font-bold mt-6 mb-4">Fremgangsmåde</h2>
        {recipeData.instructions.map((instruction, index) => (
          <div key={index} className="text-left mb-4">
            <h3 className="font-semibold">{instruction.part}</h3>
            <ul className="list-decimal list-inside">
              {instruction.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
          </div>
        ))}

        {/* Video Section */}
        <div className="mt-6">
          <button
            onClick={toggleVideo}
            className="bg-blue-700 text-white py-2 px-4 rounded-lg focus:outline-none hover:bg-blue-800 transition"
          >
            {showVideo ? "Skjul Video" : "Se Video"}
          </button>
          {showVideo && (
            <iframe
              className="w-3/5 h-72 mx-auto rounded border border-gray-300 mt-4 overflow-hidden shadow sm:rounded-lg"
              src="https://www.youtube.com/embed/HsxU2V02Eqo"
              title="YouTube video player"
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      </div>

      {/* Final Comment */}
      <div className="bg-gray-100 mt-6 p-4 rounded-lg w-full max-w-4xl text-center">
        <p className="italic text-gray-700">{recipeData.final_comment}</p>
      </div>

      {/* Other Recipes Section */}
      <div className="bg-blue-800 mt-8 p-4 w-full rounded-lg">
        <h2 className="text-white text-2xl font-semibold mb-4">Andre opskrifter</h2>
        <div className="flex flex-col space-y-4">
          {/* Assuming there’s a `related_recipes` array in the JSON */}
          {recipeData.related_recipes && recipeData.related_recipes.map((recipe, index) => (
            <button
              key={index}
              className="bg-gray-200 text-black py-2 px-4 rounded-lg text-center hover:bg-gray-300 transition"
            >
              {recipe.name}
            </button>
          ))}
        </div>
      </div>

  
    </div>
  );
};
