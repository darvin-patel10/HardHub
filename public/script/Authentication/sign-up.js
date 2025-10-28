// Mobile menu toggle
        document.getElementById('mobile-menu-button').addEventListener('click', function() {
            const menu = document.getElementById('mobile-menu');
            menu.classList.toggle('hidden');
        });

        // Form submission
        document.getElementById('signup-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const terms = document.getElementById('terms').checked;
            
            // Simple validation
            if (!name || !email || !password || !confirmPassword || !terms) {
                alert('Please fill in all required fields');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            // In a real app, you would send this to your server
            console.log('Signing up with:', { name, email, phone, password });
            
            // For demo purposes, redirect to home page after 1 second
            // setTimeout(() => {
            //     window.location.href = '/';
            // }, 1000);
        });