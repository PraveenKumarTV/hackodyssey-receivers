document.addEventListener('DOMContentLoaded', function() {
    // Initialize donation state management
    let donationState = {
        hasDonation: true,
        status: 'pending', // Can be 'pending', 'requested', 'accepted', 'pickup', 'completed'
        requestingNGO: null,
        requestingIndividual: null,
        agent: null,
        estimatedTime: null
    };

    // Load donation state from localStorage if available
    if (localStorage.getItem('donationState')) {
        try {
            donationState = JSON.parse(localStorage.getItem('donationState'));
        } catch (e) {
            console.error('Error loading donation state', e);
        }
    }

    // DOM elements
    const donationStatusEl = document.getElementById('donation-status');
    const currentDonationEl = document.getElementById('current-donation');
    const requestsContainer = document.getElementById('receiver-requests-container');
    const requestCountEl = document.getElementById('requestCount');

    // Example donation data (would come from backend)
    const currentDonation = {
        id: 'DON12345',
        title: 'Cooked Food- Veg & NonVeg',
        vegCount: 5,
        nonVegCount: 5,
        expiryDate: '15 Feb 2023',
        image: 'food-placeholder.jpg'
    };

    // Initialize the page based on donation state
    initPage();

    function initPage() {
        updateDonationUI();
        updateRequestsUI();
    }

    function updateDonationUI() {
        if (!donationState.hasDonation) {
            // No active donation
            currentDonationEl.style.display = 'none';
            donationStatusEl.style.display = 'none';
            return;
        }

        // Show current donation details
        currentDonationEl.innerHTML = `
            <div class="donation-details">
                <div class="food-title">
                    <h3>Food title</h3>
                    <div class="food-info">
                        <div class="food-image">
                            <img src="${currentDonation.image || 'food-placeholder.jpg'}" alt="Food">
                        </div>
                        <div class="food-description">
                            <p>${currentDonation.title}</p>
                            <div class="food-type-tags">
                                <span class="tag">Veg ${currentDonation.vegCount}</span>
                                <span class="tag">Non-Veg ${currentDonation.nonVegCount}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <p class="expiry-date">Expiration Date: ${currentDonation.expiryDate} <i class="far fa-calendar-alt"></i></p>
            </div>
        `;

        // Update status message based on current state
        updateStatusMessage();
    }

    function updateStatusMessage() {
        let statusHtml = '';

        switch(donationState.status) {
            case 'pending':
                statusHtml = `
                    <div class="status-message pending">
                        <i class="fas fa-clock"></i>
                        <p>Your request is pending</p>
                    </div>
                `;
                break;
            case 'requested':
                // No status message, as requests will be shown in the requests tab
                break;
            case 'accepted':
                statusHtml = `
                    <div class="status-message accepted">
                        <i class="fas fa-check-circle"></i>
                        <p>${donationState.requestingNGO || 'NGO'} Request has been accepted</p>
                        <p class="status-subtext">You will get notification once we set a agent to collect your food.</p>
                    </div>
                `;
                break;
            case 'pickup':
                statusHtml = `
                    <div class="status-message pickup">
                        <i class="fas fa-check-circle"></i>
                        <p>Your agent is on the way!!</p>
                        <p class="estimated-time">Estimated arrival time ${donationState.estimatedTime || '45 min'}</p>
                        <div class="agent-info">
                            <div class="agent-avatar">
                                <img src="agent-placeholder.jpg" alt="Agent">
                            </div>
                            <p class="agent-name">${donationState.agent || 'Ayush Pant'}</p>
                        </div>
                        <div class="agent-actions">
                            <button class="call-btn">Call</button>
                            <button class="track-btn" id="trackAgentBtn">Track</button>
                        </div>
                    </div>
                `;
                break;
            case 'completed':
                statusHtml = `
                    <div class="status-message completed">
                        <i class="fas fa-check-circle"></i>
                        <p>Donation completed successfully!</p>
                    </div>
                `;
                break;
        }

        donationStatusEl.innerHTML = statusHtml;
        
        // Add event listener for track button if present
        const trackBtn = document.getElementById('trackAgentBtn');
        if (trackBtn) {
            trackBtn.addEventListener('click', function() {
                window.location.href = 'tracking.html';
            });
        }
    }

    function updateRequestsUI() {
        // Show request count badge only if there are requests
        if (donationState.status === 'requested') {
            requestCountEl.textContent = '2';  // Example count, should be dynamic
            
            // Generate HTML for requests
            let requestsHtml = '';
            
            // Example NGO request
            requestsHtml += `
                <div class="request-item">
                    <p class="request-from"><strong>NGO#1</strong> has requested for food</p>
                    <div class="request-actions">
                        <button class="reject-btn" data-request-id="ngo1">Reject</button>
                        <button class="approve-btn" data-request-id="ngo1">Approve</button>
                    </div>
                </div>
            `;
            
            // Example Individual request
            requestsHtml += `
                <div class="request-item">
                    <p class="request-from"><strong>Individual</strong> has requested for food</p>
                    <div class="request-actions">
                        <button class="reject-btn" data-request-id="ind1">Reject</button>
                        <button class="approve-btn" data-request-id="ind1">Approve</button>
                    </div>
                </div>
            `;
            
            // Update the container
            requestsContainer.innerHTML = requestsHtml;
            
            // Add event listeners to the new buttons
            addRequestActionListeners();
        } else {
            requestCountEl.textContent = '0';
            requestsContainer.innerHTML = '<p class="empty-requests">No pending requests</p>';
        }
    }

    function addRequestActionListeners() {
        // Add event listeners for approve/reject buttons
        const approveButtons = document.querySelectorAll('.approve-btn');
        const rejectButtons = document.querySelectorAll('.reject-btn');
        
        approveButtons.forEach(button => {
            button.addEventListener('click', function() {
                const requestId = this.getAttribute('data-request-id');
                approveRequest(requestId);
            });
        });
        
        rejectButtons.forEach(button => {
            button.addEventListener('click', function() {
                const requestId = this.getAttribute('data-request-id');
                rejectRequest(requestId);
            });
        });
    }

    function approveRequest(requestId) {
        // Update donation state
        donationState.status = 'accepted';
        donationState.requestingNGO = requestId === 'ngo1' ? 'NGO#1' : null;
        donationState.requestingIndividual = requestId === 'ind1' ? 'Individual' : null;
        
        // Save state
        saveState();
        
        // Update UI
        initPage();
        
        // Switch back to My Post tab
        const myPostTab = document.querySelector('[data-tab="mypost"]');
        if (myPostTab) {
            myPostTab.click();
        }

        // Simulate receiving a volunteer after some time
        setTimeout(() => {
            simulateAgentAssigned();
        }, 5000);  // 5 seconds for demo purposes
    }

    function rejectRequest(requestId) {
        // For simplicity, just remove the request from the UI
        const requestItem = document.querySelector(`[data-request-id="${requestId}"]`).closest('.request-item');
        requestItem.remove();
        
        // Update request count
        const remainingRequests = document.querySelectorAll('.request-item').length;
        requestCountEl.textContent = remainingRequests;
        
        if (remainingRequests === 0) {
            requestsContainer.innerHTML = '<p class="empty-requests">No pending requests</p>';
            donationState.status = 'pending';
            saveState();
        }
    }

    function simulateAgentAssigned() {
        // Update state to pickup
        donationState.status = 'pickup';
        donationState.agent = 'Ayush Pant';
        donationState.estimatedTime = '45 min';
        
        // Save state
        saveState();
        
        // Update UI
        updateDonationUI();
    }

    function saveState() {
        localStorage.setItem('donationState', JSON.stringify(donationState));
    }

    // Setup tabs behavior
    const tabs = document.querySelectorAll('.tab');
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

    // Create donation button event
    const createDonationBtn = document.getElementById('createDonationBtn');
    if (createDonationBtn) {
        createDonationBtn.addEventListener('click', function() {
            window.location.href = 'create-donation.html';
        });
    }

    // For demo purposes, simulate a request coming in after page loads
    setTimeout(() => {
        if (donationState.status === 'pending') {
            donationState.status = 'requested';
            saveState();
            updateRequestsUI();
            
            // Flash the Requests tab to notify user
            const requestsTab = document.querySelector('[data-tab="requests"]');
            if (requestsTab) {
                requestsTab.classList.add('flash');
                setTimeout(() => {
                    requestsTab.classList.remove('flash');
                }, 2000);
            }
        }
    }, 3000);  // 3 seconds for demo
});