export interface DeliveryZone {
  id: string;
  name: string;
  postalCodes: string[];
  fee: number;
  minOrder: number;
}

export interface DeliverySlot {
  id: string;
  name: string;
  type: "pickup" | "delivery";
  start: string;
  end: string;
  cutoff: string;
  maxOrders: number;
  maxItems: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number; // in cents
  originalPrice?: number; // in cents
  image: string;
  images: string[];
  category: string;
  subcategory?: string;
  unit: string;
  badge?: string;
  isDailyFresh: boolean;
  isInStock: boolean;
  stock: number;
  allergens: string[];
  ingredients: string[];
  nutritionInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  b2bPricing?: {
    tier1: { minQty: number; price: number };
    tier2: { minQty: number; price: number };
    tier3: { minQty: number; price: number };
  };
}

export const productsData: Product[] = [
  {
    id: "prod_001",
    slug: "croissant-mantequilla",
    name: "Croissant de mantequilla",
    description: "Nuestro croissant clásico, hecho con mantequilla de pastoreo de Galicia (82% MG), harina de fuerza ecológica y masa madre de 48 horas. Hojaldre crujiente por fuera, alveolado y tierno por dentro. Horneado cada madrugada a las 5:00.",
    shortDescription: "Mantequilla de pastoreo, masa madre 48h, hojaldre artesanal",
    price: 280,
    originalPrice: 320,
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=600&h=600&fit=crop",
    ],
    category: "viennoiserie",
    subcategory: "croissants",
    unit: "unidad",
    badge: "Más vendido",
    isDailyFresh: true,
    isInStock: true,
    stock: 120,
    allergens: ["gluten", "lactosa", "huevo"],
    ingredients: ["Harina de trigo ecológica", "Mantequilla de pastoreo (82% MG)", "Masa madre 48h", "Huevos camperos", "Azúcar de caña", "Sal marina", "Levadura fresca"],
    nutritionInfo: { calories: 320, protein: 6, carbs: 35, fat: 18 },
    b2bPricing: { tier1: { minQty: 1, price: 280 }, tier2: { minQty: 20, price: 240 }, tier3: { minQty: 50, price: 210 } },
  },
  {
    id: "prod_002",
    slug: "pain-au-chocolat",
    name: "Pain au chocolat",
    description: "La versión chocolatada de nuestro croissant: misma mantequilla de pastoreo, mismo hojaldre de 48h, relleno con dos barras de chocolate negro 70% cacao de origen único. El equilibrio perfecto entre dulce y amargo.",
    shortDescription: "Chocolate negro 70%, misma masa madre, hojaldre crujiente",
    price: 310,
    image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=600&h=600&fit=crop",
    ],
    category: "viennoiserie",
    subcategory: "croissants",
    unit: "unidad",
    badge: "Nuevo",
    isDailyFresh: true,
    isInStock: true,
    stock: 80,
    allergens: ["gluten", "lactosa", "huevo", "soja"],
    ingredients: ["Harina de trigo ecológica", "Mantequilla de pastoreo (82% MG)", "Masa madre 48h", "Chocolate negro 70% cacao", "Huevos camperos", "Azúcar de caña", "Sal marina"],
    nutritionInfo: { calories: 380, protein: 7, carbs: 38, fat: 22 },
    b2bPricing: { tier1: { minQty: 1, price: 310 }, tier2: { minQty: 20, price: 270 }, tier3: { minQty: 50, price: 240 } },
  },
  {
    id: "prod_003",
    slug: "tarta-manzana-caramelo",
    name: "Tarta de manzana y caramelo salado",
    description: "Base de masa sablé crujiente, compota de manzana reineta asada con canela de Ceilán, crema pastelera de vainilla de Madagascar y toque final de caramelo salado con flor de sal de Añana. Para 8 personas.",
    shortDescription: "Manzana reineta, vainilla Madagascar, caramelo salado Añana",
    price: 3800,
    image: "https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&h=600&fit=crop",
    ],
    category: "tartas",
    subcategory: "fruta",
    unit: "tarta (8 pax)",
    badge: "Especial del día",
    isDailyFresh: true,
    isInStock: true,
    stock: 12,
    allergens: ["gluten", "lactosa", "huevo", "frutos secos (trazas)"],
    ingredients: ["Harina de trigo", "Mantequilla", "Manzana reineta", "Azúcar moreno", "Canela de Ceilán", "Vainilla de Madagascar", "Nata 35% MG", "Yemas de huevo", "Flor de sal de Añana"],
    nutritionInfo: { calories: 320, protein: 4, carbs: 42, fat: 16 },
    b2bPricing: { tier1: { minQty: 1, price: 3800 }, tier2: { minQty: 5, price: 3400 }, tier3: { minQty: 10, price: 3100 } },
  },
  {
    id: "prod_004",
    slug: "pan-masa-madre",
    name: "Pan de masa madre integral",
    description: "Hogaza de 1kg de harina integral ecológica de trigo y centeno, masa madre de 72h, agua de manantial y sal marina. Corteza crujiente, miga densa y aromática, se conserva 5 días. Horneado en horno de leña.",
    shortDescription: "Integral ecológico, masa madre 72h, horno de leña",
    price: 550,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=600&fit=crop",
    ],
    category: "pan",
    subcategory: "masa-madre",
    unit: "hogaza 1kg",
    isDailyFresh: true,
    isInStock: true,
    stock: 30,
    allergens: ["gluten"],
    ingredients: ["Harina integral de trigo ecológica", "Harina integral de centeno ecológica", "Masa madre 72h", "Agua de manantial", "Sal marina"],
    nutritionInfo: { calories: 240, protein: 9, carbs: 48, fat: 1.5 },
    b2bPricing: { tier1: { minQty: 1, price: 550 }, tier2: { minQty: 10, price: 480 }, tier3: { minQty: 30, price: 430 } },
  },
  {
    id: "prod_005",
    slug: "ensaimada-mallorquina",
    name: "Ensaimada mallorquina",
    description: "Receta tradicional de Mallorca: harina de fuerza, manteca de cerdo ibérico, azúcar, huevos y masa madre. Fermentación lenta de 24h, espolvoreada con azúcar glas. Ligera, esponjosa, con su característica forma de espiral.",
    shortDescription: "Manteca ibérico, fermentación 24h, azúcar glas",
    price: 350,
    image: "https://images.unsplash.com/photo-1586985289071-8d61b1a0a2b4?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1586985289071-8d61b1a0a2b4?w=600&h=600&fit=crop",
    ],
    category: "viennoiserie",
    subcategory: "tradicionales",
    unit: "unidad",
    isDailyFresh: true,
    isInStock: true,
    stock: 45,
    allergens: ["gluten", "lactosa", "huevo", "cerdo"],
    ingredients: ["Harina de fuerza", "Manteca de cerdo ibérico", "Azúcar", "Huevos camperos", "Masa madre", "Levadura fresca", "Azúcar glas"],
    nutritionInfo: { calories: 290, protein: 5, carbs: 38, fat: 14 },
    b2bPricing: { tier1: { minQty: 1, price: 350 }, tier2: { minQty: 20, price: 300 }, tier3: { minQty: 50, price: 270 } },
  },
  {
    id: "prod_006",
    slug: "donut-glaseado-vainilla",
    name: "Donut glaseado de vainilla",
    description: "Donut artesanal frito al momento, masa esponjosa con levadura natural, bañado en glaseado de vainilla de Madagascar y azúcar glas. Crujiente por fuera, suave como una nube por dentro. Hecho fresco cada mañana.",
    shortDescription: "Masa esponjosa, glaseado vainilla Madagascar, frito diario",
    price: 250,
    originalPrice: 290,
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1587668178277-295251f900ce?w=600&h=600&fit=crop",
    ],
    category: "viennoiserie",
    subcategory: "tradicionales",
    unit: "unidad",
    badge: "Oferta",
    isDailyFresh: true,
    isInStock: true,
    stock: 60,
    allergens: ["gluten", "lactosa", "huevo"],
    ingredients: ["Harina de fuerza", "Levadura fresca", "Leche entera", "Huevos camperos", "Mantequilla", "Azúcar", "Vainilla de Madagascar", "Aceite de girasol alto oleico"],
    nutritionInfo: { calories: 280, protein: 5, carbs: 35, fat: 14 },
    b2bPricing: { tier1: { minQty: 1, price: 250 }, tier2: { minQty: 20, price: 220 }, tier3: { minQty: 50, price: 190 } },
  },
  {
    id: "prod_007",
    slug: "donut-chocolate-avellanas",
    name: "Donut de chocolate y avellanas",
    description: "Donut de cacao puro 70% relleno de crema de avellanas tostadas artesanal, cubierto con ganache de chocolate negro y crocanti de avellanas caramelizadas. Para los amantes del chocolate intenso.",
    shortDescription: "Cacao 70%, crema avellanas, ganache, crocanti",
    price: 290,
    image: "https://images.unsplash.com/photo-1605981438789-8b8790d3c5d8?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1605981438789-8b8790d3c5d8?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1587668178277-295251f900ce?w=600&h=600&fit=crop",
    ],
    category: "viennoiserie",
    subcategory: "tradicionales",
    unit: "unidad",
    badge: "Nuevo",
    isDailyFresh: true,
    isInStock: true,
    stock: 40,
    allergens: ["gluten", "lactosa", "huevo", "frutos secos", "soja"],
    ingredients: ["Harina de fuerza", "Cacao puro 70%", "Avellanas tostadas", "Leche entera", "Huevos camperos", "Mantequilla", "Azúcar", "Levadura fresca", "Aceite de girasol alto oleico"],
    nutritionInfo: { calories: 350, protein: 7, carbs: 38, fat: 20 },
    b2bPricing: { tier1: { minQty: 1, price: 290 }, tier2: { minQty: 20, price: 250 }, tier3: { minQty: 50, price: 220 } },
  },
  {
    id: "prod_008",
    slug: "tarta-queso-vasca",
    name: "Tarta de queso vasca",
    description: "La auténtica tarta de queso de La Viña: queso crema, nata 35%, huevos, azúcar y harina. Quemada por fuera, cremosa por dentro. Sin base de galleta. Para 8 personas. Un clásico reinventado cada día.",
    shortDescription: "Queso crema, nata 35%, quemada fuera, cremosa dentro",
    price: 3600,
    originalPrice: 4000,
    image: "https://images.unsplash.com/photo-1533134242427-5c3e9b6a8c1e?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1533134242427-5c3e9b6a8c1e?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=600&fit=crop",
    ],
    category: "tartas",
    subcategory: "queso",
    unit: "tarta (8 pax)",
    badge: "Oferta",
    isDailyFresh: true,
    isInStock: true,
    stock: 10,
    allergens: ["gluten", "lactosa", "huevo"],
    ingredients: ["Queso crema", "Nata 35% MG", "Huevos camperos", "Azúcar", "Harina de trigo"],
    nutritionInfo: { calories: 420, protein: 8, carbs: 28, fat: 30 },
    b2bPricing: { tier1: { minQty: 1, price: 3600 }, tier2: { minQty: 5, price: 3200 }, tier3: { minQty: 10, price: 2900 } },
  },
  {
    id: "prod_009",
    slug: "tarta-sacher",
    name: "Tarta Sacher vienesa",
    description: "Bizcocho de chocolate negro 70% con mermelada de albaricoque casera, cubierto con glaseado de chocolate negro brillante. La receta original de Viena, adaptada con nuestro cacao de origen único. Para 10 personas.",
    shortDescription: "Chocolate 70%, mermelada albaricoque, glaseado espejo",
    price: 3900,
    image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=600&fit=crop",
    ],
    category: "tartas",
    subcategory: "chocolate",
    unit: "tarta (10 pax)",
    isDailyFresh: true,
    isInStock: true,
    stock: 8,
    allergens: ["gluten", "lactosa", "huevo", "soja"],
    ingredients: ["Chocolate negro 70%", "Harina de trigo", "Mantequilla", "Azúcar", "Huevos camperos", "Mermelada de albaricoque", "Levadura química"],
    nutritionInfo: { calories: 380, protein: 6, carbs: 40, fat: 22 },
    b2bPricing: { tier1: { minQty: 1, price: 3900 }, tier2: { minQty: 5, price: 3500 }, tier3: { minQty: 10, price: 3200 } },
  },
  {
    id: "prod_010",
    slug: "tarta-tres-leches",
    name: "Tarta tres leches",
    description: "Bizcocho esponjoso empapado en tres leches: evaporada, condensada y crema de leche. Coronado con nata montada, canela y frutos rojos macerados. Humedad perfecta, dulzor equilibrado. Para 10 personas.",
    shortDescription: "Tres leches, nata montada, frutos rojos, canela",
    price: 3400,
    image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=600&h=600&fit=crop",
    ],
    category: "tartas",
    subcategory: "crema",
    unit: "tarta (10 pax)",
    badge: "Especial del día",
    isDailyFresh: true,
    isInStock: true,
    stock: 12,
    allergens: ["gluten", "lactosa", "huevo"],
    ingredients: ["Harina de trigo", "Leche evaporada", "Leche condensada", "Crema de leche", "Huevos camperos", "Azúcar", "Nata 35% MG", "Frutos rojos", "Canela de Ceilán"],
    nutritionInfo: { calories: 310, protein: 5, carbs: 38, fat: 16 },
    b2bPricing: { tier1: { minQty: 1, price: 3400 }, tier2: { minQty: 5, price: 3000 }, tier3: { minQty: 10, price: 2700 } },
  },
  {
    id: "prod_011",
    slug: "bizcocho-limon-amapola",
    name: "Bizcocho de limón y amapola",
    description: "Bizcocho jugoso de yogur griego, ralladura de limón ecológico, semillas de amapola y almendra molida. Glaseado ligero de limón. Para 10 raciones. Perfecto con té o café de especialidad.",
    shortDescription: "Yogur griego, limón ecológico, semillas amapola, almendra",
    price: 3200,
    image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=600&h=600&fit=crop",
    ],
    category: "tartas",
    subcategory: "bizcochos",
    unit: "bizcocho (10 pax)",
    isDailyFresh: true,
    isInStock: true,
    stock: 15,
    allergens: ["gluten", "lactosa", "huevo", "frutos secos"],
    ingredients: ["Harina de trigo", "Almendra molida", "Yogur griego", "Azúcar", "Huevos camperos", "Ralladura de limón ecológico", "Semillas de amapola", "Levadura química", "Mantequilla"],
    nutritionInfo: { calories: 280, protein: 5, carbs: 32, fat: 15 },
    b2bPricing: { tier1: { minQty: 1, price: 3200 }, tier2: { minQty: 5, price: 2800 }, tier3: { minQty: 10, price: 2500 } },
  },
  {
    id: "prod_012",
    slug: "magdalenas-caseras",
    name: "Magdalenas caseras",
    description: "Las de toda la vida: harina, azúcar, huevos, aceite de oliva virgen extra, levadura y ralladura de limón. Con su copete característico y textura esponjosa. Pack de 6 unidades. Horneadas cada mañana.",
    shortDescription: "Aceite oliva virgen extra, ralladura limón, copete perfecto",
    price: 360,
    image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=600&h=600&fit=crop",
    ],
    category: "viennoiserie",
    subcategory: "tradicionales",
    unit: "pack 6 uds",
    badge: "Fresco hoy",
    isDailyFresh: true,
    isInStock: true,
    stock: 50,
    allergens: ["gluten", "huevo"],
    ingredients: ["Harina de trigo", "Azúcar", "Huevos camperos", "Aceite de oliva virgen extra", "Ralladura de limón", "Levadura química", "Sal"],
    nutritionInfo: { calories: 210, protein: 4, carbs: 28, fat: 9 },
    b2bPricing: { tier1: { minQty: 1, price: 360 }, tier2: { minQty: 20, price: 310 }, tier3: { minQty: 50, price: 280 } },
  },
  {
    id: "prod_013",
    slug: "galletas-mantequilla",
    name: "Galletas de mantequilla artesanas",
    description: "Galletas crujientes de mantequilla de pastoreo, corte tradicional con molde. Con su textura que se deshace en la boca y sabor auténtico a mantequilla. Pack de 12 unidades. Ideales para acompañar café o té.",
    shortDescription: "Mantequilla pastoreo, corte molde, 12 unidades",
    price: 480,
    image: "https://images.unsplash.com/photo-1499636138277-2246624543d2?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1499636138277-2246624543d2?w=600&h=600&fit=crop",
    ],
    category: "galletas",
    subcategory: "tradicionales",
    unit: "pack 12 uds",
    isDailyFresh: false,
    isInStock: true,
    stock: 60,
    allergens: ["gluten", "lactosa", "huevo"],
    ingredients: ["Harina de trigo", "Mantequilla de pastoreo", "Azúcar glas", "Huevo", "Esencia de vainilla", "Sal"],
    nutritionInfo: { calories: 180, protein: 3, carbs: 24, fat: 8 },
    b2bPricing: { tier1: { minQty: 1, price: 480 }, tier2: { minQty: 10, price: 420 }, tier3: { minQty: 30, price: 380 } },
  },
  {
    id: "prod_014",
    slug: "roscon-reyes",
    name: "Roscón de Reyes (bajo encargo)",
    description: "Masa de brioche con agua de azahar, ralladura de naranja y limón, mantequilla y masa madre. Relleno opcional de nata, trufa o crema pastelera. Decorado con frutas escarchadas y almendra laminada. Encarga con 48h de antelación.",
    shortDescription: "Brioche azahar, naranja/limón, relleno opcional, frutas escarchadas",
    price: 2800,
    image: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=600&h=600&fit=crop",
    ],
    category: "estacional",
    subcategory: "navidad",
    unit: "roscón (8-10 pax)",
    isDailyFresh: false,
    isInStock: true,
    stock: 100,
    allergens: ["gluten", "lactosa", "huevo", "frutos secos"],
    ingredients: ["Harina de fuerza", "Mantequilla", "Huevos camperos", "Azúcar", "Agua de azahar", "Ralladura de naranja y limón", "Masa madre", "Frutas escarchadas", "Almendra laminada"],
    nutritionInfo: { calories: 310, protein: 6, carbs: 40, fat: 15 },
    b2bPricing: { tier1: { minQty: 1, price: 2800 }, tier2: { minQty: 10, price: 2400 }, tier3: { minQty: 30, price: 2100 } },
  },
  {
    id: "prod_015",
    slug: "cafe-especialidad",
    name: "Café de especialidad (bolsa 250g)",
    description: "Tueste medio de grano 100% arábica de Etiopía (Yirgacheffe) y Colombia (Huila). Notas a jazmín, bergamota, melocotón y chocolate con leche. Tuestado artesanalmente cada semana. Ideal para filtro o espresso.",
    shortDescription: "Arábica Etiopía/Colombia, tueste medio, notas florales",
    price: 1200,
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&h=600&fit=crop",
    ],
    category: "bebidas",
    subcategory: "cafe",
    unit: "bolsa 250g",
    isDailyFresh: false,
    isInStock: true,
    stock: 40,
    allergens: [],
    ingredients: ["Café verde 100% arábica (Etiopía Yirgacheffe, Colombia Huila)"],
    b2bPricing: { tier1: { minQty: 1, price: 1200 }, tier2: { minQty: 10, price: 1000 }, tier3: { minQty: 30, price: 850 } },
  },
  {
    id: "prod_016",
    slug: "te-matcha-ceramico",
    name: "Matcha ceremonial + bol cerámico",
    description: "Matcha grado ceremonial de Uji (Kioto), sombra 20 días antes de cosecha. Color verde vibrante, umami intenso, sin amargor. Incluye bol cerámico artesanal (chawan) y batidor de bambú (chasen). Ritual completo.",
    shortDescription: "Matcha Uji ceremonial, bol chawan artesanal, chasen bambú",
    price: 4500,
    image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600&h=600&fit=crop",
    ],
    category: "bebidas",
    subcategory: "te",
    unit: "kit ceremonial",
    isDailyFresh: false,
    isInStock: true,
    stock: 8,
    allergens: [],
    ingredients: ["Té verde matcha grado ceremonial (Uji, Kioto)", "Bol cerámico artesanal (chawan)", "Batidor de bambú (chasen)"],
    b2bPricing: { tier1: { minQty: 1, price: 4500 }, tier2: { minQty: 5, price: 4000 }, tier3: { minQty: 10, price: 3600 } },
  },
];

