M.D. Dry Cleaners — Website (ready-to-deploy)

Files included:
- index.html
- styles.css
- script.js
- assets/logo.png (high-resolution)
- assets/favicon.png
- README.md

How to deploy (GitHub -> Netlify):
1. Create a new GitHub repository (e.g., md-drycleaners-site).
2. Upload all files and folders from this ZIP to the repository root.
3. In Netlify: Add new site -> Import from GitHub -> select your repo -> Deploy
   - Branch: main
   - Build command: leave empty (this is a static site)
   - Publish directory: root (leave empty)
4. Netlify will deploy and provide a URL. Open it to test the site.

Change Google Apps Script endpoint:
- script.js contains GAS_ENDPOINT variable at the top. Update that URL if you redeploy Apps Script.

Change prices/services later:
- Open script.js and edit the SERVICES object. Each service has id, name, price.

Google Sheet & Apps Script:
- The site posts to your Google Apps Script endpoint. Ensure the Apps Script is deployed as a Web App:
  - Execute as: Me
  - Who has access: Anyone
- If Apps Script URL changes, paste the new URL into script.js -> GAS_ENDPOINT.

Contact:
- Reply in the chat if you need help deploying or want me to push the repo for you.
