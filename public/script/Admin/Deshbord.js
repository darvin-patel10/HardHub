// Simple JavaScript for demonstration
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Dashboard loaded for JOY Hardware');
            
            // You can add more interactive features here
            document.querySelectorAll('.card').forEach(card => {
                card.addEventListener('click', function() {
                    console.log('Card clicked');
                });
            });
        });