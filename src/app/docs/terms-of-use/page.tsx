export const metadata = {
  title: "Terms of Use - OfficialSalaries.org",
  description: "Terms of use for accessing public salary data.",
};

export default function TermsOfUsePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-sm leading-relaxed">
      <h1 className="text-xl font-semibold mb-4">Terms of Use</h1>
      <p>
        By using OfficialSalaries.org, you agree to use the content for lawful,
        non-commercial, informational purposes only. The data provided is based
        on public records and may not always reflect the most current updates
        from government sources.
      </p>
      <p className="mt-4">
        We do not guarantee the accuracy, completeness, or availability of any
        data. You assume full responsibility for any use of the information
        presented. We are not liable for damages or losses related to the use of
        this site.
      </p>
      <p className="mt-4 text-gray-500">Last updated: August 2025</p>
    </main>
  );
}
