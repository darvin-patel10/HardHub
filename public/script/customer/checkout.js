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

        // Form validation and submission
        document.getElementById('placeOrderBtn').addEventListener('click', function() {
            const form = document.getElementById('shippingForm');
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
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
            
            if (isValid) {
                // In a real application, you would submit the form here
                const total = document.getElementById('totalAmount').textContent;
                alert(`Order placed successfully! Total: ${total}`);
                
                // Redirect to confirmation page (in a real app)
                // window.location.href = '/order-confirmation.html';
            } else {
                alert('Please fill in all required fields correctly');
            }
        });
        
        // Auto-format phone number input
        document.getElementById('phone').addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '').substring(0, 10);
        });
        
        // Auto-format pincode input
        document.getElementById('pincode').addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '').substring(0, 6);
        });