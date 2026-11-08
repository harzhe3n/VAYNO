"use strict";

require("dotenv").config();

const crypto = require("node:crypto");
const http = require("node:http");
const path = require("node:path");
const fs = require("node:fs");
const nodemailer = require("nodemailer");

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "127.0.0.1";
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT = 5;
const MAX_BODY_BYTES = 16 * 1024;
const rateBuckets = new Map();
const contentFile = path.join(__dirname, "data", "site-content.json");
const staticFiles = new Map([
    ["/", ["index.html", "text/html; charset=utf-8"]],
    ["/index.html", ["index.html", "text/html; charset=utf-8"]],
    ["/styles.css", ["styles.css", "text/css; charset=utf-8"]],
    ["/script.js", ["script.js", "text/javascript; charset=utf-8"]],
    ["/i18n.js", ["i18n.js", "text/javascript; charset=utf-8"]]
]);
// Every image inside assets/ is served as it is; nothing needs listing here.
const assetsDir = path.join(__dirname, "assets");
const imageTypes = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".svg": "image/svg+xml"
};

// Maps "/assets/..." to [file, content type] when it is an image inside assets/, else null.
function findAsset(urlPath) {
    if (typeof urlPath !== "string" || !urlPath.startsWith("/assets/")) return null;
    let relative;
    try { relative = decodeURIComponent(urlPath.slice("/assets/".length)); } catch { return null; }
    const type = imageTypes[path.extname(relative).toLowerCase()];
    if (!type || relative.includes("\0")) return null;
    const file = path.resolve(assetsDir, relative);
    if (!file.startsWith(assetsDir + path.sep)) return null;
    try { if (!fs.statSync(file).isFile()) return null; } catch { return null; }
    return [path.relative(__dirname, file), type];
}

const defaultContent = {
    projects: [],
    team: [],
    contact: {
        email: "",
        whatsappNumber: "",
        instagramUrl: "",
        tiktokUrl: ""
    }
};

const projectTypes = {
    website: "Website development",
    software: "Software development",
    ai: "AI development",
    uiux: "UI/UX design",
    graphic: "Graphic design",
    motion: "Motion graphics",
    other: "Other"
};
// Budget ranges offered by the form, as written in the Telegram message and email.
const budgets = {
    "50-100": "$50 – $100",
    "100-1000": "$100 – $1,000",
    "1000+": "$1,000 and more"
};
const contactMethods = new Set(["", "whatsapp", "email"]);

function sendJson(response, status, data) {
    response.writeHead(status, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff"
    });
    response.end(JSON.stringify(data));
}

function secureHeaders(response) {
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("X-Frame-Options", "DENY");
    response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    response.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    response.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'");
}

function cleanText(value, field, maxLength, required = false) {
    if (value == null && required) throw new Error(`${field} is required.`);
    if (typeof value !== "string") throw new Error(`${field} is invalid.`);
    const cleaned = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
    if (cleaned.length > maxLength) throw new Error(`${field} is too long.`);
    if (required && !cleaned) throw new Error(`${field} is required.`);
    return cleaned;
}

function validateInquiry(input) {
    if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Invalid form submission.");
    const name = cleanText(input.name, "Full name", 100, true);
    const email = cleanText(input.email, "Email address", 254, true);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || /[\r\n]/.test(email)) {
        throw new Error("Enter a valid email address.");
    }
    const company = cleanText(input.company ?? "", "Company", 120);
    const projectType = cleanText(input.projectType, "Project type", 30, true);
    if (!Object.hasOwn(projectTypes, projectType)) throw new Error("Choose a valid project type.");
    const subject = cleanText(input.subject, "Subject", 160, true);
    const description = cleanText(input.description, "Project description", 5000, true);
    const budget = cleanText(input.budget ?? "", "Budget", 20);
    if (budget && !Object.hasOwn(budgets, budget)) throw new Error("Choose a valid budget range.");
    const contactMethod = cleanText(input.contactMethod ?? "", "Preferred contact method", 20);
    if (!contactMethods.has(contactMethod)) throw new Error("Choose a valid contact method.");
    const website = cleanText(input.website ?? "", "Website", 200);
    return { name, email, company, projectType, subject, description, budget, contactMethod, website };
}

