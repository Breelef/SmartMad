import { useLocation } from 'react-router-dom';
import React, { useState, useMemo } from 'react';
import placeholderImage from "../assets/placeholderImage.png";

export const FindOpskriftPage = () => {
  const [showVideo, setShowVideo] = useState(false);
  const videoUrl = "https://www.youtube.com/embed/mhDJNfV7hjk";
  const toggleVideo = () => setShowVideo(!showVideo);

  const routerLocation = useLocation();
  const { data } = routerLocation.state || {};
  const recipes = useMemo(() => data?.recipes || [], [data?.recipes]);
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
  const recipeData = recipes[currentRecipeIndex]?.data;

  return (
    <div className="bg-gradient-to-b from-blue-800 to-blue-900 min-h-screen flex p-6 text-white">
      {/* Main Content */}
      <div className="flex-1 pr-8">
        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={() => window.history.back()}
            className="text-white hover:text-gray-300 transition duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-8 w-8">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Recipe Title */}
        <h1 className="text-4xl font-extrabold mb-6">{recipeData.name}</h1>

        {/* Time Section */}
        <div className="bg-gray-100 text-gray-900 p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2 border-blue-400">Tilberedningstid</h2>
          <ul className="space-y-2">
            <li><strong>Forberedelsestid:</strong> {recipeData.time.prep.value} {recipeData.time.prep.unit}</li>
            <li><strong>Kogetid:</strong> {recipeData.time.cook.value} {recipeData.time.cook.unit}</li>
            <li><strong>Samlet tid:</strong> {recipeData.time.total.value} {recipeData.time.total.unit}</li>
          </ul>
        </div>

        {/* Ingredients Section */}
        <div className="bg-gray-100 text-gray-900 p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2 border-blue-400">Ingredienser</h2>
          <ul className="space-y-2">
            {recipeData.ingredients.map((ingredient, index) => (
              <li key={index}>
                {ingredient.value} {ingredient.unit} {ingredient.name}
                {ingredient.comment && <span className="text-gray-600"> ({ingredient.comment})</span>}
              </li>
            ))}
          </ul>

          {/* Instructions Section */}
          <h2 className="text-2xl font-bold mt-8 mb-4 border-b pb-2 border-blue-400">Fremgangsmåde</h2>
          {recipeData.instructions.map((instruction, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-semibold text-xl text-blue-600 mb-2">{instruction.part}</h3>
              <ul className="list-decimal list-inside space-y-2">
                {instruction.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Video Section */}
        <div className="mt-8">
          <button
            onClick={toggleVideo}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition duration-300 shadow-md"
          >
            {showVideo ? "Skjul Video" : "Se Video"}
          </button>
          {showVideo && (
            <iframe
              className="w-full md:w-3/5 h-72 mx-auto rounded-lg border border-gray-300 mt-6 shadow-lg"
              src={videoUrl}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>

        {/* Final Comment */}
        <div className="bg-gray-100 mt-8 p-6 rounded-lg shadow-lg text-gray-900 text-center">
          <p className="italic text-lg">{recipeData.final_comment}</p>
        </div>
      </div>

      {/* Other Recipes Section (Sticky Sidebar) */}
      <div className="w-80 sticky top-6 self-start">
        <h2 className="text-2xl font-bold mb-4 text-center border-b pb-2 border-blue-400">Andre Opskrifter</h2>
        <div className="flex flex-col gap-6">
          {recipes.map((recipe, index) => (
            <div
              key={recipe.data.recipe_id || index}
              className="bg-gray-100 text-gray-900 rounded-lg shadow-md p-4 hover:scale-105 transition-transform duration-300"
            >
              <img
                src={placeholderImage}
                alt={recipe.data.name}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                onClick={() => setCurrentRecipeIndex(index)}
                className={`w-full mt-4 py-2 rounded-lg transition duration-300 ${
                  index === currentRecipeIndex ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
                disabled={index === currentRecipeIndex}
              >
                {recipe.data.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
