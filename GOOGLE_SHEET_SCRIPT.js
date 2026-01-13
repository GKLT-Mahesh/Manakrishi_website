
// Step 1: Go to https://sheets.google.com and create a new Sheet.
// Step 2: Name distinct columns in the first row: "Timestamp", "Name", "Mobile", "Village", "Crop", "Acres".
// Step 3: Click on "Extensions" > "Apps Script" in the menu.
// Step 4: Delete any code there and PASTE the code below.
// Step 5: Click "Deploy" > "New deployment".
// Step 6: Select type "Web app".
// Step 7: Description: "Booking API".
// Step 8: Execute as: "Me" (your email).
// Step 9: Who has access: "Anyone" (IMPORTANT!).
// Step 10: Click "Deploy" and Authorize access.
// Step 11: Copy the "Web app URL" and paste it into the booking.js file where indicated.

function doPost(e) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    try {
        // Parse the data sent from the website
        var data = JSON.parse(e.postData.contents);

        // Add a new row to the sheet
        sheet.appendRow([
            new Date(),       // Timestamp
            data.fullname,    // Name
            data.mobile,      // Mobile
            data.village,     // Village
            data.crop,        // Crop
            data.acres        // Acres
        ]);

        return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}
