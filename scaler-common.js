/* OneUmmah shared page behaviour: mobile menu, Courses dropdown, Request a Call (WhatsApp) */
(function(){
  var WA="916360846480";
  function $(id){return document.getElementById(id)}
  function wa(t){return "https://wa.me/"+WA+"?text="+encodeURIComponent(t)}

  // Bottom bar + Request a Call popup (added once per page)
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

  // Mobile menu + Courses dropdown
  var b=$("burger"),l=$("links"),dd=$("dd");
  if(b&&l){
    b.onclick=function(){b.setAttribute("aria-expanded",l.classList.toggle("open"))};
    l.addEventListener("click",function(e){if(e.target.tagName==="A")l.classList.remove("open")});
  }
  if(dd){
    dd.querySelector("button").onclick=function(e){e.stopPropagation();var o=dd.classList.toggle("open");e.currentTarget.setAttribute("aria-expanded",o)};
    document.addEventListener("click",function(e){if(!dd.contains(e.target))dd.classList.remove("open")});
  }
  document.addEventListener("keydown",function(e){if(e.key==="Escape"){closeM();if(dd)dd.classList.remove("open")}});
})();
