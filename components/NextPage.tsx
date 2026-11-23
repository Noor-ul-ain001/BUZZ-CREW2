import Link from "next/link";
import { PAGES } from "@/lib/content";

/** Big "next page" link that closes every inner page. Wraps back to Home after Contact. */
export default function NextPage({ id }: { id: string }) {
  const i = PAGES.findIndex((p) => p.id === id);
  const next = PAGES[(i + 1) % PAGES.length];

  return (
    <section className="np" aria-label="Next page">
      <Link href={next.href} className="np__link" data-cursor="Next">
        <span className="np__fill" aria-hidden="true" />
        <span className="np__label">
          Next page <i>{String(((i + 1) % PAGES.length) + 1).padStart(2, "0")}</i>
        </span>
        <span className="np__title">
          <span className="np__text">
            <span className="np__roll" data-text={next.label}>
              {next.label}
            </span>
          </span>
          <span className="np__arrow" aria-hidden="true">
            →
          </span>
        </span>
      </Link>
    </section>
  );
}
