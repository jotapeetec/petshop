/* ==========================================================
   AUMIGOS PET SHOP — script.js
   Bibliotecas utilizadas (todas via CDN):
   1. Three.js → mascote 3D no hero que segue o mouse
   2. GSAP     → animações de entrada, scroll e microinterações
   3. Leaflet  → mapa interativo de localização da loja
   ========================================================== */

/* ------------------------------------------------------------
   1. DADOS DOS PRODUTOS
   ------------------------------------------------------------ */
const products = [
  {
    id: 'racao-premium', name: 'Ração Premium Adulto', price: 149.90, cat: 'racao', badge: 'Mais vendida',
    img: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&q=80',
    desc: 'Frango e arroz, alta proteína para cães adultos de raças médias.'
  },
  {
    id: 'racao-natural', name: 'Ração Natural Grain Free', price: 189.90, cat: 'racao', badge: 'Premium',
    img: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&q=80',
    desc: 'Sem grãos, sem corantes. Salmão e batata-doce para pelos brilhantes.'
  },
  {
    id: 'racao-gato', name: 'Ração para Gatos Castrados', price: 119.90, cat: 'racao', badge: 'Para gatos',
    img: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&q=80',
    desc: 'Controle de peso e saúde urinária para gatos adultos castrados.'
  },
  {
    id: 'bolinha', name: 'Bolinha Crava Pet', price: 19.90, cat: 'brinquedo', badge: 'Diversão',
    img: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&q=80',
    desc: 'Bolinha resistente que limpa os dentes enquanto o cão brinca.'
  },
  {
    id: 'arranhador', name: 'Arranhador para Gatos', price: 89.90, cat: 'brinquedo', badge: 'Para gatos',
    img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80',
    desc: 'Torre com sisal natural, toca e bolinha pendurada. Diversão garantida.'
  },
  {
    id: 'corda', name: 'Brinquedo de Corda', price: 14.90, cat: 'brinquedo', badge: 'Cabo de guerra',
    img: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&q=80',
    desc: 'Algodão trançado resistente para brincar de puxa-puxa.'
  },
  {
    id: 'caminha', name: 'Caminha Ortopédica', price: 129.90, cat: 'acessorio', badge: 'Conforto',
    img: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=600&q=80',
    desc: 'Espuma de alta densidade com capa removível e lavável.'
  },
  {
    id: 'coleira', name: 'Coleira Peitoral Ajustável', price: 44.90, cat: 'acessorio', badge: 'Passeio',
    img: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&q=80',
    desc: 'Peitoral anti-puxão com acolchoamento e fita refletiva noturna.'
  },
  {
    id: 'comedouro', name: 'Comedouro Duplo Inox', price: 54.90, cat: 'acessorio', badge: 'Cozinha do pet',
    img: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&q=80',
    desc: 'Aço inox antiderrapante, fácil de limpar e higiênico.'
  }
];

const formatPrice = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

/* ------------------------------------------------------------
   2. GRADE DE PRODUTOS + FILTROS
   ------------------------------------------------------------ */
const grid = document.getElementById('productsGrid');
let activeFilter = 'todos';

function renderProducts() {
  const list = activeFilter === 'todos'
    ? products
    : products.filter(p => p.cat === activeFilter);

  grid.innerHTML = list.map(p => `
    <article class="product-card" data-cat="${p.cat}">
      <div class="product-img">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <span class="product-badge">${p.badge}</span>
      </div>
      <div class="product-body">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="product-foot">
          <span class="product-price">${formatPrice(p.price)}</span>
          <button class="add-btn" onclick="addToCart('${p.id}')">Adicionar 🐾</button>
        </div>
      </div>
    </article>
  `).join('');

  // Anima os cards que acabaram de entrar (GSAP)
  gsap.from('.product-card', {
    opacity: 0, y: 40, scale: 0.96, duration: 0.5,
    stagger: 0.07, ease: 'power2.out', clearProps: 'all'
  });
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    renderProducts();
  });
});

/* ------------------------------------------------------------
   3. CARRINHO
   ------------------------------------------------------------ */
let cart = {};

const cartModal   = document.getElementById('cartModal');
const cartOverlay = document.getElementById('cartOverlay');
const cartItems   = document.getElementById('cartItems');
const cartBadge   = document.getElementById('cartBadge');
const cartTotal   = document.getElementById('cartTotal');

