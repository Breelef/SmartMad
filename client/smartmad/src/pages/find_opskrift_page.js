import React, { useState } from "react";

// Variables
const opskrift1Ingredienser = { ingredienser: ["boller", "karry"] };
const opskrift2Ingredienser = { ingredienser: ["karry", "boller"] };
const opskrift3Ingredienser = { ingredienser: ["Koller", "barry"] };

const opskrift1 = "Boller i karry";
const opskrift2 = "Karry i boller";
const opskrift3 = "Koller i barry";
const bollerIKarryUrl = "https://www.youtube.com/embed/Gnv2szXSApg";
const karryIBollerUrl = "https://www.youtube.com/embed/mE5Q_ReJI3E";
const kollerIBarryUrl = "https://www.youtube.com/embed/zLCUxgmqxu0";

export const FindOpskriftPage = () => {
  const [currentIngredienser, setCurrentIngredienser] = useState(
    opskrift1Ingredienser.ingredienser
  );
  const [currentVideoUrl, setCurrentVideoUrl] = useState(bollerIKarryUrl);

  const handleRecipeClick = (recipe) => {
    switch (recipe) {
      case "opskrift1":
        setCurrentIngredienser(opskrift1Ingredienser.ingredienser);
        setCurrentVideoUrl(bollerIKarryUrl);
        break;
      case "opskrift2":
        setCurrentIngredienser(opskrift2Ingredienser.ingredienser);
        setCurrentVideoUrl(karryIBollerUrl);
        break;
      case "opskrift3":
        setCurrentIngredienser(opskrift3Ingredienser.ingredienser);
        setCurrentVideoUrl(kollerIBarryUrl);
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-blue-900 min-h-screen flex flex-col items-center justify-start p-4">
      <div className="w-full flex justify-start">
        <button
          onClick={() => window.history.back()}
          className="text-white bg-transparent p-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>
      <div className="flex space-x-4 mt-4">
        <button
          onClick={() => handleRecipeClick("opskrift1")}
          className="bg-gray-200 text-black py-2 px-4 rounded-full focus:outline-none"
        >
          {opskrift1}
        </button>
        <button
          onClick={() => handleRecipeClick("opskrift2")}
          className="bg-gray-200 text-black py-2 px-4 rounded-full focus:outline-none"
        >
          {opskrift2}
        </button>
        <button
          onClick={() => handleRecipeClick("opskrift3")}
          className="bg-gray-200 text-black py-2 px-4 rounded-full focus:outline-none"
        >
          {opskrift3}
        </button>
      </div>

      {/* Recipe Content */}
      <div className="bg-gray-200 max-w-4xl w-full max-w-md mt-6 p-6 rounded-md text-center shadow-lg">
        {/* Ingredients */}
        <h2 className="text-xl font-bold mb-4">Ingredienser</h2>
        <ul className="text-center list-disc list-inside text-left space-y-1">
          {currentIngredienser.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>

        {/* Procedure */}
        <h2 className="text-xl font-bold mt-6 mb-4">Fremgangsmåde</h2>
        <p className="text-center">BlablablaBlablablaBlablaBlablablaBlwwa</p>
        <p className="text-center">BlablablaBlablablaBlablaBlablablaBlwwa</p>
        <p className="text-center">BlablablaBlablablaBlablaBlablablaBlwwa</p>
        <p className="text-center">BlablablaBlablablaBlablaBlablablaBlwwa</p>
        <p className="text-center">BlablablaBlablablaBlablaBlablablaBlwwa</p>
        <p className="text-center">BlablablaBlablablaBlablaBlablablaBlwwa</p>
        <p className="text-center">BlablablaBlablablaBlablaBlablablaBlwwa</p>
        <p className="text-center">BlablablaBlablablaBlablaBlablablaBlwwa</p>

        {/* Video */}
        <h2 className="text-xl font-bold mt-6 mb-4">Video</h2>
        <iframe
          className="w-3/5 h-72 mx-auto rounded border border-gray-300 mb-6 overflow-hidden shadow sm:rounded-lg "
          src={currentVideoUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Buttons */}
      <div className="flex space-x-4 mt-6">
        <button
          onClick={() =>
            (window.location.href = "https://www.youtube.com/@AsmonTV")
          }
          className="bg-blue-700 text-white py-2 px-4 rounded-lg focus:outline-none hover:bg-blue-800 transition"
        >
          Lignende opskrifter
        </button>
      </div>
    </div>
  );
};
