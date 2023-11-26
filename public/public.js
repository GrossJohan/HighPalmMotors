let sessionId = null;
let adminSessionId = null;

// Send request
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

function adminSignIn() {
  event.preventDefault();

  const emailInput = document.getElementById('adminSignInEmail');
  const passwordInput = document.getElementById('adminSignInPassword');
  const email = emailInput.value;
  const password = passwordInput.value;

  // Validate email and password
  const validationError = validateForm(email, password);

  if (validationError) {
    return alert(validationError);
  }

  // Send a POST request to /sessions
  send('POST', '/admin', { email, password }).then((response) => {
    if (response.ok) {
      document.querySelector('.admin').style.display = 'none';
      document.querySelector('.admin-dashboard').style.display = 'block';

      // Save session id to local storage
      const sessionIdString = response.body.id;

      localStorage.setItem('adminSessionId', sessionIdString);
      adminSessionId = sessionIdString;

      // Clear form
      emailInput.value = '';
      passwordInput.value = '';
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

function submitPrice(vehicle) {
  const priceInput = document.getElementById(`price${vehicle.id}`);
  let price = priceInput.value;

  send('POST', '/email', { vehicle, price }).then((response) => {
    if (response.ok) {
      alert('Email sent!');

      // Clear form
      priceInput.value = '';

      document.getElementById(`offer${vehicle.id}`).innerHTML = `${response.body.data}: ($${price})`;
    } else {
      alert('Failed to send email!');

      // Clear form
      priceInput.value = '';
    }
  });
}

function submitVehicleForm() {
  event.preventDefault();

  let year = document.getElementById('year').value.trim();
  let make = document.getElementById('make').value.trim();
  let model = document.getElementById('model').value.trim();
  let vin = document.getElementById('vin').value.trim();

  // Validate vehicle form
  const validationError = validateVehicleForm(year, make, model, vin);

  if (validationError) {
    return alert(validationError);
  }

  // Send a POST request to /users
  send('POST', '/vehicles', { year, make, model, vin }).then((response) => {
    if (response.ok) {
      alert('Vehicle information submitted!');

      // Clear form
      document.getElementById('year').value = '';
      document.getElementById('make').value = '';
      document.getElementById('model').value = '';
      document.getElementById('vin').value = '';
    } else {
      alert('Failed to submit vehicle information!');
    }
  });
}

// Modal
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

// On page load or refresh, check if there is a session id in local storage
window.onload = function () {
  const session = localStorage.getItem('sessionId');
  const adminSession = localStorage.getItem('adminSessionId');
  if (session) {
    sessionId = session;
    document.getElementById('signInButton').style.display = 'none';
    document.getElementById('signOutButton').style.display = 'block';
  } else {
    document.getElementById('signInButton').style.display = 'block';
    document.getElementById('signOutButton').style.display = 'none';
  }

  if (adminSession) {
    adminSessionId = adminSession;
    document.querySelector('.admin').style.display = 'none';
    document.querySelector('.admin-dashboard').style.display = 'block';
  } else {
    document.querySelector('.admin').style.display = 'block';
    document.querySelector('.admin-dashboard').style.display = 'none';
  }
};

// Validation
function validateForm(email, password) {
  if (!email.trim() || !password.trim()) {
    return 'Email and password are required';
  }

  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }

  return null;
}

function validateVehicleForm(year, make, model, vin) {
  if (!year.trim() || !make.trim() || !model.trim() || !vin.trim()) {
    return 'All fields are required';
  }

  let currentYear = new Date().getFullYear();

  if (year < 1900 || year > currentYear) {
    return `Year must be between 1900 and ${currentYear}`;
  }

  if (vin.length !== 17) {
    return 'VIN must be 17 characters';
  }

  return null;
}

// Other
function toggleMenu() {
  const menu = document.getElementById('mobile-menu');
  // var menu = document.getElementById("header-navbar");
  if (menu.style.display === 'none') {
    menu.style.display = 'block';
  } else {
    menu.style.display = 'none';
  }
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
  localStorage.removeItem('adminSessionId');
  sessionId = null;
  adminSessionId = null;
}