export const categories = [
  { id: "viennoiserie", name: "Viennoiserie", icon: "croissant", count: 5 },
  { id: "tartas", name: "Tartas y bizcochos", icon: "gift", count: 5 },
  { id: "pan", name: "Pan artesanal", icon: "wheat", count: 1 },
  { id: "galletas", name: "Galletas", icon: "cookie", count: 1 },
  { id: "estacional", name: "Estacional", icon: "sparkles", count: 1 },
  { id: "bebidas", name: "Bebidas", icon: "coffee", count: 2 },
];

export const deliveryZones = [
  { id: "zone_centro", name: "Centro", postalCodes: ["28001", "28002", "28003", "28004", "28005", "28006", "28007", "28008", "28009", "28010"], fee: 350, minOrder: 1500 },
  { id: "zone_norte", name: "Norte", postalCodes: ["28015", "28016", "28017", "28018", "28019", "28020", "28021", "28022", "28023", "28024"], fee: 450, minOrder: 2000 },
  { id: "zone_sur", name: "Sur", postalCodes: ["28025", "28026", "28027", "28028", "28029", "28030", "28031", "28032", "28033", "28034"], fee: 450, minOrder: 2000 },
  { id: "zone_este", name: "Este", postalCodes: ["28011", "28012", "28013", "28014", "28015"], fee: 400, minOrder: 1800 },
  { id: "zone_oeste", name: "Oeste", postalCodes: ["28006", "28007", "28008", "28009"], fee: 400, minOrder: 1800 },
];

