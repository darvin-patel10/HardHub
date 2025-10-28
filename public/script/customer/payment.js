// Toggle payment methods
        function togglePaymentMethod(methodId) {
            // Hide all payment method contents
            document.querySelectorAll('.payment-method-content').forEach(content => {
                content.style.display = 'none';
            });
            
            // Remove active class from all headers
            document.querySelectorAll('.payment-method-header').forEach(header => {
                header.classList.remove('active');
            });
            
            // Show selected method
            const method = document.getElementById(methodId);
            method.querySelector('.payment-method-content').style.display = 'block';
            method.querySelector('.payment-method-header').classList.add('active');
            
            // Check the radio button
            method.querySelector('input[type="radio"]').checked = true;
        }
        
        // Format card number input
        document.getElementById('cardNumber').addEventListener('input', function(e) {
            let value = this.value.replace(/\s+/g, '').replace(/[^0-9]/g, '');
            if (value.length > 16) value = value.substr(0, 16);
            
            let formatted = '';
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) formatted += ' ';
                formatted += value[i];
            }
            
            this.value = formatted;
        });
        
        // Format expiry date input
        document.getElementById('expiryDate').addEventListener('input', function(e) {
            let value = this.value.replace(/\//g, '').replace(/[^0-9]/g, '');
            if (value.length > 4) value = value.substr(0, 4);
            
            if (value.length > 2) {
                value = value.substr(0, 2) + '/' + value.substr(2);
            }
            
            this.value = value;
        });
        
        // Format CVV input
        document.getElementById('cvv').addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '').substr(0, 4);
        });
        
        // Pay button click handler
        document.getElementById('payButton').addEventListener('click', function() {
            const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').id;
            
            // Validate based on selected method
            let isValid = true;
            
            if (selectedMethod === 'upiRadio') {
                const upiId = document.getElementById('upiId').value;
                if (!upiId.includes('@') || upiId.length < 5) {
                    alert('Please enter a valid UPI ID');
                    isValid = false;
                }
            } 
            else if (selectedMethod === 'cardRadio') {
                const cardNumber = document.getElementById('cardNumber').value.replace(/\s+/g, '');
                const expiry = document.getElementById('expiryDate').value;
                const cvv = document.getElementById('cvv').value;
                
                if (cardNumber.length !== 16) {
                    alert('Please enter a valid 16-digit card number');
                    isValid = false;
                } else if (!expiry.includes('/') || expiry.length !== 5) {
                    alert('Please enter a valid expiry date (MM/YY)');
                    isValid = false;
                } else if (cvv.length < 3) {
                    alert('Please enter a valid CVV');
                    isValid = false;
                }
            }
            else if (selectedMethod === 'netBankingRadio') {
                const bank = document.getElementById('bankSelect').value;
                if (!bank) {
                    alert('Please select a bank');
                    isValid = false;
                }
            }
            
            if (isValid) {
                alert('Payment successful! Your order has been placed.');
                // In a real app, redirect to order confirmation
                // window.location.href = '/order-confirmation.html';
            }
        });