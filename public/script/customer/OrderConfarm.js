// Simple animation for the confirmation icon
        document.addEventListener('DOMContentLoaded', function() {
            const icon = document.querySelector('.confirmation-icon');
            icon.style.transform = 'scale(0)';
            icon.style.transition = 'transform 0.5s ease-out';
            
            setTimeout(() => {
                icon.style.transform = 'scale(1)';
            }, 100);
            
            // In a real app, you might want to save the order details to localStorage
            // localStorage.setItem('lastOrder', 'JOY-ORD-10025');
        });
        
        // Print order functionality
        function printOrder() {
            window.print();
        }