function openCart() {
  cartOverlay.classList.add('open');
  gsap.to(cartModal, { x: 0, duration: 0.45, ease: 'power3.out' });
}
function closeCart() {
  cartOverlay.classList.remove('open');
  gsap.to(cartModal, { x: '100%', duration: 0.4, ease: 'power3.in' });
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  const p = products.find(p => p.id === id);
  showToast(`${p.name} adicionado! 🐾`);
  // "Pulsa" o badge do carrinho (GSAP)
  gsap.fromTo(cartBadge, { scale: 1.6 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' });
}

function changeQty(id, delta) {
  cart[id] += delta;
  if (cart[id] <= 0) delete cart[id];
  renderCart();
}

function renderCart() {
  const entries = Object.entries(cart);
  const count = entries.reduce((acc, [, q]) => acc + q, 0);
  cartBadge.textContent = count;

  if (!entries.length) {
    cartItems.innerHTML = '<p class="cart-empty">🐶<br>Seu carrinho está vazio...</p>';
    cartTotal.textContent = formatPrice(0);
    return;
  }

  let total = 0;
  cartItems.innerHTML = entries.map(([id, qty]) => {
    const p = products.find(p => p.id === id);
    total += p.price * qty;
    return `
      <div class="cart-item">
        <img src="${p.img}" alt="${p.name}">
        <div class="cart-item-info">
          <h4>${p.name}</h4>
          <span>${formatPrice(p.price)}</span>
        </div>
        <div class="qty-controls">
          <button onclick="changeQty('${id}', -1)">−</button>
          <strong>${qty}</strong>
          <button onclick="changeQty('${id}', 1)">+</button>
        </div>
      </div>`;
  }).join('');
  cartTotal.textContent = formatPrice(total);
}

document.getElementById('openCartBtn').addEventListener('click', openCart);
document.getElementById('closeCartBtn').addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

document.getElementById('checkoutBtn').addEventListener('click', () => {
  if (!Object.keys(cart).length) {
    showToast('Adicione algo antes de finalizar! 🦴');
    return;
  }
  showToast('Pedido feito! Obrigado pela preferência 🐾🎉');
  cart = {};
  renderCart();
  closeCart();
});

/* ------------------------------------------------------------
   4. TOAST (avisos)
   ------------------------------------------------------------ */
const toast = document.getElementById('toast');
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

/* ------------------------------------------------------------
   5. HEADER: fundo ao rolar + menu mobile
   ------------------------------------------------------------ */
const header = document.getElementById('header');
addEventListener('scroll', () => {
  header.classList.toggle('scrolled', scrollY > 40);
});

const hamburger = document.getElementById('hamburgerBtn');
const navMenu = document.getElementById('navMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('open');
});
document.querySelectorAll('.nav-link').forEach(link =>
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
  })
);

/* ------------------------------------------------------------
   6. BOTÃO DA PROMOÇÃO
   ------------------------------------------------------------ */
document.getElementById('promoBtn').addEventListener('click', () => {
  showToast('Use o cupom AU20 no checkout! 🎟️');
  document.getElementById('produtos').scrollIntoView({ behavior: 'smooth' });
});

/* ------------------------------------------------------------
   7. BIBLIOTECA GSAP — animações de entrada e scroll
   ------------------------------------------------------------ */
gsap.registerPlugin(ScrollTrigger);

// Direções configuradas por atributo data-anim
const animDirections = {
  left:  { x: -90, y: 0 },
  right: { x: 90,  y: 0 },
  up:    { x: 0,   y: 60 },
  zoom:  { x: 0,   y: 0, scale: 0.92 }
};

document.querySelectorAll('[data-anim]').forEach(el => {
  const dir = animDirections[el.dataset.anim] || animDirections.up;
  gsap.from(el, {
    opacity: 0,
    x: dir.x, y: dir.y,
    scale: dir.scale || 1,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 88%' }
  });
});

// Contadores animados do hero (ex: "2500 pets felizes")
document.querySelectorAll('[data-counter]').forEach(el => {
  const target = parseFloat(el.dataset.counter);
  const isDecimal = !Number.isInteger(target);
  const obj = { value: 0 };
  gsap.to(obj, {
    value: target,
    duration: 2,
    ease: 'power2.out',
    delay: 0.6,
    onUpdate: () => {
      el.textContent = isDecimal
        ? obj.value.toFixed(1)
        : Math.round(obj.value).toLocaleString('pt-BR') + '+';
    }
  });
});

// O emoji da promoção gira ao clicar
const promoEmoji = document.querySelector('.promo-emoji');
promoEmoji.addEventListener('click', () => {
  gsap.to(promoEmoji, { rotation: '+=360', duration: 0.8, ease: 'back.out(1.5)' });
});

/* ------------------------------------------------------------
   8. BIBLIOTECA THREE.JS — mascote 3D que segue o mouse
   ------------------------------------------------------------ */
