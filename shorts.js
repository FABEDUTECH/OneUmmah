// To add more shorts, add another object to this list.
(function () {
  var SHORTS = [
    { src: "videoplayback.mp4", title: "SQL in 6 seconds", tag: "Quick tip" }
  ];

  var row = document.getElementById("shortsRow");
  if (!row) { console.error("shorts.js: #shortsRow not found. Use the new courses.html."); return; }

  function pauseAll(except) {
    row.querySelectorAll(".short-card").forEach(function (card) {
      if (card === except) return;
      card.querySelector("video").pause();
      card.classList.remove("playing");
    });
  }

  SHORTS.forEach(function (s) {
    var card = document.createElement("div");
    card.className = "short-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", "Play short: " + s.title);
    card.innerHTML =
      '<video src="' + s.src + '#t=0.1" preload="auto" loop muted playsinline></video>' +
      '<span class="short-play">▶</span>' +
      '<button class="short-mute" type="button">Unmute</button>' +
      '<div class="short-info"><strong>' + s.title + '</strong><small>' + s.tag + '</small></div>';

    var video = card.querySelector("video");
    var mute = card.querySelector(".short-mute");
    var info = card.querySelector(".short-info small");

    video.addEventListener("error", function () {
      info.textContent = "Video not found: put " + s.src + " in the same folder as courses.html";
      info.style.color = "#fca5a5";
    });

    function toggle() {
      if (video.paused) {
        pauseAll(card);
        var p = video.play();
        card.classList.add("playing");
        if (p && p.catch) p.catch(function (err) {
          card.classList.remove("playing");
          console.error("Play failed:", err);
        });
      } else {
        video.pause();
        card.classList.remove("playing");
      }
    }

    card.addEventListener("click", toggle);
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
    });
    mute.addEventListener("click", function (e) {
      e.stopPropagation();
      video.muted = !video.muted;
      mute.textContent = video.muted ? "Unmute" : "Mute";
    });

    row.appendChild(card);
  });
})();
