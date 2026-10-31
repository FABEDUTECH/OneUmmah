```javascript
/* =====================================================
   ONEUMMAH DATA SKILLS
   Complete Frontend JavaScript
   ===================================================== */

/* ---------- Course Data ---------- */

const COURSES = {
  sql: {
    name: 'Master SQL',
    lessons: 48,
    mini: 'sql',
    label: 'SQL'
  },
  python: {
    name: 'Python for Data Engineering',
    lessons: 56,
    mini: 'py',
    label: 'Py'
  },
  azure: {
    name: 'Azure Data Engineering',
    lessons: 64,
    mini: 'cloud',
    label: 'AZ'
  },
  snowflake: {
    name: 'Snowflake & dbt',
    lessons: 42,
    mini: 'snow',
    label: 'SF'
  },
  java: {
    name: 'Java Development',
    lessons: 52,
    mini: 'java',
    label: 'J'
  }
};

const USERS_KEY = 'dfa_users';
const SESSION_KEY = 'dfa_session';

const PROTECTED_PAGES = [
  'dashboard.html',
  'payments.html'
];

/* ---------- Storage Helpers ---------- */

function getUsers() {
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Unable to read users:', error);
    return {};
  }
}

function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('Unable to save users:', error);
    alert('Unable to save your account in this browser. Please check browser storage settings.');
    return false;
  }
}

function getSession() {
  try {
    return localStorage.getItem(SESSION_KEY);
  } catch (error) {
    return null;
  }
}

function setSession(email) {
  try {
    if (email) {
      localStorage.setItem(SESSION_KEY, email);
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
    return true;
  } catch (error) {
    alert('Unable to save your login session. Please check browser storage settings.');
    return false;
  }
}

function currentUser() {
  const email = getSession();

  if (!email) {
    return null;
  }

  const users = getUsers();

  return users[email] || null;
}

/*
  DEMO ONLY:
  This hash is NOT secure password storage.
  Do not use this frontend-only authentication
  for real production accounts.
*/

function hashPassword(password) {
  let hash = 0;

  for (let i = 0; i < password.length; i++) {
    hash = (Math.imul(31, hash) + password.charCodeAt(i)) | 0;
  }

  return String(hash);
}

/* ---------- Page Helpers ---------- */

function currentPage() {
  const path = window.location.pathname.split('/').pop();

  return path || 'index.html';
}

function getFieldValue(id) {
  const element = document.getElementById(id);

  return element ? element.value.trim() : '';
}

function getFieldPassword(id) {
  const element = document.getElementById(id);

  return element ? element.value : '';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ---------- Toast Messages ---------- */

function toast(message) {
  const element = document.getElementById('toast');

  if (!element) {
    console.log(message);
    return;
  }

  element.textContent = message;
  element.style.display = 'block';
  element.classList.add('show');

  clearTimeout(window.oneUmmahToastTimer);

  window.oneUmmahToastTimer = setTimeout(function () {
    element.classList.remove('show');
    element.style.display = 'none';
  }, 2500);
}

/* ---------- Form Error Messages ---------- */

function showError(id, message) {
  const element = document.getElementById(id);

  if (!element) {
    alert(message);
    return;
  }

  element.textContent = message;
  element.style.display = 'block';
  element.classList.add('show');
}

function clearError(id) {
  const element = document.getElementById(id);

  if (!element) {
    return;
  }

  element.textContent = '';
  element.style.display = 'none';
  element.classList.remove('show');
}

/* ---------- Registration ---------- */

function handleRegister() {
  clearError('registerError');

  const name = getFieldValue('regName');
  const email = getFieldValue('regEmail').toLowerCase();
  const password = getFieldPassword('regPassword');

  if (!name) {
    showError('registerError', 'Please enter your full name.');
    return false;
  }

  if (!isValidEmail(email)) {
    showError('registerError', 'Please enter a valid email address.');
    return false;
  }

  if (password.length < 6) {
    showError('registerError', 'Password must be at least 6 characters.');
    return false;
  }

  const users = getUsers();

  if (users[email]) {
    showError(
      'registerError',
      'This email is already registered. Please sign in instead.'
    );
    return false;
  }

  const newUser = {
    name: name,
    email: email,
    passwordHash: hashPassword(password),
    enrolled: [],
    certificates: [],
    joined: new Date().toISOString()
  };

  users[email] = newUser;

  if (!saveUsers(users)) {
    showError(
      'registerError',
      'Your account could not be saved. Please check browser storage.'
    );
    return false;
  }

  if (!setSession(email)) {
    showError(
      'registerError',
      'Your account was created, but the login session could not be saved. Please sign in.'
    );
    return false;
  }

  toast('Account created successfully!');

  setTimeout(function () {
    window.location.href = 'dashboard.html';
  }, 500);

  return false;
}

/* ---------- Login ---------- */

function handleLogin() {
  clearError('loginError');

  const email = getFieldValue('loginEmail').toLowerCase();
  const password = getFieldPassword('loginPassword');

  if (!isValidEmail(email) || !password) {
    showError(
      'loginError',
      'Please enter a valid email address and password.'
    );
    return false;
  }

  const users = getUsers();
  const user = users[email];

  if (!user || user.passwordHash !== hashPassword(password)) {
    showError(
      'loginError',
      'Incorrect email or password. Please try again.'
    );
    return false;
  }

  if (!setSession(email)) {
    showError(
      'loginError',
      'Unable to save your login session. Please try again.'
    );
    return false;
  }

  toast('Welcome back, ' + user.name + '!');

  setTimeout(function () {
    window.location.href = 'dashboard.html';
  }, 500);

  return false;
}

/* ---------- Logout ---------- */

function handleLogout() {
  setSession(null);

  window.location.href = 'index.html';
}

/* ---------- Password Visibility ---------- */

function togglePassword(id, button) {
  const input = document.getElementById(id);

  if (!input) {
    return;
  }

  if (input.type === 'password') {
    input.type = 'text';

    if (button) {
      button.textContent = 'Hide';
    }
  } else {
    input.type = 'password';

    if (button) {
      button.textContent = 'Show';
    }
  }
}

/* ---------- Course Details ---------- */

function openCourse(id) {
  const course = COURSES[id];

  if (!course) {
    return;
  }

  toast(course.name + ' curriculum opened');

  const title = document.getElementById('detailTitle');
  const module = document.getElementById('detailModule');
  const details = document.getElementById('course-details');

  if (title) {
    title.textContent =
      course.name + ': everything you need in one learning path.';
  }

  if (module) {
    module.textContent = course.name;
  }

  if (details) {
    details.scrollIntoView({
      behavior: 'smooth'
    });
  }
}

/* ---------- Course Enrollment ---------- */

function handleEnroll(id) {
  const course = COURSES[id];

  if (!course) {
    return;
  }

  const user = currentUser();

  if (!user) {
    toast('Please sign in to enroll.');

    setTimeout(function () {
      window.location.href = 'login.html';
    }, 500);

    return;
  }

  user.enrolled = user.enrolled || [];

  if (user.enrolled.includes(id)) {
    toast('You are already enrolled in ' + course.name + '.');
    return;
  }

  user.enrolled.push(id);

  const users = getUsers();
  users[user.email] = user;

  if (!saveUsers(users)) {
    return;
  }

  toast('Successfully enrolled in ' + course.name + '!');

  refreshUI();
}

/* ---------- Payment ---------- */

function handlePay() {
  const user = currentUser();

  if (!user) {
    toast('Please sign in to continue.');

    setTimeout(function () {
      window.location.href = 'login.html';
    }, 500);

    return;
  }

  toast('Payment process started for ' + user.name + '.');
}

/* ---------- Dashboard ---------- */

function renderDashboard() {
  const user = currentUser();

  if (!user) {
    return;
  }

  const initial = user.name.trim().charAt(0).toUpperCase() || 'S';

  function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = value;
    }
  }

  setText('dashAvatar', initial);
  setText('dashName', user.name);
  setText('dashEmail', user.email);
  setText('navAvatar', initial);
  setText('navName', user.name.split(' ')[0]);

  const enrolled = user.enrolled || [];

  const supportButton = document.getElementById('studentSupportBtn');

  if (supportButton) {
    supportButton.style.display =
      enrolled.length > 0 ? 'inline-block' : 'none';
  }

  setText('metricActive', enrolled.length);

  setText(
    'metricActiveSub',
    enrolled.length ? 'Keep it up!' : 'Browse courses to enroll'
  );

  const totalLessons = enrolled.reduce(function (sum, id) {
    return sum + Math.round((COURSES[id]?.lessons || 0) * 0.35);
  }, 0);

  setText('metricLessons', totalLessons);
  setText('metricAssign', enrolled.length * 3);
  setText('metricCerts', (user.certificates || []).length);

  setText(
    'dashWelcome',
    enrolled.length
      ? 'Keep going — you are making progress.'
      : 'You have not enrolled in a course yet.'
  );

  const list = document.getElementById('myCoursesList');

  if (!list) {
    return;
  }

  list.innerHTML = '';

  if (!enrolled.length) {
    list.innerHTML =
      '<div class="course-row empty">' +
      'No courses yet — ' +
      '<a class="text-link" href="courses.html">explore the catalog</a>' +
      ' and enroll to get started.' +
      '</div>';

    return;
  }

  enrolled.forEach(function (id) {
    const course = COURSES[id];

    if (!course) {
      return;
    }

    const progress = 35;

    const row = document.createElement('div');
    row.className = 'course-row';

    const icon = document.createElement('div');
    icon.className = 'mini-icon ' + course.mini;
    icon.textContent = course.label;

    const info = document.createElement('div');
    info.className = 'row-info';

    const title = document.createElement('b');
    title.textContent = course.name;

    const lessons = document.createElement('small');
    lessons.textContent =
      Math.round(course.lessons * progress / 100) +
      ' of ' + course.lessons + ' lessons';

    const progressBox = document.createElement('div');
    progressBox.className = 'progress';

    const progressBar = document.createElement('div');
    progressBar.style.width = progress + '%';

    progressBox.appendChild(progressBar);

    info.appendChild(title);
    info.appendChild(lessons);
    info.appendChild(progressBox);

    const percent = document.createElement('strong');
    percent.textContent = progress + '%';

    row.appendChild(icon);
    row.appendChild(info);
    row.appendChild(percent);

    list.appendChild(row);
  });
}

/* ---------- Navigation and UI ---------- */

function refreshUI() {
  const user = currentUser();

  const guest = document.getElementById('guestActions');
  const authenticated = document.getElementById('authActions');

  if (guest && authenticated) {
    guest.style.display = user ? 'none' : 'flex';
    authenticated.style.display = user ? 'flex' : 'none';
  }

  if (user) {
    renderDashboard();
  }

  document.querySelectorAll('.course-btn-alt[data-course]').forEach(
    function (button) {
      const id = button.getAttribute('data-course');

      if (!COURSES[id]) {
        return;
      }

      const enrolled =
        !!user &&
        Array.isArray(user.enrolled) &&
        user.enrolled.includes(id);

      button.textContent = enrolled ? '✓ Enrolled' : 'Enroll';
      button.classList.toggle('enrolled', enrolled);
    }
  );
}

/* ---------- Protected Pages ---------- */

function guardPage() {
  const page = currentPage();

  if (
    PROTECTED_PAGES.includes(page) &&
    !currentUser()
  ) {
    window.location.href = 'login.html';
  }
}

/* ---------- Start Application ---------- */

document.addEventListener('DOMContentLoaded', function () {
  guardPage();
  refreshUI();

  console.log('OneUmmah Data Skills JavaScript loaded successfully.');
});
```
