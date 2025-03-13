document.addEventListener('DOMContentLoaded', function() {
    // Tab Toggle
    const tabs = document.querySelectorAll('.search-tabs .tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and hide all tab contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.add('hidden'));
            
            // Add active class to clicked tab and show corresponding content
            this.classList.add('active');
            document.getElementById(`${tabId}-content`).classList.remove('hidden');
        });
    });

    // Filter Modal
    const filterBtn = document.querySelector('.filter-btn');
    const filterModal = document.getElementById('filterModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const applyBtn = document.querySelector('.apply-btn');
    const resetBtn = document.querySelector('.reset-btn');

    filterBtn.addEventListener('click', function() {
        filterModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
    });

    closeModalBtn.addEventListener('click', function() {
        filterModal.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
    });

    // Close modal when clicking outside of it
    filterModal.addEventListener('click', function(e) {
        if (e.target === filterModal) {
            filterModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Apply filters
    applyBtn.addEventListener('click', function() {
        // Here you would collect filter values and apply them
        filterModal.classList.remove('active');
        document.body.style.overflow = '';
        
        // For demonstration, show a toast message
        showToast('Filters applied');
    });

    // Reset filters
    resetBtn.addEventListener('click', function() {
        // Reset all filter inputs to defaults
        document.getElementById('distanceSlider').value = 5;
        document.querySelector('.range-value').textContent = '5 km';
        
        // Reset checkboxes
        const checkboxes = filterModal.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            if (checkbox.closest('.rating-filters')) {
                checkbox.checked = checkbox.closest('label').querySelector('.filter-label').textContent === '4+ Stars';
            } else if (checkbox.closest('.food-filters')) {
                checkbox.checked = ['Vegetarian', 'Non-Vegetarian'].includes(
                    checkbox.closest('label').querySelector('.filter-label').textContent
                );
            }
        });
        
        showToast('Filters reset');
    });

    // Distance slider
    const distanceSlider = document.getElementById('distanceSlider');
    const rangeValue = document.querySelector('.range-value');

    distanceSlider.addEventListener('input', function() {
        rangeValue.textContent = `${this.value} km`;
    });

    // Search input functionality
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        // Get active tab
        const activeTab = document.querySelector('.search-tabs .tab.active').getAttribute('data-tab');
        const activeResults = document.querySelectorAll(`#${activeTab}-content .result-item`);
        
        activeResults.forEach(result => {
            const resultText = result.textContent.toLowerCase();
            
            if (resultText.includes(searchTerm)) {
                result.style.display = 'flex';
            } else {
                result.style.display = 'none';
            }
        });
    });

    // Function to show toast messages
    function showToast(message) {
        // Create toast element if it doesn't exist
        let toast = document.querySelector('.toast-message');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast-message';
            document.body.appendChild(toast);
            
            // Add styles
            toast.style.position = 'fixed';
            toast.style.bottom = '70px';
            toast.style.left = '50%';
            toast.style.transform = 'translateX(-50%)';
            toast.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            toast.style.color = 'white';
            toast.style.padding = '10px 20px';
            toast.style.borderRadius = '20px';
            toast.style.zIndex = '1000';
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s ease-in-out';
        }
        
        // Set message and show toast
        toast.textContent = message;
        toast.style.opacity = '1';
        
        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
        }, 3000);
    }
});