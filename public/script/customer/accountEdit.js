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

        // Tab Switching
        function switchTab(tabName) {
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
                tab.classList.add('hidden');
            });
            
            // Remove active class from all tabs
            document.querySelectorAll('[id$="-tab"]').forEach(tab => {
                tab.classList.remove('tab-active');
                tab.classList.add('tab-inactive');
            });
            
            // Show selected tab content
            document.getElementById(`${tabName}-tab-content`).classList.remove('hidden');
            document.getElementById(`${tabName}-tab-content`).classList.add('active');
            
            // Set active tab button
            document.getElementById(`${tabName}-tab`).classList.remove('tab-inactive');
            document.getElementById(`${tabName}-tab`).classList.add('tab-active');
        }

        // Profile Photo Preview
        function previewImage(event) {
            const reader = new FileReader();
            const image = document.getElementById('profile-preview');
            
            reader.onload = function() {
                image.src = reader.result;
            }
            
            if (event.target.files[0]) {
                reader.readAsDataURL(event.target.files[0]);
            }
        }

        // Remove Profile Photo
        function removePhoto() {
            if (confirm('Remove profile photo?')) {
                document.getElementById('profile-preview').src = 'https://thumbs.dreamstime.com/b/default-profile-picture-avatar-photo-placeholder-vector-illustration-default-profile-picture-avatar-photo-placeholder-vector-189495158.jpg';
                document.getElementById('profilePhoto').value = '';
            }
        }

        // Take Photo (placeholder function)
        function takePhoto() {
            alert('Camera functionality would be implemented with WebRTC API. For now, please upload a photo.');
        }

        // Toggle Password Visibility
        function togglePassword(inputId) {
            const input = document.getElementById(inputId);
            const button = input.nextElementSibling;
            const icon = button.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        }

        // Password Strength Checker
        const newPasswordInput = document.getElementById('newPassword');
        if (newPasswordInput) {
            newPasswordInput.addEventListener('input', function() {
                const password = this.value;
                
                // Update checkmarks
                const lengthCheck = document.getElementById('length-check');
                const uppercaseCheck = document.getElementById('uppercase-check');
                const numberCheck = document.getElementById('number-check');
                const strengthBar = document.getElementById('password-strength');
                
                // Check criteria
                const hasLength = password.length >= 8;
                const hasUppercase = /[A-Z]/.test(password);
                const hasNumber = /[0-9]/.test(password);
                
                // Update checkmarks
                lengthCheck.className = hasLength ? 'fas fa-check-circle text-green-500 text-xs mr-2' : 'fas fa-circle text-gray-300 text-xs mr-2';
                uppercaseCheck.className = hasUppercase ? 'fas fa-check-circle text-green-500 text-xs mr-2' : 'fas fa-circle text-gray-300 text-xs mr-2';
                numberCheck.className = hasNumber ? 'fas fa-check-circle text-green-500 text-xs mr-2' : 'fas fa-circle text-gray-300 text-xs mr-2';
                
                // Calculate strength
                let strength = 0;
                if (hasLength) strength += 33;
                if (hasUppercase) strength += 33;
                if (hasNumber) strength += 34;
                
                // Update strength bar
                strengthBar.style.width = `${strength}%`;
                
                // Update color
                if (strength < 33) {
                    strengthBar.className = 'h-full bg-red-500 transition-all duration-300';
                } else if (strength < 66) {
                    strengthBar.className = 'h-full bg-yellow-500 transition-all duration-300';
                } else {
                    strengthBar.className = 'h-full bg-green-500 transition-all duration-300';
                }
                
                // Check password match
                const confirmPassword = document.getElementById('confirmPassword').value;
                const matchText = document.getElementById('password-match');
                
                if (confirmPassword && password !== confirmPassword) {
                    matchText.textContent = 'Passwords do not match';
                    matchText.className = 'text-xs mt-2 text-red-600';
                    matchText.classList.remove('hidden');
                } else if (confirmPassword && password === confirmPassword) {
                    matchText.textContent = 'Passwords match';
                    matchText.className = 'text-xs mt-2 text-green-600';
                    matchText.classList.remove('hidden');
                } else {
                    matchText.classList.add('hidden');
                }
            });
            
            // Also check confirm password field
            document.getElementById('confirmPassword').addEventListener('input', function() {
                newPasswordInput.dispatchEvent(new Event('input'));
            });
        }

        // Delete Account Modal
        function confirmDelete() {
            document.getElementById('delete-modal').classList.remove('hidden');
            document.getElementById('delete-modal').classList.add('flex');
        }

        function closeDeleteModal() {
            document.getElementById('delete-modal').classList.add('hidden');
            document.getElementById('delete-modal').classList.remove('flex');
            document.getElementById('delete-form').reset();
        }

        // Close modal on outside click
        document.getElementById('delete-modal').addEventListener('click', function(event) {
            if (event.target === this) {
                closeDeleteModal();
            }
        });

        // Form validation
        document.addEventListener('DOMContentLoaded', function() {
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                form.addEventListener('submit', function(event) {
                    if (!form.checkValidity()) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    form.classList.add('was-validated');
                }, false);
            });
        });

        // Auto-format phone number
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function() {
                this.value = this.value.replace(/\D/g, '').slice(0, 10);
            });
        }

        // Auto-format pincode
        const pincodeInput = document.getElementById('pincode');
        if (pincodeInput) {
            pincodeInput.addEventListener('input', function() {
                this.value = this.value.replace(/\D/g, '').slice(0, 6);
            });
        }