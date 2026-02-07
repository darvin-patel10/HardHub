// Delivery option selection
function selectDeliveryOption(element, option) {
    document.querySelectorAll('.delivery-option').forEach(opt => {
        opt.classList.remove('active');
    });
    element.classList.add('active');
    
    // Update shipping cost and totals
    updateTotals(option);
}

// Update totals based on delivery option
function updateTotals(deliveryOption) {
    const subtotal = 973.00;
    let shipping = 50.00;
    
    if (deliveryOption === 'express') {
        shipping = 150.00;
    }
    
    const tax = (subtotal + shipping) * 0.18;
    const total = subtotal + shipping + tax;
    
    document.getElementById('shippingCost').textContent = `₹${shipping.toFixed(2)}`;
    document.getElementById('taxAmount').textContent = `₹${tax.toFixed(2)}`;
    document.getElementById('totalAmount').textContent = `₹${total.toFixed(2)}`;
}

// Toggle address form based on saved address selection
function setupAddressToggle() {
    const savedAddressCheckbox = document.getElementById('useSavedAddress');
    const addressFormSection = document.getElementById('addressFormSection');
    const addressCard = document.getElementById('savedAddressCard');

    const formFields = addressFormSection.querySelectorAll(
        'input, textarea, select'
    );

    if (savedAddressCheckbox) {
        savedAddressCheckbox.addEventListener('change', function () {

            if (this.checked) {
                // Disable form
                addressFormSection.classList.add('form-disabled');
                addressCard.classList.add('active');

                formFields.forEach(field => {
                    field.dataset.wasRequired = field.required;
                    field.required = false;
                    field.disabled = true;
                });

            } else {
                // Enable form
                addressFormSection.classList.remove('form-disabled');
                addressCard.classList.remove('active');

                formFields.forEach(field => {
                    field.disabled = false;

                    // restore required only if it was required before
                    if (field.dataset.wasRequired === "true") {
                        field.required = true;
                    }
                });
            }
        });
    }
}


// Form validation and submission
document.getElementById('placeOrderBtn').addEventListener('click', function(e) {
    e.preventDefault();
    const form = document.getElementById('shippingForm');
    const useSavedAddress = document.getElementById('useSavedAddress');
    
    let isValid = true;
    
    if (useSavedAddress && useSavedAddress.checked) {
        // Using saved address - only validate that checkbox is checked
        isValid = true;
        
        // Populate hidden fields with saved address data
        populateSavedAddressFields();
    } else {
        // Using custom address - validate all form fields
        const requiredFields = form.querySelectorAll('[required]');
        
        // Validate required fields
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = 'red';
                isValid = false;
            } else {
                field.style.borderColor = '#ddd';
            }
        });
        
        // Validate phone number
        const phoneField = document.getElementById('phone');
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phoneField.value.trim())) {
            phoneField.style.borderColor = 'red';
            isValid = false;
            alert('Please enter a valid 10-digit phone number');
        }
        
        // Validate pincode
        const pincodeField = document.getElementById('pincode');
        const pincodeRegex = /^[0-9]{6}$/;
        if (!pincodeRegex.test(pincodeField.value.trim())) {
            pincodeField.style.borderColor = 'red';
            isValid = false;
            alert('Please enter a valid 6-digit pincode');
        }
        
        // Validate email
        const emailField = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value.trim())) {
            emailField.style.borderColor = 'red';
            isValid = false;
            alert('Please enter a valid email address');
        }
    }
    
    if (isValid) {
        // Submit the form
        form.submit();
    } else {
        alert('Please fill in all required fields correctly');
    }
});

// Function to populate hidden fields with saved address data
function populateSavedAddressFields() {
    const form = document.getElementById('shippingForm');
    const dataDiv = document.getElementById('savedUserData');

    const savedFields = [
        { name: 'firstname', value: dataDiv.dataset.firstname },
        { name: 'lastname', value: dataDiv.dataset.lastname },
        { name: 'email', value: dataDiv.dataset.email },
        { name: 'phone', value: dataDiv.dataset.phone },
        { name: 'address', value: dataDiv.dataset.address },
        { name: 'city', value: dataDiv.dataset.city },
        { name: 'state', value: dataDiv.dataset.state },
        { name: 'pincode', value: dataDiv.dataset.pincode },
        { name: 'country', value: "India" }
    ];

    savedFields.forEach(field => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = field.name;
        input.value = field.value;
        form.appendChild(input);
    });
}

// Auto-format phone number input
document.getElementById('phone')?.addEventListener('input', function(e) {
    this.value = this.value.replace(/[^0-9]/g, '').substring(0, 10);
});

// Auto-format pincode input
document.getElementById('pincode')?.addEventListener('input', function(e) {
    this.value = this.value.replace(/[^0-9]/g, '').substring(0, 6);
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    setupAddressToggle();
});