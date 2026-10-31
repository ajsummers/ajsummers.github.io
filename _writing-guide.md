# Writing guide

Formatting reference for the write-up pages. This file starts with an
underscore, so it lives in the repo but is never published on the site.

## Paragraph styles

Put one of these lines directly above a paragraph, with no blank line in
between. A paragraph with no `{: ...}` line is normal body text.

Placeholders (draft text; delete the line once the paragraph is written):

| Line | Look |
|---|---|
| `{: .placeholder}` | dashed box |
| `{: .placeholder-bar}` | accent bar on the left |
| `{: .placeholder-tint}` | tinted block |
| `{: .placeholder-todo}` | "TODO" tag |
| `{: .placeholder-plain}` | grey italics |

Finished writing:

| Line | Look |
|---|---|
| `{: .lead}` | larger opening paragraph, once at the top |
| `{: .note}` | callout box; start it with a bold label such as `**Note**`, `**Tip**` or `**Warning**` on its own line |

## Code

Wrap code in ```` ```c ```` or ```` ```python ```` fences for syntax colouring.

To make a code block foldable, put one of these lines directly above the
opening fence. A code block with no `{: ...}` line is always visible.

| Line | Result |
|---|---|
| `{: .fold-code}` | foldable, open when the page loads |
| `{: .fold-code .folded}` | foldable, folded when the page loads |
| `{: .fold-code data-label="ADC setup"}` | custom bar text (default is "C code" / "Python code"); works with `.folded` too |

## Headings

`##` gets a divider line and appears in the "On this page" list (if the page
has one). `###` and `####` are subsections. Every `##` to `####` heading can
be folded by clicking it.

To add an "On this page" list:

```markdown
**On this page**

* TOC
{:toc}
```

## Images

Put images in the project's `images` folder, for example
`learning-in-2kb/images/`, then use either form:

```markdown
![Description of the image](/learning-in-2kb/images/file-name.png)
```

```html
<img src="/learning-in-2kb/images/file-name.png" alt="Description of the image" width="400"/>
```

## Section pages (Learning in 2 KB)

Each part, such as Part 1: Temperature, has a folder of section pages and a
list of them in `_data/<part>.yml` (for example `_data/temperature.yml`).
That list sets the order, titles, card descriptions and card pictures, and
the previous/next links are built from it.

To add a section:

1. Add an entry to `_data/temperature.yml` with `title`, `url`, `summary`
   and, optionally, `image`.
2. Create the page in `learning-in-2kb/temperature/` with this front matter,
   where the file name matches the end of the `url`:

   ```yaml
   ---
   title: Section title
   layout: writeup
   part: temperature
   ---
   ```

The "Section N of M" line, the link back to the part, and the
previous/next links are added automatically.
