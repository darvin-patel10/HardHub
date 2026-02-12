// ===============================
// Address Toggle Logic
// ===============================
function setupAddressToggle() {
    const savedAddressCheckbox = document.getElementById('useSavedAddress');
    const addressFormSection = document.getElementById('addressFormSection');

    if (!savedAddressCheckbox || !addressFormSection) return;

    const formFields = addressFormSection.querySelectorAll(
        'input, textarea, select'
    );

    savedAddressCheckbox.addEventListener('change', function () {

        if (this.checked) {
            // Disable manual form
            formFields.forEach(field => {
                field.dataset.required = field.required;
                field.required = false;
                field.disabled = true;
                field.readOnly = true;
            });

            addressFormSection.classList.add(
                'opacity-50',
                'pointer-events-none'
            );

        } else {
            // Enable manual form
            formFields.forEach(field => {
                field.disabled = false;
                field.readOnly = false;

                if (field.dataset.required === "true") {
                    field.required = true;
                }
            });

            addressFormSection.classList.remove(
                'opacity-50',
                'pointer-events-none'
            );
        }
    });
}

// ===============================
// Populate Saved Address
// ===============================
function populateSavedAddressFields() {
    const form = document.getElementById('shippingForm');
    const dataDiv = document.getElementById('savedUserData');

    if (!dataDiv) return;

    const fields = {
        firstname: dataDiv.dataset.firstname || "",
        lastname: dataDiv.dataset.lastname || "",
        email: dataDiv.dataset.email || "",
        phone: dataDiv.dataset.phone || "",
        address: dataDiv.dataset.address || "",
        city: dataDiv.dataset.city || "",
        state: dataDiv.dataset.state || "",
        pincode: dataDiv.dataset.pincode || "",
        country: "India"
    };

    Object.entries(fields).forEach(([name, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.appendChild(input);
    });
}

// ===============================
// Validation
// ===============================
function validateForm() {
    const form = document.getElementById('shippingForm');
    const useSavedAddress = document.getElementById('useSavedAddress');

    let isValid = true;

    // If using saved address
    if (useSavedAddress && useSavedAddress.checked) {
        populateSavedAddressFields();
        return true;
    }

    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('border-red-500');
            isValid = false;
        } else {
            field.classList.remove('border-red-500');
        }
    });

    // Phone validation
    const phone = document.getElementById('phone');
    if (phone && !/^[0-9]{10}$/.test(phone.value.trim())) {
        alert("Enter valid 10-digit phone number");
        phone.classList.add('border-red-500');
        isValid = false;
    }

    // Pincode validation
    const pincode = document.getElementById('pincode');
    if (pincode && !/^[0-9]{6}$/.test(pincode.value.trim())) {
        alert("Enter valid 6-digit pincode");
        pincode.classList.add('border-red-500');
        isValid = false;
    }

    // Email validation
    const email = document.getElementById('email');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        alert("Enter valid email");
        email.classList.add('border-red-500');
        isValid = false;
    }

    return isValid;
}

// ===============================
// Auto Format Inputs
// ===============================
function setupAutoFormat() {

    const phone = document.getElementById('phone');
    phone?.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').slice(0, 10);
    });

    const pincode = document.getElementById('pincode');
    pincode?.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').slice(0, 6);
    });
}

// ===============================
// Init
// ===============================
document.addEventListener("DOMContentLoaded", () => {

    setupAddressToggle();
    setupAutoFormat();

    const form = document.getElementById("shippingForm");

    form?.addEventListener("submit", function (e) {

        if (!validateForm()) {
            e.preventDefault();
            alert("Please fill all fields correctly!");
        }

    });

});
