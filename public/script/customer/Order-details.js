 // Mobile Menu Toggle
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (event) => {
            if (!mobileMenu.contains(event.target) && !mobileMenuButton.contains(event.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
        
        // Print Invoice Function
        function printInvoice() {
            window.print();
        }
        
        // Generate and Download PDF Invoice
        function downloadInvoice() {
            // This would typically call a backend API to generate a PDF
            // For now, we'll use the print functionality
            alert('PDF download feature would be implemented with a backend API. For now, please use Print.');
            printInvoice();
        }
        
        // Order Actions
        function cancelOrder() {
            if (confirm('Are you sure you want to cancel this order?')) {
                // Implement cancel order logic here
                fetch(`/orders/<%= order._id %>/cancel`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(data => {
                    if(data.success) {
                        alert('Order cancelled successfully.');
                        window.location.reload();
                    } else {
                        alert('Failed to cancel order: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error cancelling order.');
                });
            }
        }
        
        function requestReturn() {
            const orderId = '<%= order._id %>';
            const reason = prompt('Please enter the reason for return/exchange:');
            if (reason) {
                // Implement return request logic here
                fetch(`/orders/${orderId}/return`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ reason: reason })
                })
                .then(response => response.json())
                .then(data => {
                    if(data.success) {
                        alert('Return request submitted successfully. We will contact you within 24 hours.');
                    } else {
                        alert('Failed to submit return request: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error submitting return request.');
                });
            }
        }
        
        // Calculate total items for display
        function calculateTotalItems() {
            const items = JSON.stringify(order.items) || '[]';
            let total = 0;
            items.forEach(item => {
                total += item.quantity || 1;
            });
            return total;
        }
        
        // Initialize total items display
        document.addEventListener('DOMContentLoaded', function() {
            const totalItems = calculateTotalItems();
            const totalItemsElement = document.getElementById('total-items-count');
            if(totalItemsElement) {
                totalItemsElement.textContent = totalItems;
            }
        });