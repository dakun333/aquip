import { notFound } from "next/navigation";

// Root requests are rewritten by i18n middleware to /[locale].
// If this route renders, the middleware did not rewrite as expected.
export default function RootPage() {
  notFound();
}
