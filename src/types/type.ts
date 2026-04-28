// export const CarouselInfo {

// }

export const NAV_LINKS = [
  { label: "All", href: "/browse" },
  { label: "Brands", href: "/browse/brands" },
  { label: "Trending", href: "/browse/trending" },
  { label: "New", href: "/browse/new" },
  { label: "Deals", href: "/browse/deals", accent: true },
  { label: "Men", href: "/browse/men" },
  { label: "Women", href: "/browse/women" },
  { label: "Sneaker", href: "/browse/sneakers" },
  { label: "Shoes", href: "/browse/shoes" },
  { label: "Apparel", href: "/browse/apparel" },
  { label: "Accessories", href: "/browse/accessories" },
  { label: "Collectibles", href: "/browse/collectibles" },
  { label: "Trading Cards", href: "/browse/trading_card" },
  { label: "More", href: "/browse/more" },
]

export const SUBCATEGORIES: Record<string, { type?: string; label: string; slug: string }[]> = {
  shoes: [
    { type: "subcategory", label: "Slides & Sandals", slug: "slides-sandals" },
    { type: "subcategory", label: "Cleats", slug: "cleats" },
    { type: "subcategory", label: "Boots", slug: "boots" },
    { type: "subcategory", label: "Clogs", slug: "clogs" },
    { type: "subcategory", label: "Loafers", slug: "loafers" },
    { type: "subcategory", label: "Heels", slug: "heels" },
    { type: "subcategory", label: "Slippers", slug: "slippers" },
    { type: "subcategory", label: "Oxfords", slug: "oxfords" },
    { type: "subcategory", label: "Flats", slug: "flats" },
    { type: "subcategory", label: "Spikes", slug: "spikes" },
    { type: "subcategory", label: "Sandals", slug: "sandals" },
  ],
  sneakers: [
    { type: "subcategory", label: "Lifestyle", slug: "lifestyle" },
    { type: "subcategory", label: "Luxury", slug: "luxury" },
    { type: "subcategory", label: "Running", slug: "running" },
    { type: "subcategory", label: "Basketball", slug: "basketball" },
    { type: "subcategory", label: "Skate", slug: "skate" },
    { type: "subcategory", label: "Soccer Cleats", slug: "soccer-cleats" },
    { type: "subcategory", label: "Slip-On", slug: "slip-on" },
  ],
  apparel: [
    { type: "subcategory", label: "Hoodies", slug: "hoodies" },
    { type: "subcategory", label: "Jersey", slug: "jersey" },
    { type: "subcategory", label: "T-Shirts", slug: "t-shirts" },
    { type: "subcategory", label: "Shorts", slug: "shorts" },
    { type: "subcategory", label: "Pants", slug: "pants" },
    { type: "subcategory", label: "Jackets", slug: "jackets" },
  ],
}

export const NAV_ITEMS = [
  { label: "Overview", href: "/admin", icon: "" },
  { label: "Products", href: "/admin/products", icon: "" },
  { label: "Categories", href: "/admin/categories", icon: "" },
  { label: "Orders", href: "/admin/orders", icon: "" },
  { label: "Users", href: "/admin/users", icon: "" },
]

export const SLUG_MAP: Record<string, { type: "category" | "section" | "all" | "subcategory"; value?: string; label: string; parent?: string; }> = {
  "trending": { type: "section", value: "trending", label: "Trending" },
  "new": { type: "section", value: "new", label: "New Arrivals" },
  "deals": { type: "section", value: "deals", label: "Deals" },
  "sneakers": { type: "category", value: "Sneakers", label: "Sneakers" },
  "shoes": { type: "category", value: "Shoes", label: "Shoes" },
  "apparel": { type: "category", value: "Apparel", label: "Apparel" },
  "accessories": { type: "category", value: "Accessories", label: "Accessories" },
  "collectibles": { type: "category", value: "Collectibles", label: "Collectibles" },
  "trading-cards": { type: "category", value: "Trading Cards", label: "Trading Cards" },
  "men": { type: "category", value: "Men", label: "Men" },
  "women": { type: "category", value: "Women", label: "Women" },
  "kids": { type: "category", value: "Kids", label: "Kids" },
};

export const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Lowest Ask", value: "lowest_ask" },
  { label: "Highest Ask", value: "highest_ask" },
  { label: "Price: Low", value: "price_asc" },
  { label: "Price: High", value: "price_desc" },
]

export const BRANDS = [
  "Nike",
  "Adidas",
  "Jordan",
  "Yeezy",
  "Puma",
  "New Balance",
  "Converse",
  "Vans",
  "Reebok",
  "Asics"
]

export const CATEGORIES = [
  "Sneakers",
  "Apparel",
  "Accessories",
  "Collectibles",
  "Tranding Card",
  "Shoes"
]

