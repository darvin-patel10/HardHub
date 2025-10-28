        // Helper function to get status class
        function getStatusClass(status) {
            switch(status) {
                case 'Completed':
                case 'Delivered':
                    return 'completed';
                case 'Cancelled':
                    return 'cancelled';
                case 'Processing':
                    return 'processing';
                default:
                    return '';
            }
        }

        // Print order
        function printOrder() {
            window.print();
        }

        // Open status modal
        function updateOrderStatus(orderId) {
            document.getElementById('statusModal').classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
            // Set current status as checked
            const currentStatus = '<%= order.status || "Processing" %>';
            document.getElementById(`status-${currentStatus.toLowerCase()}`).checked = true;
        }

        // Close status modal
        function closeStatusModal() {
            document.getElementById('statusModal').classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        }

        // Save order status
        function saveOrderStatus() {
            const selectedStatus = document.querySelector('input[name="status"]:checked').value;
            
            fetch(`/seller/orders/<%= order.orderid %>/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: selectedStatus })
            })
            .then(response => {
                if (response.ok) {
                    window.location.reload();
                } else {
                    alert('Failed to update order status');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while updating the order status');
            });
        }

        // Close modal when clicking outside
        document.getElementById('statusModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeStatusModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !document.getElementById('statusModal').classList.contains('hidden')) {
                closeStatusModal();
            }
        });