export const deliverySlots = [
  { id: "slot_pickup_morning", name: "Recogida mañana 09:00-11:00", type: "pickup", start: "09:00", end: "11:00", cutoff: "10:00", maxOrders: 50, maxItems: 200 },
  { id: "slot_pickup_midday", name: "Recogida mediodía 12:00-14:00", type: "pickup", start: "12:00", end: "14:00", cutoff: "11:00", maxOrders: 40, maxItems: 150 },
  { id: "slot_pickup_afternoon", name: "Recogida tarde 17:00-19:00", type: "pickup", start: "17:00", end: "19:00", cutoff: "16:00", maxOrders: 30, maxItems: 100 },
  { id: "slot_delivery_morning", name: "Delivery mañana 09:30-12:00", type: "delivery", start: "09:30", end: "12:00", cutoff: "10:00", maxOrders: 20, maxItems: 80 },
  { id: "slot_delivery_midday", name: "Delivery mediodía 12:30-14:30", type: "delivery", start: "12:30", end: "14:30", cutoff: "11:30", maxOrders: 15, maxItems: 60 },
  { id: "slot_delivery_afternoon", name: "Delivery tarde 17:30-19:30", type: "delivery", start: "17:30", end: "19:30", cutoff: "16:30", maxOrders: 15, maxItems: 60 },
];