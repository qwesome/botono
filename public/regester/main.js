

const userIn = document.getElementById("username");
const passIn = document.getElementById("password");

const endpoint = 'http://botono.vercel.app/api/regesterAccount';

const data = {
  userName: 'newUser',
  passWord: 'securePassword'
};

async function createAccount() {
    data.userName = userIn.value;
    data.passWord = passIn.value;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Account created successfully:', result);
  } catch (error) {
    console.error('Error creating account:', error);
  }
}

