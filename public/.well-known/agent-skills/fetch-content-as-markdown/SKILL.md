---
name: fetch-content-as-markdown
description: Use this when you want Nikolay's content as clean Markdown instead of parsing HTML - for summarizing a page, answering questions about the site, or indexing it. Covers the machine-readable endpoints this site exposes; no authentication required.
---

# Fetching Nikolay's content as Markdown

This site exposes its content in Markdown alongside the HTML pages. Prefer the Markdown URLs below over fetching and parsing HTML.

## Endpoints

- `https://nikolaynikolaev.com/llms.txt` - a curated index of the site's most important pages, one line per entry with a short description. Start here for an overview.
- `https://nikolaynikolaev.com/index.md` - the Markdown for the home page. Use this instead of fetching and parsing the HTML version; use HTML only as a fallback.

## Notes

- These are plain GET requests, no authentication, served as `text/plain` or `text/markdown`.
- Content reflects what's currently published - there's no separate draft/staging feed.