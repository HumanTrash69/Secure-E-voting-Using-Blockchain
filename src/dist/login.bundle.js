(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const voter_id = document.getElementById('voter-id').value;
  const password = document.getElementById('password').value;
  
  // Hardcoded users for authentication
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
    }
  };
  
  try {
    // Check credentials against hardcoded users
    if (hardcodedUsers[voter_id] && hardcodedUsers[voter_id].password === password) {
      // Login successful
      localStorage.setItem('voterId', voter_id);
      localStorage.setItem('role', hardcodedUsers[voter_id].role);
      
      // Create a simple token (not secure, but works for demo)
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
      // Login failed
      console.error('Login failed: Invalid credentials');
      document.getElementById('error').innerText = 'Invalid credentials. Please try again.';
    }
  } catch (error) {
    console.error('Login failed:', error.message);
    document.getElementById('error').innerText = 'Login failed: ' + error.message;
  }
  
  // Comment out or remove the fetch call to the API
  /*
  fetch(`http://127.0.0.1:8000/login?voter_id=${voter_id}&password=${password}`, { headers })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Login failed');
    }
  })
  .then(data => {
    if (data.role === 'admin') {
      console.log(data.role)
      localStorage.setItem('jwtTokenAdmin', data.token);
      window.location.replace(`http://127.0.0.1:8080/admin.html?Authorization=Bearer ${localStorage.getItem('jwtTokenAdmin')}`);
    } else if (data.role === 'user'){
      localStorage.setItem('jwtTokenVoter', data.token);
      window.location.replace(`http://127.0.0.1:8080/index.html?Authorization=Bearer ${localStorage.getItem('jwtTokenVoter')}`);
    }
  })
  .catch(error => {
    console.error('Login failed:', error.message);
  });
  */
});

},{}]},{},[1]);
