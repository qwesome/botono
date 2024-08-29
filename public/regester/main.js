if (localStorage.getItem("username") != null) {
    window.location.href = "https://botono.vercel.app/";
}

// Define the endpoint URL
const regesterAccountEndpoint = 'https://botono.vercel.app/api/regester';
const queryAccountEndpoint = 'https://botono.vercel.app/api/signIn';


const userIn2 = document.getElementById('2username');
const passIn2 = document.getElementById('2password');

let passWord2 = "";
let userName2 = "";

userIn2.addEventListener("change", function(){
    userName2 = userIn2.value;
})

passIn2.addEventListener("change", function(){
    passWord2 = passIn2.value;
})


// Function to create an account
async function createAccount() {
    
    const data = {
        userName: userIn2.value,
        passWord: passIn2.value
    };

    console.log(userName2+"   "+passWord2);

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

        localStorage.setItem("username", userName2);
        localStorage.setItem("password", passWord2);

        window.location.href = "https://botono.vercel.app/";
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

            localStorage.setItem("username", userName1);
            localStorage.setItem("password", passWord1);


            window.location.href = "https://botono.vercel.app/";
        } catch (error) {
            console.error('Error creating account:', error);
            alert('Error creating account. Please try again.');
        }
    }
}