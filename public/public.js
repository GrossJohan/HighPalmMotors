let sessionId = null;

function toggleMenu() {
  const menu = document.getElementById('mobile-menu');
  // var menu = document.getElementById("header-navbar");
  if (menu.style.display === 'none') {
    menu.style.display = 'block';
  } else {
    menu.style.display = 'none';
  }
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = 'flex';
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = 'none';
  document.getElementById('signUpEmail').value = '';
  document.getElementById('signUpPassword').value = '';
  document.getElementById('signInEmail').value = '';
  document.getElementById('signInPassword').value = '';
}

function signUp() {
  event.preventDefault();

  const emailInput = document.getElementById('signUpEmail');
  const passwordInput = document.getElementById('signUpPassword');
  const email = emailInput.value;
  const password = passwordInput.value;

  // Validate email and password
  const validationError = validateForm(email, password);

  if (validationError) {
    return alert(validationError);
  }

  // Send a POST request to /users
  send('POST', '/users', { email, password }).then((response) => {
    if (response.ok) {
      alert('Sign up successful!');

      // Clear form
      emailInput.value = '';
      passwordInput.value = '';

      // Close modal
      closeModal('signUpModal');

      // Redirect to /home
      window.location.href = '/home';
    } else {
      alert('Failed to sign up!');
    }
  });
}

function signIn() {
  event.preventDefault();

  const emailInput = document.getElementById('signInEmail');
  const passwordInput = document.getElementById('signInPassword');
  const email = emailInput.value;
  const password = passwordInput.value;

  // Validate email and password
  const validationError = validateForm(email, password);

  if (validationError) {
    return alert(validationError);
  }

  // Send a POST request to /sessions
  send('POST', '/sessions', { email, password }).then((response) => {
    if (response.ok) {
      // Save session id to local storage
      const sessionIdString = response.body.id;

      localStorage.setItem('sessionId', sessionIdString);
      sessionId = sessionIdString;

      // Clear form
      emailInput.value = '';
      passwordInput.value = '';

      // Close modal
      closeModal('signInModal');

      // Hide sign in button
      document.getElementById('signInButton').style.display = 'none';
      document.getElementById('signOutButton').style.display = 'block';

      // Redirect to /home
      window.location.href = '/home';
    } else {
      alert('Failed to sign in!');
    }
  });
}

function signOut() {
  // Send a DELETE request to /sessions
  send('DELETE', '/sessions').then((response) => {
    if (response.ok) {
      // Clear local storage
      clearStorageAndResetSessionInfo();

      // Show sign in button
      document.getElementById('signInButton').style.display = 'block';
      document.getElementById('signOutButton').style.display = 'none';

      // Redirect to /home
      window.location.href = '/home';
    } else {
      alert('Failed to sign out!');
    }
  });
}

// On page load or refresh, check if there is a session id in local storage
window.onload = function () {
  const session = localStorage.getItem('sessionId');
  if (session) {
    sessionId = session;
    document.getElementById('signInButton').style.display = 'none';
    document.getElementById('signOutButton').style.display = 'block';
  } else {
    document.getElementById('signInButton').style.display = 'block';
    document.getElementById('signOutButton').style.display = 'none';
  }
};

function validateForm(email, password) {
  if (!email.trim() || !password.trim()) {
    return 'Email and password are required';
  }

  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }

  return null;
}

function tryToParseJSON(jsonString) {
  try {
    const o = JSON.parse(jsonString);
    if (o && typeof o === 'object') {
      return o;
    }
  } catch (e) {}
  return false;
}

function send(method, url, body) {
  async function checkError(response) {
    if (response.status >= 200 && response.status <= 299) {
      let responseText = await response.text();
      return { ok: true, status: response.status, body: tryToParseJSON(responseText) };
    } else {
      let responseText = await response.text();
      let responseObject = tryToParseJSON(responseText);
      if (typeof responseObject === 'object' && typeof responseObject.error === 'string') {
        alert('Error code ' + response.status + ':\n' + responseObject.error);
      } else {
        alert('Error code ' + response.status + ':\n' + responseText);
      }
      if (response.status === 401) {
        // Assuming you have a function named clearStorageAndResetSessionInfo
        clearStorageAndResetSessionInfo();
      }
      return { ok: false, status: response.status, body: responseObject || responseText };
    }
  }

  const headers = {
    'Content-Type': 'application/json',
  };
  // Assuming you have a variable named sessionId
  if (sessionId) {
    headers.Authorization = 'Bearer ' + sessionId;
  }

  return fetch(url, {
    method: method,
    headers,
    body: JSON.stringify(body),
  })
    .then(checkError)
    .then((jsonResponse) => {
      return jsonResponse;
    })
    .catch((error) => {
      throw new Error('Network error: ' + error);
    });
}

function clearStorageAndResetSessionInfo() {
  localStorage.removeItem('sessionId');
  sessionId = null;
}
