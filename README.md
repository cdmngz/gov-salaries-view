# 🏛️ gov-salaries-view

**Interactive public salary viewer with personalized SVG portraits**

`gov-salaries-view` is a web app that displays public salary data in a browsable format, enhanced with customizable avatars for each official. It includes dynamic styling based on political metadata and supports localized versions through geolocation-based redirection.

---

## ✨ Features

- 📊 Browse salaries by official, role, or institution
- 🧑‍🎨 Auto-generated SVG portraits with hair and clothing variants
- 🎨 Party-based color customization for visual identity
- 🌍 Country-based redirection using AWS CloudFront and Next.js middleware
- 🔍 Search and filter for quick data exploration

---

## 🛠️ Tech Stack

- **Next.js / React**
- **TypeScript**
- **Tailwind CSS**
- **SVG rendering**
- **AWS CloudFront (optional, for geolocation)**

---

## 🚀 Getting Started

```bash
git clone https://github.com/your-username/gov-salaries-view.git
cd gov-salaries-view
npm install
npm run dev
```

## Resilient production builds

`pnpm run build` retries the complete Next.js build when prerendering fails because
of a transient upstream HTTP or network error. This prevents a short-lived data
API outage (for example, a `503` response) from immediately failing deployment.
Application errors and permanent HTTP failures such as `404` are not retried.

The build makes up to three attempts, waiting 15 seconds between attempts. CI can
override those defaults with `BUILD_RETRIES` (the number of retries after the
first attempt) and `BUILD_RETRY_DELAY_MS`, or disable retries with
`BUILD_RETRIES=0`. Use `pnpm run build:next` to invoke Next.js once without the
wrapper.
