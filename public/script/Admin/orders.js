// Search functionality
        document.querySelector('input[type="text"]').addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const orders = document.querySelectorAll('.order-row');
            
            orders.forEach(order => {
                const orderText = order.textContent.toLowerCase();
                if (orderText.includes(searchTerm)) {
                    order.style.display = 'grid';
                } else {
                    order.style.display = 'none';
                }
            });
        });