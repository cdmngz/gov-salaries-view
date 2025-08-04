# 🌍 Geolocation-Based Redirection with CloudFront and Next.js

## How It Works

- AWS CloudFront detects the user's country via IP.
- It injects the `CloudFront-Viewer-Country` header into the request.
- Next.js Middleware reads this header before the page loads.
- If the country code exists in `countries.json`, the user is redirected to `/<countryCode>`.
- Otherwise, the user is redirected to `/intl`.

## 🔁 Middleware Logic

Redirection logic lives in [`middleware.ts`](../../middleware.ts).  
It dynamically checks supported countries from [`src/data/countries.json`](../../src/data/countries.json) and redirects accordingly.

## ⚙️ CloudFront Configuration

To enable country detection:

1. Go to your **CloudFront distribution**.
2. Edit the **Behavior** that matches your app route.
3. Under **Cache key and origin requests**, forward this header:
   - `CloudFront-Viewer-Country`
4. Save and deploy.

## ➕ Adding a New Country

1. Add the country to [`countries.json`](../../src/data/countries.json), for example:

```json
"de": {
  "flag": "🇩🇪",
  "names": { "en": "Germany", "es": "Alemania" }
}
```
