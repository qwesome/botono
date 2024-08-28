// Define the endpoint URL
const endpoint = 'http://botono.vercel.app/api/regesterAccount';

// Function to create an account
async function createAccount() {
    // Get references to the input fields
    const userIn = document.getElementById('username');
    const passIn = document.getElementById('password');

    // Prepare the data from input fields
    const data = {
        userName: userIn.value,
        passWord: passIn.value
    };

    try {
        // Make the fetch request
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON response
        const result = await response.json();
        console.log('Account created successfully:', result);

        // Optionally, provide user feedback
        alert('Account created successfully!');
    } catch (error) {
        console.error('Error creating account:', error);
        alert('Error creating account. Please try again.');
    }
}
