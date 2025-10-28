// Image preview functionality
        document.getElementById('productImages').addEventListener('change', function(e) {
            const previewsContainer = document.getElementById('imagePreviews');
            previewsContainer.innerHTML = '';
            
            Array.from(e.target.files).forEach((file, index) => {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const preview = document.createElement('div');
                    preview.className = 'image-preview relative w-20 h-20 rounded-md overflow-hidden border border-gray-200';
                    preview.innerHTML = `
                        <img src="${event.target.result}" class="w-full h-full object-cover">
                        <button type="button" onclick="removeImage(this)" class="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">×</button>
                        <input type="hidden" name="image[${index}][url]" value="${event.target.result}">
                        <input type="hidden" name="image[${index}][public_id]" value="upload_${Date.now()}_${index}">
                    `;
                    previewsContainer.appendChild(preview);
                };
                reader.readAsDataURL(file);
            });
        });

        function removeImage(button) {
            button.parentElement.remove();
            // You might want to update the file input as well
        }

        // Add a new key feature input field
            function addKeyFeature() {
                const container = document.getElementById("keyFeaturesContainer");

                const div = document.createElement("div");
                div.classList.add("flex", "space-x-2");

                div.innerHTML = `
                    <input type="text" name="key_features[]" placeholder="Key feature" required
                        class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <button type="button" onclick="removeKeyFeature(this)" class="px-2 text-red-500 hover:text-red-700">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 
                                00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                `;

                container.appendChild(div);
            }

            // Remove a key feature input field
            function removeKeyFeature(button) {
                button.parentElement.remove();
            }

            function resetForm() {
            if (confirm('Are you sure you want to reset the form?')) {
                document.getElementById('productForm').reset();
                document.getElementById('imagePreviews').innerHTML = '';
                document.getElementById('keyFeaturesContainer').innerHTML = `
                    <div class="flex space-x-2">
                        <input type="text" name="key_features[]" placeholder="Key feature" required
                            class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <button type="button" onclick="removeKeyFeature(this)" class="px-2 text-red-500 hover:text-red-700">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                `;
                keyFeatureCount = 1;
            }
        }
        
        // Add to your existing script or create a new one
            // let keyFeatureCount = 1;

            // function addKeyFeature() {
            //     keyFeatureCount++;
            //     const container = document.getElementById('keyFeaturesContainer');
            //     const newFeature = document.createElement('div');
            //     newFeature.className = 'flex space-x-2';
            //     newFeature.innerHTML = `
            //         <input type="text" name="key_features" placeholder="Key feature" required
            //             class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            //         <button type="button" onclick="removeKeyFeature(this)" class="px-2 text-red-500 hover:text-red-700">
            //             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            //                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            //             </svg>
            //         </button>
            //     `;
            //     container.appendChild(newFeature);
            // }

            // function removeKeyFeature(button) {
            //     if (document.getElementById('keyFeaturesContainer').children.length > 1) {
            //         button.parentElement.remove();
            //     } else {
            //         alert("You need at least one key feature");
            //     }
            // }


            

        // Specifications management
        // let specCount = 1;
        // function addSpec() {
        //     specCount++;
        //     const container = document.getElementById('specsContainer');
        //     const newSpec = document.createElement('div');
        //     newSpec.className = 'flex space-x-2';
        //     newSpec.innerHTML = `
        //         <input type="text" name="specs[key${specCount}]" placeholder="Specification name" class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        //         <input type="text" name="specs[value${specCount}]" placeholder="Value" class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        //         <button type="button" onclick="removeSpec(this)" class="px-2 text-red-500 hover:text-red-700">
        //             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        //                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        //             </svg>
        //         </button>
        //     `;
        //     container.appendChild(newSpec);
        // }

        // function removeSpec(button) {
        //     if (document.getElementById('specsContainer').children.length > 1) {
        //         button.parentElement.remove();
        //     } else {
        //         alert("You need at least one specification");
        //     }
        // }

        // Form handling
        // document.getElementById('productForm').addEventListener('submit', async function(e) {
        //     e.preventDefault();
            
        //     // Simple validation
        //     const requiredFields = ['productName', 'category', 'smallDescription', 'price', 'stock'];
        //     for (const fieldId of requiredFields) {
        //         const input = document.getElementById(fieldId);
        //         if (!input || !input.value.trim()) {
        //         alert(`Please fill in ${fieldId.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        //         return;
        //         }
        //     }
        // })

            // Collect form data
            // const formData = new FormData(this);
            // const productData = {};
            
            // Convert FormData to object
        //     formData.forEach((value, key) => {
        //         // Handle nested objects
        //         if (key.includes('[') && key.includes(']')) {
        //             const keys = key.split(/\[|\]/).filter(k => k);
        //             let current = productData;
                    
        //             for (let i = 0; i < keys.length - 1; i++) {
        //                 const k = keys[i];
        //                 if (!current[k]) {
        //                     // If next key is a number, create array, otherwise object
        //                     current[k] = isNaN(keys[i+1]) ? {} : [];
        //                 }
        //                 current = current[k];
        //             }
                    
        //             current[keys[keys.length - 1]] = value;
        //         } else {
        //             productData[key] = value;
        //         }
        //     });

        //     try {
        //         // Send to backend
        //         const response = await fetch('/api/product', {
        //             method: 'POST',
        //             headers: {
        //                 'Content-Type': 'application/json',
        //             },
        //             body: JSON.stringify(productData)
        //         });

        //         if (response.ok) {
        //             const result = await response.json();
        //             alert('Product saved successfully!');
        //             resetForm();
        //         } else {
        //             throw new Error('Failed to save product');
        //         }
        //     } catch (error) {
        //         console.error('Error:', error);
        //         alert('Error saving product. Please try again.');
        //     }
        // });

        