document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.querySelector('.search-form');
    const searchResults = document.getElementById('searchResults');
    const modal = document.getElementById('trainModal');
    const closeModal = document.querySelector('.close');

    // Sample train data (replace with API call)
    const trains = [
        {
            id: 1,
            name: 'Rajdhani Express',
            from: 'Delhi',
            to: 'Mumbai',
            departure: '10:00',
            arrival: '08:00',
            duration: '22h',
            price: 1200,
            seats: 45,
            image: '/images/trains/rajdhani.jpg'
        },
        // Add more train data
    ];

    // Handle search form submission
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const from = document.getElementById('from').value;
        const to = document.getElementById('to').value;
        const date = document.getElementById('date').value;
        const passengers = document.getElementById('passengers').value;

        // Filter trains based on search criteria
        const filteredTrains = filterTrains(from, to, date);
        displaySearchResults(filteredTrains);
    });

    // Filter trains function
    function filterTrains(from, to, date) {
        return trains.filter(train => 
            train.from.toLowerCase().includes(from.toLowerCase()) &&
            train.to.toLowerCase().includes(to.toLowerCase())
        );
    }

    // Display search results
    function displaySearchResults(trains) {
        searchResults.innerHTML = '';
        
        trains.forEach(train => {
            const trainCard = createTrainCard(train);
            searchResults.appendChild(trainCard);
        });
    }

    // Create train card
    function createTrainCard(train) {
        const card = document.createElement('div');
        card.className = 'train-card';
        card.innerHTML = `
            <img src="${train.image}" alt="${train.name}" class="train-image">
            <div class="train-info">
                <h3 class="train-name">${train.name}</h3>
                <div class="train-route">
                    <span>${train.from}</span>
                    <i class="fas fa-arrow-right"></i>
                    <span>${train.to}</span>
                </div>
                <div class="train-time">
                    <span>${train.departure}</span>
                    <span>${train.duration}</span>
                    <span>${train.arrival}</span>
                </div>
                <div class="seats-available">
                    <i class="fas fa-couch"></i> ${train.seats} seats available
                </div>
                <div class="train-price">
                    ₹${train.price}
                </div>
                <button class="btn-book" onclick="showTrainDetails(${train.id})">
                    Book Now
                </button>
            </div>
        `;
        return card;
    }

    // Show train details modal
    window.showTrainDetails = function(trainId) {
        const train = trains.find(t => t.id === trainId);
        if (!train) return;

        const modalContent = document.querySelector('.train-details');
        modalContent.innerHTML = `
            <h2>${train.name}</h2>
            <div class="train-details-content">
                <!-- Add detailed train information -->
            </div>
        `;
        modal.style.display = 'block';
    }

    // Close modal
    closeModal.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }

    // Real-time seat availability updates (simulated)
    function updateSeatAvailability() {
        trains.forEach(train => {
            if (Math.random() > 0.8) {
                train.seats = Math.max(0, train.seats - Math.floor(Math.random() * 3));
                const trainCard = document.querySelector(`[data-train-id="${train.id}"]`);
                if (trainCard) {
                    const seatsElement = trainCard.querySelector('.seats-available');
                    seatsElement.textContent = `${train.seats} seats available`;
                }
            }
        });
    }

    // Update seats every 30 seconds
    setInterval(updateSeatAvailability, 30000);
}); 