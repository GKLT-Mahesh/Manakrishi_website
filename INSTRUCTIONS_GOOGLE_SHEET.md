
# How to Connect Google Sheets

To automatically save bookings to your personal Google Sheet, follow these manual steps:

1.  **Create a Google Sheet:**
    *   Go to [Google Sheets](https://sheets.google.com) and create a new blank sheet.
    *   In the first row (A1 to E1), add these headers: `Timestamp`, `Name`, `Mobile`, `Village`, `Crop`, `Acres`.

2.  **Add the Script:**
    *   In your Google Sheet, click **Extensions** > **Apps Script**.
    *   Delete any existing code in the editor.
    *   Open the file `GOOGLE_SHEET_SCRIPT.js` in this folder, copy all the code, and paste it into the Apps Script editor.

3.  **Deploy as Web App:**
    *   Click the blue **Deploy** button (top right) > **New deployment**.
    *   Click the "Select type" gear icon > **Web app**.
    *   **Description:** "Manakrishi Booking".
    *   **Execute as:** "Me" (your email address).
    *   **Who has access:** **Anyone** (This is critical!).
    *   Click **Deploy**.

4.  **Authorize:**
    *   It will ask for permission. Click "Review permissions".
    *   Choose your account.
    *   If you see "Google hasn't verified this app", click **Advanced** > **Go to (Untitled project) (unsafe)** > **Allow**.

5.  **Get the URL:**
    *   Copy the **Web app URL** provided (it starts with `https://script.google.com/macros/s/...`).

6.  **Update Your Code:**
    *   Open the file `booking.js` in your website folder.
    *   Find line 21: `const GOOGLE_SCRIPT_URL = "YOUR_GOOGLE_SCRIPT_URL_HERE";`
    *   Paste your copied URL inside the quotes.

7.  **Done!**
    *   Now, when a farmer books a service, it will save to Firebase AND your Google Sheet.
