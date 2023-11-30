let adminSessionId = null;

// Send request
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

function changeBetweenDetailsAndStart() {
  let details = document.getElementById('car_details');
  let start = document.getElementById('additional_details');

  if (details.style.display === 'none') {
    details.style.display = 'block';
    start.style.display = 'none';
  } else {
    details.style.display = 'none';
    start.style.display = 'block';
  }
}

function submitVehicleForm() {
  event.preventDefault();

  let year = document.getElementById('year').value.trim();
  let make = document.getElementById('make').value.trim();
  let model = document.getElementById('model').value.trim();
  let vin = document.getElementById('vin').value.trim();
  let accident = document.getElementById('accident').value.trim();
  let issue = document.getElementById('issue').value.trim();
  let clearTitle = document.getElementById('clear_title').value.trim().toLowerCase();
  let odometer = document.getElementById('odometer').value.trim();
  let zipCode = document.getElementById('zip_code').value.trim();
  let emailAddress = document.getElementById('email_address').value.trim();
  let phoneNumber = document.getElementById('phone_number').value.trim() ? document.getElementById('phone_number').value.trim() : null;

  const vehicleInfo = {
    year,
    make,
    model,
    vin,
    accident,
    issue,
    clearTitle,
    odometer,
  };

  const user = {
    zipCode,
    emailAddress,
    phoneNumber,
  };

  // Validate vehicle form
  const validationError = validateVehicleForm(vehicleInfo, user);

  if (validationError) {
    return alert(validationError);
  }

  // Send a POST request to /users
  send('POST', '/vehicles', { vehicleInfo, user }).then((response) => {
    if (response.ok) {
      window.location.href = '/home';
      changeBetweenDetailsAndStart();
      alert('Vehicle information submitted! Email will be sent as soon as possible!');
      clearVehicleForm();
    } else {
      alert('Failed to submit vehicle information!');
    }
  });
}

function clearVehicleForm() {
  document.getElementById('year').value = '';
  document.getElementById('make').value = '';
  document.getElementById('model').value = '';
  document.getElementById('vin').value = '';
  document.getElementById('accident').value = '';
  document.getElementById('issue').value = '';
  document.getElementById('clear_title').value = '';
  document.getElementById('odometer').value = '';
  document.getElementById('zip_code').value = '';
  document.getElementById('email_address').value = '';
  document.getElementById('phone_number').value = '';
}

// On page load or refresh, check if there is a session id in local storage
window.onload = function () {
  const adminSession = localStorage.getItem('adminSessionId');

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

function validateVehicleForm(vehicleInfo, user) {
  const requiredFields = [
    vehicleInfo.year,
    vehicleInfo.make,
    vehicleInfo.model,
    vehicleInfo.vin,
    vehicleInfo.accident,
    vehicleInfo.issue,
    vehicleInfo.clearTitle,
    vehicleInfo.odometer,
    user.zipCode,
    user.emailAddress,
    user.phoneNumber,
  ];

  if (requiredFields.includes('')) {
    return 'All fields are required';
  }

  let currentYear = new Date().getFullYear();

  if (vehicleInfo.year < 1900 || vehicleInfo.year > currentYear) {
    return `Year must be between 1900 and ${currentYear}`;
  }

  if (vehicleInfo.vin.length !== 17) {
    return 'VIN must be 17 characters';
  }

  if (vehicleInfo.odometer < 0) {
    return 'Odometer must be greater than 0';
  }

  if (vehicleInfo.clearTitle !== 'yes' && vehicleInfo.clearTitle !== 'no') {
    return 'Clear title must be yes or no';
  }

  if (user.emailAddress.indexOf('@') === -1) {
    return 'Email address must be valid';
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
        clearStorageAndResetSessionInfo();
      }
      return { ok: false, status: response.status, body: responseObject || responseText };
    }
  }

  const headers = {
    'Content-Type': 'application/json',
  };

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
  localStorage.removeItem('adminSessionId');
  adminSessionId = null;
}
