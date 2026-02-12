
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function formatPrice(num) {
  const n = Number(num);
  if (Number.isNaN(n)) return "$0.00";
  return `$${n.toFixed(2)}`;
}

function safeData() {
  const root = Array.isArray(fastFood) && fastFood[0] ? fastFood[0] : null;
  return {
    categories: root?.categories ?? [],
    products: root?.products ?? [],
  };
}

function renderCategories(categories) {
  const wrap = $("#cats");
  if (!wrap) return;

  wrap.innerHTML = categories.map((c) => {
    const name = c.categoriyName ?? "Category";
    const img = c.categoriyImage ?? "";
    const price = c.categoriyPrice ?? "";
    return `
      <article class="cat" data-cat="${name}">
        <div class="cat__bg" style="background-image:url('${img}')"></div>
        <div class="cat__shade"></div>
        <div class="cat__content">
          <div>
            <div class="cat__name">${name.toUpperCase()}</div>
            <div class="cat__price">${price ? `$${price}` : ""}</div>
          </div>
        </div>
        <button class="btn btn--solid cat__btn" type="button">See more</button>
      </article>
    `;
  }).join("");

  wrap.addEventListener("click", (e) => {
    const card = e.target.closest(".cat");
    if (!card) return;
    const catName = card.getAttribute("data-cat");
    filterProducts(catName);
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  });
}

let ALL_PRODUCTS = [];

function calcOldPrice(price, discountPct) {
  const p = Number(price);
  const d = Number(discountPct);
  if (!p || !d) return null;
  const old = p / (1 - d / 100);
  return old;
}

function renderProducts(products) {
  const grid = $("#productsGrid");
  if (!grid) return;

  grid.innerHTML = products.map((p) => {
    const name = p.productName ?? "Item";
    const img = p.poster ?? "";
    const rating = p.rating ?? 0;
    const desc = p.description ?? "";
    const price = p.price ?? 0;
    const disc = p.discountInPercentage ?? 0;
    const old = calcOldPrice(price, disc);

    return `
      <article class="card">
        ${disc ? `<div class="badge">${disc}%</div>` : ""}
        <div class="card__img">
          <img src="${img}" alt="${name}">
        </div>
        <div class="card__body">
          <h3 class="card__name">${name}</h3>
          <div class="card__meta">
            <span class="rating">★ ${Number(rating).toFixed(1)}</span>
            <span>Popular</span>
          </div>
          <p class="card__desc">${desc}</p>
          <div class="card__foot">
            <div>
              <span class="price">${formatPrice(price)}</span>
              ${old ? `<span class="old">${formatPrice(old)}</span>` : ""}
            </div>
            <button class="add" type="button" title="Add">+</button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}


function filterProducts(keyword) {
  const key = String(keyword || "").trim().toLowerCase();
  if (!key) {
    renderProducts(ALL_PRODUCTS);
    return;
  }

  const filtered = ALL_PRODUCTS.filter((p) => {
    const name = (p.productName ?? "").toLowerCase();
    const desc = (p.description ?? "").toLowerCase();
    return name.includes(key) || desc.includes(key);
  });

  renderProducts(filtered);
}


function initFAQ() {
  const items = $$(".faq__item");
  items.forEach((btn) => {
    btn.addEventListener("click", () => {
      const panel = btn.nextElementSibling;
      const isOpen = btn.classList.contains("is-open");

  
      items.forEach((b) => {
        b.classList.remove("is-open");
        const p = b.nextElementSibling;
        if (p && p.classList.contains("faq__panel")) p.style.maxHeight = "0px";
      });

      if (!panel || !panel.classList.contains("faq__panel")) return;

      if (!isOpen) {
        btn.classList.add("is-open");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });
}

function initMobileNav() {
  const burger = $("#burgerBtn");
  const mnav = $("#mnav");
  if (!burger || !mnav) return;

  burger.addEventListener("click", () => {
    const open = mnav.style.display === "block";
    mnav.style.display = open ? "none" : "block";
  });

  mnav.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    mnav.style.display = "none";
  });
}


function initSearch() {
  const input = $("#searchInput");
  const btn = $("#searchBtn");
  if (!input || !btn) return;

  const run = () => filterProducts(input.value);
  input.addEventListener("input", run);
  btn.addEventListener("click", run);
}


(function init() {
  const { categories, products } = safeData();
  ALL_PRODUCTS = products;

  renderCategories(categories);
  renderProducts(products);

  initFAQ();
  initMobileNav();
  initSearch();
})();
