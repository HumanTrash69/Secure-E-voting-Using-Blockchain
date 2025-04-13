import FaceVerification from './faceverification.js';

const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const voter_id = document.getElementById('voter-id').value;
  const password = document.getElementById('password').value;
  
  const hardcodedUsers = {
    "admin": {
      password: "admin123",
      role: "admin"
    },
    "voter1": {
      password: "voter123",
      role: "user"
    },
    "voter2": {
      password: "voter123",
      role: "user"
    },
    "voter3": {
      password: "voter123",
      role: "user"
    },
    "voter4": {
      password: "voter123",
      role: "user"
    },
    "voter5": {
      password: "voter123",
      role: "user"
    },
    "voter6": { 
      password: "voter123",
      role: "user"
    }
  };
  
  try {
    if (hardcodedUsers[voter_id] && hardcodedUsers[voter_id].password === password) {
      // Face verification for non-admin users
      if (hardcodedUsers[voter_id].role !== 'admin') {
          const faceVerifier = new FaceVerification();
          const isVerified = await faceVerifier.startVerification(voter_id);
          
          if (!isVerified) {
              const errorElement = document.getElementById('error');
              errorElement.style.color = '#ff0000';  // Set error text to red
              errorElement.innerText = 'Face verification failed. Please try again.';
              return;
          }
      }

      // Continue with existing login logic
      localStorage.setItem('voterId', voter_id);
      localStorage.setItem('role', hardcodedUsers[voter_id].role);
      const token = btoa(JSON.stringify({
        voterId: voter_id,
        role: hardcodedUsers[voter_id].role
      }));
      
      if (hardcodedUsers[voter_id].role === 'admin') {
        localStorage.setItem('jwtTokenAdmin', token);
        window.location.replace(`http://127.0.0.1:8080/admin.html?Authorization=Bearer ${token}`);
      } else {
        localStorage.setItem('jwtTokenVoter', token);
        window.location.replace(`http://127.0.0.1:8080/index.html?Authorization=Bearer ${token}`);
      }
    } else {
      console.error('Login failed: Invalid credentials');
      document.getElementById('error').innerText = 'Invalid credentials. Please try again.';
    }
  } catch (error) {
    console.error('Login failed:', error.message);
    const errorElement = document.getElementById('error');
    if (errorElement) {
      errorElement.innerText = 'Login failed: ' + error.message;
    } else {
      console.error('Login failed:', error.message);
    }
  }
});
