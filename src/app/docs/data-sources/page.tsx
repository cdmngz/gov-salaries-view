// src/app/docs/data-sources/page.tsx

export const metadata = {
  title: "Data Sources - OfficialSalaries.org",
  description: "Attribution for public salary datasets used on the platform.",
};

export default function DataSourcesPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-sm leading-relaxed">
      <h1 className="text-xl font-semibold mb-4">Data Sources & Attribution</h1>
      <p>
        The data presented on OfficialSalaries.org is sourced from publicly
        available government datasets. Attribution is provided below per
        jurisdiction:
      </p>

      <ul className="list-disc list-inside mt-4 space-y-2">
        <li>
          <strong>GitHub Repository</strong>:{" "}
          <a
            href="https://github.com/cdmngz/gov-salaries-data"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            cdmngz/gov-salaries-data
          </a>
        </li>
      </ul>

      <p className="mt-4 text-sm text-gray-500">
        Please consult the repository or the source portals for licenses and
        usage restrictions.
      </p>

      <p className="mt-4 text-gray-500">Last updated: August 2025</p>
    </main>
  );
}
