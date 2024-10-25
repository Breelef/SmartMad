//Needs Ollama installed and the command "Ollama run LLama3" in CMD to run locally.


import axios from "axios";

async function askModel(prompt) {
    try {
        // Send the request to the model
        const response = await axios.post('http://localhost:11434/api/generate', {
            model: "llama3",
            prompt: prompt,
            max_tokens: 100,
        }, {
            // Set up to receive streaming response
            responseType: 'stream'
        });

        let completeResponse = '';

        // Listen for data events to accumulate response chunks
        response.data.on('data', (chunk) => {
            // Each chunk is a JSON object; accumulate response chunks
            completeResponse += chunk.toString();
        });

        // Listen for end event to process the complete response
        response.data.on('end', () => {
            // Split the concatenated response by newlines
            const responses = completeResponse.split('\n').filter(Boolean);

            // Initialize a variable to hold the final accumulated response
            let finalResponse = '';

            // Process each JSON object
            responses.forEach((resp) => {
                try {
                    const jsonResponse = JSON.parse(resp);
                    if (jsonResponse.response) {
                        finalResponse += jsonResponse.response; // Concatenate the response
                    }
                } catch (err) {
                    console.error('Failed to parse response:', err);
                }
            });

            // Log the final accumulated response only once after processing all data
            console.log("Final Response:", finalResponse);
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

// Example usage:
askModel("Tell me something interesting about asmongold");
