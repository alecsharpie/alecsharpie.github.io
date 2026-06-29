# Blog → EPUB

*A small CLI that turns a blog's archive into a single clean EPUB you can read on a
Kindle or Kobo — no app, no account, no distraction.*

I read a lot of long technical writing (the Anthropic engineering blog, research posts,
Slate Star Codex) and I'd rather read it on e-ink, away from the browser, than in yet
another tab. Copy-pasting articles one at a time is miserable, and "send to Kindle"
bookmarklets choke on multi-post archives. So I made a tool that does the whole blog at
once.

Point it at a blog, it walks the archive page, downloads every article, strips the
navigation / ads / footers, and stitches the real content into one HTML file with a
table of contents — which Calibre then converts to a tidy EPUB.

```bash
# list the blogs I've pre-configured
uv run python blog_to_epub.py --list

# grab one (text only, ~340 KB) or with images (~15 MB)
uv run python blog_to_epub.py anthropic-engineering
uv run python blog_to_epub.py anthropic-engineering --images

# Calibre does the final HTML -> EPUB step
ebook-convert anthropic-engineering.html anthropic-engineering.epub \
    --title "Anthropic Engineering Blog" --authors "Anthropic" \
    --level1-toc "//h:article/h:h1"
```

## What makes it actually work

The hard part of scraping arbitrary blogs is *content extraction* — finding the article
and throwing away everything else. Rather than hand-write rules per site, it leans on
[**trafilatura**](https://github.com/adbar/trafilatura), which gets the main content
right on ~95% of sites. Each article becomes one `<article>` with an `<h1>`, so Calibre's
`--level1-toc` builds a chapter list automatically.

Adding a new blog is just one entry in `BLOG_CONFIGS` — a name, the archive URL, and a
CSS selector for the article links:

```python
"simonwillison": BlogConfig(
    name="Simon Willison's Weblog",
    base_url="https://simonwillison.net",
    index_url="https://simonwillison.net/archive/",
    article_link_selector="a[href*='/simonwillison.net/2']",
    link_prefix="",          # links are already full URLs
    request_delay=1.0,       # be a polite scraper
),
```

The README in the repo has a fuller cookbook — selector patterns for `/blog/`,
`/posts/`, Substacks, etc., plus the Calibre flags for covers, fonts and `.mobi` for
older Kindles.

## The pipeline

1. **Fetch** the archive page.
2. **Find** article URLs (BeautifulSoup + a CSS selector).
3. **Download** each article, with a delay between requests.
4. **Extract** just the article body with trafilatura.
5. **Stitch** into one HTML file with a table of contents.
6. **Convert** to EPUB with Calibre's `ebook-convert`.

Requires Python 3.10+, [uv](https://github.com/astral-sh/uv), and
[Calibre](https://calibre-ebook.com/). MIT licensed — point it at your own reading list.
