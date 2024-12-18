// Function to fetch the API key from the input field
function getApiKey() {
    return document.querySelector("#api-key").value;
}

function logSuggestion(userDescription) {
    // Get the API Key from input
    const OPENAI_API_KEY = getApiKey();

    // Check if the API Key is provided
    if (!OPENAI_API_KEY) {
        alert("Please enter your OpenAI API key.");
        return;
    }

    // Show loading
    showLoading();

    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-4',
            messages: [{
                role: 'user',
                content: `Create a fun, funny, and exciting story based on the following description: "${userDescription}". Not longer than 300 words.`
            }]
        })
    })
        .then(response => response.json())
        .then(suggestionData => {
            const story = suggestionData.choices[0].message.content;
            document.querySelector("#story").textContent = story;

            // Fetching the image after getting story
            return generateImage(userDescription, OPENAI_API_KEY);
        })
        .then(imageUrl => {
            const imageElement = document.querySelector("#story-image");
            imageElement.src = imageUrl;
            imageElement.alt = "Generated Image";

            // Hide loading state
            hideLoading();
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Something went wrong. Please try again.");

            // Hide loading state even on error
            hideLoading();
        });
}

function generateImage(userDescription, OPENAI_API_KEY) {
    return fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            prompt: `A creative and funny illustration based on the following description: "${userDescription}".`,
            n: 1,
            size: "512x512"
        })
    })
        .then(response => response.json())
        .then(imageData => {
            return imageData.data[0].url;  // Return generated image URL
        });
}

// Show loading
function showLoading() {
    document.querySelector("#story").textContent = "Loading story... Please wait.";
    const imageElement = document.querySelector("#story-image");
    imageElement.src = "https://raw.githubusercontent.com/Codelessly/FlutterLoadingGIFs/master/packages/cupertino_activity_indicator_square_large.gif"; // Loading spinner
    imageElement.alt = "Loading image...";
}

// Hide loading indicators
function hideLoading() {
    // Hide the loading spinner after  request is completed
}

// Event listener for the "Generate" button
document.querySelector("#generate-btn").addEventListener("click", function () {
    const descriptionInput = document.querySelector("#description").value;
    if (!descriptionInput) {
        alert("Please enter a description!");
        return;
    }

    logSuggestion(descriptionInput);
});
