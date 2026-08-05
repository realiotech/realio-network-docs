(function () {
  var API_URL = "/api/chat";

  var ICONS = {
    chat:
      '<svg class="rio-icon-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>',
    close:
      '<svg class="rio-icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    sparkles:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>',
    send:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>',
    link:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>',
  };

  var SUGGESTIONS = [
    "What is Realio Network?",
    "How do I run a full node?",
    "How do I become a validator?",
  ];

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function init() {
    if (document.getElementById("rio-chat-toggle")) return; // already mounted (SPA nav)

    var toggle = el("button", "rio-chat-toggle", ICONS.chat + ICONS.close);
    toggle.id = "rio-chat-toggle";
    toggle.setAttribute("aria-label", "Open docs chat assistant");
    var badge = el("span", "rio-chat-badge");
    toggle.appendChild(badge);

    var panel = el("div", "rio-chat-panel");
    panel.id = "rio-chat-panel";

    var header = el("div", "rio-chat-header");
    var avatar = el("div", "rio-chat-avatar", ICONS.sparkles);
    var headerText = el("div", "rio-chat-header-text");
    headerText.appendChild(el("div", "rio-title", "Docs Assistant"));
    var subtitle = el("div", "rio-subtitle");
    subtitle.appendChild(el("span", "rio-status-dot"));
    subtitle.appendChild(document.createTextNode("Answers from the Realio docs"));
    headerText.appendChild(subtitle);
    var closeBtn = el("button", "rio-close", ICONS.close.replace('class="rio-icon-close" ', ""));
    closeBtn.setAttribute("aria-label", "Close chat");
    header.appendChild(avatar);
    header.appendChild(headerText);
    header.appendChild(closeBtn);

    var messages = el("div", "rio-chat-messages");
    messages.id = "rio-chat-messages";

    var inputRow = el("div", "rio-chat-input");
    var textarea = document.createElement("textarea");
    textarea.rows = 1;
    textarea.placeholder = "Ask about the docs...";
    var sendBtn = el("button", "rio-send", ICONS.send);
    sendBtn.setAttribute("aria-label", "Send message");
    inputRow.appendChild(textarea);
    inputRow.appendChild(sendBtn);

    panel.appendChild(header);
    panel.appendChild(messages);
    panel.appendChild(inputRow);

    document.body.appendChild(toggle);
    document.body.appendChild(panel);

    function botAvatar() {
      return el("div", "rio-msg-avatar", ICONS.sparkles);
    }

    function addMessage(role, text) {
      var row = el("div", "rio-msg-row " + role);
      if (role === "bot") row.appendChild(botAvatar());
      var bubble = el("div", "rio-chat-msg", null);
      bubble.textContent = text;
      row.appendChild(bubble);
      messages.appendChild(row);
      messages.scrollTop = messages.scrollHeight;
      return bubble;
    }

    function appendSources(bubble, sources) {
      var srcWrap = el("div", "rio-sources");
      sources.forEach(function (s) {
        var a = document.createElement("a");
        a.href = s.url;
        a.target = "_blank";
        a.rel = "noopener";
        a.innerHTML = ICONS.link;
        var label = document.createElement("span");
        label.textContent = s.title || s.url;
        a.appendChild(label);
        srcWrap.appendChild(a);
      });
      bubble.appendChild(srcWrap);
    }

    var greeted = false;
    function renderSuggestions() {
      var wrap = el("div", "rio-suggestions");
      SUGGESTIONS.forEach(function (q) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = q;
        btn.addEventListener("click", function () {
          wrap.remove();
          textarea.value = q;
          send();
        });
        wrap.appendChild(btn);
      });
      messages.appendChild(wrap);
      messages.scrollTop = messages.scrollHeight;
    }

    function openPanel() {
      panel.classList.add("open");
      toggle.classList.add("open");
      badge.style.display = "none";
      if (!greeted) {
        addMessage("bot", "Hi! Ask me anything about the Realio Network docs.");
        renderSuggestions();
        greeted = true;
      }
      textarea.focus();
    }
    function closePanel() {
      panel.classList.remove("open");
      toggle.classList.remove("open");
    }

    toggle.addEventListener("click", function () {
      panel.classList.contains("open") ? closePanel() : openPanel();
    });
    closeBtn.addEventListener("click", closePanel);

    var sending = false;

    function streamChat(question) {
      return fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      }).then(function (r) {
        if (!r.ok || !r.body) {
          return r
            .json()
            .catch(function () {
              return {};
            })
            .then(function (data) {
              throw new Error(data.error || "Something went wrong. Try again.");
            });
        }

        var reader = r.body.getReader();
        var decoder = new TextDecoder();
        var buf = "";
        var botBubble = null;
        var typingRow = el("div", "rio-msg-row bot");
        typingRow.appendChild(botAvatar());
        var typing = el("div", "rio-chat-typing", "<span></span><span></span><span></span>");
        typingRow.appendChild(typing);
        messages.appendChild(typingRow);
        messages.scrollTop = messages.scrollHeight;

        function ensureBotBubble() {
          if (!botBubble) {
            typingRow.remove();
            botBubble = addMessage("bot", "");
          }
          return botBubble;
        }

        function handleEvent(evt) {
          if (evt.type === "sources") {
            return; // attached on "done" so they land after the final text
          }
          if (evt.type === "token") {
            ensureBotBubble().textContent += evt.text;
            messages.scrollTop = messages.scrollHeight;
          } else if (evt.type === "error") {
            typingRow.remove();
            addMessage("bot", evt.error || "Something went wrong. Try again.");
          } else if (evt.type === "done") {
            var bubble = ensureBotBubble();
            if (evt.sources && evt.sources.length) {
              appendSources(bubble, evt.sources);
              messages.scrollTop = messages.scrollHeight;
            }
          }
        }

        function pump() {
          return reader.read().then(function (result) {
            if (result.done) {
              typingRow.remove();
              return;
            }
            buf += decoder.decode(result.value, { stream: true });
            var lines = buf.split("\n");
            buf = lines.pop(); // last element may be a partial line
            for (var i = 0; i < lines.length; i++) {
              if (!lines[i].trim()) continue;
              try {
                handleEvent(JSON.parse(lines[i]));
              } catch (e) {
                // ignore malformed line, keep streaming
              }
            }
            return pump();
          });
        }

        return pump();
      });
    }

    function send() {
      var text = textarea.value.trim();
      if (!text || sending) return;
      var existingSuggestions = messages.querySelector(".rio-suggestions");
      if (existingSuggestions) existingSuggestions.remove();
      addMessage("user", text);
      textarea.value = "";
      textarea.style.height = "auto";
      sending = true;
      sendBtn.disabled = true;

      streamChat(text)
        .catch(function (err) {
          addMessage("bot", err.message || "Couldn't reach the assistant. Please try again shortly.");
        })
        .finally(function () {
          sending = false;
          sendBtn.disabled = false;
        });
    }

    sendBtn.addEventListener("click", send);
    textarea.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    });
    textarea.addEventListener("input", function () {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 90) + "px";
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
