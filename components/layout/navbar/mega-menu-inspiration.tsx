import Image from "next/image";
import Link from "next/link";

export type MegaMenuInspirationProps = {
  title: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
};

export function MegaMenuInspiration({
  title,
  href,
  imageSrc,
  imageAlt,
}: MegaMenuInspirationProps) {
  return (
    <div className="mt-auto border-t border-neutral-200 pt-4">
      <Link href={href} className="group/inspo block">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-900 transition-colors group-hover/inspo:text-red-600">
          {title}
        </p>
        <div className="relative mt-2 aspect-[16/10] w-full overflow-hidden bg-neutral-100">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover transition duration-300 group-hover/inspo:scale-[1.02]"
            sizes="(min-width: 1024px) 18vw, 40vw"
          />
        </div>
      </Link>
    </div>
  );
}