export const SIZES = [
  "4",
  "4.5",
  "5",
  "5.5",
  "6",
  "6.5",
  "7",
  "7.5",
  "8",
  "8.5",
  "9",
  "9.5",
  "10",
  "10.5",
  "11",
  "11.5",
  "12",
  "13",
  "14"
]

export const FOOTER_COLS = [
  { title: "Air Jordan", links: ["Air Jordan 1", "Air Jordan 3", "Air Jordan 4", "Air Jordan 5", "Air Jordan 11", "Air Jordan 12"] },
  { title: "Adidas", links: ["Adidas Yeezy", "Yeezy Slides", "Yeezy Foam RNR", "Yeezy Boost 350", "Yeezy 700", "Campus 00s"] },
  { title: "New Balance", links: ["New Balance 2002R", "New Balance 1906R", "New Balance 530", "New Balance 550", "New Balance 9060", "New Balance 990 V1"] },
  { title: "Nike", links: ["Air Force 1", "Air Max", "Nike Dunk", "Nike Ja", "Nike Kobe", "Nike Vomero 5"] },
  { title: "ASICS", links: ["Asics Gel 1130", "Asics Kayano 14", "Asics Gel-NYC", "Asics for Men", "Asics for Women", "Asics for Kids"] },
  { title: "Fear of God", links: ["Essentials Hoodies", "Essentials Sweatpants", "Essentials T-Shirts", "Essentials Pants", "Essentials Kids", "Essentials Women's"] },
  { title: "Popular Releases", links: ["Jordan 3 Retro Black Cat (2025)", "Jordan 5 Retro OG Black Metallic Reimagined", "Jordan 1 Retro High '85 OG Bred (2025)", "Nintendo Switch 2 MarioKart World", "Jordan 1 Retro High OG Black Toe Reimagined", "LABUBU Time to Chill Vinyl Plush Doll"] },
  { title: "Apparel", links: ["Denim Tears", "BAPE", "Nike Apparel", "Supreme", "Travis Scott", "Yeezy"] },
  { title: "Accessories", links: ["Swatch X Omega", "Stanley", "Designer Sunglasses", "Louis Vuitton Accessories", "Gucci Accessories", "Supreme Accessories"] },
  { title: "About", links: ["How It Works", "Our Process", "Newsroom", "Company", "Careers", "StockX Reviews", "Give $10, Get $10"] },
  { title: "Sell", links: ["Selling Guide", "Professional Tools", "StockX Pro", "Sponsored Asks", "Developers"] },
  { title: "Help", links: ["Help Center", "Contact Us", "Product Suggestions", "Size Guide"] },
];

export const POPULAR_BRANDS = [
  {
    name: "Jordan",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/3/37/Jumpman_logo.svg/1200px-Jumpman_logo.svg.png",
    image: "https://images-cs.stockx.com/v3/assets/blt818b0c67cf450811/blt227248c57913601d/6965696d6e95f90008bf0b5e/Jordan_(1).jpg?auto=webp&format=pjpg&quality=75&dpr=2&width=234&height=160",
    href: "/browse/sneakers?brand=Jordan",
  },
  {
    name: "Fear of God",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Fear_of_God_logo.svg/1200px-Fear_of_God_logo.svg.png",
    image: "https://images-cs.stockx.com/v3/assets/blt818b0c67cf450811/blt59ab3597035c152d/69d7b1cd947c812965e675ec/Fear_of_God_(3).jpg?auto=webp&format=pjpg&quality=75&dpr=2&width=234&height=160",
    href: "/browse/apparel?brand=Fear+of+God",
  },
  {
    name: "Nike",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png",
    image: "https://images-cs.stockx.com/v3/assets/blt818b0c67cf450811/bltf1a26fb968ef84c0/69666022bc982f0008f22093/POP_MART_(2).jpg?auto=webp&amp;format=pjpg&amp;quality=75&amp;dpr=2&amp;width=234&amp;height=160",
    href: "/browse/sneakers?brand=Nike",
  },
  {
    name: "Adidas",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/1200px-Adidas_Logo.svg.png",
    image: "https://images-cs.stockx.com/v3/assets/blt818b0c67cf450811/bltd3b0b44af6101c32/69665b4f955a7d000811ae00/Supreme_(1).jpg?auto=webp&format=pjpg&quality=75&dpr=2&width=234&height=160",
    href: "/browse/sneakers?brand=Adidas",
  },
  {
    name: "New Balance",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/New_Balance_logo.svg/1200px-New_Balance_logo.svg.png",
    image: "https://images-cs.stockx.com/v3/assets/blt818b0c67cf450811/blt26336cf8b8d6f44c/6966737c92a197000922d432/Louis_Vuitton_(1).jpg?auto=webp&format=pjpg&quality=75&dpr=2&width=234&height=160",
    href: "/browse/sneakers?brand=New+Balance",
  },
];