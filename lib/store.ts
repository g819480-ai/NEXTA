export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  badge?: string;
  image_url?: string;
}

export const categories = [
  "Shoes",
  "Clothing",
  "Bags",
  "Watches",
  "Jewelry",
  "Beauty",
  "Electronics",
  "Home",
  "Kids",
  "Sports",
];

export const products: Product[] = [
  {
    id: "nesta-premium-tee",
    name: "NESTA Premium Tee",
    price: 120,
    category: "Fashion",
    description:
      "A clean, comfortable premium everyday T-shirt designed for effortless style.",
    badge: "Popular",
  },

  {
    id: "urban-oversized-tee",
    name: "Urban Oversized Tee",
    price: 150,
    category: "Fashion",
    description:
      "A modern oversized fit with a relaxed streetwear look.",
    badge: "New",
  },

  {
    id: "classic-hoodie",
    name: "Classic NESTA Hoodie",
    price: 280,
    category: "Fashion",
    description:
      "Soft, comfortable and versatile hoodie for everyday wear.",
  },

  {
    id: "air-style-sneakers",
    name: "Air Force Style Sneakers",
    price: 650,
    category: "Shoes",
    description:
      "Classic low-profile sneakers designed to pair with everyday outfits.",
    badge: "Best Seller",
  },

  {
    id: "street-runner",
    name: "Street Runner Sneakers",
    price: 520,
    category: "Shoes",
    description:
      "Lightweight casual sneakers with a sporty modern appearance.",
    badge: "New",
  },

  {
    id: "nesta-shoulder-bag",
    name: "Stylish Shoulder Bag",
    price: 250,
    category: "Bags",
    description:
      "A stylish everyday shoulder bag with enough space for your essentials.",
  },

  {
    id: "premium-backpack",
    name: "Premium Everyday Backpack",
    price: 320,
    category: "Bags",
    description:
      "A practical backpack for school, work, travel and everyday use.",
    badge: "Popular",
  },

  {
    id: "wireless-earbuds",
    name: "Wireless Earbuds",
    price: 350,
    category: "Electronics",
    description:
      "Compact wireless earbuds designed for music, calls and everyday listening.",
    badge: "Popular",
  },

  {
    id: "smart-watch-series-9",
    name: "Smart Watch Series 9",
    price: 700,
    category: "Electronics",
    description:
      "A modern smartwatch with a stylish design for everyday use.",
    badge: "New",
  },

  {
    id: "portable-speaker",
    name: "Portable Bluetooth Speaker",
    price: 420,
    category: "Electronics",
    description:
      "Compact portable speaker for music at home, outdoors and on the move.",
  },

  {
    id: "classic-nesta-cap",
    name: "Classic NESTA Cap",
    price: 90,
    category: "Accessories",
    description:
      "A clean everyday cap featuring the NESTA style.",
  },

  {
    id: "minimalist-wallet",
    name: "Minimalist Wallet",
    price: 110,
    category: "Accessories",
    description:
      "A compact wallet designed to keep your everyday essentials organized.",
  },

  {
    id: "premium-sunglasses",
    name: "Premium Sunglasses",
    price: 180,
    category: "Accessories",
    description:
      "A stylish pair of sunglasses designed to complete your everyday look.",
    badge: "New",
  },

  {
    id: "nesta-table-lamp",
    name: "Modern Table Lamp",
    price: 220,
    category: "Home & Living",
    description:
      "A modern decorative lamp designed to add warmth and style to your space.",
  },

  {
    id: "home-organizer",
    name: "Multi-Purpose Home Organizer",
    price: 160,
    category: "Home & Living",
    description:
      "A practical organizer for keeping your home, desk or personal space tidy.",
  },
];
