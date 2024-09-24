import { useState } from "react";

export const UdfyldTilOpskrift = () => {
    const [view, setView] = useState('self');

    const handleVælgSelvClick = () => setView('self');
    const handleRydUdClick = () => setView('clear');

    return (
        <div className="min-h-screen bg-blue-900 text-white p-5">
          {/* Header Section */}
          <h1 className="text-4xl font-bold text-teal-400 mb-8 text-center">SmartOpskrift</h1>
    
          {/* Top Buttons */}
          <div className="flex justify-center space-x-4 mb-8">
            <button
              className={`px-6 py-2 rounded-lg font-bold ${view === 'self' ? 'bg-teal-500 text-white' : 'bg-white text-teal-500'}`}
              onClick={handleVælgSelvClick}
            >
              Vælg selv
            </button>
            <button
              className={`px-6 py-2 rounded-lg font-bold ${view === 'clear' ? 'bg-teal-500 text-white' : 'bg-white text-teal-500'}`}
              onClick={handleRydUdClick}
            >
              Ryd ud
            </button>
          </div>
    
          {/* Conditional Rendering based on the view */}
          {view === 'self' ? <VælgSelvView /> : <RydUdView />}
        </div>
      );
    };
    
    // "Vælg selv" View
    const VælgSelvView = () => {
      return (
        <div>
          <h2 className="text-xl font-bold mb-4">Vælg selv View</h2>
          <p>This is the content for Vælg selv view.</p>
          {/* Add form sections or dropdowns here for the "Vælg selv" view */}
        </div>
      );
    };
    
    // "Ryd ud" View
    const RydUdView = () => {
      return (
        <div>
          <h2 className="text-xl font-bold mb-4">Ryd ud View</h2>
          <p>This is the content for Ryd ud view.</p>
          {/* Add a clear functionality or reset logic here for the "Ryd ud" view */}
        </div>
      );
    };
