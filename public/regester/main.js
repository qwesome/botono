// Define the endpoint URL
const regesterAccountEndpoint = 'https://botono.vercel.app/api/regester';
const queryAccountEndpoint = 'https://botono.vercel.app/api/signIn';

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

    console.log(userName+"   "+passWord);

    try {
        // Make the fetch request
        const response = await fetch(regesterAccountEndpoint, {
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


const userIn1 = document.getElementById('1username');
const passIn1 = document.getElementById('1password');

let passWord1 = "";
let userName1 = "";

userIn1.addEventListener("change", function(){
    userName1 = userIn1.value;
})

passIn1.addEventListener("change", function(){
    passWord1 = passIn1.value;
})

async function verifyAccount() {

    if (true) {
        // Prepare the data from input fields
        const data = {  
            userName: userName1,
            passWord: passWord1
        };

        console.log(userName1+"   "+passWord1);

        try {
            // Make the fetch request
            const response = await fetch(queryAccountEndpoint, {
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

            console.log(result);
        } catch (error) {
            console.error('Error creating account:', error);
            alert('Error creating account. Please try again.');
        }
    }
}