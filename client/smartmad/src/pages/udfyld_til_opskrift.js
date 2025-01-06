import { useState } from "react";
import{ ChooseSelf } from "./vælg_selv.js";
import { ClearOut } from "./ryd_ud.js";
import { LogoutButton } from "../components/logout_knap.js";

export const UdfyldTilOpskrift = () => {
    const [view, setView] = useState('self');

    const handleVælgSelvClick = () => setView('self');
    const handleRydUdClick = () => setView('clear');

    return (
        <div className="min-h-screen bg-blue-900 text-white p-5">
            {/* Header Section */}
            <h1 className="text-4xl font-bold text-teal-400 mb-8 text-center">SmartOpskrift</h1>

            <div className="text-center mb-8">
                <LogoutButton/>
            </div>

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
            {view === 'self' ? <VælgSelvView/> : <RydUdView/>}
        </div>
    );
};

// "Vælg selv" View
const VælgSelvView = () => {
      return (
        <div>
            <ChooseSelf />
        </div>
      );
    };
    
    // "Ryd ud" View
    const RydUdView = () => {
      return (
        <div>
            <ClearOut />
        </div>
      );
    };
