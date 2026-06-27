// Firebase Configuration (Compat) — Primary: manakrishi-booking (Firestore)
const firebaseConfig = {
    apiKey: "AIzaSyBy2yNoxRWj0fR5_3zXWZoi7xwrusHBf9U",
    authDomain: "manakrishi-booking.firebaseapp.com",
    projectId: "manakrishi-booking",
    storageBucket: "manakrishi-booking.firebasestorage.app",
    messagingSenderId: "658175860538",
    appId: "1:658175860538:web:a570816454f7d7697cfa03",
    measurementId: "G-246CVYV263"
};

// Secondary: db-vt-gsocp (Realtime Database — for WhatsApp Automator)
const rtdbConfig = {
    apiKey: "AIzaSyCznxVw1-MXtsauYiyAA9Jor8SZ3irZO-E",
    authDomain: "db-vt-gsocp.firebaseapp.com",
    databaseURL: "https://db-vt-gsocp-default-rtdb.firebaseio.com",
    projectId: "db-vt-gsocp",
    storageBucket: "db-vt-gsocp.firebasestorage.app",
    messagingSenderId: "619171992371",
    appId: "1:619171992371:web:c3fd02cd0687d26775e446",
    measurementId: "G-DK2E3PG516"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const rtdbApp = firebase.app().name === '[DEFAULT]'
    ? firebase.initializeApp(rtdbConfig, 'rtdb')
    : firebase.app('rtdb');

const db = firebase.firestore();
const rtdb = firebase.database(rtdbApp);

document.addEventListener('DOMContentLoaded', () => {
    const deleteForm = document.getElementById('deleteForm');
    const bookingWrapper = document.getElementById('booking-wrapper');
    const successMessage = document.getElementById('success-message');
    const bookingNav = document.getElementById('booking-nav');

    if (bookingNav) {
        const onScroll = () => bookingNav.classList.toggle('scrolled', window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    if (!deleteForm) return;

    const reasonSelect = document.getElementById('reason');
    const otherReasonGroup = document.getElementById('otherReasonGroup');
    const otherReasonInput = document.getElementById('otherReason');
    const confirmDeleteCheckbox = document.getElementById('confirmDelete');
    const chkErrorMsg = document.getElementById('chkErrorMsg');
    const submitBtn = deleteForm.querySelector('.submit-btn');
    const submitBtnText = submitBtn && submitBtn.querySelector('.submit-btn-text');

    // Handle conditional fields
    reasonSelect.addEventListener('change', () => {
        if (reasonSelect.value === 'other') {
            otherReasonGroup.style.display = 'block';
            otherReasonInput.setAttribute('required', 'required');
        } else {
            otherReasonGroup.style.display = 'none';
            otherReasonInput.removeAttribute('required');
            showError(otherReasonInput, false);
        }
    });

    const showError = (input, show) => {
        if (!input) return;
        const formGroup = input.closest('.form-group');
        const errorMsg = formGroup && formGroup.querySelector('.error-msg');
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
                submitBtnText.textContent = submitBtn.dataset.originalBtnText || 'Submit Deletion Request';
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
        reason: reasonSelect,
        otherReason: otherReasonInput
    };

    deleteForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        let isValid = true;
        let firstInvalid = null;

        // Validate Full Name
        if (!fields.fullname || !fields.fullname.value.trim()) {
            showError(fields.fullname, true);
            if (!firstInvalid) firstInvalid = fields.fullname;
            isValid = false;
        } else {
            showError(fields.fullname, false);
        }

        // Validate Mobile Number
        const mobileRegex = /^[6-9][0-9]{9}$/;
        if (!fields.mobile || !mobileRegex.test(fields.mobile.value.trim())) {
            showError(fields.mobile, true);
            if (!firstInvalid) firstInvalid = fields.mobile;
            isValid = false;
        } else {
            showError(fields.mobile, false);
        }

        // Validate Reason
        if (!fields.reason || !fields.reason.value) {
            showError(fields.reason, true);
            if (!firstInvalid) firstInvalid = fields.reason;
            isValid = false;
        } else {
            showError(fields.reason, false);
        }

        // Validate Conditional Other Reason
        if (fields.reason.value === 'other') {
            if (!fields.otherReason || !fields.otherReason.value.trim()) {
                showError(fields.otherReason, true);
                if (!firstInvalid) firstInvalid = fields.otherReason;
                isValid = false;
            } else {
                showError(fields.otherReason, false);
            }
        }

        // Validate Checkbox
        if (!confirmDeleteCheckbox || !confirmDeleteCheckbox.checked) {
            chkErrorMsg.style.display = 'block';
            if (!firstInvalid) firstInvalid = confirmDeleteCheckbox;
            isValid = false;
        } else {
            chkErrorMsg.style.display = 'none';
        }

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
            reason: fields.reason.value,
            otherReason: fields.reason.value === 'other' ? fields.otherReason.value.trim() : '',
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'pending_deletion'
        };

        try {
            // Write request to Firestore
            await db.collection("delete_requests").add(formData);

            // Sync request to Realtime Database
            try {
                await rtdb.ref('delete_requests').push({
                    fullname: formData.fullname,
                    mobile: formData.mobile,
                    reason: formData.reason,
                    otherReason: formData.otherReason,
                    status: 'pending_deletion',
                    timestamp: new Date().toISOString()
                });
            } catch (rtdbErr) {
                console.error("RTDB deletion sync error:", rtdbErr);
            }

            showSuccess();
        } catch (error) {
            console.error("Deletion request error:", error);
            alert("Error submitting deletion request. Please try again.\n" + (error.message || ""));
        } finally {
            setLoading(false);
        }
    });

    // Clear error messages on user input
    deleteForm.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', () => {
            if (input.id === 'confirmDelete') {
                chkErrorMsg.style.display = confirmDeleteCheckbox.checked ? 'none' : 'block';
            } else {
                showError(input, false);
            }
        });
        input.addEventListener('change', () => {
            if (input.id === 'reason') {
                showError(input, false);
            }
        });
        input.addEventListener('focus', () => {
            if (input.id !== 'confirmDelete') {
                showError(input, false);
            }
        });
    });
});
