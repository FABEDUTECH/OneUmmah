// To add more shorts, add another object to this list.
const SHORTS = [
  { src: "videoplayback.mp4", title: "SQL in 6 seconds", tag: "Quick tip" }
];

(function () {
  const row = document.getElementById("shortsRow");
  if (!row) return;

  function pauseAll(except) {
    row.querySelectorAll(".short-card").forEach(card => {
      if (card === except) return;
      const v = card.querySelector("video");
      v.pause();
      card.classList.remove("playing");
    });
  }

  SHORTS.forEach(s => {
    const card = document.createElement("div");
    card.className = "short-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", "Play short: " + s.title);
    card.innerHTML =
      '<video src="' + s.src + '" preload="metadata" loop muted playsinline></video>' +
      '<span class="short-play">▶</span>' +
      '<button class="short-mute" type="button">Unmute</button>' +
      '<div class="short-info"><strong>' + s.title + '</strong><small>' + s.tag + '</small></div>';

    const video = card.querySelector("video");
    const mute = card.querySelector(".short-mute");

    function toggle() {
      if (video.paused) {
        pauseAll(card);
        video.play();
        card.classList.add("playing");
      } else {
        video.pause();
        card.classList.remove("playing");
      }
    }

    card.addEventListener("click", toggle);
    card.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
    });
    mute.addEventListener("click", e => {
      e.stopPropagation();
      video.muted = !video.muted;
      mute.textContent = video.muted ? "Unmute" : "Mute";
    });

    row.appendChild(card);
  });
})();
