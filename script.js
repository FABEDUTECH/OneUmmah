/* ---------- Data ---------- */
const COURSES = {
  sql:       { name: 'Master SQL', lessons: 48, mini: 'sql', label: 'SQL' },
  python:    { name: 'Python for Data Engineering', lessons: 56, mini: 'py', label: 'Py' },
  azure:     { name: 'Azure Data Engineering', lessons: 64, mini: 'cloud', label: 'AZ' },
  snowflake: { name: 'Snowflake & dbt', lessons: 42, mini: 'snow', label: 'SF' },
  java:      { name: 'Java Development', lessons: 52, mini: 'java', label: 'J' }
};

const USERS_KEY = 'dfa_users';
const SESSION_KEY = 'dfa_session';
const PROTECTED_PAGES = ['dashboard.html', 'payments.html'];

/* ---------- Storage helpers ---------- */
function getUsers(){ try { return JSON.parse(localStorage.getItem(USERS_KEY)) || {}; } catch(e){ return {}; } }
function saveUsers(u){ localStorage.setItem(USERS_KEY, JSON.stringify(u)); }
function getSession(){ return localStorage.getItem(SESSION_KEY); }
function setSession(email){ if(email){ localStorage.setItem(SESSION_KEY, email); } else { localStorage.removeItem(SESSION_KEY); } }
function currentUser(){ const email = getSession(); if(!email) return null; const users = getUsers(); return users[email] || null; }

/* Simple non-cryptographic hash — this is a front-end demo with no server, not real security. */
function hashPassword(pw){ let h = 0; for(let i=0;i<pw.length;i++){ h = (Math.imul(31,h) + pw.charCodeAt(i))|0; } return String(h); }

function currentPage(){
  const path = location.pathname.split('/').pop();
  return path === '' ? 'index.html' : path;
}

/* ---------- Toast ---------- */
function toast(message){const t=document.getElementById('toast');t.textContent=message;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}

/* ---------- Course actions ---------- */
function openCourse(id){
  const c = COURSES[id];
  if(!c) return;
  toast(c.name + ' — curriculum opened');
  const titleEl = document.getElementById('detailTitle');
  const moduleEl = document.getElementById('detailModule');
  if(titleEl) titleEl.textContent = c.name + ': everything you need in one learning path.';
  if(moduleEl) moduleEl.textContent = c.name;
  const details = document.getElementById('course-details');
  if(details) details.scrollIntoView({behavior:'smooth'});
}

function handleEnroll(id){
  const user = currentUser();
  if(!user){
    toast('Please login to enroll');
    setTimeout(() => location.href = 'login.html', 600);
    return;
  }
  user.enrolled = user.enrolled || [];
  if(!user.enrolled.includes(id)){
    user.enrolled.push(id);
    const users = getUsers();
    users[user.email] = user;
    saveUsers(users);
    toast('Enrolled in ' + COURSES[id].name);
  } else {
    toast('Already enrolled — continue from your dashboard');
  }
  refreshUI();
}

function handlePay(){
  const user = currentUser();
  if(!user){
    toast('Please login to continue to payment');
    setTimeout(() => location.href = 'login.html', 600);
    return;
  }
  toast('Payment flow started for ' + user.name);
}

/* ---------- Auth ---------- */
function showError(id, msg){
  const el = document.getElementById(id);
  if(!el) return;
  el.textContent = msg;
  el.classList.add('show');
}
function clearError(id){
  const el = document.getElementById(id);
  if(!el) return;
  el.textContent = '';
  el.classList.remove('show');
}
function isValidEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

