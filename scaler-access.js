/* OneUmmah access helper (browser-only = demo level; real protection needs a server later).
   Put in the <head> of a protected page:
     <script src="scaler-access.js" data-guard="paid"></script>                    any paid course
     <script src="scaler-access.js" data-guard="paid" data-course="sql"></script>  one specific course
   Lesson-by-lesson unlock helpers (use in dashboard code):
     OUM.isUnlocked('sql', index)   lesson 0 is open; lesson n opens after lesson n-1 is done
     OUM.markDone('sql', index)     call when a lesson video / assignment is completed       */
(function(){
  function users(){try{return JSON.parse(localStorage.getItem('dfa_users')||'{}')}catch(x){return {}}}
  function user(){try{var e=localStorage.getItem('dfa_session');return e?(users()[e]||null):null}catch(x){return null}}
  function save(u){var all=users();all[u.email]=u;localStorage.setItem('dfa_users',JSON.stringify(all))}
  function hasPaid(id){var u=user();if(!u)return false;var p=u.paid||[];return id?p.indexOf(id)>-1:p.length>0}
  function done(id){var u=user();return (u&&u.progress&&u.progress[id])||[]}
  function markDone(id,lesson){
    var u=user();if(!u)return;u.progress=u.progress||{};
    var d=u.progress[id]=u.progress[id]||[];
    if(d.indexOf(lesson)<0)d.push(lesson);save(u);
  }
  function isUnlocked(id,index){return hasPaid(id)&&index<=done(id).length}
  window.OUM={user:user,hasPaid:hasPaid,done:done,markDone:markDone,isUnlocked:isUnlocked};

  var s=document.currentScript;
  if(s&&s.getAttribute('data-guard')==='paid'){
    var c=s.getAttribute('data-course');
    var page=(location.pathname.split('/').pop()||'index.html')+location.search;
    if(!user()){try{sessionStorage.setItem('oum_next',page)}catch(x){}location.replace('login.html')}
    else if(!hasPaid(c)){location.replace('payments.html'+(c?'?course='+encodeURIComponent(c):''))}
  }
})();
