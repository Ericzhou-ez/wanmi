import type { ParsedDescription } from "types/product";

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

function matchesCategory(
  text: string,
  patterns: RegExp[],
): boolean {
  return patterns.some((p) => p.test(text));
}

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
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
    return { description: null, weightAndDimensions: null, specifications: null };
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
      description: { title: "La description", content: html },
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
      content: descSections.map((s) => s.content).join(""),
    };
  }

  if (wdSections.length > 0) {
    result.weightAndDimensions = {
      title: wdSections[0]!.title,
      content: wdSections.map((s) => s.content).join(""),
    };
  }

  if (specSections.length > 0) {
    result.specifications = {
      title: specSections[0]!.title,
      content: specSections.map((s) => s.content).join(""),
    };
  }

  if (!result.description && !result.weightAndDimensions && !result.specifications) {
    result.description = { title: "La description", content: html };
  }

  return result;
}
