// src/services/api.js
function getStoredUrls() {
  return JSON.parse(localStorage.getItem("urls") || "[]");
}

function saveStoredUrls(urls) {
  localStorage.setItem("urls", JSON.stringify(urls));
}

export const api = {
  async shortenUrl({ url, validity, code }) {
    if (!url) throw new Error("URL is required");

    // default validity = 30 mins
    const minutes = validity && validity > 0 ? validity : 30;
    const createdAt = Date.now();
    const expiresAt = createdAt + minutes * 60 * 1000;

    let shortcode = code && code.trim() !== "" ? code.trim() : Math.random().toString(36).substring(2, 8);

    const urls = getStoredUrls();
    if (urls.find((u) => u.code === shortcode)) {
      throw new Error("Shortcode already exists");
    }

    const newEntry = {
      url,
      code: shortcode,
      createdAt,
      expiresAt,
      clicks: 0,
      shortUrl: `http://localhost:3000/${shortcode}`,
    };

    urls.push(newEntry);
    saveStoredUrls(urls);
    return newEntry;
  },

  async getUrls() {
    return getStoredUrls();
  },

  async visitShortcode(code) {
    const urls = getStoredUrls();
    const entry = urls.find((u) => u.code === code);

    if (!entry) throw new Error("Short URL not found");
    if (Date.now() > entry.expiresAt) throw new Error("This short URL has expired");

    entry.clicks++;
    saveStoredUrls(urls);

    return entry.url;
  },
};