function handleRegister(){
  clearError('registerError');
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim().toLowerCase();
  const password = document.getElementById('regPassword').value;

  if(!name){ showError('registerError','Please enter your full name.'); return; }
  if(!isValidEmail(email)){ showError('registerError','Please enter a valid email address.'); return; }
  if(password.length < 6){ showError('registerError','Password must be at least 6 characters.'); return; }

  const users = getUsers();
  if(users[email]){ showError('registerError','An account with this email already exists. Please login instead.'); return; }

  users[email] = { name, email, passwordHash: hashPassword(password), enrolled: [], joined: new Date().toISOString() };
  saveUsers(users);
  setSession(email);
  toast('Welcome, ' + name + '! Account created.');
  setTimeout(() => location.href = 'dashboard.html', 500);
}

function handleLogin(){
  clearError('loginError');
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;

  if(!isValidEmail(email) || !password){ showError('loginError','Please enter a valid email and password.'); return; }

  const users = getUsers();
  const user = users[email];
  if(!user || user.passwordHash !== hashPassword(password)){
    showError('loginError','Incorrect email or password.');
    return;
  }
  setSession(email);
  toast('Welcome back, ' + user.name + '!');
  setTimeout(() => location.href = 'dashboard.html', 500);
}

function handleLogout(){
  setSession(null);
  toast('Logged out');
  setTimeout(() => location.href = 'index.html', 400);
}

/* ---------- UI rendering ---------- */
function renderDashboard(){
  const user = currentUser();
  if(!user) return;
  const initial = user.name.trim().charAt(0).toUpperCase() || 'S';
  const set = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = val; };

  set('dashAvatar', initial);
  set('dashName', user.name);
  set('dashEmail', user.email);
  set('navAvatar', initial);
  set('navName', user.name.split(' ')[0]);

  const enrolled = user.enrolled || [];
  set('metricActive', enrolled.length);
  set('metricActiveSub', enrolled.length ? 'Keep it up' : 'Browse courses to enroll');
  set('metricLessons', enrolled.reduce((sum,id) => sum + Math.round((COURSES[id]?.lessons || 0) * 0.35), 0));
  set('metricAssign', enrolled.length * 3);
  set('metricCerts', (user.certificates || []).length);
  set('dashWelcome', enrolled.length ? 'Keep going — you\'re making progress.' : 'You haven\'t enrolled in a course yet.');

  const list = document.getElementById('myCoursesList');
  if(!list) return;
  list.innerHTML = '';
  if(!enrolled.length){
    list.innerHTML = '<div class="course-row empty">No courses yet — <a class="text-link" href="courses.html">explore the catalog</a> and enroll to get started.</div>';
    return;
  }
  enrolled.forEach(id => {
    const c = COURSES[id];
    if(!c) return;
    const progress = 35; /* demo progress for a freshly enrolled course */
    const row = document.createElement('div');
    row.className = 'course-row';
    row.innerHTML = `<div class="mini-icon ${c.mini}">${c.label}</div>
      <div class="row-info"><b>${c.name}</b><small>${Math.round(c.lessons*progress/100)} of ${c.lessons} lessons</small>
      <div class="progress"><div style="width:${progress}%"></div></div></div><strong>${progress}%</strong>`;
    list.appendChild(row);
  });
}

function refreshUI(){
  const user = currentUser();
  const guest = document.getElementById('guestActions');
  const authed = document.getElementById('authActions');
  if(guest && authed){
    if(user){
      guest.style.display = 'none';
      authed.style.display = 'flex';
    } else {
      guest.style.display = 'flex';
      authed.style.display = 'none';
    }
  }
  if(user) renderDashboard();

  Object.keys(COURSES).forEach(id => {
    const btn = document.querySelector('.course-btn-alt[data-course="' + id + '"]');
    if(!btn) return;
    const enrolled = user && user.enrolled && user.enrolled.includes(id);
    btn.textContent = enrolled ? '✓ Enrolled' : 'Enroll';
    btn.classList.toggle('enrolled', !!enrolled);
  });
}

/* ---------- Page guard ---------- */
function guardPage(){
  const page = currentPage();
  if(PROTECTED_PAGES.includes(page) && !currentUser()){
    toast('Please login to continue');
    location.href = 'login.html';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  guardPage();
  refreshUI();
});
