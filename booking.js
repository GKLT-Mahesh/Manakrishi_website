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

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyGHnnn6GiKYCbMgraKofdbhU8ZaVMBav89Y-xKu63OLp5z-y4O1F9eDhGQ4I9Qn9do/exec";

document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.querySelector('.booking-form');
    const bookingWrapper = document.getElementById('booking-wrapper');
    const successMessage = document.getElementById('success-message');
    const bookingNav = document.getElementById('booking-nav');

    if (bookingNav) {
        const onScroll = () => bookingNav.classList.toggle('scrolled', window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    if (!bookingForm) return;

    const submitBtn = bookingForm.querySelector('.submit-btn');
    const submitBtnText = submitBtn && submitBtn.querySelector('.submit-btn-text');

    const showError = (input, show) => {
        if (!input) return;
        const errorMsg = input.closest('.form-group') && input.closest('.form-group').querySelector('.error-msg');
        if (errorMsg) errorMsg.style.display = show ? 'block' : 'none';
        input.classList.toggle('error', show);
    };

    const setLoading = (loading) => {
        if (!submitBtn) return;
        submitBtn.disabled = loading;
        submitBtn.classList.toggle('is-loading', loading);
        if (submitBtnText) {
            if (loading) {
                submitBtn.dataset.originalBtnText = submitBtnText.textContent;
                submitBtnText.textContent = 'Processing...';
            } else {
                submitBtnText.textContent = submitBtn.dataset.originalBtnText || 'Confirm Booking';
            }
        }
    };

    const showSuccess = () => {
        if (!bookingWrapper || !successMessage) return;
        bookingWrapper.style.display = 'none';
        successMessage.style.display = 'block';
        successMessage.classList.add('is-visible');
        successMessage.setAttribute('aria-hidden', 'false');
    };

    const fields = {
        fullname: document.getElementById('fullname'),
        mobile: document.getElementById('mobile'),
        village: document.getElementById('village'),
        date: document.getElementById('date'),
        crop: document.getElementById('crop'),
        acres: document.getElementById('acres')
    };

    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Trim and validate
        let isValid = true;
        let firstInvalid = null;

        if (!fields.fullname || !fields.fullname.value.trim()) {
            showError(fields.fullname, true);
            if (!firstInvalid) firstInvalid = fields.fullname;
            isValid = false;
        } else showError(fields.fullname, false);

        const mobileRegex = /^[6-9][0-9]{9}$/;
        if (!fields.mobile || !mobileRegex.test(fields.mobile.value.trim())) {
            showError(fields.mobile, true);
            if (!firstInvalid) firstInvalid = fields.mobile;
            isValid = false;
        } else showError(fields.mobile, false);

        if (!fields.village || !fields.village.value.trim()) {
            showError(fields.village, true);
            if (!firstInvalid) firstInvalid = fields.village;
            isValid = false;
        } else showError(fields.village, false);

        if (!fields.date || !fields.date.value) {
            showError(fields.date, true);
            if (!firstInvalid) firstInvalid = fields.date;
            isValid = false;
        } else showError(fields.date, false);

        if (!fields.crop || !fields.crop.value.trim()) {
            showError(fields.crop, true);
            if (!firstInvalid) firstInvalid = fields.crop;
            isValid = false;
        } else showError(fields.crop, false);

        const acresNum = fields.acres ? parseFloat(fields.acres.value, 10) : 0;
        if (!fields.acres || !fields.acres.value.trim() || isNaN(acresNum) || acresNum < 0.5) {
            showError(fields.acres, true);
            if (!firstInvalid) firstInvalid = fields.acres;
            isValid = false;
        } else showError(fields.acres, false);

        if (!isValid) {
            if (firstInvalid) {
                firstInvalid.focus();
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        setLoading(true);

        const formData = {
            fullname: fields.fullname.value.trim(),
            mobile: fields.mobile.value.trim(),
            village: fields.village.value.trim(),
            date: fields.date.value,
            crop: fields.crop.value.trim(),
            acres: fields.acres.value.trim(),
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'new'
        };

        try {
            await db.collection("bookings").add(formData);

            if (GOOGLE_SCRIPT_URL && !GOOGLE_SCRIPT_URL.includes("REPLACE THIS")) {
                fetch(GOOGLE_SCRIPT_URL, {
                    method: "POST",
                    mode: "no-cors",
                    headers: { "Content-Type": "text/plain" },
                    body: JSON.stringify({
                        fullname: formData.fullname,
                        mobile: formData.mobile,
                        village: formData.village,
                        date: formData.date,
                        crop: formData.crop,
                        acres: formData.acres
                    })
                }).catch(() => { });
            }

            showSuccess();
        } catch (error) {
            console.error("Booking error:", error);
            alert("Error submitting booking. Please try again.\n" + (error.message || ""));
        } finally {
            setLoading(false);
        }
    });

    bookingForm.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => showError(input, false));
        input.addEventListener('focus', () => showError(input, false));
    });
});