function escapeHtml(value) {
    return value.replace(/[&<>"']/g, (character) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
}

function buildMail(inquiry, reference) {
    const submittedAt = new Date().toISOString();
    const rows = [
        ["Inquiry reference", reference],
        ["Customer name", inquiry.name],
        ["Customer email", inquiry.email],
        ["Company", inquiry.company || "Not provided"],
        ["Project type", projectTypes[inquiry.projectType]],
        ["Subject", inquiry.subject],
        ["Project description", inquiry.description],
        ["Budget range", budgets[inquiry.budget] || "Not provided"],
        ["Preferred contact method", inquiry.contactMethod || "Not provided"],
        ["Submitted (UTC)", submittedAt]
    ];
    const htmlRows = rows.map(([label, value]) =>
        `<tr><th align="left" valign="top" style="padding:10px;border-bottom:1px solid #25262b;color:#c6a76a;font:12px Arial">${escapeHtml(label)}</th><td style="padding:10px;border-bottom:1px solid #25262b;color:#f4f2ed;font:14px Arial;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`
    ).join("");
    const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n\n");
    return {
        subject: `[VAYNO Inquiry ${reference}] ${inquiry.subject}`,
        text,
        html: `<div style="background:#08090b;padding:32px;font-family:Arial,sans-serif"><div style="max-width:700px;margin:auto"><p style="color:#c6a76a;font-size:11px;letter-spacing:3px">VAYNO / PROJECT INQUIRY</p><h1 style="color:#f4f2ed;font-size:24px;font-weight:500">A new project inquiry</h1><p style="color:#92939a">Reference <strong style="color:#c6a76a">${reference}</strong></p><table role="presentation" style="width:100%;border-collapse:collapse">${htmlRows}</table><p style="margin-top:24px;color:#92939a;font-size:11px">From the Mountains to the World.</p></div></div>`
    };
}

function getRateLimitKey(request) {
    return request.socket.remoteAddress || "unknown";
}

function isRateLimited(request) {
    const now = Date.now();
    const key = getRateLimitKey(request);
    const current = rateBuckets.get(key);
    if (!current || now - current.start >= RATE_WINDOW_MS) {
        rateBuckets.set(key, { start: now, count: 1 });
        return false;
    }
    current.count += 1;
    return current.count > RATE_LIMIT;
}

function readJson(request, maxBytes = MAX_BODY_BYTES) {
    return new Promise((resolve, reject) => {
        let size = 0;
        const chunks = [];
        request.on("data", (chunk) => {
            size += chunk.length;
            if (size > maxBytes) {
                reject(Object.assign(new Error("Request body is too large."), { status: 413 }));
                request.resume();
                return;
            }
            chunks.push(chunk);
        });
        request.on("end", () => {
            if (size > maxBytes) return;
            try {
                resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
            } catch {
                reject(Object.assign(new Error("Request must contain valid JSON."), { status: 400 }));
            }
        });
        request.on("error", reject);
    });
}

function validatePublicUrl(value, field, allowAssetPath = false) {
    const url = cleanText(value ?? "", field, 2048);
    if (!url) return "";
    if (allowAssetPath && url.startsWith("/assets/")) {
        if (findAsset(url)) return url;
        throw new Error(`${field} "${url}" was not found in the assets folder.`);
    }
    let parsed;
    try { parsed = new URL(url); } catch { throw new Error(`${field} must be a valid HTTPS URL.`); }
    if (parsed.protocol !== "https:" || !parsed.hostname || parsed.username || parsed.password) {
        throw new Error(`${field} must be a valid HTTPS URL.`);
    }
    return parsed.href;
}

// The optional "how it works" write-up opened from a project card: a summary and
// screenshot sections, each on the public website or in the admin panel.
function validateProjectDetails(details, projectName) {
    if (details == null) return null;
    const where = `"${projectName}" details`;
    if (typeof details !== "object" || Array.isArray(details)) throw new Error(`${where} are invalid.`);
    if (!Array.isArray(details.sections) || details.sections.length > 16) throw new Error(`${where} need a list of up to 16 sections.`);
    return {
        summary: cleanText(details.summary ?? "", `${where} summary`, 1200),
        sections: details.sections.map((section, index) => {
            const label = `${where}, section ${index + 1}`;
            if (!section || typeof section !== "object" || Array.isArray(section)) throw new Error(`${label} is invalid.`);
            const group = section.group ?? "site";
            if (group !== "site" && group !== "admin") throw new Error(`${label}: group must be "site" or "admin".`);
            return {
                group,
                title: cleanText(section.title, `${label} title`, 100, true),
                text: cleanText(section.text, `${label} text`, 800, true),
                image: validatePublicUrl(section.image, `${label} image`, true)
            };
        })
    };
}

function validateSiteContent(input) {
    if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Invalid site content.");
    if (!Array.isArray(input.projects) || input.projects.length > 40) throw new Error("Projects must be a list of up to 40 entries.");
    if (!Array.isArray(input.team) || input.team.length > 30) throw new Error("Team members must be a list of up to 30 entries.");
    const projects = input.projects.map((project) => {
        if (!project || typeof project !== "object" || Array.isArray(project)) throw new Error("A project entry is invalid.");
        if (!Array.isArray(project.tags) || project.tags.length > 8) throw new Error("Each project can have up to 8 tags.");
        return {
            name: cleanText(project.name, "Project name", 100, true),
            category: cleanText(project.category, "Project category", 100, true),
            imageUrl: validatePublicUrl(project.imageUrl, "Project image", true),
            portfolioUrl: validatePublicUrl(project.portfolioUrl, "Project link"),
            tags: project.tags.map((tag) => cleanText(tag, "Project tag", 32, true)),
            details: validateProjectDetails(project.details, project.name)
        };
    });
    const team = input.team.map((member) => {
        if (!member || typeof member !== "object" || Array.isArray(member)) throw new Error("A team member entry is invalid.");
        return {
            name: cleanText(member.name, "Team member name", 80, true),
            role: cleanText(member.role, "Team member role", 80, true),
            description: cleanText(member.description, "Team member description", 500, true),
            photoUrl: validatePublicUrl(member.photoUrl, "Profile photo", true),
            portfolioUrl: validatePublicUrl(member.portfolioUrl, "Portfolio link")
        };
    });
    if (!input.contact || typeof input.contact !== "object" || Array.isArray(input.contact)) throw new Error("Contact details are invalid.");
    const email = cleanText(input.contact.email ?? "", "Contact email", 254);
    if (email && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || /[\r\n]/.test(email))) {
        throw new Error("Enter a valid contact email address.");
    }
    const whatsappNumber = cleanText(input.contact.whatsappNumber ?? "", "WhatsApp number", 15);
    if (whatsappNumber && !/^\d{8,15}$/.test(whatsappNumber)) throw new Error("WhatsApp must be 8–15 digits including the country code.");
    return {
        projects,
        team,
        contact: {
            email,
            whatsappNumber,
            instagramUrl: validatePublicUrl(input.contact.instagramUrl, "Instagram link"),
            tiktokUrl: validatePublicUrl(input.contact.tiktokUrl, "TikTok link")
        }
    };
}

function loadSiteContent() {
    try {
        return validateSiteContent(JSON.parse(fs.readFileSync(contentFile, "utf8")));
    } catch (error) {
        if (error.code === "ENOENT") return validateSiteContent(defaultContent);
        throw error;
    }
}

function publicContent(request, response) {
    if (request.method !== "GET") {
        response.setHeader("Allow", "GET");
        return sendJson(response, 405, { error: "Method not allowed." });
    }
    try { return sendJson(response, 200, loadSiteContent()); }
    catch (error) {
        // data/site-content.json is edited by hand, so say what is wrong with it.
        console.error(`data/site-content.json could not be loaded: ${error.message}`);
        return sendJson(response, 500, { error: "Site content is temporarily unavailable." });
    }
}

function getTransport() {
    const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env;
    const port = Number(SMTP_PORT || 587);
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !Number.isInteger(port) || port < 1 || port > 65535) return null;
    const secure = SMTP_SECURE === "true";
    return nodemailer.createTransport({
        host: SMTP_HOST,
        port,
        secure,
        requireTLS: !secure,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 20000
    });
}