(function mascote3D() {
  const canvas = document.getElementById('petCanvas');
  const cena = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 6;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

  function resize() {
    const box = canvas.parentElement.getBoundingClientRect();
    renderer.setSize(box.width, box.height, false);
    camera.aspect = box.width / box.height;
    camera.updateProjectionMatrix();
  }
  resize();
  addEventListener('resize', resize);

  // Cachorrinho montado com formas simples:
  // cabeça (esfera), focinho, orelhas, olhos e nariz
  const dog = new THREE.Group();

  const corPelagem  = new THREE.MeshStandardMaterial({ color: 0xd9a066, roughness: 0.7 });
  const corEscura   = new THREE.MeshStandardMaterial({ color: 0x6b4423, roughness: 0.7 });
  const corNariz    = new THREE.MeshStandardMaterial({ color: 0x2b2b2b, roughness: 0.4 });
  const corOlho     = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.2 });

  const cabeca = new THREE.Mesh(new THREE.SphereGeometry(1.3, 48, 48), corPelagem);
  dog.add(cabeca);

  const focinho = new THREE.Mesh(new THREE.SphereGeometry(0.62, 32, 32), corEscura);
  focinho.position.set(0, -0.35, 1.05);
  dog.add(focinho);

  const nariz = new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 24), corNariz);
  nariz.position.set(0, -0.15, 1.6);
  dog.add(nariz);

  // Olhos (com brilho)
  [-0.45, 0.45].forEach(x => {
    const olho = new THREE.Mesh(new THREE.SphereGeometry(0.14, 24, 24), corOlho);
    olho.position.set(x, 0.35, 1.15);
    dog.add(olho);
    const brilho = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    brilho.position.set(x + 0.05, 0.4, 1.27);
    dog.add(brilho);
  });

  // Orelhas: cones achatados, balançam sozinhas
  const orelhaE = new THREE.Mesh(new THREE.ConeGeometry(0.45, 1.1, 24), corEscura);
  orelhaE.position.set(-0.95, 1.15, 0);
  orelhaE.rotation.z = 0.45;
  dog.add(orelhaE);

  const orelhaD = new THREE.Mesh(new THREE.ConeGeometry(0.45, 1.1, 24), corEscura);
  orelhaD.position.set(0.95, 1.15, 0);
  orelhaD.rotation.z = -0.45;
  dog.add(orelhaD);

  // Língua que sai e volta (animação)
  const lingua = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.5, 0.12),
    new THREE.MeshStandardMaterial({ color: 0xff6b81, roughness: 0.6 })
  );
  lingua.position.set(0, -0.85, 1.25);
  lingua.visible = false;
  dog.add(lingua);

  cena.add(dog);
  cena.add(new THREE.AmbientLight(0xffffff, 0.7));
  const luz = new THREE.DirectionalLight(0xffffff, 1.2);
  luz.position.set(3, 4, 5);
  cena.add(luz);

  // Balanço padrão + língua de 3 em 3 segundos (tipo "feliz")
  gsap.to([orelhaE.rotation, orelhaD.rotation], {
    z: '+=0.18', duration: 0.5, yoyo: true, repeat: -1, ease: 'sine.inOut'
  });
  setInterval(() => {
    lingua.visible = true;
    gsap.fromTo(lingua.scale, { y: 0.2 }, {
      y: 1, duration: 0.25, yoyo: true, repeat: 1,
      onComplete: () => lingua.visible = false
    });
  }, 3000);

  // Segue o mouse suavemente (lerp)
  let alvoX = 0, alvoY = 0;
  addEventListener('mousemove', e => {
    alvoX = (e.clientX / innerWidth - 0.5) * 1.4;
    alvoY = (e.clientY / innerHeight - 0.5) * 0.9;
  });

  let t = 0;
  (function loop() {
    requestAnimationFrame(loop);
    t += 0.02;
    dog.rotation.y += (alvoX - dog.rotation.y) * 0.06;
    dog.rotation.x += (alvoY - dog.rotation.x) * 0.06;
    dog.position.y = Math.sin(t) * 0.15; // flutua levemente
    renderer.render(cena, camera);
  })();
})();

/* ------------------------------------------------------------
   9. BIBLIOTECA LEAFLET — mapa da loja
   ------------------------------------------------------------ */
const mapa = L.map('mapa').setView([-22.9068, -43.1729], 15);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(mapa);

// Marcador personalizado (emoji de pata) com popup
const pataIcon = L.divIcon({
  html: '<div style="font-size:2.2rem">🐾</div>',
  className: 'pata-marker',
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

L.marker([-22.9068, -43.1729], { icon: pataIcon })
  .addTo(mapa)
  .bindPopup('<b>AuMigos Pet Shop 🐶</b><br>Rua dos Bichinhos, 123 — Centro<br>Seg a Sáb, 8h às 20h')
  .openPopup();

/* ------------------------------------------------------------
   INICIALIZAÇÃO
   ------------------------------------------------------------ */
renderProducts();
renderCart();
gsap.set(cartModal, { x: '100%' }); // modal do carrinho começa escondido
