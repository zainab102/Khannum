const CART_KEY = "khanum_cart";

let cart = loadCart();
let activeFilter = "all";
let searchQuery = "";

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || {};
  } catch {
    return {};
  }
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function getCartCount() {
  return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
}

function getBookById(id) {
  return BOOKS.find((b) => b.id === id);
}

// Filename used for a book's local cover photo, e.g. "Peer-e-Kamil" -> "peer-e-kamil.jpg"
function bookSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function placeholderCover(title) {
  return `https://placehold.co/400x600/6B4F3A/FAF6F0?text=${encodeURIComponent(
    title.split(" ")[0]
  )}&font=playfair-display`;
}

// Cover priority: your own local photo -> a web cover URL -> a coloured placeholder.
function coverImgTag(book, className) {
  const local = `images/covers/${bookSlug(book.title)}.jpg`;
  const web = book.cover && !book.cover.includes("placehold.co") ? book.cover : "";
  const ph = placeholderCover(book.title);
  return `<img class="${className}" src="${local}" alt="${book.title} cover" loading="lazy" data-web="${web}" data-ph="${ph}" onerror="coverFallback(this)">`;
}

function coverFallback(img) {
  const web = img.dataset.web;
  const ph = img.dataset.ph;
  if (web && !img.dataset.triedWeb) {
    img.dataset.triedWeb = "1";
    img.src = web;
    return;
  }
  img.onerror = null;
  if (ph) img.src = ph;
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  updateCartUI();
  showToast(`Added to cart 📚`);
  bounceCartBtn();
}

function updateQty(id, delta) {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  saveCart();
  updateCartUI();
}

function removeFromCart(id) {
  delete cart[id];
  saveCart();
  updateCartUI();
}

function bounceCartBtn() {
  const btn = document.getElementById("cartBtn");
  btn.classList.remove("bounce");
  void btn.offsetWidth;
  btn.classList.add("bounce");
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove("show"), 2500);
}

function buildOrderMessage() {
  const lines = ["Assalam o Alaikum! Mujhe order confirm karna hai:", ""];
  let i = 1;
  for (const [id, qty] of Object.entries(cart)) {
    const book = getBookById(Number(id));
    if (book) {
      lines.push(`${i}. ${book.title} × ${qty}`);
      i++;
    }
  }
  lines.push("", `Total books: ${getCartCount()}`, "Delivery: Pakistan-wide", "", "Shukriya! 🙏");
  return lines.join("\n");
}

async function copyOrderAndOpenInstagram() {
  if (getCartCount() === 0) {
    showToast("Cart is empty — add some books first!");
    return;
  }
  const message = buildOrderMessage();
  try {
    await navigator.clipboard.writeText(message);
    showToast("Order copied! Opening Instagram…");
  } catch {
    showToast("Copy the order message from cart");
  }
  setTimeout(() => {
    window.open(`https://ig.me/m/${KHANUM_CONFIG.instagram}`, "_blank");
  }, 600);
}

function openWhatsApp() {
  const message = getCartCount() > 0 ? buildOrderMessage() : "Assalam o Alaikum, mujhe order karna hai.";
  const url = `https://wa.me/${KHANUM_CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

function getCategories() {
  return ["all", ...new Set(BOOKS.map((b) => b.category))];
}

function filterBooks() {
  return BOOKS.filter((book) => {
    const matchesFilter =
      activeFilter === "all" ||
      activeFilter === "bestsellers"
        ? activeFilter === "all" || book.priority === "Anchor"
        : book.category === activeFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      book.title.toLowerCase().includes(q) ||
      book.category.toLowerCase().includes(q) ||
      book.dmKeyword.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });
}

function renderFilters() {
  const container = document.getElementById("filterPills");
  const categories = getCategories();
  const pills = [
    { key: "all", label: "All Books" },
    { key: "bestsellers", label: "⭐ Bestsellers" },
    ...categories.filter((c) => c !== "all").map((c) => ({ key: c, label: c })),
  ];

  container.innerHTML = pills
    .map(
      (p) =>
        `<button class="filter-pill ${activeFilter === p.key ? "active" : ""}" data-filter="${p.key}">${p.label}</button>`
    )
    .join("");

  container.querySelectorAll(".filter-pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeFilter = btn.dataset.filter;
      renderFilters();
      renderBooks();
    });
  });
}

function renderBookCard(book, index) {
  const inCart = cart[book.id] > 0;
  const badges = [
    `<span class="badge badge-stock">In Stock</span>`,
    book.priority === "Anchor" ? `<span class="badge badge-anchor">Bestseller</span>` : "",
    book.priority === "Curation" ? `<span class="badge badge-curation">Curated Pick</span>` : "",
  ]
    .filter(Boolean)
    .join("");

  return `
    <article class="book-card" style="animation-delay: ${Math.min(index * 0.03, 0.5)}s">
      <div class="book-cover-wrap">
        ${coverImgTag(book, "book-cover")}
        <div class="book-badges">${badges}</div>
      </div>
      <div class="book-info">
        <h3 class="book-title">${book.title}</h3>
        <p class="book-category">${book.category}</p>
        <button class="add-btn ${inCart ? "added" : ""}" data-id="${book.id}">
          ${inCart ? `In cart (${cart[book.id]})` : "Add to cart"}
        </button>
      </div>
    </article>
  `;
}

function renderBooks() {
  const grid = document.getElementById("bookGrid");
  const books = filterBooks();

  if (books.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <div class="emoji">📭</div>
        <p>No books found. Try a different search!</p>
      </div>`;
    return;
  }

  grid.innerHTML = books.map((b, i) => renderBookCard(b, i)).join("");

  grid.querySelectorAll(".add-btn").forEach((btn) => {
    btn.addEventListener("click", () => addToCart(Number(btn.dataset.id)));
  });
}