function telegramConfigured() {
    return /^\d+:[\w-]+$/.test(process.env.TELEGRAM_BOT_TOKEN || "") && /^-?\d+$/.test(process.env.TELEGRAM_CHAT_ID || "");
}

// Sends the inquiry to the agency's Telegram chat. Telegram caps a message at
// 4096 characters, so a long description is split across several messages.
async function sendTelegram(inquiry, reference) {
    const rows = [
        ["Reference", reference],
        ["Name", inquiry.name],
        ["Email", inquiry.email],
        ["Company", inquiry.company || "Not provided"],
        ["Project type", projectTypes[inquiry.projectType]],
        ["Budget", budgets[inquiry.budget] || "Not provided"],
        ["Preferred contact", inquiry.contactMethod || "Not provided"],
        ["Subject", inquiry.subject]
    ];
    const header = `<b>New VAYNO project inquiry</b>\n\n${rows.map(([label, value]) => `<b>${label}:</b> ${escapeHtml(value)}`).join("\n")}\n\n<b>Project description:</b>\n`;
    const limit = 3800;
    const parts = [];
    let rest = inquiry.description;
    let first = header;
    while (rest || first) {
        const room = limit - (first ? first.length : 0);
        // Escaping (& -> &amp;) makes text longer, so shrink until it fits.
        let take = Math.min(rest.length, room);
        while (take > 0 && escapeHtml(rest.slice(0, take)).length > room) take = Math.floor(take * 0.8);
        parts.push((first || "") + escapeHtml(rest.slice(0, take)));
        rest = rest.slice(take);
        first = "";
    }
    for (const text of parts) {
        const result = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text, parse_mode: "HTML", disable_web_page_preview: true }),
            signal: AbortSignal.timeout(15000)
        });
        const body = await result.json().catch(() => ({}));
        if (!result.ok || !body.ok) throw new Error(`Telegram answered ${result.status}: ${body.description || "unknown error"}`);
    }
}

