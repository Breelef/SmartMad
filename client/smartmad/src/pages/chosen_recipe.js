import { useLocation } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';

export const ChosenRecipePage = () => {
    const location = useLocation();
    const { recipe } = location.state || {};  // Retrieve recipe data passed via state

    const [messages, setMessages] = useState([]);
    const [userMessage, setUserMessage] = useState('');

    const [showVideo, setShowVideo] = useState(false);
    const videoUrl = "https://www.youtube.com/embed/mhDJNfV7hjk";
    const toggleVideo = () => setShowVideo(!showVideo);

    const messagesEndRef = useRef(null); // Ref to the last message element

    const handleMessageSubmit = (e) => {
        e.preventDefault();

        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'user', text: userMessage },
        ]);

        const data = {
            userMessage: userMessage,
            recipe: recipe,
        };

        console.log("Sending data: (log in chosen_recipe.js)", data);
        fetch('https://smartmad.railway.internal:8080/generateRecipeResponse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(responseData => {
                // Log the response data for debugging
                console.log("AI response data:", responseData);
                console.log('AI response:', responseData.answer);  // This should print the AI answer

                // Add AI response to the conversation
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { sender: 'bot', text: responseData.answer },
                ]);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        // Clear the input field after submission
        setUserMessage('');
    };

    // Scroll to the bottom of the chat when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]); // Trigger scroll when messages array changes

    return (
        <div className="bg-gradient-to-b from-blue-800 to-blue-900 min-h-screen flex p-6 text-white">
            {/* Main Content */}
            <div className="flex-2 pr-8">
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
                <h1 className="text-4xl font-extrabold mb-6">{recipe?.name}</h1>

                {/* Time Section */}
                <div className="bg-gray-100 text-gray-900 p-6 rounded-lg shadow-lg mb-6">
                    <h2 className="text-2xl font-bold mb-4 border-b pb-2 border-blue-400">Tilberedningstid</h2>
                    <ul className="space-y-2">
                        <li><strong>Forberedelsestid:</strong> {recipe?.time?.prep?.value} {recipe?.time?.prep?.unit}</li>
                        <li><strong>Kogetid:</strong> {recipe?.time?.cook?.value} {recipe?.time?.cook?.unit}</li>
                        <li><strong>Samlet tid:</strong> {recipe?.time?.total?.value} {recipe?.time?.total?.unit}</li>
                    </ul>
                </div>

                {/* Ingredients Section */}
                <div className="bg-gray-100 text-gray-900 p-6 rounded-lg shadow-lg mb-6">
                    <h2 className="text-2xl font-bold mb-4 border-b pb-2 border-blue-400">Ingredienser</h2>
                    <ul className="space-y-2">
                        {recipe?.ingredients?.map((ingredient, index) => (
                            <li key={index}>
                                {ingredient.value} {ingredient.unit} {ingredient.name}
                                {ingredient.comment && <span className="text-gray-600"> ({ingredient.comment})</span>}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Instructions Section */}
                <h2 className="text-2xl font-bold mt-8 mb-4 border-b pb-2 border-blue-400">Fremgangsmåde</h2>
                {recipe?.instructions?.map((instruction, index) => (
                    <div key={index} className="mb-4">
                        <h3 className="font-semibold text-xl text-blue-600 mb-2">{instruction.titel}</h3>
                        <ul className="list-inside space-y-2">
                            {instruction.steps?.map((step, i) => (
                                <li key={i}>
                                    {i + 1}. {step} {/* No multiplication for numbering */}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

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
            </div>

            <div className="fixed bottom-0 right-1 w-[35rem] mb-1">
                <div className="bg-white p-6 rounded-lg shadow-lg h-[calc(95vh)] flex flex-col overflow-hidden">
                    {/* Chatbox messages container */}
                    <div className="flex-1 overflow-auto space-y-4 mb-4 scrollbar-thin scrollbar-thumb-gray-400">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`p-4 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
                            >
                                <p>{message.text}</p>
                            </div>
                        ))}
                        {/* Scroll trigger */}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Form */}
                    <form onSubmit={handleMessageSubmit} className="flex gap-2">
                        <input
                            type="text"
                            value={userMessage}
                            onChange={(e) => setUserMessage(e.target.value)}
                            placeholder="Spørg kokken!"
                            className="flex-1 p-2 rounded-lg border border-gray-300 text-black"
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300"
                        >
                            Send
                        </button>
                    </form>
                </div>
            </div>

        </div>
    );
};