function renderBundles() {
  const container = document.getElementById("bundlesScroll");
  container.innerHTML = MOOD_BUNDLES.map(
    (bundle) => `
    <div class="bundle-card" data-books="${bundle.books.join("|")}">
      <div class="emoji">${bundle.emoji}</div>
      <h3>${bundle.name}</h3>
      <ul>${bundle.books.map((t) => `<li>${t}</li>`).join("")}</ul>
    </div>`
  ).join("");

  container.querySelectorAll(".bundle-card").forEach((card) => {
    card.addEventListener("click", () => {
      const titles = card.dataset.books.split("|");
      titles.forEach((title) => {
        const book = BOOKS.find((b) => b.title === title);
        if (book) cart[book.id] = (cart[book.id] || 0) + 1;
      });
      saveCart();
      updateCartUI();
      openCart();
      showToast(`Bundle added! ${titles.length} books 📚`);
    });
  });
}

function renderCartItems() {
  const container = document.getElementById("cartItems");
  const ids = Object.keys(cart);

  if (ids.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <div class="emoji">📚</div>
        <p>Your cart is empty</p>
        <p style="font-size:0.85rem;margin-top:0.5rem">Browse our collection and add your favourites!</p>
      </div>`;
    return;
  }

  container.innerHTML = ids
    .map((id) => {
      const book = getBookById(Number(id));
      if (!book) return "";
      return `
      <div class="cart-item">
        ${coverImgTag(book, "")}
        <div class="cart-item-info">
          <div class="cart-item-title">${book.title}</div>
          <div class="qty-controls">
            <button class="qty-btn" data-id="${id}" data-delta="-1">−</button>
            <span class="qty-value">${cart[id]}</span>
            <button class="qty-btn" data-id="${id}" data-delta="1">+</button>
          </div>
          <button class="remove-btn" data-id="${id}">Remove</button>
        </div>
      </div>`;
    })
    .join("");

  container.querySelectorAll(".qty-btn").forEach((btn) => {
    btn.addEventListener("click", () => updateQty(Number(btn.dataset.id), Number(btn.dataset.delta)));
  });
  container.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", () => removeFromCart(Number(btn.dataset.id)));
  });
}

function updateCartUI() {
  const count = getCartCount();
  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartCount").dataset.count = count;
  document.getElementById("cartTotal").textContent = `${count} book${count !== 1 ? "s" : ""}`;
  renderCartItems();
  renderBooks();
}

function openCart() {
  document.getElementById("cartOverlay").classList.add("open");
  document.getElementById("cartDrawer").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  document.getElementById("cartOverlay").classList.remove("open");
  document.getElementById("cartDrawer").classList.remove("open");
  document.body.style.overflow = "";
}

function initConfig() {
  document.getElementById("brandName").textContent = KHANUM_CONFIG.brandName;
  document.querySelectorAll("[data-brand]").forEach((el) => {
    el.textContent = KHANUM_CONFIG.brandName;
  });
  document.getElementById("instagramHandle").textContent = `@${KHANUM_CONFIG.instagram}`;
  document.getElementById("deliveryDays").textContent = KHANUM_CONFIG.deliveryDays;
  document.getElementById("deliveryNote").textContent = KHANUM_CONFIG.deliveryNote;

  const igLinks = document.querySelectorAll("[data-instagram]");
  igLinks.forEach((a) => {
    a.href = `https://instagram.com/${KHANUM_CONFIG.instagram}`;
  });

  const waBtn = document.getElementById("whatsappBtn");
  if (KHANUM_CONFIG.whatsapp) {
    waBtn.style.display = "flex";
    waBtn.addEventListener("click", openWhatsApp);
  }

  const heroBooks = document.getElementById("heroBooks");
  const featured = BOOKS.filter((b) => b.priority === "Anchor").slice(0, 3);
  heroBooks.innerHTML = featured.map((b) => coverImgTag(b, "hero-book")).join("");
}

function init() {
  initConfig();
  renderFilters();
  renderBooks();
  renderBundles();
  updateCartUI();

  document.getElementById("searchInput").addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderBooks();
  });

  document.getElementById("cartBtn").addEventListener("click", openCart);
  document.getElementById("closeCart").addEventListener("click", closeCart);
  document.getElementById("cartOverlay").addEventListener("click", closeCart);
  document.getElementById("checkoutBtn").addEventListener("click", copyOrderAndOpenInstagram);
  document.getElementById("heroShopBtn").addEventListener("click", () => {
    document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });
  });
  document.getElementById("heroIgBtn").addEventListener("click", () => {
    window.open(`https://ig.me/m/${KHANUM_CONFIG.instagram}`, "_blank");
  });
}

document.addEventListener("DOMContentLoaded", init);
