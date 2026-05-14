"use client";

import { CollapsibleSection } from "./collapsible-section";
import type { ParsedDescription } from "types/product";
import Prose from "components/prose";

export function ProductDetailsSections({
  parsedDescription,
}: {
  parsedDescription: ParsedDescription;
}) {
  const sections = [
    parsedDescription.description,
    parsedDescription.weightAndDimensions,
    parsedDescription.specifications,
  ].filter(Boolean);

  if (sections.length === 0) return null;

  return (
    <div className="mt-8" id="details-section">
      {sections.map((section, idx) => (
        <CollapsibleSection
          key={section!.title}
          title={section!.title}
          defaultOpen={idx === 0}
        >
          <Prose
            className="text-sm leading-relaxed text-neutral-700"
            html={section!.content}
          />
        </CollapsibleSection>
      ))}
    </div>
  );
}
