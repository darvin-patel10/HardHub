// Quantity controls
const qunBtns = document.querySelectorAll('.quantity-btn');
const qunInput =document.querySelectorAll('.quantity-input');
const remove = document.querySelectorAll('.remove-btn');

        qunBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const input = this.parentElement.querySelector('.quantity-input');
                let value = parseInt(input.value);
                
                if (this.textContent === '+' && value < 10) {
                    input.value = value + 1;
                } else if (this.textContent === '-' && value > 1) {
                    input.value = value - 1;
                }
                
                updateCartTotals();
            });
        });
        
        // Quantity input validation
        qunInput.forEach(input => {
            input.addEventListener('change', function() {
                if (this.value < 1) this.value = 1;
                if (this.value > 10) this.value = 10;
                updateCartTotals();
            });
        });
        
        // Remove item
        // remove.forEach(btn => {
        //     btn.addEventListener('click', function() {
        //         if (confirm('Remove this item from your cart?')) {
        //             this.closest('tr').remove();
        //             updateCartTotals();
        //         }
        //     });
        // });
        
        // Update cart totals
        function updateCartTotals() {
            // In a real implementation, this would calculate:
            // - Subtotal
            // - Shipping
            // - Taxes
            // - Grand total
            // And update the UI accordingly
            alert('Cart updated! (This would calculate totals in a real implementation)');
        }