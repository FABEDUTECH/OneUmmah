(() => {
const API_URL = "https://oneummah-ai-chatbot.oneummahdataskills.workers.dev";
  if (document.getElementById("oum-chat-launcher")) return;

  const css = document.createElement("style");
  css.textContent = `
    #oum-chat-launcher {
      position:fixed;right:22px;bottom:22px;z-index:99999;
      width:60px;height:60px;border-radius:50%;
      background:#171717;color:#e8bd58;border:2px solid #e8bd58;
      font-size:27px;cursor:pointer;box-shadow:0 5px 25px #0006;
    }
    #oum-chat-panel {
      display:none;position:fixed;right:20px;bottom:94px;z-index:99999;
      width:min(360px,calc(100vw - 32px));height:480px;max-height:70vh;
      background:#111;color:#fff;border:1px solid #e8bd58;
      border-radius:16px;overflow:hidden;font-family:Arial,sans-serif;
      flex-direction:column;box-shadow:0 8px 35px #0007;
    }
    #oum-chat-panel.open{display:flex}
    .oum-head{padding:15px;background:#211c10;border-bottom:1px solid #665127}
    .oum-head strong{color:#e8bd58;font-size:16px}
    .oum-head small{display:block;margin-top:5px;color:#ccc}
    #oum-chat-close{float:right;background:none;border:0;color:white;font-size:24px;cursor:pointer}
    #oum-chat-log{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:10px}
    .oum-bubble{padding:10px 12px;border-radius:12px;max-width:88%;font-size:13px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}
    .oum-bot{background:#29251b;border:1px solid #4b3c1d;align-self:flex-start}
    .oum-user{background:#e8bd58;color:#171717;align-self:flex-end}
    .oum-shortcuts{display:flex;gap:6px;flex-wrap:wrap;padding:8px}
    .oum-shortcuts button{background:#1b1b1b;color:#e8bd58;border:1px solid #8c7035;border-radius:15px;padding:7px;font-size:11px;cursor:pointer}
    #oum-chat-form{display:flex;gap:7px;padding:10px;border-top:1px solid #443921}
    #oum-chat-input{min-width:0;flex:1;background:#202020;color:white;border:1px solid #5b4a2b;border-radius:8px;padding:10px}
    #oum-chat-send{background:#e8bd58;color:#171717;border:0;border-radius:8px;padding:0 13px;cursor:pointer}
    @media(max-width:480px){#oum-chat-panel{right:8px;bottom:86px;width:calc(100vw - 16px)}}
  `;
  document.head.appendChild(css);

  const launcher = document.createElement("button");
  launcher.id = "oum-chat-launcher";
  launcher.textContent = "✦";
  launcher.title = "Chat with OneUmmah AI Mentor";
  launcher.setAttribute("aria-label", "Open AI Mentor");

  const panel = document.createElement("section");
  panel.id = "oum-chat-panel";
  panel.innerHTML = `
    <div class="oum-head">
      <button id="oum-chat-close" aria-label="Close">×</button>
      <strong>✦ OneUmmah AI Mentor</strong>
      <small>Your learning companion · SQL · Python · Career</small>
    </div>
    <div id="oum-chat-log" aria-live="polite"></div>
    <div class="oum-shortcuts">
      <button type="button" data-q="Teach me SQL from zero">Learn SQL</button>
      <button type="button" data-q="Give me a Python practice question">Python Practice</button>
      <button type="button" data-q="Help me prepare for a data engineer interview">Interview Prep</button>
    </div>
    <form id="oum-chat-form">
      <input id="oum-chat-input" maxlength="2000" placeholder="Ask your question..." required>
      <button id="oum-chat-send" type="submit">Send</button>
    </form>
  `;
  document.body.append(launcher, panel);

  const log = panel.querySelector("#oum-chat-log");
  const input = panel.querySelector("#oum-chat-input");
  const send = panel.querySelector("#oum-chat-send");
  const history = [];
  let busy = false;

  function message(text, role) {
    const el = document.createElement("div");
    el.className = "oum-bubble " + (role === "user" ? "oum-user" : "oum-bot");
    el.textContent = text;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }

  message("Assalamu Alaikum! Welcome to OneUmmah AI Mentor. 🌟\nAsk me about SQL, Python, courses or interviews.", "bot");

  launcher.onclick = () => {
    panel.classList.toggle("open");
    if (panel.classList.contains("open")) input.focus();
  };
  panel.querySelector("#oum-chat-close").onclick = () => panel.classList.remove("open");

  panel.querySelectorAll("[data-q]").forEach(button => {
    button.onclick = () => {
      input.value = button.dataset.q;
      panel.querySelector("#oum-chat-form").requestSubmit();
    };
  });

  panel.querySelector("#oum-chat-form").onsubmit = async event => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question || busy) return;

    if (API_URL === "PASTE_WORKER_URL_HERE") {
      message("Setup pending: paste your deployed Cloudflare Worker URL in chatbot.js.", "bot");
      return;
    }

    busy = true;
    send.disabled = true;
    input.disabled = true;
    message(question, "user");
    input.value = "";
    history.push({ role: "user", content: question });
    const wait = message("Thinking...", "bot");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.slice(-12) })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Request failed");

      const answer = data.reply || "Please try again.";
      wait.textContent = answer;
      history.push({ role: "assistant", content: answer });
    } catch (error) {
      wait.textContent = "AI connection failed. Please check the backend URL and try again.";
      console.error("OneUmmah AI:", error);
    } finally {
      busy = false;
      send.disabled = false;
      input.disabled = false;
      input.focus();
    }
  };
})();
