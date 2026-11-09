(() => {
  const API_URL = "https://oneummah-ai-chatbot.oneummahdataskills.workers.dev";

  if (document.getElementById("oum-chat-launcher")) return;

  /* Scaler-style look: blue + navy, square corners, Plus Jakarta Sans.
     Sits above the navy "Request a Call" bar (54px) and below the login drawer. */
  const css = document.createElement("style");
  css.textContent = `
    #oum-chat-launcher {
      position: fixed;
      right: 22px;
      bottom: 74px;
      z-index: 80;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #0443e0;
      color: #fff;
      border: 0;
      font-size: 24px;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(4, 67, 224, .4);
      transition: background .2s, transform .2s;
    }

    #oum-chat-launcher:hover {
      background: #0334b3;
      transform: translateY(-2px);
    }

    #oum-chat-panel {
      display: none;
      position: fixed;
      right: 20px;
      bottom: 142px;
      z-index: 80;
      width: min(380px, calc(100vw - 32px));
      height: 500px;
      max-height: calc(100vh - 170px);
      background: #fff;
      color: #000;
      border: 1px solid #e5e5e5;
      border-radius: 2px;
      overflow: hidden;
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      flex-direction: column;
      box-shadow: 0 18px 50px rgba(0, 26, 79, .28);
    }

    #oum-chat-panel.open {
      display: flex;
    }

    .oum-head {
      padding: 16px 18px;
      background: #001a4f;
      color: #fff;
    }

    .oum-head strong {
      color: #fff;
      font-family: 'Clash Grotesk', 'Plus Jakarta Sans', system-ui, sans-serif;
      font-weight: 500;
      font-size: 18px;
      letter-spacing: .01em;
    }

    .oum-head small {
      display: block;
      margin-top: 4px;
      color: #b9c8ee;
      font-size: 12px;
    }

    #oum-chat-close {
      float: right;
      background: none;
      border: 0;
      color: #fff;
      font-size: 26px;
      line-height: 1;
      cursor: pointer;
    }

    #oum-chat-log {
      flex: 1;
      overflow-y: auto;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      background: #fafafa;
    }

    .oum-bubble {
      padding: 11px 13px;
      border-radius: 2px;
      max-width: 88%;
      font-size: 14px;
      line-height: 1.55;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }

    .oum-bot {
      background: #fff;
      border: 1px solid #e5e5e5;
      color: #111;
      align-self: flex-start;
    }

    .oum-user {
      background: #0443e0;
      color: #fff;
      align-self: flex-end;
    }

    .oum-shortcuts {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      padding: 10px 12px;
      background: #fafafa;
      border-top: 1px solid #e5e5e5;
    }

    .oum-shortcuts button {
      background: #fff;
      color: #0443e0;
      border: 1px solid #0443e0;
      border-radius: 2px;
      padding: 7px 10px;
      font: 600 11px 'Plus Jakarta Sans', system-ui, sans-serif;
      letter-spacing: .06em;
      text-transform: uppercase;
      cursor: pointer;
      transition: background .2s, color .2s;
    }

    .oum-shortcuts button:hover {
      background: #0443e0;
      color: #fff;
    }

    #oum-chat-form {
      display: flex;
      gap: 8px;
      padding: 12px;
      border-top: 1px solid #e5e5e5;
      background: #fff;
    }

    #oum-chat-input {
      min-width: 0;
      flex: 1;
      background: #fff;
      color: #000;
      border: 1px solid #cfcfcf;
      border-radius: 2px;
      padding: 0 12px;
      height: 40px;
      font: 14px 'Plus Jakarta Sans', system-ui, sans-serif;
    }

    #oum-chat-input:focus {
      border-color: #0443e0;
      outline: none;
      box-shadow: 0 0 0 3px rgba(4, 67, 224, .12);
    }

    #oum-chat-send {
      background: #0443e0;
      color: #fff;
      border: 0;
      border-radius: 2px;
      padding: 0 16px;
      font: 700 12px 'Plus Jakarta Sans', system-ui, sans-serif;
      letter-spacing: .1em;
      text-transform: uppercase;
      cursor: pointer;
    }

    #oum-chat-send:hover {
      background: #0334b3;
    }

    #oum-chat-send:disabled {
      opacity: 0.6;
      cursor: wait;
    }

    @media (max-width: 480px) {
      #oum-chat-launcher {
        right: 14px;
        bottom: 70px;
      }

      #oum-chat-panel {
        right: 8px;
        bottom: 134px;
        width: calc(100vw - 16px);
      }
    }
  `;

  document.head.appendChild(css);

  const launcher = document.createElement("button");
  launcher.id = "oum-chat-launcher";
  launcher.textContent = "✦";
  launcher.title = "Chat with OneUmmah AI Mentor";
  launcher.setAttribute("aria-label", "Open AI Mentor");
  launcher.type = "button";

  const panel = document.createElement("section");
  panel.id = "oum-chat-panel";

  panel.innerHTML = `
    <div class="oum-head">
      <button id="oum-chat-close" type="button" aria-label="Close">×</button>
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
      <input
        id="oum-chat-input"
        maxlength="2000"
        placeholder="Ask your question..."
        autocomplete="off"
        required
      >
      <button id="oum-chat-send" type="submit">Send</button>
    </form>
  `;

  document.body.append(launcher, panel);

  const log = panel.querySelector("#oum-chat-log");
  const input = panel.querySelector("#oum-chat-input");
  const send = panel.querySelector("#oum-chat-send");
  const form = panel.querySelector("#oum-chat-form");
  const history = [];
  let busy = false;

  function message(text, role) {
    const el = document.createElement("div");
    el.className =
      "oum-bubble " + (role === "user" ? "oum-user" : "oum-bot");
    el.textContent = text;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }

  message(
    "Assalamu Alaikum! Welcome to OneUmmah AI Mentor. 🌟\nAsk me about SQL, Python, courses or interviews.",
    "bot"
  );

  launcher.addEventListener("click", () => {
    panel.classList.toggle("open");
    if (panel.classList.contains("open")) input.focus();
  });

  panel.querySelector("#oum-chat-close").addEventListener("click", () => {
    panel.classList.remove("open");
  });

  panel.querySelectorAll("[data-q]").forEach(button => {
    button.addEventListener("click", () => {
      input.value = button.dataset.q;
      form.requestSubmit();
    });
  });

  form.addEventListener("submit", async event => {
    event.preventDefault();

    const question = input.value.trim();
    if (!question || busy) return;

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
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: history.slice(-12)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Request failed");
      }

      const answer = data.reply || "Please try again.";
      wait.textContent = answer;
      history.push({ role: "assistant", content: answer });

    } catch (error) {
      wait.textContent =
        "AI connection failed. Please check the Worker URL and backend settings.";
      console.error("OneUmmah AI:", error);

    } finally {
      busy = false;
      send.disabled = false;
      input.disabled = false;
      input.focus();
    }
  });
})();
