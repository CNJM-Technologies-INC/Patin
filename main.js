// Pagination configuration
const ITEMS_PER_PAGE = {
    flowers: 6,
    advice: 4
};

let currentPage = {
    flowers: 1,
    advice: 1
};

// P5.js Background Animation
new p5(function(p) {
    let particles = [];

    p.setup = function() {
        let canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent('p5-container');
        for(let i = 0; i < 50; i++) {
            particles.push({
                x: p.random(p.width),
                y: p.random(p.height),
                size: p.random(2, 5),
                speedX: p.random(-0.5, 0.5),
                speedY: p.random(-0.5, 0.5)
            });
        }
    };

    p.draw = function() {
        p.clear();
        particles.forEach(particle => {
            p.noStroke();
            p.fill(74, 222, 128, 100);
            p.circle(particle.x, particle.y, particle.size);
            
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            if(particle.x < 0) particle.x = p.width;
            if(particle.x > p.width) particle.x = 0;
            if(particle.y < 0) particle.y = p.height;
            if(particle.y > p.height) particle.y = 0;
        });
    };

    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
});

// Gallery population function
function populateGallery(data, page = 1) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = ''; // Clear existing content
    
    const start = (page - 1) * ITEMS_PER_PAGE.flowers;
    const end = start + ITEMS_PER_PAGE.flowers;
    const paginatedFlowers = data.flowers.slice(start, end);
    
    // Add flowers
    paginatedFlowers.forEach(flower => {
        const item = document.createElement('div');
        item.className = 'hover-lift cursor-pointer';
        item.innerHTML = `
            <div class="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700">
                <img src="${flower.image}" alt="${flower.name}" class="w-full h-64 object-cover transition-transform duration-300 hover:scale-105">
                <div class="p-4">
                    <h3 class="caveat text-xl text-green-400 mb-2">${flower.name}</h3>
                    <p class="text-gray-400 mb-2">${flower.varieties.join(', ')}</p>
                    <p class="text-green-400 font-semibold">${flower.price}</p>
                </div>
            </div>
        `;
        item.onclick = () => showModal(flower);
        gallery.appendChild(item);
    });
    
    // Add pagination controls
    const totalPages = Math.ceil(data.flowers.length / ITEMS_PER_PAGE.flowers);
    if (totalPages > 1) {
        const paginationContainer = document.createElement('div');
        paginationContainer.className = 'col-span-full flex justify-center items-center gap-4 mt-8';
        paginationContainer.innerHTML = `
            <button class="pagination-btn" ${page === 1 ? 'disabled' : ''} 
                    onclick="changePage('flowers', ${page - 1})">
                Previous
            </button>
            <span class="text-gray-400">Page ${page} of ${totalPages}</span>
            <button class="pagination-btn" ${page === totalPages ? 'disabled' : ''} 
                    onclick="changePage('flowers', ${page + 1})">
                Next
            </button>
        `;
        gallery.appendChild(paginationContainer);
    }
}

// Advice population function
function populateAdvice(data, page = 1) {
    const adviceContainer = document.getElementById('advice-container');
    adviceContainer.innerHTML = ''; // Clear existing content
    
    const start = (page - 1) * ITEMS_PER_PAGE.advice;
    const end = start + ITEMS_PER_PAGE.advice;
    const paginatedAdvice = data.advice.slice(start, end);
    
    // Add advice cards
    paginatedAdvice.forEach(advice => {
        const card = document.createElement('div');
        card.className = 'bg-gray-800 rounded-lg p-6 hover-lift border border-gray-700';
        card.innerHTML = `
            <span class="inline-block px-3 py-1 text-sm text-green-400 border border-green-400 rounded-full mb-4">
                ${advice.category}
            </span>
            <h3 class="caveat text-xl text-green-400 mb-3">${advice.title}</h3>
            <p class="text-gray-300">${advice.content}</p>
        `;
        adviceContainer.appendChild(card);
    });
    
    // Add pagination controls
    const totalPages = Math.ceil(data.advice.length / ITEMS_PER_PAGE.advice);
    if (totalPages > 1) {
        const paginationContainer = document.createElement('div');
        paginationContainer.className = 'col-span-full flex justify-center items-center gap-4 mt-8';
        paginationContainer.innerHTML = `
            <button class="pagination-btn" ${page === 1 ? 'disabled' : ''} 
                    onclick="changePage('advice', ${page - 1})">
                Previous
            </button>
            <span class="text-gray-400">Page ${page} of ${totalPages}</span>
            <button class="pagination-btn" ${page === totalPages ? 'disabled' : ''} 
                    onclick="changePage('advice', ${page + 1})">
                Next
            </button>
        `;
        adviceContainer.appendChild(paginationContainer);
    }
}

// Page change handler
function changePage(section, newPage) {
    currentPage[section] = newPage;
    if (section === 'flowers') {
        fetch('flowers.json')
            .then(response => response.json())
            .then(data => populateGallery(data, newPage));
    } else {
        fetch('flowers.json')
            .then(response => response.json())
            .then(data => populateAdvice(data, newPage));
    }
}

// Modal functions
function showModal(flower) {
    const modal = document.getElementById('modal');
    const content = document.getElementById('modal-content');
    content.innerHTML = `
        <img src="${flower.image}" alt="${flower.name}" class="w-full h-72 object-cover rounded-lg mb-4">
        <h3 class="caveat text-3xl text-green-400 mb-3">${flower.name}</h3>
        <p class="text-gray-300 mb-4">${flower.description}</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
                <h4 class="caveat text-xl text-green-400 mb-2">Varieties</h4>
                <ul class="list-disc list-inside text-gray-300">
                    ${flower.varieties.map(v => `<li>${v}</li>`).join('')}
                </ul>
            </div>
            <div>
                <h4 class="caveat text-xl text-green-400 mb-2">Market Price</h4>
                <p class="text-gray-300">${flower.price}</p>
            </div>
        </div>

        <div class="bg-gray-700 p-4 rounded-lg">
            <h4 class="caveat text-xl text-green-400 mb-2">Export Care Instructions</h4>
            <p class="text-gray-300">${flower.care}</p>
        </div>
    `;
    modal.classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initial data load
    fetch('flowers.json')
        .then(response => response.json())
        .then(data => {
            populateGallery(data, currentPage.flowers);
            populateAdvice(data, currentPage.advice);
        })
        .catch(error => console.error('Error loading data:', error));

    // Modal outside click handler
    document.getElementById('modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });

    // Infinite carousel animation reset
    const rolesCarousel = document.querySelector('.roles-carousel');
    if (rolesCarousel) {
        rolesCarousel.addEventListener('animationend', function() {
            this.style.animation = 'none';
            void this.offsetWidth; // Trigger reflow
            this.style.animation = null;
        });
    }

    // Scroll to top functionality
    const scrollBtn = document.getElementById('scroll-top-btn');
    if (scrollBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        });

        scrollBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});