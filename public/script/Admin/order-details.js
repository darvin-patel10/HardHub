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

        function statusManu() {
            document.getElementById('statusModal').classList.remove('hidden');
            // document.getElementById('statusModal').classList.remove('hidden');
        }

        let CURRENT_ORDER_ID = null;

        function updateOrderStatus(orderId) {
            console.log("Received Order ID:", orderId);

            if (!orderId) {
                alert("Order ID missing");
                return;
            }

            CURRENT_ORDER_ID = orderId;

        }


        // Close status modal
        function closeStatusModal() {
            document.getElementById('statusModal').classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        }

        // Save order status
        function saveOrderStatus(orderId) {
            const selectedStatus = document.querySelector('input[name="status"]:checked');
            console.log("Selected Status:", selectedStatus);
            if (!selectedStatus) {
                alert("Please select a status");
                return;
            }

            if (!orderId) {
                alert("Order ID not set");
                return;
            }   

            fetch(`/seller/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: selectedStatus.value })
            })
            .then(res => {
                if (!res.ok) throw new Error("Request failed");
                return res.json();
            })
            .then(() => {
                alert("Order status updated");
                window.location.reload();
            })
            .catch(err => {
                console.error(err);
                alert("Failed to update order status");
            });
            closeStatusModal();
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