# LOCKER

A React + Vite starter for a personal digital locker dashboard.

## Current build

- Responsive dashboard with sidebar navigation
- Overview cards for items, starred items, storage, and status
- Search, starred items, recent items, and demo trash view
- Create placeholder folders/items and star or remove them
- Responsive desktop, tablet, and mobile layout

## Run locally

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. For a production build, run `npm run build`.

## Important security note

This is the first UI prototype. The displayed files, storage usage, and security status are sample data. Creating an item only changes the current page state; nothing is uploaded or saved. Do not enter real passwords, private documents, or sensitive information yet.

Before using this for real private files, add a backend, real authentication, server-side authorization, encrypted file storage, safe upload validation, and backups. Keep secrets in deployment environment variables, never in frontend code or committed files.
