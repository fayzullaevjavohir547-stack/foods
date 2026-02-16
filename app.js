document.querySelectorAll(".cat-card, .food-card").forEach(card=>{
  card.addEventListener("mouseenter",()=> card.style.transition="0.25s");
});


// ===== CART TOTAL (Buy button) =====
document.addEventListener("DOMContentLoaded", () => {
  const totalElement = document.getElementById("totalPrice");
  if (!totalElement) return;

  let total = 0;

  const parsePrice = (text) => {
    // keeps digits and dot, e.g. "6.44 $" -> 6.44
    const cleaned = (text || "").toString().replace(/[^0-9.]/g, "");
    const value = parseFloat(cleaned);
    return Number.isFinite(value) ? value : 0;
  };

  document.querySelectorAll(".card").forEach((card) => {
    const priceEl = card.querySelector(".price b");
    if (!priceEl) return;

    // prevent duplicates
    if (card.querySelector(".buy-btn")) return;

    const price = parsePrice(priceEl.textContent);

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "buy-btn";
    btn.textContent = "Buy";

    btn.addEventListener("click", () => {
      total += price;
      totalElement.textContent = total.toFixed(2);
    });

    const info = card.querySelector(".info");
    if (info) info.appendChild(btn);
  });
});
