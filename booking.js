
// Firebase Configuration (Compat)
const firebaseConfig = {
    apiKey: "AIzaSyBy2yNoxRWj0fR5_3zXWZoi7xwrusHBf9U",
    authDomain: "manakrishi-booking.firebaseapp.com",
    projectId: "manakrishi-booking",
    storageBucket: "manakrishi-booking.firebasestorage.app",
    messagingSenderId: "658175860538",
    appId: "1:658175860538:web:a570816454f7d7697cfa03",
    measurementId: "G-246CVYV263"
};

// Initialize Firebase (Compat)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Initialize Firestore
const db = firebase.firestore();

// TODO: REPLACE THIS WITH YOUR GOOGLE APPS SCRIPT WEB APP URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyGHnnn6GiKYCbMgraKofdbhU8ZaVMBav89Y-xKu63OLp5z-y4O1F9eDhGQ4I9Qn9do/exec";

document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.querySelector('.booking-form');
    // Remove the inline onsubmit
    if (bookingForm) {
        bookingForm.removeAttribute('onsubmit');

        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = bookingForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerText;
            submitBtn.disabled = true;
            submitBtn.innerText = "Processing...";

            // Get form values
            const formData = {
                fullname: document.getElementById('fullname').value,
                mobile: document.getElementById('mobile').value,
                village: document.getElementById('village').value,
                crop: document.getElementById('crop').value,
                acres: document.getElementById('acres').value,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(), // Compat timestamp
                status: 'new'
            };

            try {
                // 1. Add to Firebase
                const docRef = await db.collection("bookings").add(formData);
                console.log("Document written with ID: ", docRef.id);

                // 2. Send to Google Sheets (if URL is configured)
                // 2. Send to Google Sheets (if URL is configured)
                if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL !== "https://script.google.com/macros/s/AKfycbyGHnnn6GiKYCbMgraKofdbhU8ZaVMBav89Y-xKu63OLp5z-y4O1F9eDhGQ4I9Qn9do/execE") {

                    // Create a clean object for the Sheet (exclude Firebase specific objects like timestamp)
                    const sheetData = {
                        fullname: formData.fullname,
                        mobile: formData.mobile,
                        village: formData.village,
                        crop: formData.crop,
                        acres: formData.acres
                    };

                    fetch(GOOGLE_SCRIPT_URL, {
                        method: "POST",
                        mode: "no-cors",
                        headers: {
                            "Content-Type": "text/plain"
                        },
                        body: JSON.stringify(sheetData)
                    }).catch(err => console.error("Error sending to Google Sheet:", err));
                }

                // Get success message based on language
                const currentLang = localStorage.getItem('manakrishi_lang') || 'en';
                const successMsg = currentLang === 'te'
                    ? "బుకింగ్ విజయవంతమైంది! మేము త్వరలో మిమ్మల్ని సంప్రదిస్తాము."
                    : "Booking Successful! We will contact you shortly.";

                alert(successMsg);
                bookingForm.reset();
            } catch (error) {
                console.error("Error adding document: ", error);
                alert("Error submitting booking: " + error.message + "\n\n(Check your browser console for more details)");
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            }
        });
    }
});
