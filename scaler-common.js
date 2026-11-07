/* OneUmmah shared page behaviour: mobile menu, Courses dropdown, Login drawer, Request a Call (WhatsApp) */
(function(){
  var WA="916360846480";
  /* ===== Login drawer settings =====
     DEFAULT_VIEW: "phone" (Scaler look) or "email".
     OTP_ENABLED : keep false until a real SMS/OTP service is connected (Firebase later). */
  var DEFAULT_VIEW="phone";
  var OTP_ENABLED=false;

  function $(id){return document.getElementById(id)}
  function wa(t){return "https://wa.me/"+WA+"?text="+encodeURIComponent(t)}

  /* ---------- Bottom bar + Request a Call popup ---------- */
  document.body.insertAdjacentHTML("beforeend",
    '<div class="bar">Ready to start learning? Talk to us at <b>+91 63608 46480</b> or <button type="button" data-open>Request a Call \u2197</button></div>'+
    '<div class="modal" id="rcModal" role="dialog" aria-modal="true" aria-labelledby="rcTitle">'+
      '<form class="mbox" id="rcForm" novalidate>'+
        '<button class="x" type="button" id="rcClose" aria-label="Close">\u00d7</button>'+
        '<h3 id="rcTitle">Request a Call</h3>'+
        '<small>Tell us what you want to learn. We\u2019ll reply on WhatsApp.</small>'+
        '<div class="field"><label for="rcName">Full name *</label><input id="rcName" autocomplete="name"></div>'+
        '<div class="field"><label for="rcPhone">Phone number *</label><input id="rcPhone" type="tel" autocomplete="tel" placeholder="+91"></div>'+
        '<div class="field"><label for="rcCourse">Course *</label><select id="rcCourse"><option value="">Select a course</option><option>Master SQL</option><option>Python for Data Engineering</option><option>Azure Data Engineering</option><option>Snowflake &amp; dbt</option><option>Java Development</option></select></div>'+
        '<p class="err" id="rcErr" role="alert"></p>'+
        '<button class="btn" type="submit">Submit</button>'+
      '</form></div>');

  var m=$("rcModal");
  function openM(){m.classList.add("open");$("rcName").focus()}
  function closeM(){m.classList.remove("open")}
  document.querySelectorAll("[data-open]").forEach(function(x){x.onclick=openM});
  $("rcClose").onclick=closeM;
  m.onclick=function(e){if(e.target===m)closeM()};
  $("rcForm").onsubmit=function(e){
    e.preventDefault();
    var n=$("rcName").value.trim(),p=$("rcPhone").value.trim(),c=$("rcCourse").value;
    if(!n||!/^[+\d][\d\s-]{7,}$/.test(p)||!c){$("rcErr").textContent="Enter your name, a valid phone number and select a course.";return}
    $("rcErr").textContent="";
    window.open(wa("Hi, I'm "+n+" ("+p+"). I want to know about "+c+" at OneUmmah Data Skills."),"_blank");
    closeM();
  };

  /* ---------- Login drawer (slides in from the right, page behind is blurred) ---------- */
  var dr=document.createElement("div");
  dr.className="dr";dr.id="loginDrawer";
  dr.setAttribute("role","dialog");dr.setAttribute("aria-modal","true");dr.setAttribute("aria-labelledby","drTitle");
  dr.innerHTML=
    '<div class="dr-bg" data-dr-close></div>'+
    '<aside class="dr-panel">'+
      '<button class="dr-x" type="button" aria-label="Close" data-dr-close>\u00d7</button>'+
      '<h2 id="drTitle">Take your skills to the next level now!</h2>'+

      /* PHONE VIEW (default, same layout as Scaler) */
      '<div class="dr-view" id="drPhoneView">'+
        '<div class="dr-phone">'+
          '<div class="dr-cc" aria-hidden="true"><i class="flag-in"></i><span class="chev"></span></div>'+
          '<div class="dr-field dr-pf"><label for="drTel">Enter your phone number *</label><input id="drTel" type="tel" inputmode="numeric" maxlength="10" autocomplete="tel-national"></div>'+
        '</div>'+
        '<p class="dr-help">Enter phone number registered with OneUmmah</p>'+
        '<div class="message" id="drPErr" role="alert"></div>'+
        '<button class="btn full dr-main" id="drOtp" type="button">Get OTP</button>'+
        '<div class="dr-or">OR</div>'+
        '<button class="dr-alt" type="button" id="drToEmail"><span class="ic">\u2709</span> Login via Email</button>'+
        '<button class="dr-alt" type="button" data-soon="Google"><b class="g">G</b> Login via Google</button>'+
      '</div>'+

      /* EMAIL VIEW */
      '<div class="dr-view" id="drEmailView" hidden>'+
        '<form id="drForm" novalidate autocomplete="off">'+
          '<div class="dr-field"><label for="drEmail">Enter your email *</label><input id="drEmail" type="email" autocomplete="username"></div>'+
          '<div class="dr-field"><label for="drPass">Enter your password *</label><input id="drPass" type="password" autocomplete="current-password"><button class="show" type="button" id="drShow">Show</button></div>'+
          '<div class="message" id="drErr" role="alert"></div>'+
          '<button class="btn full dr-main" id="drBtn" type="submit">Sign In</button>'+
        '</form>'+
        '<div class="dr-or">OR</div>'+
        '<button class="dr-alt" type="button" id="drToPhone"><span class="ic">\u260E</span> Login via Phone OTP</button>'+
        '<button class="dr-alt" type="button" data-soon="Google"><b class="g">G</b> Login via Google</button>'+
      '</div>'+

      '<p class="dr-foot">Don\u2019t have an account? <a href="register.html">Sign-up</a></p>'+
    '</aside>';
  document.body.appendChild(dr);

  function showView(v){
    $("drPhoneView").hidden=(v!=="phone");
    $("drEmailView").hidden=(v!=="email");
    $("drPErr").style.display="none";$("drErr").style.display="none";
    setTimeout(function(){$(v==="phone"?"drTel":"drEmail").focus()},50);
  }
  function note(kind,text){
    var e=$($("drPhoneView").hidden?"drErr":"drPErr");
    e.className="message"+(kind==="info"?" info":"");e.textContent=text;e.style.display="block";
  }
  function openDr(view){
    var l=$("links");if(l)l.classList.remove("open");
    dr.classList.add("open");document.documentElement.style.overflow="hidden";
    showView(view||DEFAULT_VIEW);
  }
  function closeDr(){
    if(dr.classList.contains("open")){try{sessionStorage.removeItem("oum_next")}catch(x){}}
    dr.classList.remove("open");document.documentElement.style.overflow="";
  }
  function goNext(){
    var n="dashboard.html";
    try{var v=sessionStorage.getItem("oum_next");sessionStorage.removeItem("oum_next");
      if(v&&/^[a-z0-9-]+\.html(\?[\w=&-]*)?$/i.test(v))n=v}catch(x){}
    window.location.href=n;
  }
  function cu(){
    try{var e=localStorage.getItem("dfa_session");if(!e)return null;return JSON.parse(localStorage.getItem("dfa_users")||"{}")[e]||null}catch(x){return null}
  }
  dr.querySelectorAll("[data-dr-close]").forEach(function(x){x.onclick=closeDr});
  $("drToEmail").onclick=function(){showView("email")};
  $("drToPhone").onclick=function(){showView("phone")};
  dr.querySelectorAll("[data-soon]").forEach(function(b){
    b.onclick=function(){note("info",b.getAttribute("data-soon")+" login will be available soon. Please sign in with your email for now.")};
  });

  // Phone view: digits only + Get OTP
  $("drTel").oninput=function(){this.value=this.value.replace(/\D/g,"")};
  $("drOtp").onclick=function(){
    var p=$("drTel").value;
    if(!/^[6-9]\d{9}$/.test(p)){note("err","Enter a valid 10-digit mobile number.");return}
    if(!OTP_ENABLED){note("info","Phone OTP login is coming soon. Please use Login via Email for now.");return}
    /* When an OTP service is connected: send the code here, then show a 6-digit code box. */
  };

  // On every page except login.html itself, "Login" links open the drawer
  if(!/login\.html$/.test(location.pathname)){
    document.addEventListener("click",function(e){
      var a=e.target.closest&&e.target.closest('a[href="login.html"]');
      if(!a||e.metaKey||e.ctrlKey||e.shiftKey||e.button===1)return;
      e.preventDefault();openDr();
    });
  }

  // Enroll button: not logged in -> login drawer; logged in -> payment page; already paid -> dashboard
  window.startEnroll=function(id){
    var to="payments.html?course="+encodeURIComponent(id),u=cu();
    if(!u){try{sessionStorage.setItem("oum_next",to)}catch(x){}openDr();return}
    if((u.paid||[]).indexOf(id)>-1){location.href="dashboard.html";return}
    location.href=to;
  };

  // Email view
  $("drShow").onclick=function(){
    var i=$("drPass"),s=i.type==="password";
    i.type=s?"text":"password";this.textContent=s?"Hide":"Show";
  };
  function hp(pw){var h=0;for(var i=0;i<pw.length;i++){h=(Math.imul(31,h)+pw.charCodeAt(i))|0}return String(h)}
  $("drForm").onsubmit=function(e){
    e.preventDefault();
    $("drErr").style.display="none";
    var email=$("drEmail").value.trim().toLowerCase(),pw=$("drPass").value;
    if(!email||!pw){note("err","Please enter your email and password.");return}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){note("err","Please enter a valid email address.");return}
    try{
      var users=JSON.parse(localStorage.getItem("dfa_users")||"{}"),u=users[email];
      if(!u||u.passwordHash!==hp(pw)){note("err","Incorrect email or password. If you have not registered, create an account first.");return}
      localStorage.setItem("dfa_session",email);
      $("drBtn").disabled=true;$("drBtn").textContent="Signing in...";
      goNext();
    }catch(x){note("err","Your browser could not access account storage. Please enable local storage and try again.")}
  };

  /* ---------- Mobile menu + Courses dropdown ---------- */
  var b=$("burger"),l=$("links"),dd=$("dd");
  if(b&&l){
    b.onclick=function(){b.setAttribute("aria-expanded",l.classList.toggle("open"))};
    l.addEventListener("click",function(e){if(e.target.tagName==="A")l.classList.remove("open")});
  }
  if(dd){
    dd.querySelector("button").onclick=function(e){e.stopPropagation();var o=dd.classList.toggle("open");e.currentTarget.setAttribute("aria-expanded",o)};
    document.addEventListener("click",function(e){if(!dd.contains(e.target))dd.classList.remove("open")});
  }
  document.addEventListener("keydown",function(e){
    if(e.key==="Escape"){closeM();closeDr();if(dd)dd.classList.remove("open")}
  });
})();