async function submitInquiry(request, response) {
    if (request.method !== "POST") {
        response.setHeader("Allow", "POST");
        return sendJson(response, 405, { error: "Method not allowed." });
    }
    if (isRateLimited(request)) {
        return sendJson(response, 429, { error: "Too many attempts. Please wait before trying again." });
    }
    if (!String(request.headers["content-type"] || "").toLowerCase().startsWith("application/json")) {
        return sendJson(response, 415, { error: "Submit the inquiry as JSON." });
    }
    const declaredLength = Number(request.headers["content-length"] || 0);
    if (declaredLength > MAX_BODY_BYTES) {
        return sendJson(response, 413, { error: "Request body is too large." });
    }

    let inquiry;
    try {
        inquiry = validateInquiry(await readJson(request));
    } catch (error) {
        return sendJson(response, error.status || 400, { error: error.message || "Invalid form submission." });
    }
    if (inquiry.website) return sendJson(response, 400, { error: "The inquiry could not be accepted." });

    // Each configured channel gets the inquiry; it counts as delivered if any succeeds.
    const channels = [];
    if (telegramConfigured()) channels.push(["Telegram", (reference) => sendTelegram(inquiry, reference)]);
    const transport = getTransport();
    const recipient = process.env.AGENCY_EMAIL;
    const sender = process.env.FROM_EMAIL;
    if (transport && recipient && sender) {
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sender)) {
            channels.push(["Email", (reference) => transport.sendMail({
                from: sender,
                to: recipient,
                replyTo: inquiry.email,
                ...buildMail(inquiry, reference)
            })]);
        } else {
            console.error("Inquiry email configuration contains an invalid sender or recipient address.");
        }
    }
    if (!channels.length) {
        return sendJson(response, 503, { error: "Inquiry delivery is not configured yet. Please try again later." });
    }

    const date = new Date();
    const reference = `VY-${date.toISOString().slice(0, 10).replace(/-/g, "")}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
    const results = await Promise.allSettled(channels.map(([, send]) => send(reference)));
    results.forEach((result, index) => {
        if (result.status === "rejected") {
            console.error(`Inquiry ${channels[index][0]} delivery failed.`, { reference, error: result.reason?.code || result.reason?.message || "unknown" });
        }
    });
    if (!results.some((result) => result.status === "fulfilled")) {
        return sendJson(response, 502, { error: "We couldn't deliver your inquiry right now. Please try again." });
    }
    return sendJson(response, 201, { reference });
}

function serveStatic(urlPath, response, method) {
    const entry = staticFiles.get(urlPath) || findAsset(urlPath);
    if (!entry) {
        response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8", "X-Content-Type-Options": "nosniff" });
        return response.end("Not found");
    }
    const filePath = path.join(__dirname, entry[0]);
    fs.readFile(filePath, (error, content) => {
        if (error) {
            console.error("Static file could not be read.", { file: entry[0], code: error.code });
            response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
            return response.end("Unable to serve this page.");
        }
        response.writeHead(200, {
            "Content-Type": entry[1],
            // Photos and the logo rarely change and the 4K slides are large, so
            // browsers keep them for a week; pages, styles and scripts revalidate.
            "Cache-Control": entry[1].startsWith("image/") ? "public, max-age=604800" : "no-cache",
            "X-Content-Type-Options": "nosniff"
        });
        response.end(method === "HEAD" ? undefined : content);
    });
}

const server = http.createServer((request, response) => {
    secureHeaders(response);
    let url;
    try {
        url = new URL(request.url, `http://${request.headers.host || "localhost"}`);
    } catch {
        return sendJson(response, 400, { error: "Invalid request URL." });
    }
    if (url.pathname === "/api/inquiries") return void submitInquiry(request, response);
    if (url.pathname === "/api/content") return void publicContent(request, response);
    if (request.method !== "GET" && request.method !== "HEAD") {
        response.setHeader("Allow", "GET, HEAD");
        return sendJson(response, 405, { error: "Method not allowed." });
    }
    return serveStatic(url.pathname, response, request.method);
});

server.listen(PORT, HOST, () => {
    console.log(`VAYNO website listening on http://${HOST}:${PORT}`);
});

const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of rateBuckets) {
        if (now - bucket.start >= RATE_WINDOW_MS) rateBuckets.delete(key);
    }
}, RATE_WINDOW_MS);
cleanupTimer.unref();
