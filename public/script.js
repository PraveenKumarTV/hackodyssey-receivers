document.addEventListener('DOMContentLoaded', function() {
    const donorTypes = document.querySelectorAll('.donor-type');
    const businessNameInput = document.getElementById('businessName');
    const useLocationBtn = document.getElementById('useLocationBtn');
    const latitudeInput = document.getElementById('latitude');
    const longitudeInput = document.getElementById('longitude');
    const locationInput = document.getElementById('location');

    // Handle donor type selection
    donorTypes.forEach(type => {
        type.addEventListener('click', function() {
            donorTypes.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            if (this.id === 'individual') {
                businessNameInput.placeholder = 'Full Name';
            } else {
                businessNameInput.placeholder = 'Business Name';
            }
        });
    });

    // ✅ Use Current Location Functionality
    useLocationBtn.addEventListener('click', function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;

                    latitudeInput.value = lat;
                    longitudeInput.value = lng;
                    locationInput.value = `${lat}, ${lng}`;

                    // ✅ Reverse geocoding to get address
                    fetchAddress(lat, lng);
                },
                function(error) {
                    alert('Error getting location: ' + error.message);
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    });

    // ✅ Map modal functionality
    const mapModal = document.getElementById('mapModal');
    const pinLocationBtn = document.getElementById('pinLocationBtn');
    const closeBtn = document.querySelector('.close');
    const confirmLocationBtn = document.getElementById('confirmLocation');
    let map;
    let marker;

    pinLocationBtn.addEventListener('click', function(e) {
        e.preventDefault();
        mapModal.style.display = 'block';
        initMap();
    });

    closeBtn.addEventListener('click', function() {
        mapModal.style.display = 'none';
    });

    confirmLocationBtn.addEventListener('click', function() {
        const locationValue = locationInput.value;
        if (locationValue) {
            const [lat, lng] = locationValue.split(', ');
            fetchAddress(lat, lng);
        }
        mapModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === mapModal) {
            mapModal.style.display = 'none';
        }
    });

    function initMap() {
        if (map) {
            map.remove();
        }

        map = L.map('map').setView([20.5937, 78.9629], 5);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
        
        map.on('click', function(e) {
            if (marker) {
                map.removeLayer(marker);
            }
            marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
            locationInput.value = `${e.latlng.lat}, ${e.latlng.lng}`;
        });

        // ✅ Map/Satellite toggle
        const mapBtn = document.querySelector('.map-btn');
        const satelliteBtn = document.querySelector('.satellite-btn');

        mapBtn.addEventListener('click', function() {
            if (!this.classList.contains('active')) {
                map.removeLayer(map._layers[Object.keys(map._layers)[1]]);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; OpenStreetMap contributors'
                }).addTo(map);
                satelliteBtn.classList.remove('active');
                this.classList.add('active');
            }
        });

        satelliteBtn.addEventListener('click', function() {
            if (!this.classList.contains('active')) {
                map.removeLayer(map._layers[Object.keys(map._layers)[1]]);
                L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                    attribution: 'Tiles &copy; Esri'
                }).addTo(map);
                mapBtn.classList.remove('active');
                this.classList.add('active');
            }
        });
    }

    // ✅ Fetch address using Nominatim API (Reverse Geocoding)
    function fetchAddress(lat, lng) {
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.display_name) {
                    document.getElementById('address').value = data.display_name;
                    document.getElementById('pinCode').value = data.address.postcode || '';
                } else {
                    alert('Failed to fetch address');
                }
            })
            .catch(error => {
                console.error('Error fetching address:', error);
                alert('Error fetching address');
            });
    }

    // ✅ Form submission
    const donorForm = document.getElementById('donorForm');
    
    donorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const mobileNumber = document.getElementById('mobileNumber').value;
        const emailId = document.getElementById('emailId').value;
        
        if (mobileNumber.length < 10) {
            alert('Please enter a valid mobile number');
            return;
        }
        
        if (!validateEmail(emailId)) {
            alert('Please enter a valid email address');
            return;
        }
        
        alert('Form submitted successfully!');
        window.location.href = 'profile.html';
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
});
