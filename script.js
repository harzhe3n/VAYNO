(() => {
    "use strict";

    // ---- Languages ----
    // English, Arabic and Kurdish (Sorani), from i18n.js. Text written in
    // index.html carries data-i18n keys; text built in this file goes through
    // t(). The brand name VAYNO is never translated.
    const I18N = window.VAYNO_I18N || { languages: { en: { label: "EN", dir: "ltr" } }, strings: {}, content: {} };
    const LANG_KEY = "vayno-lang";
    let lang = "en";
    const isRTL = () => document.documentElement.dir === "rtl";
    const t = (key, vars) => {
        const entry = I18N.strings[key];
        let text = entry ? (entry[lang] ?? entry.en ?? "") : key;
        if (vars) text = text.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? String(vars[name]) : match));
        return text;
    };
    // Demo projects from data/site-content.json are translated by their English
    // wording; anything else in that file is shown as written.
    const tc = (text) => (lang !== "en" && I18N.content?.[text]?.[lang]) || text;

    function initLanguage() {
        const root = document.documentElement;
        const switcher = document.querySelector(".lang-switch");
        const description = document.querySelector('meta[name="description"]');
        // The English already in the page is kept, so switching back restores it exactly.
        const originals = new WeakMap();
        const remember = (element) => {
            if (!originals.has(element)) {
                const attrs = {};
                (element.dataset.i18nAttr || "").split(",").forEach((pair) => {
                    const name = pair.split(":")[0];
                    if (name) attrs[name] = element.getAttribute(name) ?? "";
                });
                originals.set(element, { text: element.textContent, html: element.innerHTML, attrs });
            }
            return originals.get(element);
        };
        const pick = (key, english) => (lang === "en" ? english : (I18N.strings[key]?.[lang] ?? english));

        const apply = (code) => {
            lang = I18N.languages[code] ? code : "en";
            root.lang = lang;
            root.dir = I18N.languages[lang].dir || "ltr";
            document.querySelectorAll("[data-i18n]").forEach((element) => {
                element.textContent = pick(element.dataset.i18n, remember(element).text);
            });
            document.querySelectorAll("[data-i18n-html]").forEach((element) => {
                // Only ever trusted markup from i18n.js or the page itself.
                element.innerHTML = pick(element.dataset.i18nHtml, remember(element).html);
            });
            document.querySelectorAll("[data-i18n-attr]").forEach((element) => {
                const saved = remember(element);
                element.dataset.i18nAttr.split(",").forEach((pair) => {
                    const [name, key] = pair.split(":");
                    if (name && key) element.setAttribute(name, pick(key, saved.attrs[name]));
                });
            });
            document.title = t("meta.title");
            description?.setAttribute("content", t("meta.description"));
            switcher?.querySelectorAll("[data-lang]").forEach((button) => {
                button.setAttribute("aria-pressed", String(button.dataset.lang === lang));
            });
            try { window.localStorage.setItem(LANG_KEY, lang); } catch { /* private mode */ }
            document.dispatchEvent(new CustomEvent("vayno:lang", { detail: { lang } }));
        };

        // The page fades out, changes language (and direction), and fades back in.
        const change = (code) => {
            if (code === lang || !I18N.languages[code]) return;
            if (reducedMotion.matches) {
                apply(code);
                return;
            }
            root.classList.add("is-switching-lang");
            window.setTimeout(() => {
                apply(code);
                window.requestAnimationFrame(() => window.requestAnimationFrame(() => root.classList.remove("is-switching-lang")));
            }, 280);
        };
        switcher?.addEventListener("click", (event) => {
            const button = event.target instanceof Element ? event.target.closest("[data-lang]") : null;
            if (button) change(button.dataset.lang);
        });

        // A saved choice wins; otherwise the browser's own language preference.
        let initial = "";
        try { initial = window.localStorage.getItem(LANG_KEY) || ""; } catch { initial = ""; }
        if (!I18N.languages[initial]) {
            initial = "en";
            for (const preference of navigator.languages || [navigator.language || "en"]) {
                const value = String(preference).toLowerCase();
                if (value.startsWith("ckb") || value.startsWith("ku")) { initial = "ckb"; break; }
                if (value.startsWith("ar")) { initial = "ar"; break; }
                if (value.startsWith("en")) break;
            }
        }
        apply(initial);
    }

    function safeExternalUrl(value) {
        if (typeof value !== "string" || !value.trim()) return "";
        if (/^\/assets\/[a-zA-Z0-9._/-]+$/.test(value) && !value.split("/").includes("..")) return value;
        try {
            const url = new URL(value);
            return url.protocol === "https:" && !url.username && !url.password ? url.href : "";
        } catch {
            return "";
        }
    }

    function initNavigation() {
        const nav = document.querySelector(".navbar");
        const toggle = document.querySelector(".nav-toggle");
        const menu = document.querySelector(".nav-menu");
        const setMenuOpen = (isOpen) => {
            toggle.setAttribute("aria-expanded", String(isOpen));
            toggle.setAttribute("aria-label", isOpen ? t("nav.close") : t("nav.open"));
            menu.classList.toggle("open", isOpen);
        };
        const updateNav = () => nav.classList.toggle("scrolled", window.scrollY > 18);
        updateNav();
        toggle.setAttribute("aria-label", t("nav.open"));
        document.addEventListener("vayno:lang", () => setMenuOpen(toggle.getAttribute("aria-expanded") === "true"));
        window.addEventListener("scroll", updateNav, { passive: true });
        toggle.addEventListener("click", () => {
            const isOpen = toggle.getAttribute("aria-expanded") === "true";
            setMenuOpen(!isOpen);
        });
        menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
            setMenuOpen(false);
        }));
        document.addEventListener("keydown", (event) => {
            if (event.key !== "Escape" || toggle.getAttribute("aria-expanded") !== "true") return;
            setMenuOpen(false);
            toggle.focus();
        });
        document.addEventListener("click", (event) => {
            if (toggle.getAttribute("aria-expanded") === "true" && !nav.contains(event.target)) {
                setMenuOpen(false);
            }
        });
        window.addEventListener("resize", () => {
            if (window.innerWidth > 800 && toggle.getAttribute("aria-expanded") === "true") {
                setMenuOpen(false);
            }
        }, { passive: true });
    }

    const PANEL_LABELS = ["Home", "Projects", "Services", "About", "Contact"];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Phones and tablets get a lighter version of the heavy effects.
    const touchDevice = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    const SLIDE_MS = 1100;
    // Shared by the slider and the reveal animations: when the slide that is
    // currently gliding in will land, so its content can time its entrance.
    const journeyState = { settlesAt: 0 };

    // ---- Reveal animations ----
    // Text and cards blur up into place as they come into view, and replay each
    // time their slide is visited. Outer elements are listed first so a card
    // and the eyebrow inside it never both animate.
    const REVEAL_RULES = [
        [".project-card", "scale"],
        [".service-card, .brand-values article, .member-card", "up"],
        [".brand-values-heading, .contact-methods, .project-inquiry", "up"],
        [".section-title, .introduction h2", "words"],
        [".hero-kicker, .hero-title, .hero-lede, .hero-actions, .eyebrow, .services-note, .project-controls", "up"],
        [".contact-orbit", "fade"]
    ];

    // Wraps each word in a span so headings can rise word by word. Nested
    // markup such as <em> and <br> is kept as it is.
    function splitWords(element) {
        let count = 0;
        const walk = (node) => {
            Array.from(node.childNodes).forEach((child) => {
                if (child.nodeType === Node.TEXT_NODE) {
                    const fragment = document.createDocumentFragment();
                    child.textContent.split(/(\s+)/).forEach((part) => {
                        if (!part) return;
                        if (/^\s+$/.test(part)) {
                            fragment.append(document.createTextNode(part));
                            return;
                        }
                        const word = document.createElement("span");
                        word.className = "rw";
                        word.style.setProperty("--wi", String(count));
                        count += 1;
                        word.textContent = part;
                        fragment.append(word);
                    });
                    child.replaceWith(fragment);
                } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== "BR") {
                    walk(child);
                }
            });
        };
        walk(element);
    }

    function createReveal() {
        if (reducedMotion.matches || !("IntersectionObserver" in window)) return { scan: () => {}, release: () => {} };
        document.documentElement.classList.add("js-reveal");
        // While the loading screen is up, visible elements wait here and play
        // together as it opens.
        let ready = !document.documentElement.classList.contains("is-loading");
        const waiting = new Set();

        const enter = (elements, base = 0) => {
            if (!elements.length) return;
            elements.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
            elements.forEach((element, index) => {
                element.style.setProperty("--rd", `${Math.round(base + Math.min(index, 12) * 70)}ms`);
                element.classList.add("is-in");
            });
        };

        const observer = new IntersectionObserver((entries) => {
            const arriving = [];
            entries.forEach((entry) => {
                const element = entry.target;
                if (entry.isIntersecting) {
                    if (!ready) waiting.add(element);
                    else if (!element.classList.contains("is-in")) arriving.push(element);
                    return;
                }
                waiting.delete(element);
                // Reset only once its slide has gone, so it plays again next visit.
                const panel = element.closest(".journey-panel");
                if (panel && !panel.classList.contains("is-current")) element.classList.remove("is-in");
            });
            // A slide that is still gliding in starts its content just before it lands.
            enter(arriving, Math.max(0, journeyState.settlesAt - performance.now() - 820));
        }, { rootMargin: "0px 0px -4% 0px" });

        const release = (base = 0) => {
            if (ready) return;
            ready = true;
            enter(Array.from(waiting), base);
            waiting.clear();
        };

        // A new language replaces heading text, so split it into words again
        // and replay the current slide's entrance in the new language.
        document.addEventListener("vayno:lang", () => {
            document.querySelectorAll('[data-reveal="words"]').forEach((element) => {
                if (!element.querySelector(".rw")) splitWords(element);
            });
            if (!ready) return;
            const current = document.querySelector(".journey-panel.is-current");
            const shown = current ? Array.from(current.querySelectorAll("[data-reveal].is-in")) : [];
            shown.forEach((element) => element.classList.remove("is-in"));
            void document.body.offsetWidth;
            enter(shown, 60);
        });

        const scan = () => {
            REVEAL_RULES.forEach(([selector, type]) => {
                document.querySelectorAll(selector).forEach((element) => {
                    if (!element.closest(".horizontal-journey")) return;
                    if (element.closest("[data-reveal]") || element.querySelector("[data-reveal]")) return;
                    if (type === "words") splitWords(element);
                    element.dataset.reveal = type;
                    observer.observe(element);
                });
            });
        };
        return { scan, release };
    }

    // ---- Loading screen ----
    // The silver half of the V slides in from one side and the green half from
    // the other; they lock together, the name appears, and the screen opens
    // from the centre once the fonts are ready. Return
    // visits in the same session get a shorter version.
    function initLoader(onReady) {
        const root = document.documentElement;
        const loader = document.getElementById("loader");
        const open = () => {
            root.classList.remove("is-loading");
            root.classList.add("is-loaded");
        };
        if (!loader) {
            open();
            onReady();
            return;
        }
        let quick = false;
        try { quick = window.sessionStorage.getItem("vayno-intro") === "seen"; } catch { quick = false; }
        if (quick) loader.classList.add("is-quick");
        const minTime = reducedMotion.matches ? 350 : quick ? 1150 : 2900;
        const started = performance.now();

        const fontsReady = document.fonts ? document.fonts.ready.catch(() => {}) : Promise.resolve();
        const giveUp = new Promise((resolve) => window.setTimeout(resolve, 6500));

        Promise.race([fontsReady, giveUp]).then(() => {
            loader.classList.add("is-ready");
            window.setTimeout(() => {
                try { window.sessionStorage.setItem("vayno-intro", "seen"); } catch { /* private mode */ }
                loader.classList.add("is-done");
                open();
                window.setTimeout(onReady, reducedMotion.matches ? 0 : 280);
                window.setTimeout(() => loader.remove(), reducedMotion.matches ? 450 : 1800);
            }, Math.max(0, minTime - (performance.now() - started)));
        });
    }

    // ---- Buttons ----
    // Each button label sits in a clipping frame and carries a copy of itself
    // as a text shadow just below, so on hover it rolls up and is replaced.
    // Labels set by i18n or rebuilt cards keep working: only the frame is new.
    const ROLL_SELECTOR = ".hero-start, .hero-link, .project-open, .submit-btn, .whatsapp-btn, .email-btn, .team-portfolio";
    function rollLabels() {
        document.querySelectorAll(ROLL_SELECTOR).forEach((button) => {
            if (button.querySelector(".btn-roll")) return;
            let label = Array.from(button.children).find((child) => child.tagName === "SPAN");
            if (!label) {
                const text = Array.from(button.childNodes).find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
                if (!text) return;
                label = document.createElement("span");
                label.textContent = text.textContent.trim();
                text.replaceWith(label);
            }
            const roll = document.createElement("span");
            roll.className = "btn-roll";
            label.replaceWith(roll);
            roll.append(label);
        });
    }

    // ---- Cards ----
    // Every card gets a soft light that follows the pointer and a thin glowing
    // edge that travels around it; the smaller cards also tilt toward the pointer.
    const CARD_SELECTOR = ".service-card, .project-card, .member-card, .brand-values article, .project-inquiry";
    const TILT_SELECTOR = ".service-card, .project-card, .member-card";
    function decorateCards() {
        document.querySelectorAll(CARD_SELECTOR).forEach((card) => {
            if (card.classList.contains("lux-card")) return;
            card.classList.add("lux-card");
            if (card.matches(TILT_SELECTOR)) card.classList.add("lux-tilt");
            const glow = document.createElement("span");
            glow.className = "lux-glow";
            glow.setAttribute("aria-hidden", "true");
            const edge = document.createElement("span");
            edge.className = "lux-border";
            edge.setAttribute("aria-hidden", "true");
            card.prepend(glow, edge);
        });
    }
    function initCardEffects() {
        if (reducedMotion.matches || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
        let active = null;
        const reset = (card) => {
            card.classList.remove("is-pointer");
            card.style.removeProperty("--tilt-x");
            card.style.removeProperty("--tilt-y");
        };
        document.addEventListener("pointermove", (event) => {
            if (event.pointerType !== "mouse") return;
            const card = event.target instanceof Element ? event.target.closest(".lux-card") : null;
            if (active && active !== card) reset(active);
            active = card;
            if (!card) return;
            const box = card.getBoundingClientRect();
            const x = Math.min(Math.max((event.clientX - box.left) / box.width, 0), 1);
            const y = Math.min(Math.max((event.clientY - box.top) / box.height, 0), 1);
            card.classList.add("is-pointer");
            card.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
            card.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
            if (card.classList.contains("lux-tilt")) {
                card.style.setProperty("--tilt-x", `${((.5 - y) * 7).toFixed(2)}deg`);
                card.style.setProperty("--tilt-y", `${((x - .5) * 9).toFixed(2)}deg`);
            }
        }, { passive: true });
        document.addEventListener("mouseout", (event) => {
            if (!event.relatedTarget && active) {
                reset(active);
                active = null;
            }
        });
    }

    // ---- Slide journey ----
    // One slide fills the screen. The wheel, trackpad, arrow keys, swipes and
    // in-page links all move one slide at a time; the CSS turns each move into
    // a "depth" transition (the slides shrink into cards, glide, and settle).
    function initHorizontalJourney() {
        const journey = document.querySelector(".horizontal-journey");
        const track = journey?.querySelector(".journey-track");
        if (!journey || !track) return;
        const panels = Array.from(track.children).filter((node) => node.classList.contains("journey-panel"));
        if (!panels.length) return;

        const navbar = document.querySelector(".navbar");
        const navContainer = document.querySelector(".nav-container");
        const navLinks = Array.from(document.querySelectorAll(".nav-menu a[href^='#']"));
        const counter = document.querySelector(".nav-counter-num");
        const counterTotal = document.querySelector(".nav-counter-total");
        let index = 0;
        let moving = false;
        let settleTimer = 0;

        journey.classList.add("is-slider");
        panels.forEach((panel) => {
            if (!panel.hasAttribute("tabindex")) panel.tabIndex = -1;
        });
        if (counterTotal) counterTotal.textContent = `/ ${String(panels.length).padStart(2, "0")}`;

        // A pill slides behind the active nav link.
        const indicator = document.createElement("span");
        indicator.className = "nav-indicator";
        indicator.setAttribute("aria-hidden", "true");
        navContainer?.append(indicator);
        const placeIndicator = () => {
            const link = navLinks.find((item) => item.getAttribute("aria-current") === "true");
            if (!link || !navContainer || !link.offsetWidth) {
                indicator.classList.remove("is-ready");
                return;
            }
            const box = link.getBoundingClientRect();
            const base = navContainer.getBoundingClientRect();
            indicator.style.setProperty("--ind-x", `${(box.left - base.left - 13).toFixed(1)}px`);
            indicator.style.setProperty("--ind-w", `${(box.width + 26).toFixed(1)}px`);
            indicator.classList.add("is-ready");
        };

        // The slide number in the navbar rolls up (or down) to the new value.
        const rollCounter = (direction) => {
            if (!counter) return;
            const text = String(index + 1).padStart(2, "0");
            const current = counter.querySelector("span:not(.is-leaving)");
            if (current?.textContent === text) return;
            counter.style.setProperty("--roll", String(direction));
            counter.querySelectorAll(".is-leaving").forEach((node) => node.remove());
            const next = document.createElement("span");
            next.textContent = text;
            if (current) {
                if (reducedMotion.matches) {
                    current.remove();
                } else {
                    current.classList.remove("is-entering");
                    current.classList.add("is-leaving");
                    window.setTimeout(() => current.remove(), 800);
                    next.classList.add("is-entering");
                }
            }
            counter.append(next);
        };

        const markCurrent = (from) => {
            panels.forEach((panel, position) => panel.classList.toggle("is-current", position === index));
            navLinks.forEach((link) => {
                const target = document.getElementById(link.hash.slice(1));
                if (target && target.closest(".journey-panel") === panels[index]) link.setAttribute("aria-current", "true");
                else link.removeAttribute("aria-current");
            });
            placeIndicator();
            navbar?.style.setProperty("--journey-progress", ((index + 1) / panels.length).toFixed(3));
            rollCounter(index >= from ? 1 : -1);
            if (from !== index) {
                document.dispatchEvent(new CustomEvent("vayno:slide", { detail: { index, from, label: PANEL_LABELS[index] || "" } }));
            }
        };

        // The footer sits below the slides; any move brings the slides back into view.
        const syncWindow = (smooth) => {
            const top = journey.getBoundingClientRect().top + window.scrollY;
            if (Math.abs(window.scrollY - top) > 1) window.scrollTo({ top, behavior: smooth ? "smooth" : "auto" });
        };

        // ---- The turn ----
        // The old slide turns away in 3D and slides off while the next one
        // turns in from the side it comes from. Both blur sideways as they
        // move fastest, like a camera following them; the timing matches the
        // background.
        const curve = (() => {
            const blur = document.querySelector("#motion-blur feGaussianBlur");
            const ease = (t) => (t < .5 ? 8 * t ** 4 : 1 - 8 * (t - 1) ** 4);
            let frame = 0;
            let active = null;
            const finish = () => {
                window.cancelAnimationFrame(frame);
                frame = 0;
                if (!active) return;
                [active.incoming, active.outgoing].forEach((panel) => {
                    panel.style.transform = "";
                    panel.style.opacity = "";
                    panel.style.filter = "";
                });
                active.outgoing.classList.remove("is-leaving");
                blur?.setAttribute("stdDeviation", "0 0");
                active = null;
            };
            const run = (outgoing, incoming, fromRight) => {
                finish();
                const dir = fromRight ? 1 : -1;
                active = { outgoing, incoming };
                outgoing.classList.add("is-leaving");
                if (blur && !touchDevice) [outgoing, incoming].forEach((panel) => { panel.style.filter = "url(#motion-blur)"; });
                const began = performance.now();
                const step = (now) => {
                    const t = Math.min(1, (now - began) / SLIDE_MS);
                    const e = ease(t);
                    const speed = Math.sin(Math.PI * t) ** 2;
                    blur?.setAttribute("stdDeviation", `${(speed * 16).toFixed(1)} 0`);
                    outgoing.style.transform = `perspective(1800px) translateX(${(-dir * e * 55).toFixed(2)}%) rotateY(${(dir * e * 38).toFixed(2)}deg) scale(${(1 - e * .12).toFixed(3)})`;
                    outgoing.style.opacity = (1 - e).toFixed(3);
                    incoming.style.transform = `perspective(1800px) translateX(${(dir * (1 - e) * 55).toFixed(2)}%) rotateY(${(-dir * (1 - e) * 38).toFixed(2)}deg) scale(${(.88 + e * .12).toFixed(3)})`;
                    incoming.style.opacity = Math.min(1, e * 1.4).toFixed(3);
                    if (t < 1) frame = window.requestAnimationFrame(step);
                    else finish();
                };
                step(began);
            };
            return { run, finish };
        })();

        const goTo = (next, { instant = false, enter = "keep" } = {}) => {
            const target = Math.max(0, Math.min(panels.length - 1, next));
            const fast = instant || reducedMotion.matches;
            syncWindow(!fast);
            const from = index;
            if (target === from) return false;
            index = target;
            const panel = panels[index];
            window.clearTimeout(settleTimer);
            curve.finish();
            // The old slide must never be hidden, even for a moment, before the
            // curve wipes it away: hiding it would restart its animations.
            if (!fast) panels[from].classList.add("is-leaving");
            // The new slide is shown from here on.
            markCurrent(from);
            // Going forward starts a long slide at its top; going back starts it
            // at its end, so reading flows naturally in both directions.
            if (enter === "edge") panel.scrollTop = index > from ? 0 : panel.scrollHeight;
            if (fast) {
                moving = false;
                journeyState.settlesAt = 0;
            } else {
                moving = true;
                journeyState.settlesAt = performance.now() + SLIDE_MS;
                // In Arabic and Kurdish the slides run right to left.
                curve.run(panels[from], panel, (index > from) !== isRTL());
                settleTimer = window.setTimeout(() => { moving = false; }, SLIDE_MS + 40);
            }
            return true;
        };

        const offsetWithin = (element, ancestor) => {
            let top = 0;
            for (let node = element; node && node !== ancestor; node = node.offsetParent) top += node.offsetTop;
            return top;
        };
        const goToTarget = (target, { instant = false } = {}) => {
            const panel = target.closest(".journey-panel");
            const next = panels.indexOf(panel);
            if (next < 0) return false;
            const changed = goTo(next, { instant });
            const top = target === panel ? 0 : offsetWithin(target, panel);
            panel.scrollTo({ top, behavior: changed || instant || reducedMotion.matches ? "auto" : "smooth" });
            return true;
        };

        const canScrollY = (element, direction) => {
            const overflow = getComputedStyle(element).overflowY;
            if (overflow !== "auto" && overflow !== "scroll") return false;
            // A slide that runs only a few pixels past the screen changes at
            // once rather than scrolling that little first.
            if (element.classList.contains("journey-panel") && element.scrollHeight - element.clientHeight < 48) return false;
            return direction > 0
                ? element.scrollTop + element.clientHeight < element.scrollHeight - 2
                : element.scrollTop > 2;
        };
        const canScrollX = (element, direction) => (direction > 0
            ? element.scrollLeft + element.clientWidth < element.scrollWidth - 2
            : element.scrollLeft > 2);
        // Anything between the pointer and the slide that can still scroll
        // vertically this way (the slide itself, a textarea…) gets the wheel first.
        const hasVerticalRoom = (start, direction) => {
            for (let node = start; node && node !== journey; node = node.parentElement) {
                if (canScrollY(node, direction)) return true;
                if (node.classList.contains("journey-panel")) break;
            }
            return false;
        };

        // ---- Wheel and trackpad ----
        // One gesture moves one slide. A pause, or a clearly harder push, starts
        // a new gesture; the fading tail of trackpad momentum never does.
        const wheel = { last: 0, lastSize: 0, sum: 0, spent: false };
        const loading = () => document.documentElement.classList.contains("is-loading");
        window.addEventListener("wheel", (event) => {
            if (event.ctrlKey) return;
            if (loading()) {
                event.preventDefault();
                return;
            }
            const target = event.target instanceof Element ? event.target : null;
            if (target?.closest(".assistant-panel, .footer, .nav-menu.open, .case-study")) return;
            const now = performance.now();
            const gap = now - wheel.last;
            wheel.last = now;
            const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
            let delta = horizontal ? event.deltaX : event.deltaY;
            if (event.deltaMode === 1) delta *= 32;
            else if (event.deltaMode === 2) delta *= journey.clientHeight;
            if (!delta) return;
            const direction = Math.sign(delta);
            const size = Math.abs(delta);
            if (gap > 220 || size > wheel.lastSize * 1.6 + 4) {
                wheel.spent = false;
                wheel.sum = 0;
            }
            wheel.lastSize = size;

            // The projects carousel scrolls sideways before the slide moves on.
            const carousel = target?.closest(".project-track-viewport");
            if (carousel && canScrollX(carousel, direction)) {
                if (!horizontal) {
                    event.preventDefault();
                    carousel.scrollBy({ left: delta, behavior: "auto" });
                }
                wheel.spent = true;
                return;
            }
            if (!horizontal) {
                // The footer sits below the slides. Coming back up from it, the
                // page scrolls first; the slides take over once they are in view.
                if (direction < 0 && journey.getBoundingClientRect().top < -1) {
                    event.preventDefault();
                    window.scrollBy({ top: delta, behavior: "auto" });
                    wheel.spent = true;
                    return;
                }
                if (target && journey.contains(target) && hasVerticalRoom(target, direction)) {
                    wheel.spent = true;
                    return;
                }
                // Past the end of the last slide, the page continues to the footer.
                if (direction > 0 && index === panels.length - 1) {
                    event.preventDefault();
                    window.scrollBy({ top: delta, behavior: "auto" });
                    wheel.spent = true;
                    return;
                }
            }
            event.preventDefault();
            if (moving || wheel.spent) return;
            // In Arabic and Kurdish the slides run right to left, so a sideways
            // swipe toward the right moves forward.
            const step = horizontal && isRTL() ? -direction : direction;
            wheel.sum += size * step;
            if (Math.abs(wheel.sum) < 28) return;
            wheel.sum = 0;
            wheel.spent = true;
            goTo(index + step, { enter: "edge" });
        }, { passive: false });

        // ---- Keyboard ----
        document.addEventListener("keydown", (event) => {
            if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || loading()) return;
            const target = event.target instanceof Element ? event.target : null;
            if (target?.closest("input, textarea, select, [contenteditable], .assistant-panel, .project-track-viewport, .case-study")) return;
            if (document.querySelector(".case-study[open]")) return;
            const key = event.key;
            if (key === " " && target?.closest("a, button, [role='button']")) return;
            if (key === "Home" || key === "End") {
                event.preventDefault();
                goTo(key === "Home" ? 0 : panels.length - 1, { enter: "top" });
                return;
            }
            const vertical = { ArrowDown: 1, PageDown: 1, " ": event.shiftKey ? -1 : 1, ArrowUp: -1, PageUp: -1 }[key];
            const sideways = ({ ArrowRight: 1, ArrowLeft: -1 }[key] || 0) * (isRTL() ? -1 : 1);
            const direction = vertical || sideways;
            if (!direction) return;
            const panel = panels[index];
            if (vertical && canScrollY(panel, vertical)) {
                event.preventDefault();
                const step = key.startsWith("Arrow") ? 90 : panel.clientHeight * .85;
                panel.scrollBy({ top: vertical * step, behavior: reducedMotion.matches ? "auto" : "smooth" });
                return;
            }
            event.preventDefault();
            if (moving) return;
            goTo(index + direction, { enter: "edge" });
        });

        // ---- Touch: a horizontal swipe moves one slide ----
        let touch = null;
        journey.addEventListener("touchstart", (event) => {
            if (event.touches.length !== 1) {
                touch = null;
                return;
            }
            const point = event.touches[0];
            const target = event.target instanceof Element ? event.target : null;
            const carousel = target?.closest(".project-track-viewport") || null;
            touch = {
                x: point.clientX,
                y: point.clientY,
                carousel,
                left: carousel ? carousel.scrollLeft : 0,
                skip: Boolean(target?.closest(".scratch-overlay, input, textarea, select"))
            };
        }, { passive: true });
        journey.addEventListener("touchend", (event) => {
            const start = touch;
            touch = null;
            if (!start || start.skip || moving) return;
            const point = event.changedTouches[0];
            const dx = point.clientX - start.x;
            const dy = point.clientY - start.y;
            if (Math.abs(dx) < 46 || Math.abs(dx) < Math.abs(dy) * 1.25) return;
            // The projects carousel always scrolls left to right; the slides
            // follow the reading direction.
            const scrollDirection = dx < 0 ? 1 : -1;
            if (start.carousel && (Math.abs(start.carousel.scrollLeft - start.left) > 2 || canScrollX(start.carousel, scrollDirection))) return;
            goTo(index + (isRTL() ? -scrollDirection : scrollDirection));
        }, { passive: true });
        journey.addEventListener("touchcancel", () => { touch = null; }, { passive: true });

        // ---- Links, history and focus ----
        document.addEventListener("click", (event) => {
            if (!(event.target instanceof Element)) return;
            const link = event.target.closest('a[href^="#"]');
            if (!link) return;
            const id = decodeURIComponent(link.hash.slice(1));
            const target = id ? document.getElementById(id) : null;
            if (!target || !journey.contains(target)) return;
            event.preventDefault();
            goToTarget(target);
            target.closest(".journey-panel")?.focus({ preventScroll: true });
            if (window.location.hash !== link.hash) window.history.pushState(null, "", link.hash);
        });
        window.addEventListener("popstate", () => {
            const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
            if (target && journey.contains(target)) goToTarget(target);
            else if (!window.location.hash) goTo(0);
        });
        // Tabbing into another slide brings that slide on screen.
        journey.addEventListener("focusin", (event) => {
            const panel = event.target instanceof Element ? event.target.closest(".journey-panel") : null;
            const next = panels.indexOf(panel);
            if (next >= 0 && next !== index) goTo(next);
            if (journey.scrollLeft) journey.scrollLeft = 0;
        });
        journey.addEventListener("scroll", () => {
            if (journey.scrollLeft) journey.scrollLeft = 0;
        }, { passive: true });
        window.addEventListener("resize", placeIndicator, { passive: true });
        document.fonts?.ready.then(placeIndicator);
        // Changing language can flip the reading direction: the nav pill re-measures.
        document.addEventListener("vayno:lang", () => {
            window.requestAnimationFrame(placeIndicator);
            document.fonts?.ready.then(placeIndicator);
        });

        markCurrent(0);
        if (window.location.hash) {
            const initialTarget = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
            if (initialTarget && journey.contains(initialTarget)) goToTarget(initialTarget, { instant: true });
        }
    }

    // ---- The guide robot's walk ----
    // The stage is the floor: it slides left and right while the figure faces
    // the way it is going and steps in time with the distance it covers.
    function initRobotWalker(companion, isPaused) {
        const walker = companion.querySelector(".robot-walker");
        const art = companion.querySelector(".hero-robot");
        if (!walker || !art) return null;

        const style = companion.style;
        const ROBOT_WIDTH = () => walker.offsetWidth || 120;
        const MIN_SPEED = 42;
        const MAX_SPEED = 92;
        const STEP = .34;
        let x = 0;
        let facing = 1;
        let walkTimer = 0;
        let stepTimer = 0;
        let walking = false;
        let bounds = { min: 16, max: 16 };

        const GAP = 24;
        // On-screen box of an element's text (a heading's box can be far wider than its words).
        const textBox = (element) => {
            const range = document.createRange();
            range.selectNodeContents(element);
            const box = range.getBoundingClientRect();
            return box.width ? box : element.getBoundingClientRect();
        };
        // Removes the blocked spans from the lane and returns the widest piece left.
        const widestLane = (lane, blocked) => blocked
            .reduce((lanes, [from, to]) => lanes.flatMap(([lo, hi]) => (to <= lo || from >= hi)
                ? [[lo, hi]]
                : [[lo, Math.min(hi, from)], [Math.max(lo, to), hi]].filter(([l, h]) => h >= l)), [lane])
            .reduce((best, piece) => (!best || piece[1] - piece[0] > best[1] - best[0] ? piece : best), null);

        const computeBounds = () => {
            // The robot patrols the far side of the screen from the hero text:
            // right of it in English, left of it in Arabic and Kurdish, where the
            // page reads from the right.
            const width = window.innerWidth;
            const robotWidth = ROBOT_WIDTH();
            const edge = Math.max(10, width * .03);
            let min = isRTL() ? Math.round(width * .22) : edge;
            let max = isRTL() ? width - edge - robotWidth : Math.round(width * .78) - robotWidth;
            if (max < min) max = min;

            // Keep to the far side of the "Explore our work" button when there is
            // room; on a narrow screen the button sits above the robot instead.
            const cta = document.querySelector(".hero-link")?.getBoundingClientRect();
            if (cta && cta.width && cta.right > 0 && cta.left < width) {
                if (isRTL() && cta.left - GAP - robotWidth >= min) max = Math.min(max, Math.round(cta.left - GAP - robotWidth));
                if (!isRTL() && cta.right + GAP <= max) min = Math.max(min, Math.round(cta.right + GAP));
            }

            // Neither the robot nor its speech bubble may cover, at their height,
            // the hero's words and orb, or a button, link or form field on the
            // slide that is showing (hidden slides measure nothing).
            const robotTop = walker.getBoundingClientRect().top;
            const hello = document.getElementById("robot-hello");
            const bubbleHeight = Math.max(44, hello ? hello.getBoundingClientRect().height : 0);
            const bubbleWidth = Math.min(232, width - 24);
            const bubbleTop = robotTop - bubbleHeight - 12;
            const controls = "a, button, input, select, textarea";
            const blocked = (withBubble) => [...document.querySelectorAll(`.hero-content > *, .hero-orb, .journey-panel:not(.hero) :is(${controls})`)].flatMap((element) => {
                const box = element.matches(controls) ? element.getBoundingClientRect() : textBox(element);
                if (!box.width || box.right < 0 || box.left > width) return [];
                const spans = [];
                if (box.bottom > robotTop) spans.push([box.left - GAP - robotWidth, box.right + GAP]);
                if (withBubble && box.bottom > bubbleTop && box.top < robotTop) {
                    spans.push([box.left - GAP - (robotWidth + bubbleWidth) / 2, box.right + GAP + (bubbleWidth - robotWidth) / 2]);
                }
                return spans;
            });
            const lane = widestLane([min, max], blocked(true)) || widestLane([min, max], blocked(false)) || [min, max];
            bounds = { min: Math.round(lane[0]), max: Math.round(lane[1]) };
        };
        const measure = () => {
            computeBounds();
            x = Math.min(Math.max(x, bounds.min), bounds.max);
            style.setProperty("--walker-x", `${Math.round(x)}px`);
        };

        const setFacing = (direction) => {
            facing = direction;
            walker.style.setProperty("--robot-facing", String(direction));
        };
        const setWalking = (state) => {
            walking = state;
            companion.classList.toggle("is-walking", state);
            if (!state) {
                companion.classList.remove("is-turning");
                style.removeProperty("--walk-time");
                style.removeProperty("--walk-step");
            }
        };
        // Stops the robot exactly where it is, even halfway across a walk.
        const freeze = () => {
            const transform = getComputedStyle(companion).transform;
            if (transform && transform !== "none") x = new DOMMatrixReadOnly(transform).m41;
            style.setProperty("--walk-time", "0s");
            style.setProperty("--walker-x", `${Math.round(x)}px`);
        };
        const restDelay = () => 1100 + Math.random() * 2600;

        // Walks to a new spot on the floor, then rests for a natural beat.
        // isPaused() keeps the robot planted while the guide is open.
        const planNextWalk = () => {
            window.clearTimeout(walkTimer);
            if (reducedMotion.matches || isPaused() || document.visibilityState === "hidden") {
                walkTimer = window.setTimeout(planNextWalk, 1600);
                return;
            }
            // Re-check the lane each time: fonts, entrance animations and slide
            // changes move things after the first measurement.
            computeBounds();
            const room = Math.max(0, bounds.max - bounds.min);
            // Standing outside the lane (the text moved): walk straight back into it.
            const outside = x < bounds.min - 1 || x > bounds.max + 1;
            if (!room && !outside) {
                walkTimer = window.setTimeout(planNextWalk, 3000);
                return;
            }
            const target = outside ? Math.min(Math.max(x, bounds.min), bounds.max) : bounds.min + Math.random() * room;
            if (!outside && Math.abs(target - x) < ROBOT_WIDTH() * .8) {
                walkTimer = window.setTimeout(planNextWalk, 1200 + Math.random() * 1800);
                return;
            }
            walkTo(target);
        };
        // Walks to a spot on the floor, then rests for a natural beat. A
        // hurried walk, out of the way of a new slide's buttons, is three
        // times as fast.
        const walkTo = (target, hurry = false) => {
            const distance = target - x;
            const travel = Math.abs(distance);
            const speed = hurry ? MAX_SPEED * 3 : MAX_SPEED - Math.min(MAX_SPEED - MIN_SPEED, travel * .06);
            const duration = travel / speed;
            const steps = Math.max(2, Math.round(duration / STEP));
            const start = () => {
                companion.classList.remove("is-turning");
                style.setProperty("--walk-time", `${duration.toFixed(2)}s`);
                style.setProperty("--walk-step", `${(duration / steps).toFixed(3)}s`);
                setWalking(true);
                x = target;
                style.setProperty("--walker-x", `${Math.round(x)}px`);
                stepTimer = window.setTimeout(() => {
                    setWalking(false);
                    walkTimer = window.setTimeout(planNextWalk, restDelay());
                }, duration * 1000 + 60);
            };

            if (Math.sign(distance) !== facing) {
                // Turn on the spot first, so the robot never moonwalks.
                companion.classList.add("is-turning");
                setFacing(Math.sign(distance));
                walkTimer = window.setTimeout(start, hurry ? 220 : 420);
            } else {
                start();
            }
        };

        setFacing(1);
        measure();
        window.addEventListener("resize", measure, { passive: true });
        document.addEventListener("vayno:lang", () => window.requestAnimationFrame(measure));
        // While the curve brings in a new slide, a robot standing in the way
        // of its buttons hurries to the nearest clear spot.
        document.addEventListener("vayno:slide", () => {
            window.setTimeout(() => {
                if (isPaused() || document.visibilityState === "hidden") return;
                if (reducedMotion.matches) {
                    measure();
                    return;
                }
                computeBounds();
                if (x >= bounds.min - 1 && x <= bounds.max + 1) return;
                window.clearTimeout(walkTimer);
                window.clearTimeout(stepTimer);
                if (walking) freeze();
                setWalking(false);
                walkTo(Math.min(Math.max(x, bounds.min), bounds.max), true);
            }, SLIDE_MS * .55);
        });
        document.addEventListener("visibilitychange", () => {
            window.clearTimeout(stepTimer);
            window.clearTimeout(walkTimer);
            if (document.visibilityState === "hidden") {
                freeze();
                setWalking(false);
            } else {
                walkTimer = window.setTimeout(planNextWalk, 700);
            }
        });
        walkTimer = window.setTimeout(planNextWalk, 1800);

        // Live on-screen box of the figure, used to keep the speech bubble on
        // its head mid-stride, mid-hop, at any width.
        let live = { left: 0, top: 0, width: 0, height: 0 };
        const track = () => {
            const box = art.getBoundingClientRect();
            if (box.width) live = { left: box.left, top: box.top, width: box.width, height: box.height };
            window.requestAnimationFrame(track);
        };
        window.requestAnimationFrame(track);

        return {
            left: () => x,
            width: () => ROBOT_WIDTH(),
            anchor: () => live,
            isWalking: () => walking || companion.classList.contains("is-turning"),
            pause: () => {
                window.clearTimeout(walkTimer);
                window.clearTimeout(stepTimer);
                if (walking) freeze();
                setWalking(false);
            },
            resume: (delay = 2600) => {
                // A walk already under way plans the next one when it ends.
                if (walking) return;
                window.clearTimeout(walkTimer);
                window.clearTimeout(stepTimer);
                walkTimer = window.setTimeout(planNextWalk, delay);
            }
        };
    }

    function initCompanionAssistant() {
        const companion = document.getElementById("robot-companion");
        const trigger = companion?.querySelector(".robot-companion-trigger");
        const hello = document.getElementById("robot-hello");
        const panel = document.getElementById("assistant-panel");
        const closeButton = panel?.querySelector(".assistant-close");
        const form = document.getElementById("assistant-form");
        const input = document.getElementById("assistant-input");
        const messages = document.getElementById("assistant-messages");
        if (!companion || !trigger || !hello || !panel || !closeButton || !form || !input || !messages) return;

        const walker = initRobotWalker(companion, () => !panel.hidden);

        // Short-lived moods: a hop when the slide changes, a moving mouth while
        // the guide answers. Each one clears itself.
        const moodTimers = {};
        const setMood = (name, duration) => {
            window.clearTimeout(moodTimers[name]);
            companion.classList.remove(name);
            void companion.offsetWidth;
            companion.classList.add(name);
            moodTimers[name] = window.setTimeout(() => companion.classList.remove(name), duration);
        };

        // Keep the guide panel beside the robot wherever it has walked to, so
        // tapping the robot visibly "opens the agent" right where it stands.
        const placePanel = () => {
            if (!walker || panel.hidden) return;
            const gap = 14;
            const panelWidth = Math.min(420, window.innerWidth - 32);
            const available = window.innerWidth - panelWidth - gap * 3;
            const robotCenter = walker.left() + walker.width() / 2;
            const placeRight = robotCenter <= available / 2;
            if (window.innerWidth <= 560) {
                panel.style.left = "12px";
                return;
            }
            panel.style.right = "auto";
            panel.style.left = placeRight
                ? `${Math.round(Math.min(walker.left() + walker.width() + gap, window.innerWidth - panelWidth - gap))}px`
                : `${Math.round(Math.min(Math.max(gap, walker.left() - panelWidth - gap), window.innerWidth - panelWidth - gap))}px`;
        };

        let openedAt = 0;
        const setOpen = (isOpen, restoreFocus = false) => {
            panel.hidden = !isOpen;
            panel.setAttribute("aria-hidden", String(!isOpen));
            trigger.setAttribute("aria-expanded", String(isOpen));
            companion.classList.toggle("is-assistant-open", isOpen);
            // The bubble turns toward the visitor when they tap; it is only
            // hidden while the guide is actually open.
            if (isOpen) hello.classList.remove("is-visible");
            if (isOpen) {
                openedAt = Date.now();
                walker?.pause();
                placePanel();
                window.setTimeout(() => panel.focus({ preventScroll: true }), 0);
            } else {
                walker?.resume();
                if (restoreFocus) trigger.focus();
            }
        };

        const addMessage = (text, sender) => {
            const message = document.createElement("div");
            message.className = `assistant-message assistant-message-${sender}`;
            message.textContent = text;
            messages.append(message);
            messages.scrollTop = messages.scrollHeight;
            return message;
        };
        const addLink = (message, destination) => {
            const link = document.createElement("a");
            link.className = "assistant-reply-link";
            link.href = destination;
            link.textContent = destination === "#services" ? t("guide.link.services") : t("guide.link.contact");
            message.append(link);
        };

        // Each topic lists the English, Arabic and Kurdish words that point to it;
        // the reply is given in the language the page is shown in.
        const topics = [
            { reply: "guide.reply.price", to: "#contact", en: /\b(price|pricing|budget|cost|quote|how much)\b/, local: /سعر|أسعار|اسعار|تكلفة|كلفة|ميزانية|بكم|نرخ|تێچوو|بودجە|پارە|چەندە/ },
            { reply: "guide.reply.ai", to: "#services", en: /\b(ai|artificial intelligence|machine learning|automation|automate)\b/, local: /ذكاء|اصطناعي|أتمتة|اتمتة|زیرەکی|دەستکرد|ئۆتۆماتیک/ },
            { reply: "guide.reply.web", to: "#services", en: /\b(website|web|site|application|app|landing page|e-commerce|ecommerce)\b/, local: /موقع|مواقع|ويب|تطبيق|متجر|ماڵپەڕ|وێب|ئەپ|فرۆشگا/ },
            { reply: "guide.reply.software", to: "#services", en: /\b(software|system|platform|dashboard|tool|product|workflow)\b/, local: /برمجيات|برمجية|برنامج|نظام|أنظمة|منصة|لوحة تحكم|سۆفتوێر|نەرمەکاڵا|سیستەم|پلاتفۆرم|بەرنامە|داشبۆرد/ },
            { reply: "guide.reply.brand", to: "#services", en: /\b(brand|branding|identity|logo|graphic|visual)\b/, local: /علامة|هوية|شعار|جرافيك|غرافيك|براند|ناسنامە|لۆگۆ|لوگۆ|گرافیک/ },
            { reply: "guide.reply.uiux", to: "#services", en: /\b(ui|ux|interface|user experience|prototype|research|design)\b/, local: /واجهة|تجربة المستخدم|نموذج أولي|تصميم|ڕووکار|بەکارهێنەر|دیزاین/ },
            { reply: "guide.reply.motion", to: "#services", en: /\b(motion|animation|video|film|moving)\b/, local: /موشن|حركة|رسوم متحركة|أنيميشن|انيميشن|فيديو|جووڵە|ئەنیمەیشن|ڤیدیۆ/ }
        ];
        const findResponse = (question) => {
            const text = question.toLowerCase();
            const topic = topics.find((item) => item.en.test(text) || item.local.test(text));
            return topic
                ? { text: t(topic.reply), destination: topic.to }
                : { text: t("guide.reply.default"), destination: "#contact" };
        };

        // The guide says nothing until asked. Then it shows that it is typing,
        // writes the answer out, and offers the next step. Screen readers get
        // the whole answer at once; the letters appearing are only for show.
        const suggestions = panel.querySelector(".assistant-suggestions");
        let answering = false;
        const sendMessage = (text) => {
            const question = text.trim();
            if (!question || answering) return;
            answering = true;
            suggestions?.classList.add("is-busy");
            addMessage(question, "user");
            input.value = "";
            const response = findResponse(question);
            const message = addMessage("", "guide");
            const dots = document.createElement("span");
            dots.className = "assistant-typing";
            dots.setAttribute("aria-hidden", "true");
            dots.append(document.createElement("i"), document.createElement("i"), document.createElement("i"));
            message.append(dots);
            messages.scrollTop = messages.scrollHeight;
            const quick = reducedMotion.matches;
            const thinking = quick ? 300 : Math.min(1700, 750 + response.text.length * 6);
            setMood("is-talking", thinking + Math.min(2600, response.text.length * 18));
            window.setTimeout(() => {
                const spoken = document.createElement("span");
                spoken.className = "sr-only";
                spoken.textContent = response.text;
                const words = document.createElement("span");
                words.className = "assistant-words";
                words.setAttribute("aria-hidden", "true");
                message.replaceChildren(spoken, words);
                message.classList.add("is-writing");
                const letters = Array.from(response.text);
                // Long answers write faster, so none takes much more than two seconds.
                const perStep = Math.max(1, Math.ceil(letters.length / 120));
                let shown = 0;
                const finish = () => {
                    message.classList.remove("is-writing");
                    addLink(message, response.destination);
                    messages.scrollTop = messages.scrollHeight;
                    answering = false;
                    suggestions?.classList.remove("is-busy");
                };
                const write = () => {
                    shown = Math.min(letters.length, shown + perStep);
                    words.textContent = letters.slice(0, shown).join("");
                    messages.scrollTop = messages.scrollHeight;
                    if (shown < letters.length) window.setTimeout(write, 17);
                    else finish();
                };
                if (quick) {
                    words.textContent = response.text;
                    finish();
                } else {
                    write();
                }
            }, thinking);
        };

        trigger.addEventListener("click", () => setOpen(panel.hidden, panel.hidden));
        closeButton.addEventListener("click", () => setOpen(false, true));
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            sendMessage(input.value);
        });
        panel.querySelectorAll("[data-assistant-prompt]").forEach((button) => {
            button.addEventListener("click", () => sendMessage(button.dataset.assistantPrompt || ""));
        });
        panel.addEventListener("click", (event) => {
            if (event.target instanceof Element && event.target.closest('a[href^="#"]')) {
                setOpen(false);
            }
        });
        // Closes on an outside tap, but not on the very gesture that opened it,
        // and not while the visitor is selecting text inside the panel.
        document.addEventListener("pointerdown", (event) => {
            if (panel.hidden || !(event.target instanceof Node)) return;
            if (panel.contains(event.target) || companion.contains(event.target)) return;
            if (event.target instanceof Element && event.target.closest("input, select, textarea, label, .assistant-panel")) return;
            if (Date.now() - openedAt < 350) return;
            setOpen(false);
        });
        document.addEventListener("click", (event) => {
            if (panel.hidden || !(event.target instanceof Node)) return;
            if (panel.contains(event.target) || companion.contains(event.target)) return;
            setOpen(false);
        });
        window.addEventListener("resize", placePanel, { passive: true });
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && !panel.hidden) {
                event.preventDefault();
                setOpen(false, true);
            }
        });

        // ---- Speech bubble ----
        // Fixed to the viewport and re-placed every frame from the robot's
        // measured box: centred over the jamana, tail pointing at the head,
        // pushed inward near the screen edges.
        const placeHello = () => {
            const box = walker?.anchor();
            if (!box || !box.width) return;
            const bubble = hello.getBoundingClientRect();
            const pad = 10;
            const half = Math.min(bubble.width, window.innerWidth - pad * 2) / 2;
            const center = box.left + box.width / 2;
            const x = Math.min(Math.max(center, pad + half), window.innerWidth - pad - half);
            const y = Math.max(pad, box.top + box.height * .02 - bubble.height - 12);
            hello.style.setProperty("--hello-x", `${Math.round(x)}px`);
            hello.style.setProperty("--hello-y", `${Math.round(y)}px`);
            const tail = Math.min(Math.max(center - (x - half), 16), bubble.width - 16);
            hello.style.setProperty("--hello-tail", `${Math.round(tail)}px`);
        };
        // Placed every frame, shown or not, so it never slides in from an old spot.
        const helloFrame = () => {
            placeHello();
            window.requestAnimationFrame(helloFrame);
        };
        window.requestAnimationFrame(helloFrame);

        // Greetings and a hint for each slide, in the current language.
        const helloLines = ["hello.1", "hello.2", "hello.3", "hello.4"];
        const slideLines = ["hint.0", "hint.1", "hint.2", "hint.3", "hint.4"];
        let nextHello = 0;
        let hideHello = 0;
        let lineIndex = 0;
        let lastSaid = 0;

        // A line waits for another time when its bubble would cover a button,
        // link or form field on the slide that is showing.
        const bubbleInTheWay = () => {
            const bubble = hello.getBoundingClientRect();
            return Array.from(document.querySelectorAll(".journey-panel.is-current :is(a, button, input, select, textarea)")).some((element) => {
                const box = element.getBoundingClientRect();
                return box.width > 0 && bubble.left < box.right && bubble.right > box.left && bubble.top < box.bottom && bubble.bottom > box.top;
            });
        };

        // The robot stops, waves, and says the line.
        // Lines are kept as keys, so a bubble on screen can follow a language change.
        let spokenKey = helloLines[0];
        const say = (key, { hold = 5000, next = 24000 + Math.random() * 18000 } = {}) => {
            window.clearTimeout(nextHello);
            window.clearTimeout(hideHello);
            if (document.visibilityState === "hidden" || !panel.hidden) {
                nextHello = window.setTimeout(showHello, 7000);
                return;
            }
            hello.textContent = t(key);
            placeHello();
            if (bubbleInTheWay()) {
                hello.textContent = t(spokenKey);
                nextHello = window.setTimeout(showHello, 9000);
                return;
            }
            spokenKey = key;
            hello.classList.add("is-visible");
            lastSaid = Date.now();
            walker?.pause();
            if (!reducedMotion.matches) setMood("is-greeting", 2900);
            hideHello = window.setTimeout(() => {
                hello.classList.remove("is-visible");
                if (panel.hidden) walker?.resume(900);
                nextHello = window.setTimeout(showHello, next);
            }, hold);
        };
        function showHello() {
            lineIndex = (lineIndex + 1) % helloLines.length;
            say(helloLines[lineIndex]);
        }
        hello.textContent = t(spokenKey);
        nextHello = window.setTimeout(() => say(helloLines[0]), 3800);
        document.addEventListener("vayno:lang", () => { hello.textContent = t(spokenKey); });

        let slideHint = 0;
        document.addEventListener("vayno:slide", (event) => {
            if (!panel.hidden) return;
            // A line from the last slide goes with it, and the robot walks on.
            if (hello.classList.contains("is-visible")) {
                window.clearTimeout(hideHello);
                hello.classList.remove("is-visible");
                walker?.resume(1600);
            }
            if (!reducedMotion.matches) setMood("is-cheer", 900);
            window.clearTimeout(slideHint);
            const line = slideLines[event.detail?.index] || "";
            if (!line) return;
            const speak = () => {
                if (walker?.isWalking()) {
                    slideHint = window.setTimeout(speak, 300);
                    return;
                }
                if (Date.now() - lastSaid > 6000 || !hello.classList.contains("is-visible")) say(line, { hold: 4200 });
            };
            slideHint = window.setTimeout(speak, 1250);
        });
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "visible" && !hello.classList.contains("is-visible")) {
                window.clearTimeout(nextHello);
                nextHello = window.setTimeout(showHello, 9000);
            }
        });
    }

    function initScratchValues() {
        document.querySelectorAll(".brand-values article").forEach((card, index) => {
            const letter = card.querySelector(".brand-value-letter")?.textContent.trim() || "";
            // Read at use time: the heading changes with the language.
            const title = () => card.querySelector("h2")?.textContent.trim() || "";
            const canvas = document.createElement("canvas");
            canvas.className = "scratch-overlay";
            canvas.setAttribute("role", "button");
            canvas.setAttribute("aria-label", t("scratch.aria", { letter, title: title() }));
            canvas.tabIndex = 0;
            card.classList.add("scratch-value");
            card.append(canvas);

            let context = canvas.getContext("2d", { willReadFrequently: true });
            if (!context) {
                canvas.remove();
                return;
            }
            let pixelRatio = 1;
            let scratching = false;
            let revealed = false;
            let initialized = false;
            let touched = false;
            let resizeObserver;

            const paintCover = () => {
                const width = canvas.width;
                const height = canvas.height;
                const gradient = context.createLinearGradient(0, 0, width, height);
                gradient.addColorStop(0, "#1f3226");
                gradient.addColorStop(.48, "#14231a");
                gradient.addColorStop(1, "#0a140e");
                context.globalCompositeOperation = "source-over";
                context.fillStyle = gradient;
                context.fillRect(0, 0, width, height);
                context.strokeStyle = "rgba(166,224,178,.14)";
                context.lineWidth = pixelRatio;
                for (let ring = 0; ring < 4; ring += 1) {
                    context.beginPath();
                    context.ellipse(width * .78, height * .2, (24 + ring * 15) * pixelRatio, (12 + ring * 9) * pixelRatio, -.3, 0, Math.PI * 2);
                    context.stroke();
                }
                // Arabic and Kurdish need an Arabic-script face and right-to-left shaping.
                const face = `"DM Mono", "Noto Sans Arabic", monospace`;
                if ("direction" in context) context.direction = isRTL() ? "rtl" : "ltr";
                context.fillStyle = "rgba(240,238,222,.68)";
                context.textAlign = "center";
                context.font = `${8 * pixelRatio}px ${face}`;
                context.fillText(t("scratch.note", { n: index + 1 }), width / 2, height * .43);
                context.fillStyle = "#e3efe3";
                context.font = `500 ${10 * pixelRatio}px ${face}`;
                context.fillText(t("scratch.cta"), width / 2, height * .57);
                context.strokeStyle = "rgba(166,224,178,.5)";
                context.beginPath();
                context.moveTo(width * .28, height * .65);
                context.lineTo(width * .72, height * .65);
                context.stroke();
                context.fillStyle = "rgba(240,238,222,.42)";
                context.font = `${7 * pixelRatio}px ${face}`;
                context.fillText(t("scratch.drag"), width / 2, height * .74);
            };

            const resizeCover = () => {
                // A slide that is not showing has no size: the cover waits as it is.
                const bounds = canvas.getBoundingClientRect();
                if (!bounds.width || !bounds.height) return;
                const previous = initialized ? document.createElement("canvas") : null;
                if (previous) {
                    previous.width = canvas.width;
                    previous.height = canvas.height;
                    previous.getContext("2d")?.drawImage(canvas, 0, 0);
                }
                pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
                canvas.width = Math.max(1, Math.round(bounds.width * pixelRatio));
                canvas.height = Math.max(1, Math.round(bounds.height * pixelRatio));
                context = canvas.getContext("2d", { willReadFrequently: true });
                if (!context) return;
                if (previous) {
                    context.drawImage(previous, 0, 0, canvas.width, canvas.height);
                } else {
                    paintCover();
                    initialized = true;
                }
            };

            const reveal = () => {
                if (revealed) return;
                revealed = true;
                scratching = false;
                card.classList.add("is-revealed");
                canvas.setAttribute("aria-label", t("scratch.revealed", { letter, title: title() }));
                canvas.tabIndex = -1;
                resizeObserver?.disconnect();
                window.setTimeout(() => canvas.remove(), 700);
            };
            const positionFromEvent = (event) => {
                const bounds = canvas.getBoundingClientRect();
                return {
                    x: (event.clientX - bounds.left) * pixelRatio,
                    y: (event.clientY - bounds.top) * pixelRatio
                };
            };
            const checkCoverage = () => {
                const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
                const stepX = Math.max(1, Math.floor(canvas.width / 28));
                const stepY = Math.max(1, Math.floor(canvas.height / 20));
                let samples = 0;
                let erased = 0;
                for (let y = stepY / 2; y < canvas.height; y += stepY) {
                    for (let x = stepX / 2; x < canvas.width; x += stepX) {
                        samples += 1;
                        if (pixels[(Math.floor(y) * canvas.width + Math.floor(x)) * 4 + 3] < 24) erased += 1;
                    }
                }
                if (samples && erased / samples >= .3) reveal();
            };

            resizeCover();
            if ("ResizeObserver" in window) {
                resizeObserver = new ResizeObserver(resizeCover);
                resizeObserver.observe(canvas);
            }
            canvas.addEventListener("pointerdown", (event) => {
                if (revealed || event.button > 0) return;
                event.preventDefault();
                scratching = true;
                touched = true;
                canvas.setPointerCapture(event.pointerId);
                const point = positionFromEvent(event);
                context.globalCompositeOperation = "destination-out";
                context.lineCap = "round";
                context.lineJoin = "round";
                context.lineWidth = 38 * pixelRatio;
                context.beginPath();
                context.moveTo(point.x, point.y);
                context.lineTo(point.x + .1, point.y + .1);
                context.stroke();
            });
            canvas.addEventListener("pointermove", (event) => {
                if (!scratching || revealed) return;
                const point = positionFromEvent(event);
                context.globalCompositeOperation = "destination-out";
                context.lineTo(point.x, point.y);
                context.stroke();
            });
            const finishScratch = () => {
                if (!scratching || revealed) return;
                scratching = false;
                context.globalCompositeOperation = "source-over";
                checkCoverage();
            };
            canvas.addEventListener("pointerup", finishScratch);
            canvas.addEventListener("pointercancel", finishScratch);
            canvas.addEventListener("keydown", (event) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                reveal();
            });
            // A new language repaints untouched seals; a half-scratched seal is
            // left alone so the visitor doesn't lose their progress.
            document.addEventListener("vayno:lang", () => {
                if (revealed) return;
                canvas.setAttribute("aria-label", t("scratch.aria", { letter, title: title() }));
                if (!touched && context) paintCover();
            });
        });
    }

    function createProjectCard(project, index) {
        const card = document.createElement("article");
        card.className = "project-card";
        const disc = document.createElement("div");
        disc.className = "project-disc";
        disc.style.setProperty("--disc-delay", `${-index * 9}s`);
        const imageUrl = safeExternalUrl(project.imageUrl);
        if (imageUrl) {
            const photo = document.createElement("img");
            photo.className = "project-disc-image";
            photo.src = imageUrl;
            photo.alt = t("project.imageAlt", { name: tc(project.name) });
            photo.loading = index < 3 ? "eager" : "lazy";
            disc.append(photo);
        }
        const grooves = document.createElement("span");
        grooves.className = "project-disc-grooves";
        grooves.setAttribute("aria-hidden", "true");
        disc.append(grooves);
        const center = document.createElement("span");
        center.className = "project-disc-core";
        center.setAttribute("aria-hidden", "true");
        const mark = document.createElement("img");
        mark.className = "project-disc-mark";
        mark.src = "/assets/vayno-mark-core.svg";
        mark.alt = "";
        center.append(mark);
        disc.append(center);
        const number = document.createElement("span");
        number.className = "project-card-number";
        number.textContent = `V / ${String(index + 1).padStart(2, "0")}`;
        disc.append(number);
        card.append(disc);

        const copy = document.createElement("div");
        copy.className = "project-card-copy";
        const category = document.createElement("span");
        category.className = "eyebrow";
        category.textContent = tc(project.category);
        const title = document.createElement("h3");
        title.textContent = tc(project.name);
        copy.append(category, title);
        if (Array.isArray(project.tags) && project.tags.length) {
            const tags = document.createElement("div");
            tags.className = "project-tech";
            project.tags.forEach((value) => {
                const tag = document.createElement("span");
                tag.textContent = tc(value);
                tags.append(tag);
            });
            copy.append(tags);
        }
        const actions = document.createElement("div");
        actions.className = "project-actions";
        if (project.details?.sections?.length) {
            const open = document.createElement("button");
            open.type = "button";
            open.className = "project-open";
            open.textContent = t("project.open");
            open.addEventListener("click", () => openCaseStudy(project));
            actions.append(open);
            // The disc opens it too, for anyone who clicks the artwork.
            disc.classList.add("is-openable");
            disc.addEventListener("click", () => openCaseStudy(project));
        }
        const portfolioUrl = safeExternalUrl(project.portfolioUrl);
        if (portfolioUrl) {
            const link = document.createElement("a");
            link.className = "project-link";
            link.href = portfolioUrl;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = t("project.visit");
            actions.append(link);
        }
        if (actions.children.length) copy.append(actions);
        card.append(copy);
        return card;
    }

    // ---- "See how it works" ----
    // A window that walks through a project with screenshots: first what the
    // customers see, then the admin panel. Text comes from data/site-content.json
    // and is translated through i18n.js like the project cards.
    let caseDialog = null;
    let caseProject = null;

    function buildCaseStudy(project) {
        const { details } = project;
        const inner = document.createElement("div");
        inner.className = "case-study-inner";

        const close = document.createElement("button");
        close.type = "button";
        close.className = "case-study-close";
        close.setAttribute("aria-label", t("case.close"));
        close.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>';
        close.addEventListener("click", () => caseDialog.close());

        const header = document.createElement("header");
        header.className = "case-study-header";
        const category = document.createElement("span");
        category.className = "eyebrow";
        category.textContent = tc(project.category);
        const title = document.createElement("h2");
        title.id = "case-study-title";
        title.textContent = tc(project.name);
        header.append(category, title);
        if (details.summary) {
            const summary = document.createElement("p");
            summary.className = "case-study-summary";
            summary.textContent = tc(details.summary);
            header.append(summary);
        }
        const portfolioUrl = safeExternalUrl(project.portfolioUrl);
        if (portfolioUrl) {
            const visit = document.createElement("a");
            visit.className = "case-study-visit";
            visit.href = portfolioUrl;
            visit.target = "_blank";
            visit.rel = "noopener noreferrer";
            visit.textContent = t("project.visit");
            header.append(visit);
        }
        inner.append(close, header);

        let number = 0;
        for (const group of ["site", "admin"]) {
            const sections = details.sections.filter((section) => section.group === group);
            if (!sections.length) continue;
            const block = document.createElement("section");
            block.className = "case-study-group";
            const heading = document.createElement("h3");
            heading.className = "case-study-group-title";
            heading.textContent = t(`case.${group}`);
            block.append(heading);
            sections.forEach((section) => {
                number += 1;
                const item = document.createElement("article");
                item.className = "case-study-section";
                const figure = document.createElement("figure");
                figure.className = "case-study-shot";
                const image = document.createElement("img");
                image.src = safeExternalUrl(section.image);
                image.alt = t("case.shot", { title: tc(section.title) });
                image.loading = "lazy";
                image.decoding = "async";
                figure.append(image);
                const text = document.createElement("div");
                text.className = "case-study-copy";
                const count = document.createElement("span");
                count.className = "case-study-number";
                count.textContent = String(number).padStart(2, "0");
                const name = document.createElement("h4");
                name.textContent = tc(section.title);
                const body = document.createElement("p");
                body.textContent = tc(section.text);
                text.append(count, name, body);
                item.append(figure, text);
                block.append(item);
            });
            inner.append(block);
        }
        if (details.sections.some((section) => section.group === "admin")) {
            const note = document.createElement("p");
            note.className = "case-study-note";
            note.textContent = t("case.privacy");
            inner.append(note);
        }
        caseDialog.replaceChildren(inner);
    }

    function openCaseStudy(project) {
        if (!caseDialog) {
            caseDialog = document.createElement("dialog");
            caseDialog.className = "case-study";
            caseDialog.setAttribute("aria-labelledby", "case-study-title");
            // A click on the dimmed backdrop (outside the window's content) closes it.
            caseDialog.addEventListener("click", (event) => {
                if (event.target === caseDialog) caseDialog.close();
            });
            caseDialog.addEventListener("close", () => {
                document.documentElement.classList.remove("is-case-open");
                caseProject = null;
            });
            document.addEventListener("vayno:lang", () => {
                if (caseDialog.open && caseProject) buildCaseStudy(caseProject);
            });
            document.body.append(caseDialog);
        }
        caseProject = project;
        buildCaseStudy(project);
        document.documentElement.classList.add("is-case-open");
        caseDialog.showModal();
        caseDialog.scrollTop = 0;
    }

    function initProjects(projects) {
        const viewport = document.querySelector(".project-track-viewport");
        const track = viewport.querySelector(".project-track");
        const controls = document.querySelector(".project-controls");
        const previousButton = controls.querySelector(".project-control-prev");
        const nextButton = controls.querySelector(".project-control-next");
        // Rendered again whenever the language changes.
        track.replaceChildren();
        viewport.querySelectorAll(".content-empty").forEach((node) => node.remove());
        if (!projects.length) {
            controls.hidden = true;
            const empty = document.createElement("p");
            empty.className = "content-empty";
            empty.textContent = t("projects.empty");
            viewport.append(empty);
            return;
        }
        const group = document.createElement("div");
        group.className = "project-track-group";
        projects.forEach((project, index) => group.append(createProjectCard(project, index)));
        track.append(group);
        controls.hidden = false;

        const updateControls = () => {
            const maxScroll = viewport.scrollWidth - viewport.clientWidth;
            previousButton.disabled = viewport.scrollLeft <= 1;
            nextButton.disabled = viewport.scrollLeft >= maxScroll - 1;
            // Nothing to scroll: the arrows step aside.
            controls.classList.toggle("is-idle", previousButton.disabled && nextButton.disabled);
        };
        const scrollByCard = (direction) => {
            const card = track.querySelector(".project-card");
            if (!card) return;
            const gap = Number.parseFloat(getComputedStyle(group).columnGap) || 0;
            viewport.scrollBy({
                left: direction * (card.getBoundingClientRect().width + gap),
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
            });
        };

        previousButton.onclick = () => scrollByCard(-1);
        nextButton.onclick = () => scrollByCard(1);
        viewport.onscroll = updateControls;
        if (!viewport.dataset.watched) {
            viewport.dataset.watched = "true";
            window.addEventListener("resize", () => viewport.onscroll?.(), { passive: true });
            // The arrows can only be measured once the projects slide is showing.
            document.addEventListener("vayno:slide", () => viewport.onscroll?.());
        }
        updateControls();
    }

    // Six disciplines. Each card's title, one-line summary and tag come from
    // i18n.js (service.N.title / copy / tag). The line icons draw themselves
    // when a card arrives and again when it becomes the chosen one.
    const SERVICE_COUNT = 6;
    const SERVICE_ICONS = [
        // Software development: code brackets
        '<path d="M8.5 7 3.5 12l5 5M15.5 7l5 5-5 5M13.6 4.5l-3.2 15" />',
        // AI development: a core with signals radiating from it
        '<circle cx="12" cy="12" r="3.4" /><path d="M12 2.8v3.4M12 17.8v3.4M2.8 12h3.4M17.8 12h3.4M5.5 5.5l2.4 2.4M16.1 16.1l2.4 2.4M18.5 5.5l-2.4 2.4M7.9 16.1l-2.4 2.4" />',
        // Websites and apps: a browser window
        '<rect x="2.8" y="4.2" width="18.4" height="15.6" rx="2.6" /><path d="M2.8 8.8h18.4M6.8 13h6.4M6.8 16h10.4" />',
        // UI/UX: a layout and a pointer
        '<rect x="2.8" y="3.4" width="13.4" height="10.6" rx="2" /><path d="M2.8 7.6h13.4M14.6 13.6l6.6 2.4-2.9 1.2-1.2 2.9z" />',
        // Graphic design: a pen nib
        '<path d="M12 2.8 5.2 9.4l2.9 9.6h7.8l2.9-9.6z" /><path d="M12 2.8v7.6" /><circle cx="12" cy="12.4" r="1.7" /><path d="M8.4 21.4h7.2" />',
        // Motion graphics: play, with speed lines
        '<circle cx="13.4" cy="12" r="8" /><path d="M11.6 8.8v6.4l5-3.2z" /><path d="M1.6 9h3M1 12h3.6M1.6 15h3" />'
    ];

    function initServices() {
        const deck = document.querySelector(".service-deck");
        if (!deck) return;

        const cards = Array.from({ length: SERVICE_COUNT }, (_, index) => {
            const n = index + 1;
            const card = document.createElement("button");
            card.type = "button";
            card.className = "service-card";
            card.setAttribute("role", "listitem");
            card.setAttribute("aria-pressed", "false");
            card.dataset.serviceIndex = String(index);
            card.style.setProperty("--card-order", String(index));

            const meta = document.createElement("span");
            meta.className = "service-card-meta";
            const indexLabel = document.createElement("span");
            indexLabel.className = "service-card-index";
            indexLabel.textContent = String(n).padStart(2, "0");
            const tag = document.createElement("span");
            tag.className = "service-card-tag";
            meta.append(indexLabel, tag);

            const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            icon.setAttribute("class", "service-icon");
            icon.setAttribute("viewBox", "0 0 24 24");
            icon.setAttribute("aria-hidden", "true");
            icon.setAttribute("focusable", "false");
            icon.innerHTML = SERVICE_ICONS[index];
            icon.querySelectorAll("*").forEach((shape) => shape.setAttribute("pathLength", "1"));

            const heading = document.createElement("span");
            heading.className = "service-card-title";
            const summary = document.createElement("span");
            summary.className = "service-card-copy";

            card.append(meta, icon, heading, summary);
            deck.append(card);
            return { card, n, tag, heading, summary };
        });

        const fill = () => cards.forEach(({ n, tag, heading, summary }) => {
            tag.textContent = t(`service.${n}.tag`);
            heading.textContent = t(`service.${n}.title`);
            summary.textContent = t(`service.${n}.copy`);
        });

        let selected = -1;
        const select = (next) => {
            if (selected === next) return;
            selected = next;
            cards.forEach(({ card }, index) => {
                card.classList.toggle("is-active", index === next);
                card.setAttribute("aria-pressed", String(index === next));
            });
        };

        // Hover previews on a pointer device, but a stuck hover never replaces
        // an explicit choice, and pointer-leave returns to the chosen card.
        let chosen = 0;
        cards.forEach(({ card }, index) => {
            card.addEventListener("pointerenter", (event) => {
                if (event.pointerType === "mouse") select(index);
            });
            card.addEventListener("focus", () => select(index));
            card.addEventListener("click", () => {
                chosen = index;
                select(index);
            });
        });
        deck.addEventListener("pointerleave", () => select(chosen));
        fill();
        select(0);
        document.addEventListener("vayno:lang", fill);
    }

    function initTeam(team) {
        const grid = document.querySelector(".team-grid");
        grid.replaceChildren();
        if (!team.length) {
            const empty = document.createElement("p");
            empty.className = "content-empty team-empty";
            empty.textContent = t("team.empty");
            grid.append(empty);
            return;
        }
        team.forEach((person, index) => {
            const card = document.createElement("article");
            card.className = "member-card";
            const photoFrame = document.createElement("div");
            photoFrame.className = "member-photo-frame";
            const photoUrl = safeExternalUrl(person.photoUrl);
            if (photoUrl) {
                const photo = document.createElement("img");
                photo.className = "member-photo";
                photo.src = photoUrl;
                photo.alt = t("team.portrait", { name: person.name });
                photo.loading = "lazy";
                photoFrame.append(photo);
            } else {
                const initials = document.createElement("span");
                initials.className = "member-initials";
                initials.setAttribute("aria-hidden", "true");
                initials.textContent = person.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
                photoFrame.append(initials);
            }
            card.append(photoFrame);
            const role = document.createElement("span");
            role.className = "team-role";
            role.textContent = `${String(index + 1).padStart(2, "0")} / ${tc(person.role)}`;
            const name = document.createElement("h3");
            name.textContent = person.name;
            const description = document.createElement("p");
            description.className = "team-bio";
            description.textContent = tc(person.description);
            card.append(role, name, description);
            const portfolioUrl = safeExternalUrl(person.portfolioUrl);
            if (portfolioUrl) {
                const link = document.createElement("a");
                link.className = "team-portfolio";
                link.href = portfolioUrl;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                link.textContent = t("team.portfolio");
                const arrow = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                arrow.classList.add("arrow-icon");
                arrow.setAttribute("viewBox", "0 0 20 20");
                arrow.setAttribute("aria-hidden", "true");
                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path.setAttribute("d", "M5 15 15 5M6 5h9v9");
                arrow.append(path);
                link.append(arrow);
                card.append(link);
            }
            grid.append(card);
        });
    }

    function initContact(content) {
        const whatsapp = document.getElementById("whatsapp-link");
        const emailLink = document.getElementById("email-link");
        const footerEmail = document.getElementById("footer-email");
        const copyButton = document.getElementById("copy-email");
        const copyFeedback = document.getElementById("copy-feedback");
        const phone = typeof content.whatsappNumber === "string" ? content.whatsappNumber.trim() : "";
        const email = typeof content.email === "string" ? content.email.trim() : "";
        const hasPhone = /^\d{8,15}$/.test(phone);
        const hasEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (hasPhone) {
            const message = encodeURIComponent("Hello VAYNO, I'd like to discuss a project.");
            whatsapp.href = `https://wa.me/${phone}?text=${message}`;
            whatsapp.hidden = false;
        } else {
            whatsapp.hidden = true;
        }
        if (hasEmail) {
            emailLink.href = `mailto:${email}`;
            footerEmail.href = `mailto:${email}`;
            emailLink.hidden = false;
            footerEmail.textContent = email;
            copyButton.hidden = false;
            copyButton.addEventListener("click", async () => {
                try {
                    await navigator.clipboard.writeText(email);
                    copyFeedback.textContent = t("contact.copied");
                } catch {
                    copyFeedback.textContent = t("contact.copyFailed");
                }
            });
        } else {
            // No email yet: nothing to show visitors.
            emailLink.hidden = true;
            footerEmail.hidden = true;
        }
        const socialRoot = document.getElementById("social-links");
        const socials = [
            ["Instagram", safeExternalUrl(content.instagramUrl)],
            ["WhatsApp", hasPhone ? `https://wa.me/${phone}` : ""],
            ["TikTok", safeExternalUrl(content.tiktokUrl)]
        ];
        const unset = [];
        socials.forEach(([label, url]) => {
            const link = url ? document.createElement("a") : document.createElement("span");
            if (url) {
                link.href = url;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
            } else {
                link.setAttribute("aria-disabled", "true");
                unset.push([link, label]);
            }
            link.textContent = label;
            socialRoot.append(link);
        });

        // Wording that depends on the language.
        const applyText = () => {
            if (hasEmail) emailLink.setAttribute("aria-label", t("contact.emailAria", { email }));
            unset.forEach(([link, label]) => { link.title = t("contact.socialTitle", { label }); });
        };
        applyText();
        document.addEventListener("vayno:lang", applyText);
    }

    function initInquiryForm() {
        const form = document.getElementById("inquiryForm");
        const message = document.getElementById("formMessage");
        const submit = form.querySelector('[type="submit"]');
        const submitLabel = submit.querySelector(".submit-label") || submit;
        const emailInput = form.elements.email;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            message.className = "form-message";
            message.textContent = "";
            if (!form.reportValidity()) return;
            if (!emailPattern.test(emailInput.value.trim())) {
                emailInput.setCustomValidity(t("form.invalidEmail"));
                emailInput.reportValidity();
                emailInput.setCustomValidity("");
                return;
            }

            submit.disabled = true;
            submitLabel.textContent = t("form.sending");
            const payload = Object.fromEntries(new FormData(form).entries());
            try {
                const response = await fetch("/api/inquiries", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Accept": "application/json" },
                    body: JSON.stringify(payload)
                });
                const result = await response.json().catch(() => ({}));
                // The server words its errors in English; other languages get the translated message.
                if (!response.ok) throw new Error(lang === "en" && result.error ? result.error : t("form.genericError"));
                message.classList.add("success");
                message.textContent = t("form.success", { reference: result.reference });
                form.reset();
            } catch (error) {
                message.classList.add("error");
                message.textContent = error instanceof TypeError
                    ? t("form.networkError")
                    : error.message;
            } finally {
                submit.disabled = false;
                submitLabel.textContent = t("form.submit");
            }
        });
    }

    // ---- Pointer effects (mouse only) ----
    // A soft light follows the cursor, the hero orb drifts a little with it
    // while its gloss slides the other way, and the main buttons lean toward
    // the pointer.
    function initPointerEffects() {
        if (reducedMotion.matches || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

        const glow = document.createElement("div");
        glow.className = "pointer-glow";
        glow.setAttribute("aria-hidden", "true");
        document.body.append(glow);
        const hero = document.querySelector(".hero");
        let targetX = window.innerWidth / 2;
        let targetY = window.innerHeight / 2;
        let x = targetX;
        let y = targetY;
        let frame = 0;
        const tick = () => {
            x += (targetX - x) * .14;
            y += (targetY - y) * .14;
            glow.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
            hero?.style.setProperty("--px", (x / window.innerWidth - .5).toFixed(3));
            hero?.style.setProperty("--py", (y / window.innerHeight - .5).toFixed(3));
            frame = Math.abs(targetX - x) + Math.abs(targetY - y) > .4 ? window.requestAnimationFrame(tick) : 0;
        };
        window.addEventListener("pointermove", (event) => {
            if (event.pointerType !== "mouse") return;
            targetX = event.clientX;
            targetY = event.clientY;
            glow.classList.add("is-on");
            if (!frame) frame = window.requestAnimationFrame(tick);
        }, { passive: true });
        document.addEventListener("mouseout", (event) => {
            if (!event.relatedTarget) glow.classList.remove("is-on");
        });

        document.querySelectorAll(".hero-start, .hero-link, .submit-btn, .project-control").forEach((button) => {
            button.dataset.magnetic = "";
            button.addEventListener("pointermove", (event) => {
                const box = button.getBoundingClientRect();
                const dx = event.clientX - (box.left + box.width / 2);
                const dy = event.clientY - (box.top + box.height / 2);
                button.style.translate = `${(dx * .2).toFixed(1)}px ${(dy * .3).toFixed(1)}px`;
            });
            button.addEventListener("pointerleave", () => { button.style.translate = ""; });
        });
    }

    // ---- Background ----
    // A bright, dreamlike Kurdistan in the greens of the logo, drawn in code:
    // an emerald sky that pales toward the horizon, the Kurdish sun, soft white
    // clouds, and famous Kurdish places in smooth white stone (Erbil Citadel
    // with its great gate, the Choli Minaret, a Hawraman village climbing its
    // mountainside, old town houses, gates and domes), standing in still water
    // that mirrors it all with a slow ripple. The places stand at three depths
    // that pan at different speeds as the slides move, so the visitor travels
    // through the country. Past the first slide the view tilts up a
    // little, so there is more sky behind the text on the busier slides.
    // Arabic and Kurdish see the world mirrored, like the page. The waterlines
    // come from CSS (--horizon on the first slide, --horizon-inner after it);
    // the first also places the hero orb's reflection. Paused while the tab is
    // hidden; drawn once, still, for reduced motion.
    function initBackdrop() {
        const canvas = document.querySelector(".bg-world");
        const context = canvas?.getContext("2d");
        // Everything above the waterline is painted here first, then copied
        // to the screen and, row by row, upside down into the water.
        const scene = document.createElement("canvas");
        const paint = scene.getContext("2d");
        if (!canvas || !context || !paint) return;
        const still = reducedMotion.matches;
        const steps = Math.max(1, document.querySelectorAll(".journey-panel").length - 1);

        // Deterministic random numbers, so the world is the same on every visit.
        const seeded = (seed) => () => {
            seed = (seed + 0x6d2b79f5) | 0;
            let value = Math.imul(seed ^ (seed >>> 15), 1 | seed);
            value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
            return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
        };
        const clamp = (value, low, high) => Math.min(high, Math.max(low, value));
        const rgb = (hex) => [1, 3, 5].map((at) => parseInt(hex.slice(at, at + 2), 16));
        const mix = (from, to, amount) => {
            const a = rgb(from);
            const b = rgb(to);
            return `rgb(${a.map((value, index) => Math.round(value + (b[index] - value) * amount)).join(", ")})`;
        };

        // White stone lit from the left; the farther it stands, the more it
        // takes on the colour of the haze.
        const HAZE = "#d4eedf";
        const STONE = { light: "#ffffff", mid: "#e9f3ed", shade: "#cbded3", deep: "#a6c3b3" };
        // Erbil Citadel keeps its own colour: sun-warmed sandy brick and earth.
        const BRICK = { light: "#ecd5a6", mid: "#d6b683", shade: "#b99660", deep: "#8c6b40" };
        const tinted = (palette, haze) => Object.fromEntries(Object.entries(palette).map(([name, hex]) => [name, mix(hex, HAZE, haze)]));
        const stoneFor = (haze) => tinted(STONE, haze);
        const brickFor = (haze) => tinted(BRICK, haze);

        // depth: share of the screen width a layer pans per slide.
        // Places: [kind, x, size, option]. x is in screen widths from the
        // layer's start; size is a share of the screen height.
        // On the first slide Erbil Citadel's gate shows between the words and
        // the orb, and the Choli Minaret rises against the sun on the right.
        // The near places only arrive from the second slide on.
        const LAYERS = [
            { depth: .05, stone: stoneFor(.55), items: [] },
            {
                depth: .14,
                stone: stoneFor(.22),
                brick: brickFor(.14),
                items: [
                    ["citadel", .45, .3], ["minaret", .875, .52], ["village", 1.18, .34], ["houses", 1.36, .1, 4],
                    ["gate", 1.47, .3], ["dome", 1.6, .2]
                ]
            },
            {
                depth: .3,
                stone: stoneFor(0),
                brick: brickFor(0),
                items: [
                    ["houses", 1.12, .11, 4], ["village", 1.55, .34], ["minaret", 1.95, .5], ["citadel", 2.25, .28]
                ]
            }
        ];
        // The far skyline is generated: a long, low row of small, hazy town
        // houses, domes, minarets and gates.
        {
            const random = seeded(17);
            const kinds = ["houses", "dome", "minaret", "houses", "tower", "gate", "houses", "dome"];
            for (let x = -.05; x < 1.1 + LAYERS[0].depth * steps; x += .045 + random() * .065) {
                const kind = kinds[Math.floor(random() * kinds.length)];
                LAYERS[0].items.push([kind, x, .05 + random() * .06, kind === "houses" ? 2 + Math.floor(random() * 3) : Math.floor(random() * 2)]);
            }
        }

        let width = 0;
        let height = 0;
        let horizon = 0;
        let heroHorizon = 0;
        let innerHorizon = 0;
        let ratio = 1;
        let rtl = false;
        let upright = false;
        let scrimFill = null;
        let clouds = [];
        let glints = [];
        let flock = null;
        let nextFlock = 0;
        let frame = 0;
        let previous = 0;
        const pan = { from: 0, to: 0, start: 0 };
        const lean = { x: 0, target: 0 };

        // ---- Painters (in world space, lit from the left) ----
        const faceFill = (stone, top, bottom) => {
            const fill = paint.createLinearGradient(0, top, 0, bottom);
            fill.addColorStop(0, stone.light);
            fill.addColorStop(.72, stone.mid);
            fill.addColorStop(1, stone.shade);
            return fill;
        };
        const roundFill = (stone, x, r) => {
            const fill = paint.createLinearGradient(x - r, 0, x + r, 0);
            fill.addColorStop(0, stone.shade);
            fill.addColorStop(.3, stone.light);
            fill.addColorStop(.68, stone.mid);
            fill.addColorStop(1, stone.deep);
            return fill;
        };
        // How far a building turns: its side shows toward the middle of the
        // screen, as in perspective, and grows as it nears the edge.
        const turnOf = (x) => clamp((width / 2 - x) / (width / 2), -1, 1);

        // A wall with openings cut through it. The inside of each opening
        // shows on the side facing the middle, and its underside from below.
        const wall = (stone, x, base, w, h, openings) => {
            const left = x - w / 2;
            const top = base - h;
            const side = Math.min(w, h) * .11 * turnOf(x);
            if (Math.abs(side) > .4) {
                const edge = side > 0 ? left + w : left;
                paint.fillStyle = stone.deep;
                paint.beginPath();
                paint.moveTo(edge, top);
                paint.lineTo(edge + side, top + Math.abs(side) * .5);
                paint.lineTo(edge + side, base);
                paint.lineTo(edge, base);
                paint.closePath();
                paint.fill();
            }
            paint.beginPath();
            paint.rect(left, top, w, h);
            openings(0, 0);
            paint.fillStyle = faceFill(stone, top, base);
            paint.fill("evenodd");
            paint.save();
            paint.beginPath();
            openings(0, 0);
            paint.clip();
            paint.beginPath();
            openings(0, 0);
            openings(side, Math.abs(side) * .6 + h * .012);
            const inner = paint.createLinearGradient(0, top, 0, base);
            inner.addColorStop(0, stone.deep);
            inner.addColorStop(1, stone.shade);
            paint.fillStyle = inner;
            paint.fill("evenodd");
            paint.restore();
            paint.fillStyle = "rgba(255, 255, 255, .9)";
            paint.fillRect(left, top, w, Math.max(1, h * .007));
        };

        // A pointed arch, as on old Kurdish gates and doors.
        const pointedArch = (cx, base, span, spring) => (dx, dy) => {
            const r = span / 2;
            paint.moveTo(cx - r + dx, base + dy);
            paint.lineTo(cx - r + dx, spring + dy);
            paint.quadraticCurveTo(cx - r + dx, spring - r * 1.1 + dy, cx + dx, spring - r * 1.7 + dy);
            paint.quadraticCurveTo(cx + r + dx, spring - r * 1.1 + dy, cx + r + dx, spring + dy);
            paint.lineTo(cx + r + dx, base + dy);
            paint.closePath();
        };
        // A row of battlements along a wall top.
        const battlements = (stone, left, top, w, s) => {
            const count = Math.max(3, Math.round(w / (s * .07)));
            const tooth = w / (count * 2 - 1);
            paint.fillStyle = stone.light;
            for (let index = 0; index < count; index += 1) paint.fillRect(left + index * tooth * 2, top - s * .03, tooth, s * .03);
        };

        const PAINTERS = {
            // An old town gate: a thick wall with a pointed arch and battlements.
            gate(stone, x, base, s) {
                const w = s * .66;
                wall(stone, x, base, w, s * .82, pointedArch(x, base, s * .3, base - s * .36));
                battlements(stone, x - w / 2, base - s * .82, w, s);
            },
            // Erbil Citadel: an oval wall of old houses on a high mound, the
            // great gate between two round towers, and the road up to it.
            citadel(stone, x, base, s) {
                const half = s * 1.25;
                const crest = s * .86;
                const top = base - s * .38;
                paint.beginPath();
                paint.moveTo(x - half, base);
                paint.bezierCurveTo(x - half + s * .18, base - s * .04, x - crest - s * .1, top + s * .05, x - crest, top);
                paint.lineTo(x + crest, top);
                paint.bezierCurveTo(x + crest + s * .1, top + s * .05, x + half - s * .18, base - s * .04, x + half, base);
                paint.closePath();
                const earth = paint.createLinearGradient(0, top, 0, base);
                earth.addColorStop(0, stone.mid);
                earth.addColorStop(1, stone.shade);
                paint.fillStyle = earth;
                paint.fill();
                // The road climbing to the gate.
                paint.fillStyle = stone.light;
                paint.beginPath();
                paint.moveTo(x - s * .07, top);
                paint.lineTo(x + s * .07, top);
                paint.lineTo(x + s * .32, base);
                paint.lineTo(x + s * .1, base);
                paint.closePath();
                paint.fill();
                // The ring of houses: flat roofs of different heights.
                const random = seeded(73);
                paint.beginPath();
                paint.moveTo(x - crest, top);
                for (let at = x - crest; at < x + crest - 1;) {
                    const next = Math.min(x + crest, at + s * (.07 + random() * .09));
                    const rise = s * (.1 + random() * .1);
                    paint.lineTo(at, top - rise);
                    paint.lineTo(next, top - rise);
                    at = next;
                }
                paint.lineTo(x + crest, top);
                paint.closePath();
                paint.fillStyle = faceFill(stone, top - s * .2, top);
                paint.fill();
                // Small windows along the houses.
                paint.fillStyle = stone.deep;
                const windows = seeded(91);
                for (let at = x - crest + s * .05; at < x + crest - s * .05; at += s * (.05 + windows() * .05)) {
                    const y = top - s * (.055 + windows() * .03);
                    if (Math.abs(at - x) > s * .22) paint.fillRect(at, y, s * .016, s * .026);
                }
                // The gate.
                const gw = s * .3;
                const gh = s * .34;
                const gateTop = top - gh;
                [-1, 1].forEach((side) => {
                    const tx = x + side * (gw / 2 + s * .035);
                    const r = s * .055;
                    paint.fillStyle = roundFill(stone, tx, r);
                    paint.beginPath();
                    paint.moveTo(tx - r, top);
                    paint.lineTo(tx - r, gateTop + s * .04);
                    paint.ellipse(tx, gateTop + s * .04, r, r * .3, 0, Math.PI, 0);
                    paint.lineTo(tx + r, top);
                    paint.closePath();
                    paint.fill();
                });
                paint.fillStyle = faceFill(stone, gateTop, top);
                paint.fillRect(x - gw / 2, gateTop, gw, gh);
                battlements(stone, x - gw / 2, gateTop, gw, s);
                paint.fillStyle = stone.deep;
                paint.beginPath();
                pointedArch(x, top, gw * .44, top - gh * .42)(0, 0);
                paint.fill();
                paint.fillStyle = "rgba(255, 255, 255, .9)";
                paint.fillRect(x - gw / 2, gateTop, gw, Math.max(1, s * .006));
            },
            // The Choli Minaret: an eight-sided base with arched niches, a
            // balcony, and a tall round shaft in bands of patterned brick,
            // its top broken off by time.
            minaret(stone, x, base, s) {
                const baseW = s * .16;
                const baseH = s * .26;
                const shaftBottom = base - baseH - s * .03;
                const top = base - s;
                const bottomR = s * .056;
                const topR = s * .044;
                [[-.5, -.25, stone.shade], [-.25, .25, stone.light], [.25, .5, stone.deep]].forEach(([from, to, colour]) => {
                    paint.fillStyle = colour;
                    paint.fillRect(x + from * baseW, base - baseH, (to - from) * baseW, baseH);
                });
                paint.fillStyle = stone.deep;
                paint.beginPath();
                pointedArch(x, base - baseH * .18, baseW * .2, base - baseH * .62)(0, 0);
                paint.fill();
                paint.fillStyle = stone.light;
                paint.fillRect(x - baseW * .62, shaftBottom, baseW * 1.24, s * .03);
                paint.fillStyle = stone.shade;
                paint.fillRect(x - baseW * .62, shaftBottom + s * .024, baseW * 1.24, Math.max(1, s * .006));
                paint.fillStyle = roundFill(stone, x, bottomR);
                paint.beginPath();
                paint.moveTo(x - bottomR, shaftBottom);
                paint.lineTo(x - topR, top + s * .03);
                paint.lineTo(x - topR * .4, top);
                paint.lineTo(x + topR * .1, top + s * .014);
                paint.lineTo(x + topR * .6, top + s * .005);
                paint.lineTo(x + topR, top + s * .035);
                paint.lineTo(x + bottomR, shaftBottom);
                paint.closePath();
                paint.fill();
                // Brick bands, and a band of small diamonds a third of the way up.
                paint.fillStyle = "rgba(100, 142, 122, .22)";
                for (let index = 1; index <= 5; index += 1) {
                    const share = index / 6.2;
                    const r = bottomR + (topR - bottomR) * share;
                    paint.fillRect(x - r, shaftBottom - (shaftBottom - top) * share, r * 2, Math.max(1, s * .008));
                }
                const bandY = shaftBottom - (shaftBottom - top) * .26;
                const bandR = bottomR + (topR - bottomR) * .26;
                paint.fillStyle = "rgba(100, 142, 122, .3)";
                for (let dx = -bandR * .75; dx <= bandR * .75; dx += bandR * .5) {
                    paint.beginPath();
                    paint.moveTo(x + dx, bandY - s * .016);
                    paint.lineTo(x + dx + s * .01, bandY);
                    paint.lineTo(x + dx, bandY + s * .016);
                    paint.lineTo(x + dx - s * .01, bandY);
                    paint.closePath();
                    paint.fill();
                }
            },
            // A Hawraman village: flat-roofed stone houses climbing a steep
            // mountainside, one family's roof the next one's yard.
            village(stone, x, base, s) {
                const half = s * 1.1;
                const peakX = x + s * .1;
                const peak = base - s;
                paint.beginPath();
                paint.moveTo(x - half, base);
                paint.quadraticCurveTo(x - half * .45, base - s * .55, peakX - s * .12, peak + s * .04);
                paint.quadraticCurveTo(peakX, peak - s * .02, peakX + s * .12, peak + s * .05);
                paint.quadraticCurveTo(x + half * .5, base - s * .5, x + half, base);
                paint.closePath();
                const rock = paint.createLinearGradient(0, peak, 0, base);
                rock.addColorStop(0, stone.shade);
                rock.addColorStop(1, stone.deep);
                paint.fillStyle = rock;
                paint.fill();
                // Rows of houses, the highest first so the lower ones stand in front.
                const random = seeded(57);
                const houseH = s * .085;
                for (let row = 5; row >= 0; row -= 1) {
                    const bottom = base - row * houseH * 1.05;
                    const span = half * (1 - (base - bottom) / s * 1.05) * .86;
                    const front = faceFill(stone, bottom - houseH * 1.15, bottom);
                    for (let at = x - span + random() * houseH; at < x + span - houseH * .8;) {
                        const w = houseH * (1.1 + random() * .8);
                        if (random() < .84) {
                            const h = houseH * (.9 + random() * .25);
                            paint.fillStyle = front;
                            paint.fillRect(at, bottom - h, w, h);
                            paint.fillStyle = "rgba(255, 255, 255, .9)";
                            paint.fillRect(at, bottom - h, w, Math.max(1, h * .08));
                            paint.fillStyle = stone.deep;
                            paint.fillRect(at + w * .2, bottom - h * .62, w * .14, h * .32);
                            if (w > houseH * 1.4) paint.fillRect(at + w * .6, bottom - h * .66, w * .14, h * .22);
                        }
                        at += w + houseH * (.05 + random() * .2);
                    }
                }
            },
            // A few flat-roofed town houses side by side.
            houses(stone, x, base, s, count = 3) {
                const random = seeded(Math.round(s * 13) + count);
                const widths = Array.from({ length: count }, () => s * (.7 + random() * .5));
                const total = widths.reduce((sum, w) => sum + w, 0);
                let at = x - total / 2;
                widths.forEach((w) => {
                    const h = s * (.55 + random() * .45);
                    paint.fillStyle = faceFill(stone, base - h, base);
                    paint.fillRect(at, base - h, w, h);
                    paint.fillStyle = "rgba(255, 255, 255, .9)";
                    paint.fillRect(at, base - h, w, Math.max(1, h * .06));
                    paint.fillStyle = stone.deep;
                    paint.fillRect(at + w * .22, base - h * .64, w * .16, h * .26);
                    paint.fillRect(at + w * .58, base - h * .64, w * .16, h * .26);
                    at += w;
                });
            },
            tower(stone, x, base, s, variant = 0) {
                const r = s * .12;
                const top = base - s;
                paint.fillStyle = roundFill(stone, x, r);
                paint.beginPath();
                paint.moveTo(x - r, base);
                paint.lineTo(x - r, top);
                paint.ellipse(x, top, r, r * .24, 0, Math.PI, 0);
                paint.lineTo(x + r, base);
                paint.closePath();
                paint.fill();
                if (variant === 1) {
                    // A tall, round-ended window.
                    const w = r * .38;
                    paint.fillStyle = stone.deep;
                    paint.beginPath();
                    paint.arc(x, top + s * .14, w / 2, Math.PI, 0);
                    paint.lineTo(x + w / 2, top + s * .48);
                    paint.arc(x, top + s * .48, w / 2, 0, Math.PI);
                    paint.closePath();
                    paint.fill();
                } else {
                    paint.fillStyle = "rgba(120, 160, 140, .16)";
                    paint.fillRect(x - r, top + s * .1, r * 2, Math.max(1, s * .008));
                    paint.fillRect(x - r, top + s * .14, r * 2, Math.max(1, s * .008));
                }
            },
            dome(stone, x, base, s) {
                const r = s * .38;
                const drum = s * .17;
                paint.fillStyle = roundFill(stone, x, r);
                paint.fillRect(x - r, base - drum, r * 2, drum);
                const fill = paint.createRadialGradient(x - r * .42, base - drum - r * .6, r * .05, x, base - drum, r * 1.08);
                fill.addColorStop(0, stone.light);
                fill.addColorStop(.55, stone.mid);
                fill.addColorStop(1, stone.deep);
                paint.fillStyle = fill;
                paint.beginPath();
                paint.arc(x, base - drum, r, Math.PI, 0);
                paint.closePath();
                paint.fill();
            }
        };

        // ---- Clouds: soft white heaps with shaded, flat undersides ----
        const cloudSprite = (seed) => {
            const random = seeded(seed);
            const element = document.createElement("canvas");
            element.width = 512;
            element.height = 224;
            const g = element.getContext("2d");
            const puff = (x, y, r) => {
                const fill = g.createRadialGradient(x - r * .3, y - r * .35, r * .08, x, y, r);
                fill.addColorStop(0, "rgba(255, 255, 255, 1)");
                fill.addColorStop(.68, "rgba(247, 252, 249, .97)");
                fill.addColorStop(.9, "rgba(236, 247, 240, .55)");
                fill.addColorStop(1, "rgba(236, 247, 240, 0)");
                g.fillStyle = fill;
                g.beginPath();
                g.arc(x, y, r, 0, Math.PI * 2);
                g.fill();
            };
            for (let index = 0; index < 10; index += 1) {
                const t = index / 9;
                const r = (34 + random() * 30) * (1.05 - Math.abs(t - .5) * 1.1);
                puff(64 + t * 384 + (random() - .5) * 26, 168 - r * (.62 + random() * .2), r);
            }
            for (let index = 0; index < 4; index += 1) {
                const r = 38 + random() * 26;
                puff(170 + random() * 170, 120 - r * (.4 + random() * .3), r);
            }
            g.globalCompositeOperation = "source-atop";
            const under = g.createLinearGradient(0, 80, 0, 176);
            under.addColorStop(0, "rgba(150, 194, 172, 0)");
            under.addColorStop(1, "rgba(140, 186, 164, .5)");
            g.fillStyle = under;
            g.fillRect(0, 0, 512, 224);
            g.globalCompositeOperation = "destination-out";
            const cut = g.createLinearGradient(0, 158, 0, 178);
            cut.addColorStop(0, "rgba(0, 0, 0, 0)");
            cut.addColorStop(1, "rgba(0, 0, 0, 1)");
            g.fillStyle = cut;
            g.fillRect(0, 158, 512, 66);
            return element;
        };
        const cloudSprites = [cloudSprite(5), cloudSprite(8), cloudSprite(13)];

        const resize = () => {
            ratio = touchDevice ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
            width = window.innerWidth;
            height = window.innerHeight;
            const styles = getComputedStyle(document.documentElement);
            const shareOf = (name, fallback) => clamp(parseFloat(styles.getPropertyValue(name)) || fallback, 30, 96) / 100;
            heroHorizon = Math.round(height * shareOf("--horizon", 68));
            innerHorizon = Math.round(height * shareOf("--horizon-inner", 86));
            canvas.width = Math.round(width * ratio);
            canvas.height = Math.round(height * ratio);
            scene.width = canvas.width;
            scene.height = Math.ceil(Math.max(heroHorizon, innerHorizon) * ratio);

            // The hero's words sit on the left (or the right, mirrored) on
            // wide screens and at the top on upright ones; the light behind
            // them is held down a little.
            upright = height > width;
            scrimFill = upright ? context.createLinearGradient(0, 0, 0, height) : context.createLinearGradient(0, 0, width, 0);
            scrimFill.addColorStop(0, "rgba(3, 38, 26, .55)");
            scrimFill.addColorStop(.42, "rgba(3, 38, 26, .2)");
            scrimFill.addColorStop(.62, "rgba(3, 38, 26, 0)");

            const random = seeded(29);
            clouds = Array.from({ length: 7 }, (_, index) => {
                const low = index < 3;
                return {
                    sprite: cloudSprites[index % cloudSprites.length],
                    x: random() * width * 1.5 - width * .25,
                    low,
                    // Low clouds sit this share of the screen above the waterline;
                    // high ones this share below the top.
                    rise: low ? .035 + random() * .07 : .04 + random() * .3,
                    size: (low ? .16 + random() * .1 : .26 + random() * .2) * Math.max(width, height * 1.2),
                    speed: (low ? .0025 : .0045) + random() * .004,
                    depth: low ? .02 : .045,
                    alpha: low ? .78 : .94
                };
            });
            glints = Array.from({ length: Math.round(clamp(width / (touchDevice ? 45 : 30), 12, 60)) }, () => ({
                x: random(),
                y: random(),
                length: 14 + random() * 90,
                drift: (random() - .5) * .012,
                speed: .0006 + random() * .0018,
                phase: random() * 6.3
            }));
        };

        // Where the slides are, eased like the slide transition itself.
        const panAt = (now) => {
            if (still) return pan.to;
            const t = Math.min(1, (now - pan.start) / SLIDE_MS);
            const eased = t < .5 ? 8 * t ** 4 : 1 - 8 * (t - 1) ** 4;
            return pan.from + (pan.to - pan.from) * eased;
        };

        const drawClouds = (slide, elapsed) => {
            clouds.forEach((cloud) => {
                if (!still) cloud.x += cloud.speed * elapsed;
                const w = cloud.size;
                const x = cloud.x - slide * width * cloud.depth;
                if (x > width + w * .6) cloud.x -= width + w * 1.2;
                if (x < -w * 1.6) cloud.x += width + w * 1.2;
                const y = cloud.low ? horizon - height * cloud.rise : height * cloud.rise;
                paint.globalAlpha = cloud.alpha;
                paint.drawImage(cloud.sprite, cloud.x - slide * width * cloud.depth - w / 2, y - w * .33, w, w * .4375);
            });
            paint.globalAlpha = 1;
        };

        // Now and then a few birds cross the sky in a loose V.
        const drawBirds = (now, elapsed) => {
            if (still) return;
            if (!flock && now > nextFlock) {
                const direction = Math.random() < .5 ? 1 : -1;
                const count = 3 + Math.floor(Math.random() * 3);
                flock = {
                    direction,
                    x: direction > 0 ? -60 : width + 60,
                    y: height * (.1 + Math.random() * .18),
                    speed: .045 + Math.random() * .025,
                    birds: Array.from({ length: count }, (_, index) => ({
                        dx: -index * 22 * direction,
                        dy: (index % 2 ? 1 : -1) * Math.ceil(index / 2) * 12,
                        phase: Math.random() * 6.3,
                        size: 6 + Math.random() * 4
                    }))
                };
            }
            if (!flock) return;
            flock.x += flock.speed * flock.direction * elapsed;
            paint.strokeStyle = "rgba(8, 46, 31, .72)";
            paint.lineWidth = 1.5;
            paint.lineCap = "round";
            flock.birds.forEach((bird) => {
                const x = flock.x + bird.dx;
                const y = flock.y + bird.dy + Math.sin(now * .002 + bird.phase) * 3;
                const flap = Math.sin(now * .012 + bird.phase) * bird.size * .55;
                paint.beginPath();
                paint.moveTo(x - bird.size, y - flap);
                paint.quadraticCurveTo(x - bird.size * .4, y - bird.size * .2, x, y);
                paint.quadraticCurveTo(x + bird.size * .4, y - bird.size * .2, x + bird.size, y - flap);
                paint.stroke();
            });
            if (flock.x < -260 || flock.x > width + 260) {
                flock = null;
                nextFlock = now + 9000 + Math.random() * 12000;
            }
        };

        // The Kurdish sun, as on the flag: a golden disc with 21 rays, turning
        // very slowly high in the sky, behind the clouds and the minaret.
        const drawSun = (g, slide, now) => {
            const r = Math.max(22, Math.min(width, height) * .042);
            const x = width * (.9 - slide * .015);
            const y = height * .15;
            const halo = g.createRadialGradient(x, y, r * .5, x, y, r * 4.5);
            halo.addColorStop(0, "rgba(255, 226, 140, .42)");
            halo.addColorStop(.4, "rgba(255, 226, 140, .12)");
            halo.addColorStop(1, "rgba(255, 226, 140, 0)");
            g.fillStyle = halo;
            g.fillRect(x - r * 4.5, y - r * 4.5, r * 9, r * 9);
            const turn = still ? 0 : now * .00003;
            const spread = (Math.PI / 21) * .62;
            const rays = g.createRadialGradient(x, y, r, x, y, r * 1.9);
            rays.addColorStop(0, "rgba(255, 214, 92, .95)");
            rays.addColorStop(1, "rgba(255, 214, 92, .35)");
            g.fillStyle = rays;
            g.beginPath();
            for (let index = 0; index < 21; index += 1) {
                const angle = turn + (index / 21) * Math.PI * 2;
                g.moveTo(x + Math.cos(angle - spread) * r * .96, y + Math.sin(angle - spread) * r * .96);
                g.lineTo(x + Math.cos(angle) * r * 1.9, y + Math.sin(angle) * r * 1.9);
                g.lineTo(x + Math.cos(angle + spread) * r * .96, y + Math.sin(angle + spread) * r * .96);
                g.closePath();
            }
            g.fill();
            const disc = g.createRadialGradient(x - r * .3, y - r * .3, r * .1, x, y, r);
            disc.addColorStop(0, "#fff6d2");
            disc.addColorStop(.55, "#ffd45e");
            disc.addColorStop(1, "#f1b232");
            g.fillStyle = disc;
            g.beginPath();
            g.arc(x, y, r, 0, Math.PI * 2);
            g.fill();
        };

        // Sky, sun, clouds and places: everything above the waterline.
        const drawScene = (slide, now, elapsed) => {
            paint.setTransform(ratio, 0, 0, ratio, 0, 0);
            if (rtl) {
                paint.translate(width, 0);
                paint.scale(-1, 1);
            }
            const sky = paint.createLinearGradient(0, 0, 0, horizon);
            sky.addColorStop(0, "#0c4733");
            sky.addColorStop(.3, "#186a4c");
            sky.addColorStop(.56, "#379670");
            sky.addColorStop(.78, "#82cba5");
            sky.addColorStop(.92, "#c9ecd8");
            sky.addColorStop(1, "#edf9f2");
            paint.fillStyle = sky;
            paint.fillRect(0, 0, width, horizon);
            // A warm light low in the sky, behind the hero orb.
            const glowX = width * (.68 - slide * .02);
            const glow = paint.createRadialGradient(glowX, horizon * .74, 0, glowX, horizon * .74, Math.max(width, height) * .62);
            glow.addColorStop(0, "rgba(250, 255, 236, .6)");
            glow.addColorStop(.24, "rgba(222, 248, 230, .3)");
            glow.addColorStop(.6, "rgba(196, 238, 212, .07)");
            glow.addColorStop(1, "rgba(196, 238, 212, 0)");
            paint.fillStyle = glow;
            paint.fillRect(0, 0, width, horizon);
            drawSun(paint, slide, now);
            drawClouds(slide, elapsed);
            drawBirds(now, elapsed);
            LAYERS.forEach((layer) => {
                const offset = slide * layer.depth * width + lean.x * layer.depth * 90;
                layer.items.forEach(([kind, at, size, option]) => {
                    const x = at * width - offset;
                    const s = size * height;
                    if (x < -s * 1.6 || x > width + s * 1.6) return;
                    PAINTERS[kind](kind === "citadel" ? layer.brick : layer.stone, x, horizon, s, option);
                });
            });
            // Low mist where the buildings meet the water.
            const mist = paint.createLinearGradient(0, horizon - height * .09, 0, horizon);
            mist.addColorStop(0, "rgba(226, 246, 234, 0)");
            mist.addColorStop(1, "rgba(226, 246, 234, .55)");
            paint.fillStyle = mist;
            paint.fillRect(0, horizon - height * .09, width, height * .09);
        };

        const draw = (now) => {
            const elapsed = Math.min(48, previous ? now - previous : 16);
            previous = now;
            rtl = isRTL();
            lean.x += (lean.target - lean.x) * .05;
            const slide = panAt(now);
            const dusk = clamp(slide, 0, 1);
            // Past the first slide the view tilts up: the waterline sinks.
            const ease = dusk * dusk * (3 - 2 * dusk);
            horizon = Math.round(heroHorizon + (innerHorizon - heroHorizon) * ease);
            drawScene(slide, now, elapsed);

            // The scene, then its reflection: rows from just above the
            // waterline, copied in reverse order below it, each nudged
            // sideways by small waves. Seen in perspective, the waves crowd
            // together near the horizon and spread out toward the viewer.
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.clearRect(0, 0, canvas.width, canvas.height);
            const top = Math.round(horizon * ratio);
            context.drawImage(scene, 0, 0, scene.width, top, 0, 0, scene.width, top);
            const depth = canvas.height - top;
            const strip = Math.max(2, Math.round((touchDevice ? 4 : 2) * ratio));
            for (let row = 0; row < depth; row += strip) {
                const source = top - row - strip;
                if (source < 0) break;
                const near = row / depth;
                const distance = 1 / (near + .06);
                const amp = (.25 + near * 2.4) * ratio;
                const shift = still ? 0 : (Math.sin(distance * 3.1 + now * .0019) + Math.sin(distance * 1.7 - now * .0011) * .6) * amp;
                context.drawImage(scene, 0, source, scene.width, strip, shift - amp * 1.6, top + row, canvas.width + amp * 3.2, strip);
            }

            context.setTransform(ratio, 0, 0, ratio, 0, 0);
            const water = context.createLinearGradient(0, horizon, 0, height);
            water.addColorStop(0, "rgba(8, 72, 50, .06)");
            water.addColorStop(.3, "rgba(6, 60, 41, .24)");
            water.addColorStop(1, "rgba(3, 38, 26, .56)");
            context.fillStyle = water;
            context.fillRect(0, horizon, width, height - horizon);
            // Light catching the ripples, longer and brighter up close.
            glints.forEach((glint) => {
                const y = horizon + 3 + glint.y ** 1.6 * (height - horizon - 3);
                const shine = still ? .5 : Math.max(0, Math.sin(now * glint.speed + glint.phase));
                const x = ((((glint.x * width + now * glint.drift) % (width + 160)) + width + 160) % (width + 160)) - 80;
                context.fillStyle = `rgba(240, 255, 246, ${(.06 + shine * .3).toFixed(3)})`;
                context.fillRect(x, y, glint.length * (.35 + glint.y), .8 + glint.y * 1.4);
            });
            context.fillStyle = "rgba(255, 255, 255, .6)";
            context.fillRect(0, horizon - .5, width, 1);

            // Every slide keeps the full daylight; the hero holds the light down a
            // little on the side of its words.
            if (dusk < .998) {
                context.globalAlpha = 1 - dusk;
                if (rtl && !upright) {
                    context.translate(width, 0);
                    context.scale(-1, 1);
                }
                context.fillStyle = scrimFill;
                context.fillRect(0, 0, width, height);
            }
            context.globalAlpha = 1;
        };

        // On phones and tablets the world is drawn at most 30 times a second.
        let lastDrawn = 0;
        const step = (now) => {
            if (!touchDevice || now - lastDrawn > 30) {
                lastDrawn = now;
                draw(now);
            }
            frame = window.requestAnimationFrame(step);
        };
        const start = () => {
            if (!frame && !still && document.visibilityState !== "hidden") {
                previous = 0;
                frame = window.requestAnimationFrame(step);
            }
        };
        const stop = () => {
            window.cancelAnimationFrame(frame);
            frame = 0;
        };
        const redrawStill = () => {
            if (still) draw(performance.now());
        };

        resize();
        nextFlock = performance.now() + 2500;
        draw(performance.now());
        start();
        window.addEventListener("resize", () => {
            resize();
            redrawStill();
        }, { passive: true });
        document.addEventListener("visibilitychange", () => (document.visibilityState === "hidden" ? stop() : start()));
        document.addEventListener("vayno:slide", (event) => {
            const now = performance.now();
            pan.from = panAt(now);
            pan.to = event.detail?.index ?? 0;
            pan.start = now;
            redrawStill();
        });
        document.addEventListener("vayno:lang", redrawStill);
        if (!still && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
            window.addEventListener("pointermove", (event) => {
                lean.target = event.clientX / width - .5;
            }, { passive: true });
        }
    }

    // ---- Hero ----
    // The headline types its changing word, holds it, deletes it and types the
    // next. Where that word sits comes from i18n ("{word}"), so Kurdish keeps
    // its verb at the end. The typing waits while the hero is off screen.
    function initHero() {
        const hero = document.querySelector(".hero");
        const before = hero?.querySelector('[data-part="before"]');
        const after = hero?.querySelector('[data-part="after"]');
        const word = hero?.querySelector(".hero-word");
        if (!hero || !before || !after || !word) return;
        const later = (callback, ms) => window.setTimeout(callback, ms);
        const isShowing = () => hero.classList.contains("is-current") && document.visibilityState !== "hidden";
        let words = [];
        let wordIndex = 0;
        let typing = 0;
        const layoutTitle = () => {
            const [lead = "", tail = ""] = t("hero.build").split("{word}");
            before.textContent = lead.trim();
            after.textContent = tail.trim();
            before.hidden = !before.textContent;
            after.hidden = !after.textContent;
            words = t("hero.words").split("|").map((item) => item.trim()).filter(Boolean);
            wordIndex = 0;
            word.textContent = words[0] || "";
        };
        const cycleWords = () => {
            window.clearTimeout(typing);
            hero.classList.add("is-typed");
            if (reducedMotion.matches || words.length < 2) return;
            let letters = Array.from(word.textContent);
            const type = () => {
                const full = Array.from(words[wordIndex]);
                letters.push(full[letters.length]);
                word.textContent = letters.join("");
                if (letters.length < full.length) {
                    typing = later(type, 55 + Math.random() * 55);
                } else {
                    hero.classList.add("is-typed");
                    typing = later(erase, 2400);
                }
            };
            const erase = () => {
                if (!isShowing()) {
                    typing = later(erase, 800);
                    return;
                }
                hero.classList.remove("is-typed");
                letters.pop();
                word.textContent = letters.join("");
                if (letters.length) {
                    typing = later(erase, 32);
                } else {
                    wordIndex = (wordIndex + 1) % words.length;
                    letters = [];
                    typing = later(type, 240);
                }
            };
            typing = later(erase, 2600);
        };

        layoutTitle();
        cycleWords();
        document.addEventListener("vayno:lang", () => {
            layoutTitle();
            cycleWords();
        });
    }

    // ---- Slide hint ----
    // A hand pops up under the hero's buttons and swipes toward the next
    // slide: soon after the site opens, then every five seconds while the
    // first slide shows, until the visitor has moved on once.
    function initSlideHint() {
        const hint = document.querySelector(".slide-hint");
        const hero = document.querySelector(".hero");
        if (!hint || !hero) return;
        let timer = 0;
        let learned = false;
        const show = () => {
            window.clearTimeout(timer);
            if (learned) return;
            const waiting = !hero.classList.contains("is-current")
                || document.documentElement.classList.contains("is-loading")
                || document.visibilityState === "hidden";
            if (waiting) {
                timer = window.setTimeout(show, 1000);
                return;
            }
            hint.classList.remove("is-showing");
            void hint.offsetWidth;
            hint.classList.add("is-showing");
            timer = window.setTimeout(show, 5000);
        };
        document.addEventListener("vayno:slide", (event) => {
            if ((event.detail?.index ?? 0) === 0) return;
            learned = true;
            window.clearTimeout(timer);
            hint.classList.remove("is-showing");
        });
        timer = window.setTimeout(show, 2400);
    }

    // ---- Quick links ----
    // Two buttons on the edge of the screen. On the first slide they show
    // their labels; elsewhere they fold to icons and open on hover or focus.
    // The one that leads to the slide already showing steps aside.
    function initDock() {
        const dock = document.querySelector(".side-dock");
        if (!dock) return;
        const panels = Array.from(document.querySelectorAll(".journey-panel"));
        const links = Array.from(dock.querySelectorAll("a"));
        const update = (index) => {
            dock.classList.toggle("is-open", index === 0);
            links.forEach((link) => link.classList.toggle("is-here", link.hash === `#${panels[index]?.id}`));
        };
        update(Math.max(0, panels.findIndex((panel) => panel.classList.contains("is-current"))));
        document.addEventListener("vayno:slide", (event) => update(event.detail?.index ?? 0));
    }

    async function initSite() {
        document.getElementById("current-year").textContent = String(new Date().getFullYear());
        // Language first, so everything below is built in the chosen language.
        initLanguage();
        initNavigation();
        const reveal = createReveal();
        initLoader(() => reveal.release(120));
        initBackdrop();
        initHorizontalJourney();
        initHero();
        initDock();
        initSlideHint();
        initCompanionAssistant();
        initScratchValues();
        initServices();
        initInquiryForm();
        initPointerEffects();
        rollLabels();
        decorateCards();
        initCardEffects();
        reveal.scan();
        let projects = [];
        let team = [];
        let loaded = false;
        try {
            const response = await fetch("/api/content", { headers: { Accept: "application/json" } });
            if (!response.ok) throw new Error("VAYNO content could not be loaded.");
            const content = await response.json();
            projects = Array.isArray(content.projects) ? content.projects : [];
            team = Array.isArray(content.team) ? content.team : [];
            loaded = true;
            initContact(content.contact || {});
        } catch {
            initContact({});
        }
        // Projects and team cards arrive from the server. They are drawn again
        // when the language changes, then dressed and given their entrances.
        const renderContent = () => {
            if (loaded) {
                initProjects(projects);
            } else {
                const viewport = document.querySelector(".project-track-viewport");
                viewport.querySelectorAll(".content-empty").forEach((node) => node.remove());
                const status = document.createElement("p");
                status.className = "content-empty";
                status.textContent = t("projects.unavailable");
                viewport.append(status);
            }
            initTeam(team);
            rollLabels();
            decorateCards();
            reveal.scan();
        };
        renderContent();
        document.addEventListener("vayno:lang", renderContent);
    }

    void initSite();
})();
