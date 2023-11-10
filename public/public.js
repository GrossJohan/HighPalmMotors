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

function openModal() {
  const modal = document.getElementById('myModal');
  modal.style.display = 'flex';
}

function closeModal() {
  const modal = document.getElementById('myModal');
  modal.style.display = 'none';
  document.getElementById('signUpEmail').value = '';
  document.getElementById('signUpPassword').value = '';
}

// Close the modal if the user clicks outside of it
window.onclick = function (event) {
  const modal = document.getElementById('myModal');
  if (event.target === modal) {
    modal.style.display = 'none';
    document.getElementById('signUpEmail').value = '';
    document.getElementById('signUpPassword').value = '';
  }
};

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
      closeModal();

      // Redirect to /home
      window.location.href = '/home#start_here';
    } else {
      alert(`Failed to sign up: ${response.body.error || 'Unknown error'}`);
    }
  });
}

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
