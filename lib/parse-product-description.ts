import type { ParsedDescription } from "types/product";
import sanitizeHtml from "sanitize-html";

const SECTION_PATTERNS = {
  description: [
    /la\s+description/i,
    /description/i,
    /détails?\s+du\s+produit/i,
    /about\s+this\s+product/i,
  ],
  weightAndDimensions: [
    /poids\s+et\s+dimensions/i,
    /dimensions/i,
    /weight\s+and\s+dimensions/i,
    /mesures/i,
  ],
  specifications: [
    /spécifications?/i,
    /caractéristiques/i,
    /specifications?/i,
    /details/i,
  ],
};

function matchesCategory(text: string, patterns: RegExp[]): boolean {
  return patterns.some((p) => p.test(text));
}

function stripTags(html: string): string {
  return decodeBasicEntities(html.replace(/<[^>]*>/g, "")).trim();
}

function decodeBasicEntities(text: string): string {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function sanitizeSectionContent(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "a",
      "b",
      "blockquote",
      "br",
      "caption",
      "code",
      "col",
      "colgroup",
      "dd",
      "div",
      "dl",
      "dt",
      "em",
      "figcaption",
      "figure",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "hr",
      "i",
      "img",
      "li",
      "ol",
      "p",
      "pre",
      "s",
      "span",
      "strong",
      "sub",
      "sup",
      "table",
      "tbody",
      "td",
      "tfoot",
      "th",
      "thead",
      "tr",
      "u",
      "ul",
    ],
    allowedAttributes: {
      a: ["href", "name", "target", "rel", "title"],
      col: ["span", "width", "style"],
      colgroup: ["span", "width", "style"],
      img: ["src", "alt", "width", "height", "loading", "style"],
      table: [
        "align",
        "border",
        "cellpadding",
        "cellspacing",
        "summary",
        "width",
        "style",
      ],
      td: ["align", "colspan", "rowspan", "valign", "width", "style"],
      th: ["align", "colspan", "rowspan", "scope", "valign", "width", "style"],
      tr: ["align", "valign", "style"],
      "*": ["class"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: {
      img: ["http", "https"],
    },
    allowedStyles: {
      "*": {
        "text-align": [/^left$/i, /^right$/i, /^center$/i, /^justify$/i],
        "vertical-align": [/^top$/i, /^middle$/i, /^bottom$/i, /^baseline$/i],
        width: [/^\d+(?:\.\d+)?(?:px|%|em|rem)?$/i],
        height: [/^\d+(?:\.\d+)?(?:px|%|em|rem)?$/i],
      },
      table: {
        "border-collapse": [/^collapse$/i, /^separate$/i],
        width: [/^\d+(?:\.\d+)?(?:px|%|em|rem)?$/i],
      },
      img: {
        width: [/^(?:auto|\d+(?:\.\d+)?(?:px|%|em|rem)?)$/i],
        height: [/^(?:auto|\d+(?:\.\d+)?(?:px|%|em|rem)?)$/i],
      },
    },
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
      img: sanitizeHtml.simpleTransform("img", { loading: "lazy" }),
    },
  }).trim();
}

/**
 * Parse a Shopify descriptionHtml into three collapsible sections.
 *
 * The algorithm looks for heading-level elements (h1-h6, or <strong>/<b> inside <p>
 * at the start of a block) that match the known section titles. Everything between
 * two headings belongs to the preceding section.
 *
 * If no recognisable headings are found the entire description falls into the
 * "description" bucket.
 */
export function parseProductDescription(html: string): ParsedDescription {
  if (!html || !html.trim()) {
    return {
      description: null,
      weightAndDimensions: null,
      specifications: null,
    };
  }

  const headingRe =
    /<(h[1-6])[^>]*>([\s\S]*?)<\/\1>|<p[^>]*>\s*<(?:strong|b)>([\s\S]*?)<\/(?:strong|b)>\s*<\/p>/gi;

  const headings: { index: number; end: number; text: string }[] = [];
  let match: RegExpExecArray | null;

  while ((match = headingRe.exec(html)) !== null) {
    const rawText = stripTags(match[2] || match[3] || "");
    if (rawText.length > 0 && rawText.length < 80) {
      headings.push({
        index: match.index,
        end: match.index + match[0].length,
        text: rawText,
      });
    }
  }

  if (headings.length === 0) {
    return {
      description: {
        title: "La description",
        content: sanitizeSectionContent(html),
      },
      weightAndDimensions: null,
      specifications: null,
    };
  }

  const sections: { title: string; content: string; category: string }[] = [];

  if (headings[0]!.index > 0) {
    const beforeFirst = html.slice(0, headings[0]!.index).trim();
    if (beforeFirst) {
      sections.push({
        title: "La description",
        content: beforeFirst,
        category: "description",
      });
    }
  }

  for (let i = 0; i < headings.length; i++) {
    const heading = headings[i]!;
    const nextStart = headings[i + 1]?.index ?? html.length;
    const content = html.slice(heading.end, nextStart).trim();
    const title = heading.text;

    let category = "description";
    if (matchesCategory(title, SECTION_PATTERNS.weightAndDimensions)) {
      category = "weightAndDimensions";
    } else if (matchesCategory(title, SECTION_PATTERNS.specifications)) {
      category = "specifications";
    }

    sections.push({ title, content, category });
  }

  const result: ParsedDescription = {
    description: null,
    weightAndDimensions: null,
    specifications: null,
  };

  const descSections = sections.filter((s) => s.category === "description");
  const wdSections = sections.filter(
    (s) => s.category === "weightAndDimensions",
  );
  const specSections = sections.filter((s) => s.category === "specifications");

  if (descSections.length > 0) {
    result.description = {
      title: descSections[0]!.title,
      content: sanitizeSectionContent(
        descSections.map((s) => s.content).join("\n"),
      ),
    };
  }

  if (wdSections.length > 0) {
    result.weightAndDimensions = {
      title: wdSections[0]!.title,
      content: sanitizeSectionContent(
        wdSections.map((s) => s.content).join("\n"),
      ),
    };
  }

  if (specSections.length > 0) {
    result.specifications = {
      title: specSections[0]!.title,
      content: sanitizeSectionContent(
        specSections.map((s) => s.content).join("\n"),
      ),
    };
  }

  if (
    !result.description &&
    !result.weightAndDimensions &&
    !result.specifications
  ) {
    result.description = {
      title: "La description",
      content: sanitizeSectionContent(html),
    };
  }

  return result;
}
