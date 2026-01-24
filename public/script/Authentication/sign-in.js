// // Mobile menu toggle
//         document.getElementById('mobile-menu-button').addEventListener('click', function() {
//             const menu = document.getElementById('mobile-menu');
//             menu.classList.toggle('hidden');
//         });

//         // Form submission
//         document.getElementById('signin-form').addEventListener('submit', function(e) {
//             e.preventDefault();
            
//             // Get form values
//             const email = document.getElementById('email').value;
//             const password = document.getElementById('password').value;
//             const remember = document.getElementById('remember').checked;
            
//             // Simple validation
//             if (!email || !password) {
//                 alert('Please fill in all fields');
//                 return;
//             }
            
//             // In a real app, you would send this to your server
//             console.log('Signing in with:', { email, password, remember });
            
//             // For demo purposes, redirect to home page after 1 second
//             // setTimeout(() => {
//             //     window.location.href = '/';
//             // }, 1000);
//         });

// Mobile menu toggle only
// document.getElementById('mobile-menu-button')
//     ?.addEventListener('click', () => {
//         document.getElementById('mobile-menu').classList.toggle('hidden');
//     });


// // Form submission
// document.getElementById('signin-form').addEventListener('submit', function() {
//     // e.preventDefault();
//     setTimeout(() => {
//         this.querySelectorAll('input, button').forEach(el => el.disabled = true);
//     }, 100); // delay so values are sent
    
//     // Get form values
//     const userType = document.querySelector('input[name="type"]:checked').value;
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;
//     const remember = document.getElementById('remember').checked;
    
//     // Simple validation
//     if (!email || !password) {
//         alert('Please fill in all fields');
//         return;
//     }
    
//     // Validate user type is selected
//     if (!userType) {
//         alert('Please select whether you are a Buyer or Seller');
//         return;
//     }
    
//     // Show user type confirmation
//     const userTypeText = userType === 'buyer' ? 'Buyer' : 'Seller';
//     const userTypeColor = userType === 'buyer' ? 'blue' : 'green';
    
//     // Create a styled message
//     const message = `Signing in as ${userTypeText} with email: ${email}`;
//     console.log('Signing in with:', { userType, email, password, remember });
    
//     // Show success message
//     const successDiv = document.createElement('div');
//     successDiv.className = `mt-4 p-4 rounded-lg bg-${userTypeColor}-50 border border-${userTypeColor}-200`;
//     successDiv.innerHTML = `
//         <div class="flex items-center">
//             <svg class="w-5 h-5 text-${userTypeColor}-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//             </svg>
//             <span class="text-${userTypeColor}-700 font-medium">Signing in as ${userTypeText}</span>
//         </div>
//         <p class="text-sm text-gray-600 mt-1">Redirecting to your dashboard...</p>
//     `;
    
//     // Insert success message after form
//     const form = document.getElementById('signin-form');
//     form.parentNode.insertBefore(successDiv, form.nextSibling);
    
//     // Disable form
//     form.querySelectorAll('input, button').forEach(element => {
//         element.disabled = true;
//     });
    
//     // In a real app, you would send this to your server
//     // For demo purposes, simulate API call
//     // setTimeout(() => {
//     //     // Based on user type, redirect to appropriate dashboard
//     //     if (userType === 'buyer') {
//     //         window.location.href = '/buyer/dashboard';
//     //     } else {
//     //         window.location.href = '/seller/dashboard';
//     //     }
//     // }, 1500);
//     this.submit();
// });

// // Optional: Add visual feedback when selecting user type
// document.querySelectorAll('input[name="type"]').forEach(radio => {
//     radio.addEventListener('change', function() {
//         // Remove all active styles first
//         document.querySelectorAll('input[name="type"] + label').forEach(label => {
//             label.classList.remove('ring-2', 'ring-offset-2');
//         });
        
//         // Add active style to selected
//         const selectedLabel = this.nextElementSibling;
//         if (this.value === 'buyer') {
//             selectedLabel.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2');
//         } else {
//             selectedLabel.classList.add('ring-2', 'ring-green-500', 'ring-offset-2');
//         }
//     });
// });

// // Initialize first selection
// document.getElementById('buyer').dispatchEvent(new Event('change'));