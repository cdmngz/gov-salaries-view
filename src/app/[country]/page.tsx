// src/app/[country]/page.tsx

import RenderCountryPage from "@/components/RenderCountryPage.server";
export { generateStaticParams, generateMetadata } from "@/lib/country";

export default RenderCountryPage;
