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
      {sections.map((section) => (
        <CollapsibleSection key={section!.title} title={section!.title}>
          <Prose
            className="overflow-x-auto text-sm leading-relaxed text-neutral-700 prose-img:my-4 prose-img:rounded-md prose-table:my-4 prose-table:w-full prose-table:border-collapse prose-th:bg-neutral-50 prose-th:px-3 prose-th:py-2 prose-th:text-left prose-td:px-3 prose-td:py-2 [&_tr]:border-b [&_tr]:border-neutral-200 [&_tr:nth-child(even)]:bg-neutral-50"
            html={section!.content}
          />
        </CollapsibleSection>
      ))}
    </div>
  );
}
