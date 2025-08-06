export const metadata = {
  title: "Privacy Policy - OfficialSalaries.org",
  description: "How we handle privacy and user data at OfficialSalaries.org.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-sm leading-relaxed">
      <h1 className="text-xl font-semibold mb-4">Privacy Policy</h1>
      <p>
        OfficialSalaries.org is a public data project. We do not collect, track,
        or store personal information. This website does not use cookies,
        analytics, or any form of user tracking.
      </p>
      <p className="mt-4">
        All data shown is sourced from official government databases or other
        public datasets. No user-submitted data is processed or retained.
      </p>
      <p className="mt-4 text-gray-500">Last updated: August 2025</p>
    </main>
  );
}
