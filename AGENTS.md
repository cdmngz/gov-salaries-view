<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Repository instructions

## Git commit identity for Codex

- Commits created by Codex must use the temporary identity `Codex AI <codex-ai@users.noreply.github.com>`.
- Do not modify the repository-local or global Git configuration for `user.name` or `user.email`.
- Create Codex commits with:

  ```sh
  git -c user.name="Codex AI" -c user.email="codex-ai@users.noreply.github.com" commit ...
  ```

- Commits created manually by the user must continue using the user's usual Git identity.
