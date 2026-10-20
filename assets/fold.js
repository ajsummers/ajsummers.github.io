// Turns each h2-h4 in a write-up into a button that folds its section.
// Without JavaScript the page simply shows everything.
(function () {
  var root = document.querySelector(".writeup");
  if (!root) return;

  var count = 0;

  function level(el) {
    var m = /^H([2-4])$/.exec(el.tagName);
    return m ? Number(m[1]) : 0;
  }

  function setOpen(btn, body, open) {
    btn.setAttribute("aria-expanded", String(open));
    body.hidden = !open;
  }

  function makeToggle(heading, body) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "fold-toggle";
    btn.setAttribute("aria-expanded", "true");
    btn.setAttribute("aria-controls", body.id);
    while (heading.firstChild) btn.appendChild(heading.firstChild);
    heading.appendChild(btn);
    btn.addEventListener("click", function () {
      setOpen(btn, body, btn.getAttribute("aria-expanded") !== "true");
    });
  }

  // Move everything after a heading, up to the next heading of the same or
  // higher level, into a body element, then do the same for subheadings.
  function wrap(container, lvl) {
    var children = Array.prototype.slice.call(container.children);
    children.forEach(function (heading) {
      if (level(heading) !== lvl) return;
      var body = document.createElement("div");
      body.className = "fold-body";
      body.id = (heading.id || "section-" + count) + "-body";
      count += 1;
      var next = heading.nextElementSibling;
      while (next && !(level(next) && level(next) <= lvl)) {
        var after = next.nextElementSibling;
        body.appendChild(next);
        next = after;
      }
      heading.after(body);
      makeToggle(heading, body);
      if (lvl < 4) wrap(body, lvl + 1);
    });
  }

  // Code blocks marked {: .fold-code} get a clickable bar that folds them.
  // Adding .folded starts them folded; data-label="..." sets the bar text.
  var languages = { c: "C", cpp: "C++", python: "Python", py: "Python", bash: "Shell", sh: "Shell" };
  root.querySelectorAll(".highlighter-rouge.fold-code").forEach(function (block) {
    var details = document.createElement("details");
    details.className = "code-fold";
    details.open = !block.classList.contains("folded");

    var lang = (/language-(\w+)/.exec(block.className) || [])[1];
    var label = document.createElement("span");
    label.className = "code-fold-label";
    label.textContent = block.getAttribute("data-label") ||
      (lang ? (languages[lang] || lang) + " code" : "Code");

    var code = block.querySelector("code");
    var lines = code ? code.textContent.replace(/\n$/, "").split("\n").length : 0;
    var count = document.createElement("span");
    count.className = "code-fold-lines";
    count.textContent = lines + (lines === 1 ? " line" : " lines");

    var summary = document.createElement("summary");
    summary.append(label, count);
    block.before(details);
    details.append(summary, block);
  });

  wrap(root, 2);

  var toggles = root.querySelectorAll(".fold-toggle");
  if (!toggles.length) return;

  function bodyFor(btn) {
    return document.getElementById(btn.getAttribute("aria-controls"));
  }

  // Expand all / Collapse all, placed under the table of contents.
  var controls = document.createElement("div");
  controls.className = "fold-controls";
  [["Expand all", true], ["Collapse all", false]].forEach(function (item) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "fold-all";
    btn.textContent = item[0];
    btn.addEventListener("click", function () {
      toggles.forEach(function (t) { setOpen(t, bodyFor(t), item[1]); });
    });
    controls.appendChild(btn);
  });
  var toc = document.getElementById("markdown-toc");
  if (toc) toc.after(controls);
  else toggles[0].closest("h2, h3, h4").before(controls);

  // Opening a link to a heading inside a folded section unfolds it first.
  function reveal() {
    var id = decodeURIComponent(location.hash.slice(1));
    var target = id && document.getElementById(id);
    if (!target) return;
    var changed = false;
    var own = target.querySelector(".fold-toggle");
    if (own && own.getAttribute("aria-expanded") === "false") {
      setOpen(own, bodyFor(own), true);
      changed = true;
    }
    for (var p = target.parentElement; p && p !== root; p = p.parentElement) {
      if (p.classList.contains("fold-body") && p.hidden) {
        setOpen(p.previousElementSibling.querySelector(".fold-toggle"), p, true);
        changed = true;
      }
    }
    if (changed) target.scrollIntoView();
  }

  window.addEventListener("hashchange", reveal);
  // Clicking a link to the hash already in the URL doesn't fire hashchange.
  document.addEventListener("click", function (event) {
    var link = event.target.closest('a[href^="#"]');
    if (link) setTimeout(reveal);
  });
  reveal();
})();
