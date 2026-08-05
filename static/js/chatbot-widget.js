(function () {
  var API_URL = "/api/chat";

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  function init() {
    if (document.getElementById("rio-chat-toggle")) return; // already mounted (SPA nav)

    var toggle = el("button", "rio-chat-toggle", "💬"); // speech balloon
    toggle.id = "rio-chat-toggle";
    toggle.setAttribute("aria-label", "Open docs chat assistant");

    var panel = el("div", "rio-chat-panel");
    panel.id = "rio-chat-panel";

    var header = el("div", "rio-chat-header");
    header.appendChild(el("span", null, "Docs Assistant"));
    var closeBtn = el("button", null, "✕");
    closeBtn.setAttribute("aria-label", "Close chat");
    header.appendChild(closeBtn);

    var messages = el("div", "rio-chat-messages");
    messages.id = "rio-chat-messages";

    var inputRow = el("div", "rio-chat-input");
    var textarea = document.createElement("textarea");
    textarea.rows = 1;
    textarea.placeholder = "Ask about the docs...";
    var sendBtn = el("button", null, "Send");
    inputRow.appendChild(textarea);
    inputRow.appendChild(sendBtn);

    panel.appendChild(header);
    panel.appendChild(messages);
    panel.appendChild(inputRow);

    document.body.appendChild(toggle);
    document.body.appendChild(panel);

    function addMessage(role, text, sources) {
      var msg = el("div", "rio-chat-msg " + role, text);
      if (sources && sources.length) {
        appendSources(msg, sources);
      }
      messages.appendChild(msg);
      messages.scrollTop = messages.scrollHeight;
      return msg;
    }

    function appendSources(msg, sources) {
      var srcWrap = el("div", "rio-sources");
      sources.forEach(function (s) {
        var a = document.createElement("a");
        a.href = s.url;
        a.textContent = "→ " + (s.title || s.url);
        a.target = "_blank";
        a.rel = "noopener";
        srcWrap.appendChild(a);
      });
      msg.appendChild(srcWrap);
    }

    var greeted = false;
    function openPanel() {
      panel.classList.add("open");
      if (!greeted) {
        addMessage("bot", "Hi! Ask me anything about the Realio Network docs.");
        greeted = true;
      }
      textarea.focus();
    }
    function closePanel() {
      panel.classList.remove("open");
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
        var botMsg = null;
        var typing = el("div", "rio-chat-typing", "Thinking...");
        messages.appendChild(typing);
        messages.scrollTop = messages.scrollHeight;

        function ensureBotMsg() {
          if (!botMsg) {
            typing.remove();
            botMsg = el("div", "rio-chat-msg bot", "");
            messages.appendChild(botMsg);
          }
          return botMsg;
        }

        function handleEvent(evt) {
          if (evt.type === "sources") {
            // held until "done" so they land after the final text
            return;
          }
          if (evt.type === "token") {
            ensureBotMsg().textContent += evt.text;
            messages.scrollTop = messages.scrollHeight;
          } else if (evt.type === "error") {
            typing.remove();
            addMessage("bot", evt.error || "Something went wrong. Try again.");
          } else if (evt.type === "done") {
            var msg = ensureBotMsg();
            if (evt.sources && evt.sources.length) {
              appendSources(msg, evt.sources);
            }
            messages.scrollTop = messages.scrollHeight;
          }
        }

        function pump() {
          return reader.read().then(function (result) {
            if (result.done) {
              typing.remove();
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
      addMessage("user", text);
      textarea.value = "";
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
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
