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
// Fetch and populate gallery
fetch('flowers.json')
    .then(response => response.json())
    .then(data => {
        const gallery = document.getElementById('gallery');
        data.flowers.forEach(flower => {
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

        // Populate advice section
        const adviceContainer = document.getElementById('advice-container');
        data.advice.forEach(advice => {
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
    })
    .catch(error => console.error('Error loading data:', error));

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

// Close modal when clicking outside
document.getElementById('modal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Infinite carousel animation reset
document.querySelector('.roles-carousel').addEventListener('animationend', function() {
    this.style.animation = 'none';
    void this.offsetWidth; // Trigger reflow
    this.style.animation = null;
});