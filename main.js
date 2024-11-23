const OPENAI_API = process.env.API_KEY; // Replace with your actual API key



function logSuggestion(userDescription) {
    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API}`
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
            console.log("Generated Story:", story);

            // Displaying the story
            document.querySelector("#story").textContent = story;

            // Fetching the image after getting the story
            return generateImage(userDescription);
        })
        .then(imageUrl => {
            // Display the image
            const imageElement = document.querySelector("#story-image");
            imageElement.src = imageUrl;
            imageElement.alt = "Generated Image";
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Something went wrong. Please try again.");
        });
}

function generateImage(userDescription) {
    return fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API}`
        },
        body: JSON.stringify({
            prompt: `A creative and funny illustration based on the following description: "${userDescription}".`,
            n: 1,
            size: "512x512"
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Image API Error: ${response.status}`);
            }
            return response.json();
        })
        .then(imageData => {
            const imageUrl = imageData.data[0].url; // Get the image URL
            console.log("Generated Image URL:", imageUrl);
            return imageUrl; // Return the URL in case you need it elsewhere
        })
        .catch(error => {
            console.error("Error generating image:", error);
            alert("Failed to generate an image. Please try again.");
        });
}

// Event listener for the button
const button = document.querySelector("button");
const inputElement = document.querySelector("input");

button.addEventListener("click", function () {
    const valueInputted = inputElement.value; // Get the user input
    if (!valueInputted) {
        alert("Please enter a description!");
        return;
    }

    console.log("User Input:", valueInputted);
    logSuggestion(valueInputted); // Call logSuggestion once with the user input
});
