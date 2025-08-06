import Link from "next/link";

export const metadata = {
  title: "Documentation - OfficialSalaries.org",
  description: "Project documentation, legal notices, and data sources.",
};

export default function DocsIndexPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-sm leading-relaxed">
      <h1 className="text-xl font-semibold mb-6">Documentation & Legal</h1>
      <ul className="list-disc list-inside space-y-2">
        <li>
          <Link href="/docs/privacy-policy" className="text-blue-600 underline">
            Privacy Policy
          </Link>{" "}
          - How we handle privacy and personal data
        </li>
        <li>
          <Link href="/docs/terms-of-use" className="text-blue-600 underline">
            Terms of Use
          </Link>{" "}
          - Legal conditions for using the website
        </li>
        <li>
          <Link href="/docs/data-sources" className="text-blue-600 underline">
            Data Sources & Attribution
          </Link>{" "}
          -Where the salary data comes from
        </li>
      </ul>
    </main>
  );
}
