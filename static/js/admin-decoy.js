(function () {
    const loginContainer = document.getElementById("login-container");
    const terminalScreen = document.getElementById("terminal-screen");
    const triggerButton = document.getElementById("fake-login-btn");

    if (!loginContainer || !terminalScreen || !triggerButton) {
        return;
    }

    let isHacking = false;

    function sleep(milliseconds) {
        return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
    }

    function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, function (character) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[character];
        });
    }

    function shortBrowserName() {
        const uaData = navigator.userAgentData;

        if (uaData && Array.isArray(uaData.brands) && uaData.brands.length > 0) {
            const filteredBrands = uaData.brands
                .filter(function (brand) {
                    return !/Not/.test(brand.brand);
                })
                .map(function (brand) {
                    return brand.brand;
                });

            if (filteredBrands.length > 0) {
                return filteredBrands.join(" / ");
            }
        }

        const ua = navigator.userAgent;

        if (/Edg\//.test(ua)) return "Microsoft Edge";
        if (/OPR\//.test(ua)) return "Opera";
        if (/Chrome\//.test(ua)) return "Google Chrome";
        if (/Firefox\//.test(ua)) return "Mozilla Firefox";
        if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) return "Safari";

        return "Unknown browser";
    }

    function hashSignature(input) {
        let hash = 2166136261;

        for (let index = 0; index < input.length; index += 1) {
            hash ^= input.charCodeAt(index);
            hash = Math.imul(hash, 16777619);
        }

        return ("0000000" + (hash >>> 0).toString(16)).slice(-8).toUpperCase();
    }

    function resolveReferrer() {
        if (!document.referrer) {
            return "direct";
        }

        try {
            return new URL(document.referrer).hostname;
        } catch (error) {
            return document.referrer;
        }
    }

    function collectClientIntel() {
        const screenInfo = window.screen || {};
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown";
        const viewport = window.innerWidth + "×" + window.innerHeight;
        const display = (screenInfo.width || "?") + "×" + (screenInfo.height || "?");
        const language = (navigator.languages && navigator.languages.length > 0)
            ? navigator.languages.slice(0, 2).join(", ")
            : (navigator.language || "Unknown");
        const memory = typeof navigator.deviceMemory === "number"
            ? navigator.deviceMemory + " GB (est.)"
            : "Unknown";
        const cpu = navigator.hardwareConcurrency
            ? navigator.hardwareConcurrency + " logical cores"
            : "Unknown";
        const connection = navigator.connection
            ? [navigator.connection.effectiveType, navigator.connection.downlink ? navigator.connection.downlink + " Mb/s" : null]
                .filter(Boolean)
                .join(" · ")
            : "Unknown";
        const touchPoints = navigator.maxTouchPoints
            ? navigator.maxTouchPoints + " touch point" + (navigator.maxTouchPoints === 1 ? "" : "s")
            : "none";
        const doNotTrack = navigator.doNotTrack === "1" || window.doNotTrack === "1" ? "enabled" : "disabled";
        const timeString = new Date().toLocaleString();
        const sessionSignature = hashSignature([
            navigator.userAgent,
            language,
            viewport,
            display,
            timezone,
            window.location.pathname
        ].join("|"));

        return [
            { label: "Requested path", value: window.location.pathname || "/" },
            { label: "Browser", value: shortBrowserName() },
            { label: "Platform", value: navigator.userAgentData && navigator.userAgentData.platform ? navigator.userAgentData.platform : (navigator.platform || "Unknown") },
            { label: "Language", value: language },
            { label: "Timezone", value: timezone },
            { label: "Viewport", value: viewport },
            { label: "Display", value: display },
            { label: "CPU", value: cpu },
            { label: "Memory", value: memory },
            { label: "Connection", value: connection },
            { label: "Touch", value: touchPoints },
            { label: "Cookies", value: navigator.cookieEnabled ? "enabled" : "disabled" },
            { label: "Online", value: navigator.onLine ? "yes" : "no" },
            { label: "Do Not Track", value: doNotTrack },
            { label: "Color depth", value: screenInfo.colorDepth ? screenInfo.colorDepth + "-bit" : "Unknown" },
            { label: "Referrer", value: resolveReferrer() },
            { label: "Local time", value: timeString },
            { label: "Session hash", value: sessionSignature }
        ];
    }

    function intelMap(intel) {
        return intel.reduce(function (result, item) {
            result[item.label] = item.value;
            return result;
        }, {});
    }

    function terminalTemplate() {
        return [
            '<div class="terminal-shell">',
            '  <div class="terminal-header">',
            '    <div class="terminal-title-group">',
            '      <span class="terminal-badge">Active defense / decoy mode</span>',
            '      <h1 class="terminal-heading">Intrusion trap engaged</h1>',
            '      <p class="terminal-subheading">Runtime telemetry · local browser fingerprint · theatrical countermeasures</p>',
            '    </div>',
            '    <div class="terminal-status-bar">',
            '      <div class="status-chip">',
            '        <span class="status-chip-label">Threat level</span>',
            '        <span class="status-chip-value" data-alert-level>monitoring</span>',
            '      </div>',
            '      <div class="status-chip">',
            '        <span class="status-chip-label">Captured route</span>',
            '        <span class="status-chip-value" data-route></span>',
            '      </div>',
            '    </div>',
            '  </div>',
            '  <div class="terminal-grid">',
            '    <section class="terminal-console" aria-live="polite">',
            '      <div class="terminal-console-header">',
            '        <div class="terminal-window-controls"><span></span><span></span><span></span></div>',
            '        <span class="terminal-window-title">defense://countermeasures</span>',
            '      </div>',
            '      <div class="terminal-output" data-terminal-output></div>',
            '      <div class="terminal-command-line">',
            '        <span class="terminal-prompt">root@ernesto-es:~#</span>',
            '        <span class="terminal-live-command" data-live-command>awaiting input</span>',
            '        <span class="cursor" aria-hidden="true"></span>',
            '      </div>',
            '    </section>',
            '    <aside class="intel-panel">',
            '      <div class="intel-panel-header">',
            '        <span class="intel-panel-title">Observed client telemetry</span>',
            '      </div>',
            '      <p class="intel-summary">Nada sale de tu navegador, pero sí puedo enseñarte la huella básica que cualquier web ya ve cuando aterrizas aquí.</p>',
            '      <div class="intel-grid" data-intel-grid></div>',
            '      <div class="intel-footnote" data-footnote hidden>Tranqui: esto es una broma local para curiosos que aterrizan en rutas como <code>/wp-admin</code> o <code>/admin</code>. No se envía, guarda ni comparte nada.</div>',
            '    </aside>',
            '  </div>',
            '</div>'
        ].join("");
    }

    function scrollTerminal() {
        terminalScreen.scrollTop = terminalScreen.scrollHeight;
    }

    function renderIntel(intelGrid, intel) {
        intelGrid.innerHTML = intel.map(function (item) {
            return [
                '<article class="intel-card">',
                '  <span class="intel-card-label">' + escapeHtml(item.label) + '</span>',
                '  <span class="intel-card-value">' + escapeHtml(item.value) + '</span>',
                '</article>'
            ].join("");
        }).join("");
    }

    async function typeLine(output, liveCommand, step) {
        const line = document.createElement("div");
        const prefix = document.createElement("span");
        const content = document.createElement("span");

        line.className = "log-line";
        line.dataset.tone = step.tone || "info";
        prefix.className = "line-prefix";
        prefix.textContent = step.prefix || ">";
        content.className = "line-content";

        line.appendChild(prefix);
        line.appendChild(content);
        output.appendChild(line);

        liveCommand.textContent = step.command || "simulating...";
        scrollTerminal();

        const speed = step.speed || 20;

        for (const character of step.text) {
            content.textContent += character;
            scrollTerminal();
            await sleep(speed + Math.random() * 14);
        }

        await sleep(step.pause || 260);
    }

    function buildScript(intelLookup) {
        return [
            {
                command: "init --active-defense --route " + (window.location.pathname || "/"),
                text: "Initiating active defense protocol...",
                tone: "warning"
            },
            {
                command: "fingerprint --browser --platform --locale",
                text: "Analyzing attacker fingerprint: " + intelLookup.Browser + " on " + intelLookup.Platform + ".",
                tone: "info"
            },
            {
                command: "route map --requested-path",
                text: "Requested vector captured: " + intelLookup["Requested path"] + " · referrer " + intelLookup.Referrer + ".",
                tone: "info"
            },
            {
                command: "telemetry lock --viewport --display --timezone",
                text: "Viewport " + intelLookup.Viewport + " · display " + intelLookup.Display + " · timezone " + intelLookup.Timezone + ".",
                tone: "success"
            },
            {
                command: "profile --hardware --connection",
                text: "Hardware profile correlated: " + intelLookup.CPU + ", " + intelLookup.Memory + ", " + intelLookup.Connection + ".",
                tone: "success"
            },
            {
                command: "hash --session --entropy",
                text: "Session signature indexed: " + intelLookup["Session hash"] + ".",
                tone: "warning"
            },
            {
                command: "classify --operator --confidence 0.97",
                text: "Probable operator profile: curious human, medium caffeine, low chance of finding a real admin panel here.",
                tone: "danger"
            },
            {
                command: "deploy --countermeasure --mode theater",
                text: "Countermeasure ready: dramatic terminal effects, blinking cursor and mild existential discomfort.",
                tone: "danger"
            },
            {
                command: "echo 'nice try'",
                text: "Nice try. This admin panel is fake, the scare is local, and nothing left your browser. Have a great day. ;)",
                tone: "final",
                pause: 0
            }
        ];
    }

    function moveBox() {
        if (isHacking) {
            return;
        }

        const boxWidth = loginContainer.offsetWidth;
        const boxHeight = loginContainer.offsetHeight;
        const maxLeft = Math.max(window.innerWidth - boxWidth, 0);
        const maxTop = Math.max(window.innerHeight - boxHeight, 0);
        const randomLeft = Math.floor(Math.random() * (maxLeft + 1));
        const randomTop = Math.floor(Math.random() * (maxTop + 1));

        loginContainer.style.transform = "none";
        loginContainer.style.left = randomLeft + "px";
        loginContainer.style.top = randomTop + "px";
    }

    async function startTerminal() {
        if (isHacking) {
            return;
        }

        isHacking = true;
        loginContainer.style.display = "none";
        terminalScreen.style.display = "block";
        terminalScreen.innerHTML = terminalTemplate();
        document.body.classList.add("decoy-terminal-open");

        const output = terminalScreen.querySelector("[data-terminal-output]");
        const liveCommand = terminalScreen.querySelector("[data-live-command]");
        const intelGrid = terminalScreen.querySelector("[data-intel-grid]");
        const alertLevel = terminalScreen.querySelector("[data-alert-level]");
        const route = terminalScreen.querySelector("[data-route]");
        const footnote = terminalScreen.querySelector("[data-footnote]");
        const intel = collectClientIntel();
        const lookup = intelMap(intel);

        route.textContent = window.location.pathname || "/";
        renderIntel(intelGrid, intel);

        for (const step of buildScript(lookup)) {
            await typeLine(output, liveCommand, step);
        }

        alertLevel.textContent = "parody / local-only";
        liveCommand.textContent = "idle";
        footnote.hidden = false;
        scrollTerminal();
    }

    loginContainer.addEventListener("mouseenter", moveBox);
    loginContainer.addEventListener("touchstart", moveBox, { passive: true });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !isHacking) {
            event.preventDefault();
            startTerminal();
        }
    });

    triggerButton.addEventListener("click", startTerminal);
}());
