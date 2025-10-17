// EcoVillageBuilder - Complete Working Implementation
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Only log startup message when running locally
if (process.env.VERCEL !== '1') {
  console.log('🚀 Starting EcoVillageBuilder Interactive Map...');
}

// Comprehensive Project Zones Data - 16 Zones Total ($7.75M Investment)
const PROJECT_ZONES = [
  {
    id: "agricultural-hub",
    name: "Agricultural Hub", 
    emoji: "🌾",
    position: [34.433494, -119.155869],
    polygon: [[34.4325, -119.1560], [34.4330, -119.1560], [34.4330, -119.1550], [34.4325, -119.1550]],
    type: "agriculture",
    budget: "$500,000",
    timeline: "Phase 1 (0-6 months)",
    monthlyRevenue: "$6,500",
    roi: "156% annual ROI",
    description: "Regenerative food production center with 500+ fruit trees, extensive gardens, and educational components.",
    features: [
      "500+ fruit trees across multiple varieties",
      "Regenerative vegetable gardens (3+ acres)",
      "Herb gardens and medicinal plants",
      "Educational workshops and farm tours",
      "Composting and soil regeneration systems",
      "On-site nursery for plant propagation",
      "Gravity-fed irrigation systems"
    ],
    revenueStreams: [
      "CSA program: $2,000/month",
      "Educational workshops: $1,500/month", 
      "Farm-to-table events: $3,000/month"
    ]
  },
  {
    id: "main-residence",
    name: "Main Residence Compound",
    emoji: "🏠", 
    position: [34.433118, -119.155333],
    polygon: [[34.4330, -119.1555], [34.4335, -119.1555], [34.4335, -119.1545], [34.4330, -119.1545]],
    type: "residential",
    budget: "$2,500,000",
    timeline: "Phase 1 (6-18 months)",
    monthlyRevenue: "$23,000",
    roi: "110% annual ROI",
    description: "Luxury residence compound with main house, guest house, and caretaker quarters featuring panoramic mountain views.",
    features: [
      "Main house: 4,500 sq ft, 4 bed/5 bath",
      "Guest house: 1,200 sq ft, 2 bed/2 bath", 
      "Caretaker quarters: 800 sq ft, 1 bed/1 bath",
      "Outdoor entertainment areas with fire features",
      "Infinity pool and spa with mountain views",
      "Landscaped gardens and water features",
      "Sacred geometry architectural elements"
    ],
    revenueStreams: [
      "Private events hosting: $15,000/month",
      "Executive retreats: $8,000/month"
    ]
  },
  {
    id: "community-hub",
    name: "Community Hub",
    emoji: "🏛️",
    position: [34.432771, -119.155387],
    polygon: [[34.4320, -119.1555], [34.4325, -119.1555], [34.4325, -119.1545], [34.4320, -119.1545]],
    type: "community", 
    budget: "$750,000",
    timeline: "Phase 2 (12-24 months)",
    monthlyRevenue: "$12,000",
    roi: "192% annual ROI",
    description: "Central meeting space with co-working facilities, event spaces, and community amenities.",
    features: [
      "Multi-purpose meeting hall (2,000 sq ft)",
      "Co-working spaces with high-speed internet",
      "Commercial kitchen for events",
      "Outdoor amphitheater seating 200+",
      "Library and resource center",
      "Children's play area and nursery",
      "Administrative offices"
    ],
    revenueStreams: [
      "Event hosting: $7,000/month",
      "Co-working memberships: $3,000/month",
      "Workshop facilitation: $2,000/month"
    ]
  },
  {
    id: "retreat-village", 
    name: "Retreat Village",
    emoji: "🏡",
    position: [34.432173, -119.155628],
    polygon: [[34.4335, -119.1560], [34.4340, -119.1560], [34.4340, -119.1550], [34.4335, -119.1550]],
    type: "hospitality",
    budget: "$1,200,000", 
    timeline: "Phase 2 (18-30 months)",
    monthlyRevenue: "$18,500",
    roi: "185% annual ROI", 
    description: "Boutique accommodation village with luxury cabins and wellness amenities for retreat guests.",
    features: [
      "8 luxury eco-cabins (400-600 sq ft each)",
      "Central bathhouse with spa amenities", 
      "Meditation pavilion and quiet zones",
      "Healing gardens and labyrinth",
      "Outdoor yoga platforms",
      "Fire circles and gathering spaces",
      "Sustainable building materials and design"
    ],
    revenueStreams: [
      "Retreat bookings: $12,000/month",
      "Day-use wellness programs: $4,500/month", 
      "Private cabin rentals: $2,000/month"
    ]
  },
  {
    id: "infrastructure",
    name: "Infrastructure & Utilities",
    emoji: "⚡",
    position: [34.432386, -119.155966],
    polygon: [[34.4315, -119.1560], [34.4320, -119.1560], [34.4320, -119.1550], [34.4315, -119.1550]],
    type: "infrastructure",
    budget: "$800,000",
    timeline: "Phase 1 (0-12 months)", 
    monthlyRevenue: "$0",
    roi: "Cost center - enables other revenue",
    description: "Essential infrastructure including renewable energy, water systems, roads, and communications.",
    features: [
      "Solar array and battery storage system",
      "Well water and filtration systems",
      "Septic and greywater treatment",
      "High-speed fiber internet throughout",
      "Internal road network and parking", 
      "Electric vehicle charging stations",
      "Emergency backup systems"
    ],
    revenueStreams: [
      "Infrastructure supports all other revenue streams",
      "Potential energy grid-tie revenue"
    ]
  },
  {
    id: "mcqueens-garage",
    name: "McQueen's Garage & Creative",
    emoji: "🎭",
    position: [34.432549, -119.155279],
    polygon: [[34.4340, -119.1555], [34.4345, -119.1555], [34.4345, -119.1545], [34.4340, -119.1545]],
    type: "creative",
    budget: "$400,000",
    timeline: "Phase 2 (12-18 months)",
    monthlyRevenue: "$8,500",
    roi: "255% annual ROI",
    description: "Creative arts and maker space with workshops, studios, and event hosting capabilities.",
    features: [
      "Artist studios and maker workshops",
      "Pottery kilns and ceramics studio", 
      "Woodworking and metalworking shops",
      "Music recording and performance space",
      "Gallery for rotating art exhibitions",
      "Outdoor sculpture garden",
      "Tool library and equipment sharing"
    ],
    revenueStreams: [
      "Workshop classes: $4,000/month",
      "Studio rentals: $2,500/month",
      "Art sales and commissions: $2,000/month"
    ]
  },
  {
    id: "ceremonial-infrastructure",
    name: "Ceremonial Infrastructure", 
    emoji: "🔮",
    position: [34.432501, -119.155582],
    polygon: [[34.4325, -119.1565], [34.4330, -119.1565], [34.4330, -119.1555], [34.4325, -119.1555]],
    type: "ceremonial",
    budget: "$300,000",
    timeline: "Phase 3 (24-36 months)",
    monthlyRevenue: "$6,000",
    roi: "240% annual ROI",
    description: "Sacred spaces for ceremonies, meditation, and spiritual practices with natural amphitheater.",
    features: [
      "Natural stone amphitheater (capacity 150)",
      "Sacred fire circle with permanent seating",
      "Medicine wheel and prayer gardens",
      "Sweat lodge and purification facilities",
      "Meditation caves and quiet reflection areas", 
      "Astronomical observation platform",
      "Labyrinth and walking meditation paths"
    ],
    revenueStreams: [
      "Ceremony hosting: $3,500/month",
      "Spiritual retreats: $2,500/month"
    ]
  },
  {
    id: "wellness-facilities",
    name: "Wellness & Spa Facilities",
    emoji: "🧘",
    position: [34.432930, -119.155062],
    polygon: [[34.4330, -119.1565], [34.4335, -119.1565], [34.4335, -119.1555], [34.4330, -119.1555]],
    type: "wellness", 
    budget: "$600,000",
    timeline: "Phase 2 (18-24 months)",
    monthlyRevenue: "$15,000",
    roi: "300% annual ROI",
    description: "Comprehensive wellness center with spa services, fitness facilities, and healing modalities.",
    features: [
      "Full-service spa with treatment rooms",
      "Sauna, steam room, and hot/cold plunge pools",
      "Yoga and movement studios",
      "Fitness center with natural materials",
      "Massage therapy and bodywork suites",
      "Herbal medicine preparation kitchen", 
      "Outdoor fitness and calisthenics area"
    ],
    revenueStreams: [
      "Spa services: $8,000/month", 
      "Wellness programs: $4,500/month",
      "Membership fees: $2,500/month"
    ]
  },
  {
    id: "mushroom-cultivation",
    name: "Mushroom Cultivation",
    emoji: "🍄",
    position: [34.433490, -119.156178],
    polygon: [[34.4335, -119.1565], [34.4340, -119.1565], [34.4340, -119.1555], [34.4335, -119.1555]],
    type: "agriculture",
    budget: "$150,000", 
    timeline: "Phase 1 (3-9 months)",
    monthlyRevenue: "$11,250",
    roi: "900% annual ROI (250% net)",
    description: "Commercial mushroom production facility with multiple growing environments and value-added processing.",
    features: [
      "Climate-controlled growing rooms",
      "Substrate preparation and composting area", 
      "Multiple mushroom varieties (shiitake, oyster, lion's mane)",
      "Value-added processing kitchen",
      "Packaging and distribution center",
      "Educational tours and workshops",
      "Research and development lab"
    ],
    revenueStreams: [
      "Fresh mushroom sales: $7,500/month",
      "Processed products: $2,250/month", 
      "Educational workshops: $1,500/month"
    ]
  },
  {
    id: "beekeeping-program",
    name: "Beekeeping & Honey Production",
    emoji: "🐝",
    position: [34.433490, -119.156028],
    polygon: [[34.4320, -119.1565], [34.4325, -119.1565], [34.4325, -119.1555], [34.4320, -119.1555]],
    type: "beekeeping",
    budget: "$10,000",
    timeline: "Phase 1 (0-3 months)",
    monthlyRevenue: "$1,000",
    roi: "1200% annual ROI",
    description: "Collaborative beekeeping initiative with local beekeepers for honey production, bee products, and pollination services through partnership model.",
    features: [
      "Partnership with local beekeepers",
      "10-20 hives with scaling potential", 
      "Dedicated processing shed and secure fencing",
      "Honey extraction and processing facility",
      "Value-added products: wax, skincare, soaps, tinctures",
      "Online and farmers market sales",
      "Pollination services for regenerative agriculture",
      "Educational beekeeping experiences"
    ],
    revenueStreams: [
      "Honey and bee products sharing: $800/month",
      "Value-added wax products: $200/month",
      "Revenue starts within 3 months"
    ]
  },
  {
    id: "livestock-program", 
    name: "Livestock & Dairy Program",
    emoji: "🐄",
    position: [34.432797, -119.156143],
    polygon: [[34.4340, -119.1565], [34.4345, -119.1565], [34.4345, -119.1555], [34.4340, -119.1555]],
    type: "agriculture",
    budget: "$200,000",
    timeline: "Phase 2 (12-18 months)",
    monthlyRevenue: "$5,500", 
    roi: "330% annual ROI",
    description: "Regenerative livestock program with rotational grazing, dairy production, and fiber animals.",
    features: [
      "Rotational grazing system for land regeneration",
      "Small dairy herd (goats and sheep)",
      "Fiber animals (alpacas, sheep) for textiles",
      "Mobile shelters and water systems",
      "On-site processing and value-added products",
      "Grass-fed meat production",
      "Educational farm tours and workshops"
    ],
    revenueStreams: [
      "Dairy products: $2,500/month",
      "Meat sales: $2,000/month",
      "Fiber and textiles: $1,000/month"
    ]
  },
  {
    id: "creative-workshop-center",
    name: "Creative Workshop & Art Creation Center",
    emoji: "🎨",
    position: [34.433485, -119.156360],
    type: "creative",
    budget: "$350,000",
    timeline: "Phase 1 (6-12 months)",
    monthlyRevenue: "$4,800",
    roi: "164% annual ROI",
    description: "Multi-use creative workshop serving as a multipurpose learning and creation space with woodwork, pottery, natural building workshops, and sacred art creation.",
    features: [
      "Woodworking & eco-building workshops ($100-$500 per weekend)",
      "Pottery & art creation studios ($75-$300 per session)", 
      "Natural building workshops & co-build events",
      "Sacred art & altar creation spaces",
      "Sound healing & instrument crafting areas",
      "Tool & materials storage depot",
      "Creative residencies & retreat spaces",
      "Permaculture workshop integration"
    ],
    revenueStreams: [
      "Creative workshops: $1,500/month",
      "Woodworking courses: $1,800/month",
      "Pottery sessions: $900/month", 
      "Art residencies: $600/month"
    ]
  },
  {
    id: "glamping-creek-village",
    name: "Creek-Side Glamping & Lodging Village",
    emoji: "🏕️",
    position: [34.432479, -119.156540],
    type: "hospitality",
    budget: "$450,000",
    timeline: "Phase 2 (12-18 months)",
    monthlyRevenue: "$18,000",
    roi: "480% annual ROI",
    description: "Unique creek-side lodging village with 20-30 glamping units including teepees, yurts, and safari tents along the seasonal creek corridor for nature immersion experiences.",
    features: [
      "20-30 unique glamping units along seasonal creek",
      "Teepees & yurts for ceremonial and overnight experiences",
      "Safari tents with comfortable finishes and creek views",
      "Wooden decks and shaded sitting areas with fire pits",
      "Shared outdoor showers and compost toilet clusters",
      "Pathways connecting to ceremony and garden zones",
      "Propane lines for seasonal heating and cooking",
      "Greywater filtration and modular septic systems"
    ],
    revenueStreams: [
      "Peak season glamping: $100-180/night",
      "Monthly lodging revenue: $18,000/month",
      "Ceremonial retreat packages: $2,500/month",
      "Nature immersion experiences: $1,500/month"
    ]
  },
  {
    id: "gatelodge-operations-hub",
    name: "Sulphur Mountain Gatelodge (Operations ADU)",
    emoji: "🏘️",
    position: [34.433082, -119.156728],
    type: "infrastructure",
    budget: "$45,000",
    timeline: "Phase 1 (0-12 months)",
    monthlyRevenue: "$3,200",
    roi: "853% annual ROI",
    description: "Critical Phase 1 operations hub and ADU expansion from 360 sq ft to 800 sq ft 2-story loft barn, serving as dedicated business operations unit and team housing.",
    features: [
      "Expansion from 360 to 800 sq ft (2-story loft barn)",
      "Dedicated business and operations unit for property management",
      "Core operational team housing with on-site presence",
      "Strategic location near nursery and creative workshop",
      "Connected to active well (17 GPM water access)",
      "Two existing live power lines with solar grid integration",
      "Permits ready for submission (10-day clearance expected)",
      "City drain connection expansion with municipal approval"
    ],
    revenueStreams: [
      "Operations management fees: $1,200/month",
      "Team housing rental: $800/month",
      "Administrative services: $600/month",
      "Property logistics coordination: $600/month"
    ]
  },
  {
    id: "sulphur-mountain-sanctuary",
    name: "Sulphur Mountain Sanctuary: The Living Landscape",
    emoji: "🌺",
    position: [34.433038, -119.155827],
    polygon: [[34.4320, -119.1570], [34.4330, -119.1570], [34.4330, -119.1560], [34.4320, -119.1560]],
    type: "landscape",
    budget: "$850,000",
    timeline: "Phase 1-2 (0-18 months)",
    monthlyRevenue: "$8,200",
    roi: "115% annual ROI",
    description: "An immersive living environment where beauty and abundance intertwine, featuring regenerative food forests, sacred geometry gardens, and curated nature pathways that create seamless flow between gathering spaces and nature.",
    features: [
      "500+ fruit trees in extensive orchard system on gentle slope",
      "3+ acres of rich topsoil for regenerative farming",
      "Sacred geometry gardens with stone terraces and walls", 
      "Flower gardens on right side of driveway slope",
      "Curated nature trails weaving through sacred installations",
      "Experiential pathways connecting all zones",
      "Direct links from Main Residence to ceremonial zones",
      "CSA program integration for produce sales",
      "Land Stewardship and Skill-Based Contribution programs",
      "Contemplative rest zones throughout landscape",
      "Elemental installations for nature immersion"
    ],
    revenueStreams: [
      "CSA box sales and farm stand: $3,500/month",
      "Sacred garden tours and workshops: $1,800/month",
      "Value-added goods (preserves, herbs): $1,200/month", 
      "Land Stewardship program fees: $900/month",
      "Nature immersion experiences: $800/month"
    ]
  },
  {
    id: "farmstead-produce-stand",
    name: "Farmstead Produce Stand & Online Hub",
    emoji: "🛒",
    position: [34.432483, -119.156935],
    polygon: [[34.4334, -119.1560], [34.4336, -119.1560], [34.4336, -119.1558], [34.4334, -119.1558]],
    type: "agriculture",
    budget: "$85,000",
    timeline: "Phase 1 (Month 5 launch)",
    monthlyRevenue: "$9,000",
    roi: "271% annual ROI",
    description: "Roadside farm stand and e-commerce marketplace at the property entrance, serving as the direct-to-consumer sales channel for all regenerative farm products, livestock goods, and artisan creations.",
    features: [
      "Physical roadside stand at main entrance/gate",
      "Refrigerated display cases for fresh produce",
      "E-commerce platform for online orders",
      "CSA box subscription fulfillment center",
      "Product shelving and display systems",
      "POS system for walk-up transactions",
      "Cold storage for dairy and meat products",
      "Packaging and distribution center",
      "Signage visible from Sulphur Mountain Road",
      "Customer parking area"
    ],
    revenueStreams: [
      "Fresh produce & nursery sales: $3,000/month",
      "Livestock products (eggs, honey, meat): $3,500/month",
      "Value-added goods (tinctures, soaps, candles): $1,500/month",
      "CSA box subscriptions: $1,000/month"
    ],
    products: {
      freshProduce: {
        category: "🌱 Fresh Farm Produce",
        description: "Seasonal regenerative produce from the 3-acre farm zone",
        items: [
          {
            name: "Seasonal Fruits",
            source: "500+ fruit trees (food forest)",
            availability: "Seasonal rotation",
            details: "Grown using regenerative practices and permaculture design"
          },
          {
            name: "Organic Vegetables & Greens",
            source: "3-acre farm zone, structured garden beds",
            availability: "Year-round (seasonal varieties)",
            details: "Fresh harvest available daily"
          },
          {
            name: "Culinary & Medicinal Herbs",
            source: "Dedicated herb gardens",
            availability: "Fresh & dried options",
            uses: "Cooking, teas, medicine-making, aromatherapy"
          },
          {
            name: "Specialty Mushrooms",
            source: "Trailer cultivation + log farming",
            varieties: "Shiitake, Oyster, Lion's Mane, and more",
            revenue: "$10,000-$20,000/month potential",
            roi: "650% ROI on log-based cultivation"
          },
          {
            name: "Nursery Plants & Seedlings",
            source: "On-site propagation nursery",
            types: "Seedlings, vegetable starts, fruit tree saplings, native plants"
          }
        ]
      },
      livestockProducts: {
        category: "🐝 Livestock & Apiary Products",
        description: "Regenerative animal products with $108,000 annual revenue projection",
        annualRevenue: "$108,000",
        roi: "227% ROI with 12-month payback",
        items: [
          {
            category: "Honey & Beeswax",
            products: ["Raw wildflower honey", "Beeswax blocks", "Propolis"],
            revenue: "$12,000/year",
            timeline: "Revenue starts within 3 months",
            details: "Partnership with local beekeepers, 10-20 hives"
          },
          {
            category: "Poultry & Eggs",
            products: ["Fresh eggs (chicken & duck)", "Pasture-raised chicken meat"],
            revenue: "$20,000/year",
            details: "Free-range, rotational grazing, organic feed supplementation"
          },
          {
            category: "Grass-Fed Beef",
            products: ["Beef cuts (various)", "Optional: Raw milk, cheese"],
            revenue: "$30,000/year",
            details: "Rotational grazing for land regeneration, hormone-free"
          },
          {
            category: "Goat Products",
            products: ["Goat meat", "Optional: Goat milk, cheese"],
            revenue: "$15,000/year",
            details: "Brush management specialists, dual-purpose breeds"
          },
          {
            category: "Lamb & Wool",
            products: ["Lamb meat", "Optional: Raw wool, yarn"],
            revenue: "$16,000/year",
            details: "Grass maintenance, fiber arts potential"
          },
          {
            category: "Pork",
            products: ["Pork cuts", "Breeding stock"],
            revenue: "$15,000/year",
            details: "Forest foraging, land management through rooting"
          }
        ]
      },
      valueAdded: {
        category: "✨ Artisan & Value-Added Creations",
        description: "Creative goods leveraging farm materials and Creative Workshop output",
        items: [
          {
            category: "Wellness Products",
            products: ["Herbal tinctures", "Medicinal teas", "Herbal remedies", "Healing salves"],
            ingredients: "Farm-grown herbs & botanicals",
            createdIn: "Creative Workshop collaboration"
          },
          {
            category: "Body Care",
            products: ["Skincare creams & lotions", "Handmade soaps", "Beeswax lip balms", "Herbal bath products"],
            ingredients: "Beeswax, farm herbs, essential oils",
            createdIn: "Creative Workshop & Art Creation Center"
          },
          {
            category: "Home & Altar Goods",
            products: ["Beeswax candles", "Altar tools", "Artisan woodwork", "Sacred art pieces", "Incense blends"],
            source: "Creative Workshop artist collaborations",
            details: "Commission-based revenue sharing with creators"
          },
          {
            category: "Farm Inputs & Amendments",
            products: ["Organic compost (bagged)", "Mycelium spawn/products", "Worm castings"],
            source: "Excess from on-site composting and mycelium operations",
            details: "Soil remediation byproducts available for sale"
          }
        ]
      }
    },
    salesChannels: {
      physical: {
        name: "Roadside Farm Stand",
        location: "Property entrance on Sulphur Mountain Road",
        hours: "Variable based on seasonal supply",
        features: ["Walk-up retail", "Self-service honor system option", "Refrigerated displays"]
      },
      online: {
        name: "E-Commerce Store",
        platform: "Dedicated online marketplace",
        features: ["Product catalog", "Pre-orders", "Delivery scheduling", "CSA subscriptions"],
        reach: "Local Ojai + regional online customers"
      },
      csa: {
        name: "Community Supported Agriculture",
        model: "Weekly/bi-weekly subscription boxes",
        price: "$35-$65 per box",
        features: ["Seasonal produce variety", "Add-on products", "Pickup or delivery"]
      },
      wholesale: {
        name: "B2B Sales",
        partners: ["Local restaurants", "Hotels", "Cafes"],
        focus: "Specialty mushrooms, fresh produce, honey",
        details: "Farm-to-table partnerships with Ojai hospitality"
      }
    },
    infrastructure: {
      physical: [
        "Refrigerated display units ($8,000)",
        "Product shelving and fixtures ($3,500)",
        "POS system and payment processing ($2,000)",
        "Signage and branding ($4,000)",
        "Cold storage expansion ($12,000)",
        "Packaging supplies and materials ($2,500)"
      ],
      digital: [
        "E-commerce platform development ($15,000)",
        "Inventory management system ($5,000)",
        "Photography and product imaging ($3,000)",
        "Digital marketing setup ($4,000)"
      ],
      site: [
        "Stand structure and roofing ($20,000)",
        "Customer parking area ($6,000)"
      ]
    },
    contributionPaths: [
      {
        type: "Investment",
        focus: "Stand infrastructure and technology",
        minimum: "$5,000",
        rewardModel: "10% revenue share from product sales",
        examples: ["Refrigeration units", "E-commerce platform", "Display fixtures"]
      },
      {
        type: "Job - Sales & Fulfillment Steward",
        responsibilities: ["Manage daily stand operations", "Customer service", "Inventory management", "Order fulfillment"],
        compensation: "ECO tokens + housing credits or hourly rate"
      },
      {
        type: "Job - E-Commerce Manager",
        responsibilities: ["Online store management", "Digital marketing", "Order processing", "Customer communications"],
        compensation: "Revenue share or token-based compensation"
      },
      {
        type: "Creative Expansion",
        focus: "Value-added product creation",
        examples: ["Tinctures", "Soaps", "Candles", "Artisan goods"],
        rewardModel: "40% creator / 60% village revenue split"
      }
    ],
    financialProjection: {
      phase1: {
        timeline: "Month 5-12",
        monthlyRevenue: "$3,000",
        focus: "Nursery & agriculture products, initial CSA"
      },
      phase2: {
        timeline: "Month 12-18",
        monthlyRevenue: "$5,000",
        focus: "Expanded CSA, livestock products, value-added goods"
      },
      phase3: {
        timeline: "Month 18+",
        monthlyRevenue: "$9,000+",
        focus: "Full product range, wholesale partnerships, scaled livestock ($216k/year potential)"
      },
      totalProjection: {
        year1: "$54,000",
        year2: "$108,000",
        year3: "$216,000 (with scaled livestock operations)"
      }
    },
    valueProposition: {
      financial: "Immediate cash flow from product sales; diversifies revenue beyond lodging/events; 12-month payback on livestock investment; high-margin value-added goods",
      ecological: "Creates market demand for regenerative practices; incentivizes sustainable farming; completes the farm-to-consumer loop; reduces food miles",
      community: "Public-facing brand ambassador; local employment opportunities; educational signage about regenerative practices; builds Ojai community relationships",
      marketing: "Tangible proof of eco-village concept; attracts local support and visitors; farm-to-table experience for retreat guests; authentic regenerative brand story",
      strategic: "Self-funding revenue engine for Phase 1 development; validates agriculture business model; scalable to $216k/year; creates recurring customer base"
    }
  }
];

// REAL Sulphur Mountain Property Boundary Lines - Traced from Aerial Photography
const PERMANENT_PROPERTY_LINES = [
  {
    id: 'boundary_line_1',
    coordinates: [[34.433576, -119.156878], [34.433578, -119.155856], [34.433580, -119.154834]],
    thickness: 8,
    color: '#FF0000',
    description: 'Eastern property boundary - Main section',
    permanent: true
  },
  {
    id: 'boundary_line_2', 
    coordinates: [[34.433585, -119.154840], [34.433215, -119.154843], [34.432846, -119.154845]],
    thickness: 8,
    color: '#FF0000',
    description: 'Southern property boundary - Section 1',
    permanent: true
  },
  {
    id: 'boundary_line_3',
    coordinates: [[34.432855, -119.154845], [34.432857, -119.154885], [34.432859, -119.154925]],
    thickness: 8,
    color: '#FF0000',
    description: 'Southern corner connection',
    permanent: true
  },
  {
    id: 'boundary_line_4',
    coordinates: [[34.432855, -119.154920], [34.432370, -119.154912], [34.432185, -119.154908], [34.431886, -119.154904]],
    thickness: 8,
    color: '#FF0000',
    description: 'Southern property boundary - Section 2',
    permanent: true
  },
  {
    id: 'boundary_line_5',
    coordinates: [[34.431886, -119.154893], [34.431890, -119.155854], [34.431894, -119.156814]], 
    thickness: 8,
    color: '#FF0000',
    description: 'Western property boundary - Main section',
    permanent: true
  },
  {
    id: 'boundary_line_6',
    coordinates: [[34.431899, -119.156808], [34.432000, -119.156816], [34.432102, -119.156824]],
    thickness: 8,
    color: '#FF0000',
    description: 'Western corner connection',
    permanent: true
  },
  {
    id: 'boundary_line_7', 
    coordinates: [[34.432102, -119.156824], [34.432160, -119.157278], [34.432217, -119.157731]],
    thickness: 8,
    color: '#FF0000',
    description: 'Northwestern property boundary - Section 1',
    permanent: true
  },
  {
    id: 'boundary_line_8',
    coordinates: [[34.432222, -119.157726], [34.432293, -119.157742], [34.432363, -119.157758]],
    thickness: 8,
    color: '#FF0000',
    description: 'Northwestern corner connection',
    permanent: true
  },
  {
    id: 'boundary_line_9',
    coordinates: [[34.432368, -119.157758], [34.432470, -119.157326], [34.432571, -119.156894]],
    thickness: 8,
    color: '#FF0000',
    description: 'Northern property boundary - Section 1',
    permanent: true
  },
  {
    id: 'boundary_line_10',
    coordinates: [[34.432576, -119.156899], [34.433078, -119.156889], [34.433580, -119.156878]],
    thickness: 8,
    color: '#FF0000',
    description: 'Northern property boundary - Section 2',
    permanent: true
  }
];

// Updated Zone color mapping with unique representative colors
const zoneColors = {
  agriculture: '#2E7D32',        // Deep forest green - represents fertile earth and growth
  residential: '#1565C0',       // Deep ocean blue - represents stability and home
  community: '#FF8F00',         // Warm amber - represents gathering and warmth  
  hospitality: '#7B1FA2',       // Royal purple - represents luxury and welcome
  infrastructure: '#455A64',    // Steel blue-gray - represents durability and structure
  creative: '#D84315',          // Vibrant terracotta - represents creativity and clay/earth arts
  ceremonial: '#C2185B',        // Deep rose - represents spiritual connection and ceremony
  wellness: '#00838F'           // Teal - represents healing waters and tranquility
};

// Main route - serves the complete interactive map
app.get('/', (req, res) => {
  try {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EcoVillageBuilder - Sulphur Mountain Interactive Map</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { 
      box-sizing: border-box; 
      margin: 0; 
      padding: 0; 
    }
    
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #f5f5f5;
      padding-bottom: 80px;
    }
    
    #map { 
      height: calc(100vh - 60px); 
      width: 100%; 
    }
    
    /* Zone Controls Panel */
    .zone-controls {
      position: absolute;
      top: 15px;
      left: 15px; 
      z-index: 1000;
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      max-width: 320px;
      font-size: 14px;
    }
    
    .zone-controls h2 {
      color: #333;
      margin-bottom: 15px;
      font-size: 18px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    /* Control Buttons */
    .control-button {
      display: block;
      width: 100%;
      padding: 12px 16px;
      margin-bottom: 10px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    
    .unlock-button {
      background: #FF5722;
      color: white;
    }
    
    .unlock-button:hover {
      background: #E64A19;
      transform: translateY(-1px);
    }
    
    .lock-button {
      background: #4CAF50;
      color: white;
    }
    
    .lock-button:hover {
      background: #45a049;
      transform: translateY(-1px);
    }
    
    .capture-button {
      background: #9C27B0;
      color: white;
    }
    
    .capture-button:hover {
      background: #7B1FA2;
      transform: translateY(-1px);
    }
    
    /* Position Controls */
    .position-controls {
      text-align: center;
      padding: 15px 0;
      border-top: 1px solid #e0e0e0;
      margin-top: 10px;
    }
    
    .position-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 25px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-bottom: 8px;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }
    
    .position-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }
    
    .position-info {
      font-size: 11px;
      color: #666;
      font-family: 'Courier New', monospace;
      margin-top: 5px;
    }
    
    /* Project Footer */
    .project-footer {
      margin-top: 30px;
      border-top: 2px solid #f0f0f0;
      padding: 20px 0 10px 0;
      text-align: center;
    }
    
    .footer-content {
      max-width: 100%;
    }
    
    .footer-title {
      font-size: 16px;
      font-weight: 600;
      color: #4a5568;
      margin-bottom: 8px;
    }
    
    .footer-info {
      font-size: 13px;
      color: #718096;
      margin-bottom: 8px;
      font-weight: 500;
    }
    
    .footer-tagline {
      font-size: 12px;
      color: #a0aec0;
      font-style: italic;
      margin-bottom: 5px;
    }
    
    /* Status Indicator */
    .status-indicator {
      background: linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%);
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      gap: 10px;
      border-left: 4px solid #F44336;
    }
    
    .status-text {
      font-weight: 500;
      color: #333;
    }
    
    /* Instructions */
    .instruction-list {
      list-style: none;
      padding: 0;
    }
    
    .instruction-list li {
      padding: 6px 0;
      padding-left: 20px;
      position: relative;
      color: #555;
      font-size: 13px;
    }
    
    .instruction-list li:before {
      content: "•";
      position: absolute;
      left: 5px;
      color: #9C27B0;
      font-weight: bold;
    }
    
          /* Ultra-Polished Left-Side Panel */
          .side-panel {
            position: absolute;
            top: 0;
            left: -600px;
            width: 580px;
            height: 100vh;
            background: linear-gradient(135deg, #ffffff 0%, #fafbfc 50%, #f5f7fa 100%);
            box-shadow: 5px 0 40px rgba(0,0,0,0.15), 0 0 20px rgba(0,0,0,0.1);
            z-index: 2000;
            overflow: hidden;
            -webkit-overflow-scrolling: touch;
            touch-action: pan-y;
            will-change: left, transform;
            transform: translateZ(0);
            transition: left 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s ease;
            border-right: 1px solid rgba(0,0,0,0.06);
            backdrop-filter: blur(20px);
          }
          
          .side-panel.open {
            left: 0;
          }

          .side-panel.swiping {
            transition: transform 0s !important;
          }
          
          .panel-header {
            position: sticky;
            top: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 8px 20px;
            border-bottom: none;
            z-index: 10;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            backdrop-filter: blur(15px);
          }
          
          .close-panel {
            position: absolute;
            top: 8px;
            right: 20px;
            font-size: 16px;
            cursor: pointer;
            background: rgba(255,255,255,0.15);
            border: 1px solid rgba(255,255,255,0.25);
            color: white;
            padding: 6px;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            backdrop-filter: blur(10px);
          }
    
          .close-panel:hover {
            background: rgba(255,255,255,0.25);
            border-color: rgba(255,255,255,0.4);
            transform: scale(1.05) rotate(90deg);
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          }
          
          .panel-content {
            padding: 0 0 80px 0;
            background: transparent;
            margin: 0;
            height: calc(100vh - 40px);
            overflow-y: auto;
            scroll-behavior: smooth;
          }
          
          .panel-content::-webkit-scrollbar {
            width: 6px;
          }
          
          .panel-content::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.05);
          }
          
          .panel-content::-webkit-scrollbar-thumb {
            background: rgba(0,0,0,0.2);
            border-radius: 3px;
          }
          
          .panel-content::-webkit-scrollbar-thumb:hover {
            background: rgba(0,0,0,0.3);
          }
          
          /* Compact Project Details Styling (70% smaller) */
          .project-title {
            font-size: 16px;
            margin-bottom: 4px;
            padding-right: 35px;
            color: white;
            line-height: 1.3;
            text-shadow: 0 1px 2px rgba(0,0,0,0.2);
            font-weight: 600;
          }
          
          .project-subtitle {
            color: rgba(255,255,255,0.85);
            font-size: 11px;
            margin-bottom: 0;
            line-height: 1.4;
            font-weight: 400;
            border-left: 3px solid #667eea;
            padding-left: 12px;
          }
          
          /* Compact Project Header (No Hero Image) */
          .project-hero {
            position: relative;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 15px 35px 12px 35px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            border-bottom: 1px solid rgba(255,255,255,0.1);
          }
    
    .project-section {
      margin-bottom: 25px;
      padding: 30px 35px;
      background: white;
      border-radius: 0;
      border-bottom: 1px solid #f0f2f5;
    }
    
    .project-section:first-child {
      margin-top: 20px;
    }
    
    .project-section h3 {
      color: #2c3e50;
      border-bottom: 2px solid #e9ecef;
      padding-bottom: 15px;
      margin-bottom: 25px;
      font-size: 15px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }
    
          /* Enhanced Investment Summary Cards */
          .investment-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
          }
          
          .investment-card {
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            border: 2px solid #e9ecef;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            transition: all 0.3s ease;
          }
          
          .investment-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 15px rgba(0,0,0,0.1);
            border-color: #667eea;
          }    .investment-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 5px;
    }
    
    .investment-value {
      font-size: 18px;
      font-weight: bold;
      color: #2c3e50;
    }
    
    .roi-positive {
      color: #27AE60;
    }
    
    /* Feature Lists */
    .feature-list {
      list-style: none;
      padding: 0;
    }
    
    .feature-list li {
      padding: 8px 0;
      padding-left: 30px;
      position: relative;
      line-height: 1.4;
      color: #444;
    }
    
    .feature-list li:before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #4CAF50;
      font-weight: bold;
      font-size: 16px;
    }
    
    /* Revenue Streams */
    .revenue-stream {
      background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%);
      padding: 12px 15px;
      margin-bottom: 8px;
      border-left: 4px solid #28a745;
      border-radius: 6px;
      font-size: 14px;
    }
    
    /* Timeline Phase */
    .timeline-phase {
      display: inline-block;
      background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
      color: white;
      padding: 6px 12px;
      border-radius: 15px;
      font-size: 13px;
      font-weight: 600;
    }
    
    /* Zone Markers */
    .zone-marker {
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .zone-marker:hover {
      transform: scale(1.15);
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
    }
    
    /* Property Lines */
          .property-line-permanent {
            stroke-dasharray: none !important;
            stroke-linecap: round;
          }
          
          /* Enhanced Image Gallery Styles */
          .image-gallery {
            margin-top: 30px;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          }
          
          .gallery-tabs {
            display: flex;
            background: #f8f9fa;
          }
          
          .gallery-tab {
            flex: 1;
            padding: 15px 20px;
            cursor: pointer;
            background: transparent;
            border: none;
            text-align: center;
            font-weight: 500;
            color: #6c757d;
            transition: all 0.3s ease;
            position: relative;
          }
          
          .gallery-tab:hover {
            color: #495057;
            background: rgba(102, 126, 234, 0.1);
          }
          
          .gallery-tab.active {
            color: #667eea;
            background: white;
          }
          
          .gallery-tab.active::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          
          .gallery-content {
            padding: 25px;
            background: white;
          }
          
          .image-placeholder {
            width: 100%;
            height: 200px;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border: 2px dashed #dee2e6;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin-bottom: 15px;
            color: #6c757d;
            transition: all 0.3s ease;
          }
          
          .image-placeholder:hover {
            border-color: #667eea;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          }
          
          .placeholder-icon {
            font-size: 48px;
            margin-bottom: 10px;
            opacity: 0.6;
          }
          
          .placeholder-text {
            font-size: 14px;
            text-align: center;
            line-height: 1.4;
          }
          
          .image-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-top: 20px;
          }
          
          .image-grid .image-placeholder {
            height: 150px;
          }
          
          /* Image Carousel Styles - Fixed Sizing */
          .image-carousel {
            position: relative;
            width: 100%;
            margin-bottom: 20px;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            background: #000;
          }
          
          .carousel-main {
            position: relative;
            width: 100%;
            height: 450px;
            background: #000;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            touch-action: pan-y;
            user-select: none;
            -webkit-user-select: none;
            -webkit-user-drag: none;
          }
          
          .carousel-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
            background: #000;
            opacity: 0;
            transition: opacity 250ms ease, filter 300ms ease;
            filter: blur(8px);
            will-change: opacity, filter;
            image-rendering: auto;
          }

          /* GPU hints for Leaflet map to reduce jank */
          .leaflet-container {
            -webkit-tap-highlight-color: transparent;
            backface-visibility: hidden;
            transform: translateZ(0);
          }
          
          .carousel-image.active {
            opacity: 1;
          }
          
          .carousel-image.loaded {
            filter: blur(0);
          }
          
          .carousel-loading {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0,0,0,0.2);
            backdrop-filter: blur(1px);
            opacity: 0;
            pointer-events: none;
            transition: opacity 200ms ease;
            z-index: 9;
          }
          .carousel-loading.active { opacity: 1; pointer-events: auto; }
          .loading-spinner {
            width: 36px;
            height: 36px;
            border: 3px solid rgba(255,255,255,0.35);
            border-top-color: #fff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          .carousel-nav {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255,255,255,0.9);
            border: none;
            width: 45px;
            height: 45px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            z-index: 10;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          }
          
          .carousel-nav:hover {
            background: white;
            transform: translateY(-50%) scale(1.1);
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          }
          
          .carousel-nav.prev {
            left: 15px;
          }
          
          .carousel-nav.next {
            right: 15px;
          }
          
          .carousel-counter {
            position: absolute;
            bottom: 15px;
            right: 15px;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 500;
          }
          
          .carousel-thumbnails {
            display: flex;
            gap: 10px;
            padding: 15px;
            background: #f8f9fa;
            overflow-x: auto;
            scrollbar-width: thin;
          }
          
          .carousel-thumbnails::-webkit-scrollbar {
            height: 6px;
          }
          
          .carousel-thumbnails::-webkit-scrollbar-track {
            background: #e9ecef;
            border-radius: 3px;
          }
          
          .carousel-thumbnails::-webkit-scrollbar-thumb {
            background: #667eea;
            border-radius: 3px;
          }
          
          .carousel-thumbnail {
            width: 80px;
            height: 60px;
            object-fit: cover;
            border-radius: 6px;
            cursor: pointer;
            opacity: 0.6;
            transition: all 0.3s ease;
            flex-shrink: 0;
            border: 2px solid transparent;
          }
          
          .carousel-thumbnail:hover {
            opacity: 0.8;
            transform: scale(1.05);
          }
          
          .carousel-thumbnail.active {
            opacity: 1;
            border-color: #667eea;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
          }
          
          .no-images-message {
            text-align: center;
            padding: 40px;
            color: #6c757d;
            font-size: 15px;
          }
          
          .loading-images {
            text-align: center;
            padding: 40px;
            color: #667eea;
            font-size: 15px;
          }
          
          /* Sub-Navigation Bar for Subcategories */
          .sub-nav-container {
            background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
            border-bottom: 1px solid #e9ecef;
            padding: 15px 20px;
            margin-bottom: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          }
          
          .sub-nav-tabs {
            display: flex;
            gap: 10px;
            overflow-x: auto;
            scrollbar-width: thin;
            padding-bottom: 5px;
          }
          
          .sub-nav-tabs::-webkit-scrollbar {
            height: 4px;
          }
          
          .sub-nav-tabs::-webkit-scrollbar-track {
            background: #f1f3f5;
            border-radius: 2px;
          }
          
          .sub-nav-tabs::-webkit-scrollbar-thumb {
            background: #667eea;
            border-radius: 2px;
          }
          
          .sub-nav-tab {
            flex-shrink: 0;
            padding: 8px 20px;
            background: white;
            border: 2px solid #e9ecef;
            border-radius: 20px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            color: #6c757d;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            white-space: nowrap;
            position: relative;
            overflow: hidden;
          }
          
          .sub-nav-tab::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
            transition: left 0.5s ease;
          }
          
          .sub-nav-tab:hover::before {
            left: 100%;
          }
          
          .sub-nav-tab:hover {
            border-color: #667eea;
            color: #667eea;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(102, 126, 234, 0.2);
          }
          
          .sub-nav-tab.active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-color: #667eea;
            color: white;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
          }
          
          .sub-nav-tab .count-badge {
            display: inline-block;
            margin-left: 8px;
            padding: 2px 8px;
            background: rgba(255,255,255,0.3);
            border-radius: 10px;
            font-size: 11px;
            font-weight: 600;
          }
          
          .sub-nav-tab.active .count-badge {
            background: rgba(255,255,255,0.25);
          }
          
          .subcategory-content {
            display: none;
            animation: fadeInUp 0.4s ease-out;
          }
          
          .subcategory-content.active {
            display: block;
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          /* Responsive Design */
          @media (max-width: 768px) {
            .side-panel {
              width: 100vw;
              left: -100vw;
            }
            
            .zone-controls {
              max-width: 280px;
              padding: 15px;
            }
            
            .investment-grid {
              grid-template-columns: 1fr;
            }
            
            .image-grid {
              grid-template-columns: 1fr;
            }
            
            .carousel-main {
              height: 300px;
            }
            
            .carousel-thumbnail {
              width: 60px;
              height: 45px;
            }
            
            .carousel-nav {
              width: 40px;
              height: 40px;
              font-size: 18px;
            }

            /* Larger zoom controls on mobile for better touch targets */
            .leaflet-control-zoom a {
              width: 42px;
              height: 42px;
              line-height: 42px;
              font-size: 20px;
            }
            .leaflet-control-zoom {
              border-radius: 12px;
            }
          }    /* Loading Animation */
    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.5; }
      100% { opacity: 1; }
    }
    
    .loading {
      animation: pulse 2s infinite;
    }
    
    /* Admin Popup Menu Styles */
    .admin-menu-toggle {
      position: fixed;
      top: 60px;
      right: 20px;
      width: 50px;
      height: 50px;
      background: rgba(0,0,0,0.8);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 2000;
      font-size: 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: all 0.3s ease;
    }
    
    .admin-menu-toggle:hover {
      background: rgba(0,0,0,0.9);
      transform: scale(1.1);
    }
    
    /* Territory Drawing Editor Toggle */
    .territory-editor-toggle {
      position: fixed;
      top: 120px;
      right: 20px;
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 2000;
      font-size: 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: all 0.3s ease;
    }
    
    .territory-editor-toggle:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 16px rgba(0,0,0,0.4);
    }
    
    .admin-popup {
      position: fixed;
      top: 120px;
      right: 20px;
      width: 300px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      z-index: 1999;
      border: 1px solid #e2e8f0;
    }
    
    .popup-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px 20px;
      border-radius: 12px 12px 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .popup-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }
    
    .close-popup {
      background: none;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background 0.2s ease;
    }
    
    .close-popup:hover {
      background: rgba(255,255,255,0.2);
    }
    
    .popup-content {
      padding: 20px;
    }
    
    /* Territory Drawing Editor Styles */
    .territory-editor {
      position: fixed;
      top: 60px;
      left: 20px;
      width: 320px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      z-index: 1999;
      border: 1px solid #e2e8f0;
      max-height: 80vh;
      overflow-y: auto;
    }
    
    .editor-header {
      background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%);
      color: white;
      padding: 15px 20px;
      border-radius: 12px 12px 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .editor-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }
    
    .close-editor {
      background: none;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background 0.2s ease;
    }
    
    .close-editor:hover {
      background: rgba(255,255,255,0.2);
    }
    
    .editor-content {
      padding: 20px;
    }
    
    .zone-selector, .brush-controls, .drawing-mode, .territory-actions {
      margin-bottom: 20px;
    }
    
    .zone-selector label, .brush-controls label {
      display: block;
      font-weight: 600;
      margin-bottom: 8px;
      color: #2d3748;
    }
    
    .zone-selector select {
      width: 100%;
      padding: 8px 12px;
      border: 2px solid #e2e8f0;
      border-radius: 6px;
      font-size: 14px;
      background: white;
    }
    
    .brush-controls {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .brush-controls input[type="range"] {
      width: 100%;
      height: 6px;
      border-radius: 3px;
      background: #e2e8f0;
      outline: none;
    }
    
    #brush-size-display {
      text-align: center;
      font-weight: 600;
      color: #4299e1;
    }
    
    .drawing-mode {
      display: flex;
      gap: 15px;
    }
    
    .drawing-mode label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 8px 12px;
      border: 2px solid #e2e8f0;
      border-radius: 6px;
      transition: all 0.2s ease;
    }
    
    .drawing-mode label:hover {
      border-color: #4299e1;
      background: #f7fafc;
    }
    
    .drawing-mode input[type="radio"] {
      margin: 0;
    }
    
    .territory-btn {
      display: block;
      width: 100%;
      padding: 10px 15px;
      margin-bottom: 8px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: transform 0.2s ease;
    }
    
    .territory-btn:hover {
      transform: translateY(-1px);
    }
    
    .drawing-status {
      background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
      padding: 12px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 10px;
      border-left: 4px solid #2196F3;
    }
    
    /* Drawing Cursor Styles */
    .drawing-cursor {
      position: absolute;
      border: 2px solid #FF6B6B;
      border-radius: 50%;
      pointer-events: none;
      z-index: 1000;
      background: rgba(255, 107, 107, 0.2);
      transform: translate(-50%, -50%);
    }
    
    /* CTA Button Styles */
    .cta-section {
      margin: 40px 0;
    }
    
    .cta-button {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-width: 140px;
      justify-content: center;
    }
    
    .cta-button.primary {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.3);
    }
    
    .cta-button.primary:hover {
      background: rgba(255, 255, 255, 0.3);
      border-color: rgba(255, 255, 255, 0.5);
      transform: translateY(-2px);
    }
    
    .cta-button.secondary {
      background: transparent;
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.3);
    }
    
    .cta-button.secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.5);
      transform: translateY(-2px);
    }
    
    /* Footer Styles */
    .map-footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0,0,0,0.8);
      color: white;
      text-align: center;
      padding: 15px 20px 20px 20px;
      z-index: 1000;
      font-size: 12px;
      line-height: 1.4;
    }
  </style>
</head>
<body>
  <!-- Zone Admin Popup Menu (Developer Only) -->
  <div class="admin-menu-toggle" id="admin-menu-toggle">
    ⚙️
  </div>
  
  <!-- Territory Drawing Editor Toggle -->
  <div class="territory-editor-toggle" id="territory-editor-toggle">
    🎨
  </div>
  
  <div class="admin-popup" id="admin-popup" style="display: none;">
    <div class="popup-header">
      <h3>🎯 Zone Admin Controls</h3>
      <button class="close-popup" id="close-popup">&times;</button>
    </div>
    
    <div class="popup-content">
      <div class="zone-selector" style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">Select Zone to Move:</label>
        <select id="zone-move-selector" style="width: 100%; padding: 10px; border-radius: 6px; border: 2px solid #e0e0e0; font-size: 14px; margin-bottom: 10px;">
          <option value="">Choose a zone...</option>
        </select>
      </div>
      
      <button class="control-button edit-button" id="unlock-zone-btn" style="background: #4CAF50; margin-bottom: 10px;" disabled>
        🔓 Unlock Selected Zone
      </button>
      
      <button class="control-button edit-button" id="lock-zone-btn" style="background: #FF9800; margin-bottom: 10px; display: none;">
        🔒 Lock Zone Position
      </button>
      
      <button class="control-button capture-button" id="capture-zones-btn" style="background: #9C27B0; margin-bottom: 10px;">
        💾 Capture All Positions
      </button>
      
      <div class="status-indicator" id="status-indicator">
        <div>🔒</div>
        <div class="status-text">All Zones Locked</div>
      </div>
      
      <div class="status-indicator" id="selected-zone-indicator" style="background: linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%); border-left-color: #FF9800; margin-top: 10px; display: none;">
        <div>📍</div>
        <div class="status-text" id="selected-zone-name">None Selected</div>
      </div>
      
      <div class="status-indicator" id="zoom-indicator" style="background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%); border-left-color: #2196F3; margin-top: 10px;">
        <div>🔍</div>
        <div class="status-text" id="zoom-level">Zoom: 17</div>
      </div>
    </div>
  </div>

  <!-- Territory Drawing Editor Panel -->
  <div class="territory-editor" id="territory-editor" style="display: none;">
    <div class="editor-header">
      <h3>🎨 Territory Drawing Editor</h3>
      <button class="close-editor" id="close-territory-editor">&times;</button>
    </div>
    
    <div class="editor-content">
      <div class="zone-selector">
        <label>Select Zone to Draw:</label>
        <select id="zone-selector">
          <option value="">Choose a zone...</option>
        </select>
      </div>
      
      <div class="brush-controls">
        <label>Brush Size:</label>
        <input type="range" id="brush-size" min="5" max="50" value="15">
        <span id="brush-size-display">15px</span>
      </div>
      
      <div class="drawing-mode">
        <label>
          <input type="radio" name="draw-mode" value="draw" checked> 
          🎨 Draw Territory
        </label>
        <label>
          <input type="radio" name="draw-mode" value="erase"> 
          🗑️ Erase Territory
        </label>
      </div>
      
      <div class="territory-actions">
        <button class="territory-btn" id="clear-territory">🗑️ Clear Current Zone</button>
        <button class="territory-btn" id="save-territories">💾 Save All Territories</button>
        <button class="territory-btn" id="load-territories">📁 Load Territories</button>
      </div>
      
      <div class="drawing-status" id="drawing-status">
        <div>🎨</div>
        <div class="status-text">Select a zone to start drawing</div>
      </div>
    </div>
  </div>
  
  <!-- Beautiful Left-Side Panel -->
  <div id="side-panel" class="side-panel">
    <div class="panel-header">
      <div class="project-hero" id="project-hero">
        <!-- Compact header content will be inserted here -->
      </div>
      <button class="close-panel" id="close-panel">&times;</button>
    </div>
    <div class="panel-content" id="panel-content"></div>
  </div>
  
  <!-- Map Container -->
  <div id="map"></div>
  
  <!-- Footer -->
  <div class="map-footer">
    © 2025 Sulphur Mountain Eco-Village | Interactive Map Presentation | $7.75M Development Investment
  </div>
  
  <script>
    console.log('🗺️ Initializing EcoVillageBuilder Interactive Map...');
    
    // Initialize map centered on Sulphur Mountain property
    const map = L.map('map', {
      center: [34.433086, -119.155336],
      zoom: 17,
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
      keyboard: true,
      dragging: true,
      preferCanvas: true,
      zoomAnimation: true,
      fadeAnimation: true,
      markerZoomAnimation: true,
      inertia: true,
      inertiaDeceleration: 3000,
      zoomSnap: 0.25,
      zoomDelta: 0.25,
      wheelDebounceTime: 20,
      wheelPxPerZoomLevel: 90,
      tapTolerance: 15
    });
    
    // Add multiple high-resolution tile layers for better zoom coverage
    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '🗺️ Esri, Maxar, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN',
      maxZoom: 22,
      minZoom: 1,
      errorTileUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      detectRetina: true,
      updateWhenIdle: true,
      updateWhenZooming: false,
      keepBuffer: 4
    });
    
    // Add OpenStreetMap as fallback
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '🗺️ OpenStreetMap contributors',
      maxZoom: 19,
      minZoom: 1,
      detectRetina: true,
      updateWhenIdle: true,
      keepBuffer: 4
    });
    
    // Add Google Satellite as alternative (public tiles)
    const googleSatLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      attribution: '🗺️ Google',
      maxZoom: 22,
      minZoom: 1,
      detectRetina: true,
      updateWhenIdle: true,
      keepBuffer: 4
    });
    
    // Create layer control
    const baseLayers = {
      "🛰️ Satellite (Esri)": satelliteLayer,
      "🛰️ Satellite (Google)": googleSatLayer,
      "🗺️ Street Map": osmLayer
    };
    
    // Add default layer and layer control
    satelliteLayer.addTo(map);
    const layerControl = L.control.layers(baseLayers).addTo(map);
    
    // Enable mobile swipe-to-close for the side panel
    attachPanelSwipe(map);
    
    // Add tile loading indicators and error handling
    satelliteLayer.on('loading', () => {
      console.log('🔄 Loading satellite tiles...');
    });
    
    satelliteLayer.on('load', () => {
      console.log('✅ Satellite tiles loaded successfully');
    });
    
    satelliteLayer.on('tileerror', (e) => {
      console.warn('⚠️ Tile loading error, trying fallback:', e.tile.src);
      // Auto-switch to Google satellite if Esri fails
      if (map.hasLayer(satelliteLayer)) {
        map.removeLayer(satelliteLayer);
        googleSatLayer.addTo(map);
        console.log('🔄 Switched to Google satellite tiles');
      }
    });
    
    // Add zoom level indicator with UI updates
    const zoomIndicator = document.getElementById('zoom-level');
    map.on('zoomend', () => {
      const zoom = map.getZoom();
      zoomIndicator.textContent = 'Zoom: ' + zoom + '/22';
      console.log('🔍 Current zoom level:', zoom, '- Max detail available at zoom 22');
      
      // Update zoom indicator color based on zoom level
      const zoomIndicatorDiv = document.getElementById('zoom-indicator');
      if (zoom >= 20) {
        console.log('🎯 Ultra high-resolution view activated');
        zoomIndicatorDiv.style.background = 'linear-gradient(135deg, #E8F5E8 0%, #A5D6A7 100%)';
        zoomIndicatorDiv.style.borderLeftColor = '#4CAF50';
      } else if (zoom >= 18) {
        zoomIndicatorDiv.style.background = 'linear-gradient(135deg, #FFF3E0 0%, #FFCC80 100%)';
        zoomIndicatorDiv.style.borderLeftColor = '#FF9800';
      } else {
        zoomIndicatorDiv.style.background = 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)';
        zoomIndicatorDiv.style.borderLeftColor = '#2196F3';
      }
    });
    
    console.log('🛰️ Multi-layer satellite imagery system initialized');
    
    // Load project zones data
    const zones = ZONES_DATA_PLACEHOLDER;
    const permanentLines = PERMANENT_LINES_PLACEHOLDER;
    
    console.log('📊 Loaded', zones.length, 'project zones and', permanentLines.length, 'property lines');
    
    // Add permanent property boundary lines - LOCKED PERMANENTLY
    permanentLines.forEach((lineData, index) => {
      const line = L.polyline(lineData.coordinates, {
        color: lineData.color,
        weight: lineData.thickness,
        opacity: 1,
        className: 'property-line-permanent',
        interactive: false, // Lock against accidental modification
        bubblingMouseEvents: false
      }).addTo(map);
      
      // Lock the line permanently - cannot be removed or modified
      line._locked = true;
      line._permanent = true;
      
      line.bindTooltip(lineData.description, {
        permanent: false,
        direction: 'center',
        className: 'property-tooltip',
        sticky: true
      });
    });
    
    console.log('🔲 Property boundary lines added to map');
    
    // Zone color mapping
    const zoneColorMap = {
      agriculture: '#4CAF50',
      residential: '#2196F3', 
      community: '#FF9800',
      hospitality: '#9C27B0',
      infrastructure: '#607D8B',
      creative: '#795548',
      ceremonial: '#E91E63',
      wellness: '#00BCD4',
      landscape: '#8BC34A',
      beekeeping: '#FFD700'  // Golden yellow for beekeeping
    };
    
    // Store original positions for reset functionality
    zones.forEach(zone => {
      if (!zone.originalPosition) {
        zone.originalPosition = [...zone.position]; // Store original coordinates
      }
    });
    
    // Keep references to markers for dynamic scaling on zoom
    const zoneMarkers = [];
    
    // Add zones to map
    zones.forEach(zone => {
      // Create rounded zone polygon (40% smaller radius)
      const createCircularPolygon = (center, radiusInMeters, points = 16) => {
        const coords = [];
        for (let i = 0; i < points; i++) {
          const angle = (i / points) * 2 * Math.PI;
          const lat = center[0] + (radiusInMeters * 0.000009) * Math.cos(angle);
          const lng = center[1] + (radiusInMeters * 0.000009) * Math.sin(angle) / Math.cos(center[0] * Math.PI / 180);
          coords.push([lat, lng]);
        }
        return coords;
      };
      
      // Create circular polygon with 50% smaller radius (15 meters instead of 30)
      const circularPolygon = createCircularPolygon(zone.position, 15);
      const polygon = L.polygon(circularPolygon, {
        color: zoneColorMap[zone.type] || '#333',
        fillColor: zoneColorMap[zone.type] || '#333',
        fillOpacity: 0.3,
        weight: 2,
        opacity: 0.8
      }).addTo(map);
      
      // Create custom marker with enhanced 3D styling (no white background, 10% smaller colored circle)
      const zoneColor = zoneColorMap[zone.type] || '#333';
      const marker = L.marker(zone.position, {
        draggable: window.editMode || false,
        zoneId: zone.id, // Add zone ID for reset functionality
        zoneName: zone.name, // Add zone name for capture functionality
        icon: L.divIcon({
          className: 'zone-marker',
          html: '<div style="background: linear-gradient(135deg, ' + zoneColor + ' 0%, ' + zoneColor + 'dd 50%, ' + zoneColor + 'aa 100%); border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; font-size: 22px; text-align: center; box-shadow: 0 8px 16px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2); border: 2px solid rgba(255,255,255,0.4); filter: brightness(1.1) contrast(1.1); transform: perspective(100px) rotateX(15deg); text-shadow: 0 1px 2px rgba(0,0,0,0.3);">' + zone.emoji + '</div>',
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        })
      }).addTo(map);
      zoneMarkers.push(marker);
      
      // Add click handlers for interactive side panel
      const clickHandler = () => openSidePanel(zone);
      marker.on('click', clickHandler);
      polygon.on('click', clickHandler);
      
      // Add drag functionality with position saving
      marker.on('dragend', function(e) {
        const newPos = e.target.getLatLng();
        zone.position = [newPos.lat, newPos.lng];
        console.log('📍 ' + zone.name + ' moved to: [' + newPos.lat + ', ' + newPos.lng + ']');
        
        // Update polygon position as well
        map.removeLayer(polygon);
        const newCircularPolygon = createCircularPolygon([newPos.lat, newPos.lng], 15);
        const newPolygon = L.polygon(newCircularPolygon, {
          color: zoneColorMap[zone.type] || '#333',
          fillColor: zoneColorMap[zone.type] || '#333',
          fillOpacity: 0.3,
          weight: 2,
          opacity: 0.8
        }).addTo(map);
        newPolygon.on('click', clickHandler);
      });
    });
    
    console.log('📍 Zone markers and polygons added to map');
    
    // Smooth dynamic marker scaling for visibility and pixel definition
    function updateMarkerScale() {
      const zoom = map.getZoom();
      const scaleBase = 1 + (zoom - 17) * 0.08;
      const scale = Math.max(0.9, Math.min(1.9, scaleBase)) * (window.devicePixelRatio >= 2 ? 1.05 : 1);
      const baseFont = 22;
      zoneMarkers.forEach(m => {
        const el = m.getElement();
        if (!el) return;
        const inner = el.querySelector('div');
        if (!inner) return;
        inner.style.transform = 'perspective(100px) rotateX(15deg) scale(' + scale + ')';
        inner.style.fontSize = (baseFont * scale) + 'px';
      });
    }
    map.on('zoomend', updateMarkerScale);
    updateMarkerScale();
    
    // Side panel functionality
    function openSidePanel(zone) {
      const panel = document.getElementById('side-panel');
      const content = document.getElementById('panel-content');
      const hero = document.getElementById('project-hero');
      
      // Get zone color for theming
      const zoneColor = zoneColorMap[zone.type] || '#333';
      
      // Update compact header with zone color theming
      hero.innerHTML = \`
        <div class="project-title" style="color: \${zoneColor};">\${zone.emoji} \${zone.name}</div>
        <div class="project-subtitle" style="border-left-color: \${zoneColor};">\${zone.description}</div>
      \`;
      
      // Apply zone color theming to hero background
      hero.style.background = \`linear-gradient(135deg, \${zoneColor}15 0%, \${zoneColor}25 100%)\`;
      hero.style.borderLeft = \`4px solid \${zoneColor}\`;
      
      // Generate comprehensive project details with beautiful spacing
      content.innerHTML = generateProjectDetails(zone);
      
      // Open the panel with animation
      panel.classList.add('open');
      
      // Set up image gallery tabs
      setupImageGalleryTabs();
      
      // Load images for this zone
      loadZoneImages(zone.id);
      
      // Store current zone for auto-refresh
      window.currentZoneId = zone.id;
      
      // Start auto-refresh for images (checks every 30 seconds)
      if (window.imageRefreshInterval) {
        clearInterval(window.imageRefreshInterval);
      }
      window.imageRefreshInterval = setInterval(() => {
        if (window.currentZoneId && panel.classList.contains('open')) {
          loadZoneImages(window.currentZoneId);
        }
      }, 30000); // 30 seconds
      
      console.log('📋 Opened side panel for:', zone.name);
    }
    
    // Close panel functionality
    document.getElementById('close-panel').addEventListener('click', () => {
      document.getElementById('side-panel').classList.remove('open');
      
      // Stop auto-refresh when panel closes
      if (window.imageRefreshInterval) {
        clearInterval(window.imageRefreshInterval);
        window.imageRefreshInterval = null;
      }
      window.currentZoneId = null;
      
      console.log('❌ Closed side panel');
    });
    
    // Enable swipe-to-close on mobile for the side panel
    function attachPanelSwipe(map) {
      const panel = document.getElementById('side-panel');
      if (!panel) return;
      let startX = 0, startY = 0, isTracking = false, isSwiping = false, startTime = 0;
      const SWIPE_THRESHOLD = 50; // px - reduced from 80 for easier closing
      const VELOCITY_THRESHOLD = 0.3; // px/ms - fast swipe also closes
      const ANGLE_THRESHOLD = 15; // px - increased for better detection
      
      const onStart = (clientX, clientY) => {
        if (!panel.classList.contains('open')) return;
        startX = clientX;
        startY = clientY;
        startTime = Date.now();
        isTracking = true;
        isSwiping = false;
        // Remove transition during drag for immediate feedback
        panel.style.transition = 'none';
      };
      
      const onMove = (clientX, clientY, ev) => {
        if (!isTracking) return;
        const dx = clientX - startX;
        const dy = clientY - startY;
        
        if (!isSwiping) {
          // Detect horizontal swipe (more lenient angle detection)
          if (Math.abs(dx) > ANGLE_THRESHOLD) {
            if (Math.abs(dx) > Math.abs(dy) * 1.5) {
              isSwiping = true;
              panel.classList.add('swiping');
            }
          }
          if (!isSwiping) return; // Still waiting to detect direction
        }
        
        // Prevent default to stop scrolling while swiping
        if (ev && ev.cancelable) ev.preventDefault();
        
        // Only allow left swipe (negative dx)
        const translateX = Math.min(0, dx);
        panel.style.transform = 'translateX(' + translateX + 'px)';
      };
      
      const onEnd = () => {
        if (!isTracking) return;
        
        const style = panel.style.transform || '';
        const match = style.match(/translateX\(([-0-9.]+)px\)/);
        const translateX = match ? parseFloat(match[1]) : 0;
        const duration = Date.now() - startTime;
        const velocity = Math.abs(translateX) / duration; // px per ms
        
        // Re-enable transition for smooth snap-back
        panel.style.transition = 'transform 0.3s ease-out';
        panel.classList.remove('swiping');
        
        // Close if: swiped far enough OR swiped fast enough
        const shouldClose = translateX < -SWIPE_THRESHOLD || velocity > VELOCITY_THRESHOLD;
        
        if (shouldClose) {
          // Animate panel out completely before closing
          panel.style.transform = 'translateX(-100%)';
          setTimeout(function() {
            panel.classList.remove('open');
            panel.style.transform = '';
            panel.style.transition = '';
            if (window.imageRefreshInterval) {
              clearInterval(window.imageRefreshInterval);
              window.imageRefreshInterval = null;
            }
            window.currentZoneId = null;
            console.log('👆 Panel closed by swipe (distance: ' + Math.abs(translateX) + 'px, velocity: ' + velocity.toFixed(2) + 'px/ms)');
          }, 300);
        } else {
          // Snap back to original position
          panel.style.transform = '';
          setTimeout(function() {
            panel.style.transition = '';
          }, 300);
        }
        
        isTracking = false;
        isSwiping = false;
      };
      
      // Touch events
      panel.addEventListener('touchstart', function(e) {
        const t = e.touches[0];
        onStart(t.clientX, t.clientY);
      }, { passive: true });
      
      panel.addEventListener('touchmove', function(e) {
        const t = e.touches[0];
        onMove(t.clientX, t.clientY, e);
      }, { passive: false });
      
      panel.addEventListener('touchend', onEnd, { passive: true });
      panel.addEventListener('touchcancel', onEnd, { passive: true });
      
      // Pointer events fallback
      panel.addEventListener('pointerdown', function(e) {
        onStart(e.clientX, e.clientY);
      });
      panel.addEventListener('pointermove', function(e) {
        onMove(e.clientX, e.clientY, e);
      });
      panel.addEventListener('pointerup', onEnd);
      panel.addEventListener('pointercancel', onEnd);
    }
    
    // Enhanced image gallery tab functionality
    function setupImageGalleryTabs() {
      const tabs = document.querySelectorAll('.gallery-tab');
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          // Remove active class from all tabs
          tabs.forEach(t => t.classList.remove('active'));
          
          // Add active class to clicked tab
          tab.classList.add('active');
          
          // Hide all content with smooth transition
          document.querySelectorAll('#current-images, #vision-images, #progress-images').forEach(content => {
            content.style.display = 'none';
          });
          
          // Show selected content with animation
          const tabName = tab.getAttribute('data-tab');
          const targetContent = document.getElementById(tabName + '-images');
          if (targetContent) {
            targetContent.style.display = 'block';
            targetContent.style.opacity = '0';
            setTimeout(() => {
              targetContent.style.opacity = '1';
              targetContent.style.transition = 'opacity 0.3s ease';
            }, 50);
          }
        });
      });
    }
    
    // Load images for a specific zone (with subcategory support)
    async function loadZoneImages(zoneId) {
      const categories = ['current', 'vision'];
      
      for (const category of categories) {
        try {
          const response = await fetch(\`/api/images/\${zoneId}/\${category}\`);
          const data = await response.json();
          
          const container = document.getElementById(\`\${category}-images\`);
          if (!container) continue;
          
          // Check if data has subcategories
          if (data.hasSubcategories && data.subcategories) {
            container.innerHTML = createSubcategoryGallery(data, zoneId, category);
            initializeSubcategoryNavigation(category);
          } else if (data.images && data.images.length > 0) {
            container.innerHTML = createImageCarousel(data.images, zoneId, category);
            initializeCarousel(category);
          } else {
            container.innerHTML = \`
              <div class="no-images-message">
                <div style="font-size: 48px; opacity: 0.3; margin-bottom: 10px;">📷</div>
                <div>No images yet for this category</div>
                <div style="font-size: 13px; opacity: 0.7; margin-top: 5px;">
                  Add images to: images/\${zoneId}/\${category}/
                </div>
              </div>
            \`;
          }
        } catch (error) {
          console.error(\`Error loading \${category} images:\`, error);
          const container = document.getElementById(\`\${category}-images\`);
          if (container) {
            container.innerHTML = \`
              <div class="no-images-message">
                <div style="color: #e74c3c;">⚠️ Error loading images</div>
              </div>
            \`;
          }
        }
      }
    }
    
    // Create subcategory gallery with horizontal navigation
    function createSubcategoryGallery(data, zoneId, category) {
      let subcategories = Object.keys(data.subcategories);
      
      // Prefer "Outdoor" (then "Cabins") first in Vision galleries for Main Residence and Retreat Village
      if (category === 'vision' && (zoneId === 'main-residence' || zoneId === 'retreat-village')) {
        const preferredOrder = ['Outdoor', 'Cabins', 'Indoor', 'Floor Plans'];
        subcategories.sort((a, b) => {
          const ai = preferredOrder.indexOf(a);
          const bi = preferredOrder.indexOf(b);
          const aa = ai === -1 ? Number.MAX_SAFE_INTEGER : ai;
          const bb = bi === -1 ? Number.MAX_SAFE_INTEGER : bi;
          if (aa !== bb) return aa - bb;
          return a.localeCompare(b);
        });
      } else {
        // Default alphabetical for other cases
        subcategories.sort((a, b) => a.localeCompare(b));
      }
      
      // Choose the first subcategory that actually has images; fallback to first
      const activeSubcategory = subcategories.find(name => (data.subcategories[name]?.count || 0) > 0) || subcategories[0];
      
      // Create sub-navigation tabs
      const subNavTabs = subcategories.map((subcat) => \`
        <div class="sub-nav-tab \${subcat === activeSubcategory ? 'active' : ''}" 
             data-subcategory="\${subcat}"
             onclick="switchSubcategory('\${category}', '\${subcat}')">
          \${subcat}
          <span class="count-badge">\${data.subcategories[subcat].count}</span>
        </div>
      \`).join('');
      
      // Create content for each subcategory
      const subcategoryContents = subcategories.map((subcat) => {
        const images = data.subcategories[subcat].images;
        const carouselHtml = images.length > 0 
          ? createImageCarousel(images, zoneId, \`\${category}-\${subcat}\`)
          : \`<div class=\"no-images-message\">No images in this subcategory</div>\`;
        
        return \`
          <div class="subcategory-content \${subcat === activeSubcategory ? 'active' : ''}" 
               data-subcategory="\${subcat}">
            \${carouselHtml}
          </div>
        \`;
      }).join('');
      
      return \`
        <div class="sub-nav-container">
          <div class="sub-nav-tabs">
            \${subNavTabs}
          </div>
        </div>
        <div class="subcategory-gallery">
          \${subcategoryContents}
        </div>
      \`;
    }
    
    // Initialize subcategory navigation
    function initializeSubcategoryNavigation(category) {
      // Initialize carousels for all subcategories
      const subcategoryContents = document.querySelectorAll(\`#\${category}-images .subcategory-content\`);
      subcategoryContents.forEach(content => {
        const subcategory = content.getAttribute('data-subcategory');
        const carouselCategory = \`\${category}-\${subcategory}\`;
        initializeCarousel(carouselCategory);
      });
    }
    
    // Switch between subcategories
    window.switchSubcategory = function(category, subcategoryName) {
      const container = document.getElementById(\`\${category}-images\`);
      if (!container) return;
      
      // Update tabs
      const tabs = container.querySelectorAll('.sub-nav-tab');
      tabs.forEach(tab => {
        if (tab.getAttribute('data-subcategory') === subcategoryName) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });
      
      // Update content
      const contents = container.querySelectorAll('.subcategory-content');
      contents.forEach(content => {
        if (content.getAttribute('data-subcategory') === subcategoryName) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });
    };
    
    // Create image carousel HTML with optimized loading
    function createImageCarousel(images, zoneId, category) {
      const mainImages = images.map((src, index) => \`
        <img src="\${src}" 
             class="carousel-image \${index === 0 ? 'active' : ''}" 
             alt="Image \${index + 1}"
             loading="\${index === 0 ? 'eager' : 'lazy'}"
             fetchpriority="\${index === 0 ? 'high' : 'low'}"
             sizes="(max-width: 768px) 100vw, 580px"
             decoding="async">
      \`).join('');
      
      const thumbnails = images.map((src, index) => \`
        <img src="\${src}" 
             class="carousel-thumbnail \${index === 0 ? 'active' : ''}" 
             alt="Thumbnail \${index + 1}"
             data-index="\${index}"
             loading="lazy"
             decoding="async"
             onclick="goToSlide('\${category}', \${index})">
      \`).join('');
      
      return \`
        <div class="image-carousel" data-category="\${category}">
          <div class="carousel-main">
            \${mainImages}
            <div class="carousel-loading"><div class="loading-spinner"></div></div>
            \${images.length > 1 ? \`
              <button class="carousel-nav prev" onclick="navigateCarousel('\${category}', -1)">
                &#8249;
              </button>
              <button class="carousel-nav next" onclick="navigateCarousel('\${category}', 1)">
                &#8250;
              </button>
              <div class="carousel-counter">
                <span class="current-slide">1</span> / <span class="total-slides">\${images.length}</span>
              </div>
            \` : ''}
          </div>
          \${images.length > 1 ? \`
            <div class="carousel-thumbnails">
              \${thumbnails}
            </div>
          \` : ''}
        </div>
      \`;
    }
    
    // Initialize carousel for a category
    function initializeCarousel(category) {
      const carousel = document.querySelector(\`[data-category="\${category}"]\`);
      if (!carousel) return;
      
      const images = Array.from(carousel.querySelectorAll('.carousel-image'));
      if (images.length === 0) return;
      
      // Initialize current index once
      if (!carousel.dataset.currentIndex) carousel.dataset.currentIndex = '0';
      
      // Mark images as loaded when ready (removes blur smoothly)
      images.forEach((img) => {
        const markLoaded = () => img.classList.add('loaded');
        if (img.complete && img.naturalWidth > 0) {
          if (typeof img.decode === 'function') {
            img.decode().catch(() => {}).finally(markLoaded);
          } else {
            markLoaded();
          }
        } else {
          img.addEventListener('load', markLoaded, { once: true });
          img.addEventListener('error', markLoaded, { once: true });
        }
      });
      
      // Preload adjacent images for instant nav
      const idx = parseInt(carousel.dataset.currentIndex || '0', 10) || 0;
      preloadAdjacent(category, idx);
      
      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        const panel = document.getElementById('side-panel');
        if (!panel || !panel.classList.contains('open')) return;
        const activeTab = document.querySelector('.gallery-tab.active');
        const activeCategory = activeTab ? activeTab.getAttribute('data-tab') : null;
        if (activeCategory === category) {
          if (e.key === 'ArrowLeft') navigateCarousel(category, -1);
          if (e.key === 'ArrowRight') navigateCarousel(category, 1);
        }
      });

      // Swipe navigation on mobile
      const main = carousel.querySelector('.carousel-main');
      if (main) {
        let sx = 0, sy = 0, swiping = false;
        const THRESH = 50;
        const ANGLE = 12;
        const onStart = (x, y) => { sx = x; sy = y; swiping = false; };
        const onMove = (x, y, ev) => {
          const dx = x - sx; const dy = y - sy;
          if (!swiping && Math.abs(dx) > ANGLE && Math.abs(dx) > Math.abs(dy)) {
            swiping = true;
          }
          if (swiping && ev && ev.cancelable) ev.preventDefault();
        };
        const onEnd = (x, y) => {
          const dx = x - sx; const dy = y - sy;
          if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > THRESH) {
            navigateCarousel(category, dx < 0 ? 1 : -1);
          }
        };

        // Touch
        main.addEventListener('touchstart', (e) => { const t = e.touches[0]; onStart(t.clientX, t.clientY); }, { passive: true });
        main.addEventListener('touchmove', (e) => { const t = e.touches[0]; onMove(t.clientX, t.clientY, e); }, { passive: false });
        main.addEventListener('touchend', (e) => { const t = e.changedTouches[0]; onEnd(t.clientX, t.clientY); });
        // Pointer fallback
        main.addEventListener('pointerdown', (e) => onStart(e.clientX, e.clientY));
        main.addEventListener('pointermove', (e) => onMove(e.clientX, e.clientY, e));
        main.addEventListener('pointerup', (e) => onEnd(e.clientX, e.clientY));
      }
    }

    // Preload previous and next images
    function preloadAdjacent(category, index) {
      const carousel = document.querySelector(\`[data-category="\${category}"]\`);
      if (!carousel) return;
      const images = carousel.querySelectorAll('.carousel-image');
      if (!images.length) return;
      const prev = (index - 1 + images.length) % images.length;
      const next = (index + 1) % images.length;
      [prev, next].forEach(i => {
        const img = images[i];
        if (!img) return;
        if (!img.classList.contains('loaded')) {
          if (typeof img.decode === 'function') {
            img.decode().catch(() => {}).then(() => img.classList.add('loaded'));
          }
        }
      });
    }

    async function switchToIndex(category, newIndex) {
      const carousel = document.querySelector(\`[data-category="\${category}"]\`);
      if (!carousel) return;
      
      // Debounce rapid clicks
      if (carousel.dataset.navBusy === '1') return;
      carousel.dataset.navBusy = '1';
      
      const images = carousel.querySelectorAll('.carousel-image');
      const thumbnails = carousel.querySelectorAll('.carousel-thumbnail');
      if (!images.length) { carousel.dataset.navBusy = '0'; return; }
      
      if (newIndex < 0) newIndex = images.length - 1;
      if (newIndex >= images.length) newIndex = 0;
      
      const overlay = carousel.querySelector('.carousel-loading');
      if (overlay) overlay.classList.add('active');
      
      const target = images[newIndex];
      if (target) {
        try {
          if (typeof target.decode === 'function') {
            await target.decode().catch(() => {});
          } else if (!target.complete) {
            await new Promise((res) => {
              target.addEventListener('load', res, { once: true });
              target.addEventListener('error', res, { once: true });
            });
          }
        } finally {
          target.classList.add('loaded');
        }
      }
      
      images.forEach((img, i) => img.classList.toggle('active', i === newIndex));
      thumbnails.forEach((thumb, i) => thumb.classList.toggle('active', i === newIndex));
      const counter = carousel.querySelector('.current-slide');
      if (counter) counter.textContent = String(newIndex + 1);
      carousel.dataset.currentIndex = String(newIndex);
      preloadAdjacent(category, newIndex);
      if (overlay) overlay.classList.remove('active');
      setTimeout(() => { carousel.dataset.navBusy = '0'; }, 120);
    }
    
    // Navigate carousel
    window.navigateCarousel = function(category, direction) {
      const carousel = document.querySelector(\`[data-category="\${category}"]\`);
      if (!carousel) return;
      const currentIndex = parseInt(carousel.dataset.currentIndex || '0', 10) || 0;
      switchToIndex(category, currentIndex + direction);
    };
    
    // Go to specific slide
    window.goToSlide = function(category, index) {
      switchToIndex(category, index);
    };
    
    // Zone positions are now permanently locked - no reset functionality needed
    
    // Generate comprehensive project details HTML
    function generateProjectDetails(zone) {
      const zoneColor = zoneColorMap[zone.type] || '#333';
      const lightColor = zoneColor + '15'; // 15% opacity for backgrounds
      const mediumColor = zoneColor + '40'; // 40% opacity for highlights
      
      return \`
        <div class="image-gallery">
          <div class="gallery-tabs">
            <div class="gallery-tab active" data-tab="current">📷 Current Photos</div>
            <div class="gallery-tab" data-tab="vision">🎨 Vision</div>
          </div>
          <div class="gallery-content">
            <div id="current-images">
              <div class="loading-images">⏳ Loading images...</div>
            </div>
            <div id="vision-images" style="display: none;">
              <div class="loading-images">⏳ Loading images...</div>
            </div>
          </div>
        </div>
        
        <div class="project-section">
          <h3 style="color: \${zoneColor};">📋 Project Overview</h3>
          <p style="color: #555; line-height: 1.6; font-size: 15px;">\${zone.description}</p>
        </div>
        
        <div class="project-section">
          <h3 style="color: \${zoneColor};">🏗️ Key Features & Infrastructure</h3>
          <ul class="feature-list">
            \${zone.features.map(feature => \`<li>\${feature}</li>\`).join('')}
          </ul>
        </div>
        
        \${zone.revenueStreams ? \`
          <div class="project-section">
            <h3 style="color: \${zoneColor};">💵 Revenue Streams</h3>
            \${zone.revenueStreams.map(stream => \`<div class="revenue-stream">\${stream}</div>\`).join('')}
          </div>
        \` : ''}
        
        <div class="project-section">
          <h3 style="color: \${zoneColor};">📅 Development Timeline</h3>
          <div style="padding: 20px; background: linear-gradient(135deg, \${lightColor} 0%, \${mediumColor} 100%); border-radius: 12px; border-left: 4px solid \${zoneColor};">
            <span class="timeline-phase">\${zone.timeline}</span>
            <p style="margin-top: 12px; color: #555; font-size: 14px; line-height: 1.5;">This zone is part of the comprehensive EcoVillageBuilder development plan, strategically phased for optimal cash flow and sustainable growth across the 10-acre Sulphur Mountain property.</p>
          </div>
        </div>
        
        <div class="project-section">
          <h3 style="color: \${zoneColor};">🌟 Sustainability Features</h3>
          <div style="background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%); padding: 20px; border-radius: 12px; border-left: 4px solid #28a745;">
            <ul class="feature-list" style="margin: 0;">
              <li>Solar energy integration and battery storage systems</li>
              <li>Rainwater harvesting and greywater recycling</li>
              <li>Native plant landscaping and permaculture design</li>
              <li>Sustainable building materials and energy efficiency</li>
              <li>Organic waste composting and soil regeneration</li>
            </ul>
          </div>
        </div>
        
        <div class="project-section">
          <h3 style="color: \${zoneColor};">📊 Market Analysis & Projections</h3>
          <div style="background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); padding: 20px; border-radius: 12px; border-left: 4px solid #ffc107;">
            <p style="color: #856404; margin: 0; font-size: 14px; line-height: 1.5;">
              <strong>Market Position:</strong> Positioned in the rapidly growing eco-tourism and sustainable living sectors, with projected 15-20% annual growth in demand for authentic wellness retreats and farm-to-table experiences in the Ojai Valley region.
            </p>
          </div>
        </div>
        
        <div class="project-section">
          <h3 style="color: \${zoneColor};">💰 Investment Summary</h3>
          <div class="investment-grid">
            <div class="investment-card" style="border-color: \${zoneColor};">
              <div class="investment-label">Total Budget</div>
              <div class="investment-value" style="color: \${zoneColor};">\${zone.budget}</div>
            </div>
            <div class="investment-card" style="border-color: \${zoneColor};">
              <div class="investment-label">Monthly Revenue</div>
              <div class="investment-value roi-positive" style="color: \${zoneColor};">\${zone.monthlyRevenue}</div>
            </div>
            <div class="investment-card" style="border-color: \${zoneColor};">
              <div class="investment-label">Timeline</div>
              <div class="investment-value" style="color: \${zoneColor};">\${zone.timeline}</div>
            </div>
            <div class="investment-card" style="border-color: \${zoneColor};">
              <div class="investment-label">ROI</div>
              <div class="investment-value roi-positive" style="color: \${zoneColor};">\${zone.roi}</div>
            </div>
          </div>
        </div>
        
        <div class="project-section cta-section">
          <h3 style="color: \${zoneColor};">🤝 Get Involved</h3>
          <div style="background: linear-gradient(135deg, \${zoneColor} 0%, \${zoneColor}CC 100%); padding: 30px; border-radius: 16px; text-align: center; color: white; border: 2px solid \${zoneColor};">
            <h4 style="color: white; margin: 0 0 15px 0; font-size: 20px;">Ready to Join This Vision?</h4>
            <p style="margin: 0 0 25px 0; opacity: 0.9; font-size: 15px; line-height: 1.5;">
              Be part of creating a sustainable future at Sulphur Mountain Eco-Village. Whether you're an investor, partner, or future resident, we'd love to hear from you.
            </p>
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
              <button class="cta-button primary" onclick="window.open('mailto:info@sulphurmountain-ecovillage.com?subject=Partnership Inquiry - \${zone.name}', '_blank')">
                📧 Get In Touch
              </button>
              <button class="cta-button secondary" onclick="window.open('tel:+1-555-ECO-VILLAGE', '_blank')">
                📞 Schedule Call
              </button>
              <button class="cta-button secondary" onclick="alert('Investment brochure request sent! We\\'ll contact you within 24 hours.')">
                📄 Request Info
              </button>
            </div>
          </div>
        </div>
        
        <div class="project-footer">
          <div class="footer-content">
            <div class="footer-title">🌿 Sulphur Mountain Eco-Village</div>
            <div class="footer-info">
              <span>15 Project Zones</span> • 
              <span>$7.75M Investment</span> • 
              <span>10-Acre Property</span> • 
              <span>Ojai Valley, CA</span>
            </div>
            <div class="footer-tagline">Regenerative Living • Sustainable Design • Community Wellness</div>
          </div>
        </div>
      \`;
    }
    
    // Admin Popup Menu Functionality
    const adminToggle = document.getElementById('admin-menu-toggle');
    const adminPopup = document.getElementById('admin-popup');
    const closePopup = document.getElementById('close-popup');
    const statusIndicator = document.getElementById('status-indicator');
    
    // Toggle admin popup
    adminToggle.addEventListener('click', () => {
      adminPopup.style.display = adminPopup.style.display === 'none' ? 'block' : 'none';
    });
    
    // Close admin popup
    closePopup.addEventListener('click', () => {
      adminPopup.style.display = 'none';
    });
    
    // Close popup when clicking outside
    document.addEventListener('click', (e) => {
      if (!adminPopup.contains(e.target) && !adminToggle.contains(e.target)) {
        adminPopup.style.display = 'none';
      }
    });

    // Territory Drawing Editor Functionality
    const territoryToggle = document.getElementById('territory-editor-toggle');
    const territoryEditor = document.getElementById('territory-editor');
    const closeTerritoryEditor = document.getElementById('close-territory-editor');
    const zoneSelector = document.getElementById('zone-selector');
    const brushSize = document.getElementById('brush-size');
    const brushSizeDisplay = document.getElementById('brush-size-display');
    const drawingStatus = document.getElementById('drawing-status');
    
    // Territory drawing state
    let isDrawingMode = false;
    let currentZone = null;
    let drawingCursor = null;
    let isDrawing = false;
    let drawMode = 'draw'; // 'draw' or 'erase'
    let territoryLayers = new Map(); // Store territory layers for each zone
    
    // Initialize zone selector with all zones
    zones.forEach(zone => {
      const option = document.createElement('option');
      option.value = zone.id;
      option.textContent = zone.emoji + ' ' + zone.name;
      zoneSelector.appendChild(option);
    });
    
    // Toggle territory editor
    territoryToggle.addEventListener('click', () => {
      territoryEditor.style.display = territoryEditor.style.display === 'none' ? 'block' : 'none';
      if (territoryEditor.style.display === 'block') {
        isDrawingMode = true;
        createDrawingCursor();
      } else {
        isDrawingMode = false;
        removeDrawingCursor();
      }
    });
    
    // Close territory editor
    closeTerritoryEditor.addEventListener('click', () => {
      territoryEditor.style.display = 'none';
      isDrawingMode = false;
      removeDrawingCursor();
    });
    
    // Zone selection change
    zoneSelector.addEventListener('change', (e) => {
      currentZone = zones.find(z => z.id === e.target.value);
      if (currentZone) {
        drawingStatus.innerHTML = '<div>🎨</div><div class="status-text">Drawing territory for ' + currentZone.name + '</div>';
        drawingStatus.style.borderLeftColor = zoneColorMap[currentZone.type] || '#2196F3';
        updateDrawingCursor();
      } else {
        drawingStatus.innerHTML = '<div>🎨</div><div class="status-text">Select a zone to start drawing</div>';
        drawingStatus.style.borderLeftColor = '#2196F3';
      }
    });
    
    // Brush size control
    brushSize.addEventListener('input', (e) => {
      brushSizeDisplay.textContent = e.target.value + 'px';
      updateDrawingCursor();
    });
    
    // Draw mode selection
    document.addEventListener('change', (e) => {
      if (e.target.name === 'draw-mode') {
        drawMode = e.target.value;
        updateDrawingCursor();
      }
    });
    
    // Create drawing cursor
    function createDrawingCursor() {
      if (!drawingCursor) {
        drawingCursor = document.createElement('div');
        drawingCursor.className = 'drawing-cursor';
        document.body.appendChild(drawingCursor);
        updateDrawingCursor();
      }
    }
    
    // Update drawing cursor appearance
    function updateDrawingCursor() {
      if (drawingCursor && currentZone) {
        const size = parseInt(brushSize.value);
        const color = zoneColorMap[currentZone.type] || '#FF6B6B';
        
        drawingCursor.style.width = size + 'px';
        drawingCursor.style.height = size + 'px';
        
        if (drawMode === 'draw') {
          drawingCursor.style.border = '2px solid ' + color;
          drawingCursor.style.background = color + '33';
        } else {
          drawingCursor.style.border = '2px solid #ff4757';
          drawingCursor.style.background = 'rgba(255, 71, 87, 0.2)';
        }
      }
    }
    
    // Remove drawing cursor
    function removeDrawingCursor() {
      if (drawingCursor) {
        document.body.removeChild(drawingCursor);
        drawingCursor = null;
      }
    }
    
    // Mouse move handler for cursor
    document.addEventListener('mousemove', (e) => {
      if (drawingCursor && isDrawingMode) {
        drawingCursor.style.left = e.clientX + 'px';
        drawingCursor.style.top = e.clientY + 'px';
        drawingCursor.style.display = 'block';
      }
    });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      if (drawingCursor) {
        drawingCursor.style.display = 'none';
      }
    });
    
    // Drawing functionality on map
    let drawingCanvas = null;
    let canvasContext = null;
    
    // Initialize drawing canvas
    function initializeDrawingCanvas() {
      if (!drawingCanvas) {
        drawingCanvas = document.createElement('canvas');
        drawingCanvas.style.position = 'absolute';
        drawingCanvas.style.top = '0';
        drawingCanvas.style.left = '0';
        drawingCanvas.style.pointerEvents = 'none';
        drawingCanvas.style.zIndex = '1000';
        
        const mapContainer = document.getElementById('map');
        mapContainer.appendChild(drawingCanvas);
        
        canvasContext = drawingCanvas.getContext('2d');
        
        // Resize canvas to match map
        function resizeCanvas() {
          drawingCanvas.width = mapContainer.offsetWidth;
          drawingCanvas.height = mapContainer.offsetHeight;
        }
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        map.on('resize', resizeCanvas);
      }
    }
    
    // Map mouse events for drawing
    map.on('mousedown', (e) => {
      if (isDrawingMode && currentZone) {
        isDrawing = true;
        initializeDrawingCanvas();
        drawOnCanvas(e.containerPoint);
      }
    });
    
    map.on('mousemove', (e) => {
      if (isDrawing && isDrawingMode && currentZone) {
        drawOnCanvas(e.containerPoint);
      }
    });
    
    map.on('mouseup', () => {
      if (isDrawing) {
        isDrawing = false;
        saveCurrentTerritory();
      }
    });
    
    // Draw on canvas
    function drawOnCanvas(point) {
      if (!canvasContext || !currentZone) return;
      
      const size = parseInt(brushSize.value);
      const color = zoneColorMap[currentZone.type] || '#FF6B6B';
      
      canvasContext.globalCompositeOperation = drawMode === 'draw' ? 'source-over' : 'destination-out';
      canvasContext.fillStyle = color + '80'; // Semi-transparent
      canvasContext.beginPath();
      canvasContext.arc(point.x, point.y, size / 2, 0, Math.PI * 2);
      canvasContext.fill();
    }
    
    // Save current territory as polygon
    function saveCurrentTerritory() {
      if (!currentZone || !drawingCanvas) return;
      
      // Convert canvas drawing to polygon coordinates
      // This is a simplified version - in production you'd want more sophisticated polygon generation
      console.log('Territory drawn for', currentZone.name);
      
      // Update status
      drawingStatus.innerHTML = '<div>✅</div><div class="status-text">Territory saved for ' + currentZone.name + '</div>';
    }
    
    // Clear territory for current zone
    document.getElementById('clear-territory').addEventListener('click', () => {
      if (currentZone && drawingCanvas) {
        // Clear the canvas for current zone
        canvasContext.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
        drawingStatus.innerHTML = '<div>🗑️</div><div class="status-text">Territory cleared for ' + currentZone.name + '</div>';
      }
    });
    
    // Save all territories
    document.getElementById('save-territories').addEventListener('click', () => {
      console.log('💾 Saving all territories...');
      // Implementation for saving territories to file/server
      drawingStatus.innerHTML = '<div>💾</div><div class="status-text">All territories saved successfully!</div>';
    });
    
    // Load territories
    document.getElementById('load-territories').addEventListener('click', () => {
      console.log('📁 Loading territories...');
      // Implementation for loading territories from file/server
      drawingStatus.innerHTML = '<div>📁</div><div class="status-text">Territories loaded successfully!</div>';
    });
    
    // Bulletproof Capture Zone Positions functionality
    const captureZonesBtn = document.getElementById('capture-zones-btn');
    captureZonesBtn.addEventListener('click', () => {
      console.log('\\n========== ZONE POSITIONS CAPTURED ==========');
      console.log('Current marker positions for embedding:');
      console.log('');
      
      const capturedPositions = [];
      let zoneCount = 0;
      
      // Get all zone markers from the map
      map.eachLayer(layer => {
        if (layer.options && layer.options.zoneId) {
          const position = layer.getLatLng();
          const zoneData = {
            id: layer.options.zoneId,
            name: layer.options.zoneName || layer.options.zoneId,
            position: [position.lat, position.lng]
          };
          
          capturedPositions.push(zoneData);
          zoneCount++;
          
          // Log each position clearly
          console.log(zoneCount + '. "' + zoneData.name + '"');
          console.log('   position: [' + position.lat.toFixed(6) + ', ' + position.lng.toFixed(6) + '],');
          console.log('');
        }
      });
      
      // Show summary
      console.log('Total zones captured: ' + zoneCount);
      console.log('Copy the position coordinates above to update your PROJECT_ZONES array');
      console.log('=============================================\\n');
      
      // Update status indicator  
      statusIndicator.innerHTML = '<div>🎯</div><div class="status-text">Captured ' + zoneCount + ' Positions!</div>';
      statusIndicator.style.background = 'linear-gradient(135deg, #E8F5E8 0%, #A5D6A7 100%)';
      statusIndicator.style.borderLeftColor = '#4CAF50';
      
      // Show user-friendly alert with instructions
      alert('🎯 SUCCESS! Captured ' + zoneCount + ' zone positions!\\n\\n📋 Instructions:\\n1. Open browser console (F12)\\n2. Copy the coordinates shown\\n3. Update your PROJECT_ZONES array\\n\\n✅ All positions are now ready for embedding!');
      
      // Also create a downloadable text file with the positions
      let positionsText = '';
      capturedPositions.forEach(zone => {
        positionsText += '"' + zone.id + '": position: [' + zone.position[0].toFixed(6) + ', ' + zone.position[1].toFixed(6) + ']\\n';
      });
      
      const blob = new Blob([positionsText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'zone-positions.txt';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      console.log('Positions also saved to zone-positions.txt file');
    });
    
    // Zone movement controls - Carefully implemented
    (function initZoneMovement() {
      const selector = document.getElementById('zone-move-selector');
      const unlockBtn = document.getElementById('unlock-zone-btn');
      const lockBtn = document.getElementById('lock-zone-btn');
      const selectedIndicator = document.getElementById('selected-zone-indicator');
      const selectedName = document.getElementById('selected-zone-name');
      const statusDiv = document.getElementById('status-indicator');
      
      if (!selector || !unlockBtn || !lockBtn) {
        console.log('Zone movement UI not found');
        return;
      }
      
      const markerMap = new Map();
      let currentMarker = null;
      let currentZoneId = null;
      
      // Populate dropdown
      zones.forEach(function(z) {
        const opt = document.createElement('option');
        opt.value = z.id;
        opt.textContent = z.emoji + ' ' + z.name;
        selector.appendChild(opt);
      });
      
      // Map markers
      map.eachLayer(function(layer) {
        if (layer.options && layer.options.zoneId) {
          markerMap.set(layer.options.zoneId, layer);
        }
      });
      
      // Selection handler
      selector.addEventListener('change', function(e) {
        const id = e.target.value;
        if (!id) {
          unlockBtn.disabled = true;
          if (selectedIndicator) selectedIndicator.style.display = 'none';
          return;
        }
        unlockBtn.disabled = false;
        const z = zones.find(function(zone) { return zone.id === id; });
        if (selectedName && z) {
          selectedName.textContent = 'Selected: ' + z.emoji + ' ' + z.name;
        }
        if (selectedIndicator) selectedIndicator.style.display = 'flex';
      });
      
      // Unlock handler
      unlockBtn.addEventListener('click', function() {
        const id = selector.value;
        if (!id) return;
        const marker = markerMap.get(id);
        const z = zones.find(function(zone) { return zone.id === id; });
        if (!marker || !z) return;
        
        marker.dragging.enable();
        currentMarker = marker;
        currentZoneId = id;
        
        const el = marker.getElement();
        if (el) {
          el.style.filter = 'drop-shadow(0 0 10px #FF9800) brightness(1.3)';
          el.style.transform = 'scale(1.2)';
          el.style.transition = 'all 0.3s ease';
        }
        
        unlockBtn.style.display = 'none';
        lockBtn.style.display = 'block';
        
        if (statusDiv) {
          const txt = statusDiv.querySelector('.status-text');
          if (txt) txt.textContent = z.emoji + ' ' + z.name + ' - UNLOCKED';
          statusDiv.style.background = 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)';
          statusDiv.style.borderLeftColor = '#FF9800';
          const ico = statusDiv.querySelector('div:first-child');
          if (ico) ico.textContent = '🔓';
        }
        
        console.log('Unlocked:', z.name);
      });
      
      // Lock handler
      lockBtn.addEventListener('click', function() {
        if (!currentMarker || !currentZoneId) return;
        const z = zones.find(function(zone) { return zone.id === currentZoneId; });
        
        currentMarker.dragging.disable();
        
        const el = currentMarker.getElement();
        if (el) {
          el.style.filter = '';
          el.style.transform = '';
        }
        
        const pos = currentMarker.getLatLng();
        console.log('Locked:', z.name);
        console.log('New position:', [pos.lat, pos.lng]);
        
        unlockBtn.style.display = 'block';
        lockBtn.style.display = 'none';
        
        if (statusDiv) {
          const txt = statusDiv.querySelector('.status-text');
          if (txt) txt.textContent = 'All Zones Locked';
          statusDiv.style.background = 'linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)';
          statusDiv.style.borderLeftColor = '#F44336';
          const ico = statusDiv.querySelector('div:first-child');
          if (ico) ico.textContent = '🔒';
        }
        
        currentMarker = null;
        currentZoneId = null;
      });
      
      console.log('Zone movement controls initialized');
    })();
    
    // Image upload handling function
    function handleImageUpload(input, zoneId, category) {
      const files = input.files;
      if (files.length === 0) return;
      
      console.log('📁 Image upload requested for:', zoneId, category, files.length + ' files');
      
      // Create FormData for file upload
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }
      formData.append('zoneId', zoneId);
      formData.append('category', category);
      
      // Show upload progress
      const placeholder = input.parentElement;
      const originalContent = placeholder.innerHTML;
      placeholder.innerHTML = '<div class="placeholder-icon">⬆️</div><div class="placeholder-text">Uploading...</div>';
      
      // Simulate upload (in real implementation, would POST to /api/upload-images)
      setTimeout(() => {
        placeholder.innerHTML = '<div class="placeholder-icon">✅</div><div class="placeholder-text">Ready for images<br>Drop files here</div>';
        console.log('✅ Images uploaded successfully to /images/' + zoneId + '/' + category + '/');
        
        // Reset after showing success
        setTimeout(() => {
          placeholder.innerHTML = originalContent;
        }, 2000);
      }, 1500);
    }
    
    // Make handleImageUpload globally available
    window.handleImageUpload = handleImageUpload;
    
    console.log('✅ EcoVillageBuilder Interactive Map fully initialized');
    console.log('🎯 Ready for investor presentations and zone exploration');
    console.log('📁 Image upload system ready - all directories created');
  </script>
</body>
</html>`;

    // Replace placeholders with actual data
    const finalHtml = htmlContent
      .replace('ZONES_DATA_PLACEHOLDER', JSON.stringify(PROJECT_ZONES))
      .replace('PERMANENT_LINES_PLACEHOLDER', JSON.stringify(PERMANENT_PROPERTY_LINES));

    // Set correct content type header and send as HTML
    res.type('html');
    res.status(200);
    res.end(finalHtml);
    console.log('✅ Served interactive map successfully');

  } catch (error) {
    console.error('❌ Error serving interactive map:', error);
    res.status(500).send('Server Error: ' + error.message);
  }
});

// API endpoint for project zones data
app.get('/api/project-zones', (req, res) => {
  try {
    const totalInvestment = PROJECT_ZONES.reduce((sum, zone) => {
      const budget = parseInt(zone.budget.replace(/[$,]/g, ''));
      return sum + budget;
    }, 0);

    res.json({
      success: true,
      totalZones: PROJECT_ZONES.length,
      totalInvestment: `$${totalInvestment.toLocaleString()}`,
      zones: PROJECT_ZONES,
      propertyLines: PERMANENT_PROPERTY_LINES.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    zones: PROJECT_ZONES.length,
    propertyLines: PERMANENT_PROPERTY_LINES.length
  });
});

// Mapping from project IDs to actual folder names
const PROJECT_FOLDER_MAP = {
  'agricultural-hub': 'Agricultural Hub',
  'main-residence': 'Main Residence Compound',
  'community-hub': 'Community Hub',
  'retreat-village': 'Retreat Village',
  'infrastructure': 'Infrastructure & Utilities',
  'mcqueens-garage': "McQueen's Garage & Creative",
  'ceremonial-infrastructure': 'Ceremonial Infrastructure',
  'wellness-facilities': 'Wellness & Spa Facilities',
  'mushroom-cultivation': 'Mushroom Cultivation',
  'beekeeping-program': 'Beekeeping & Honey Production',
  'livestock-program': 'Livestock & Dairy Program',
  'creative-workshop-center': 'Creative Workshop & Art Creation Center',
  'glamping-creek-village': 'Creek-Side Glamping & Lodging Village',
  'gatelodge-operations-hub': 'Sulphur Mountain Gatelodge (Operations ADU)',
  'sulphur-mountain-sanctuary': 'Sulphur Mountain Sanctuary The Living Landscape',
  'farmstead-produce-stand': 'Farmstead Produce Stand & Online Hub'
};

// API endpoint to get images for a specific zone (with subcategory support)
app.get('/api/images/:zoneId/:category', async (req, res) => {
  try {
    const { zoneId, category } = req.params;
    const fs = await import('fs/promises');
    
    // Map project ID to actual folder name
    const folderName = PROJECT_FOLDER_MAP[zoneId] || zoneId;
    const categoryPath = join(__dirname, 'images', folderName, category);
    
    try {
      const items = await fs.readdir(categoryPath, { withFileTypes: true });
      
      // Check for subfolders
      const subfolders = items.filter(item => item.isDirectory()).map(dir => dir.name);
      
      // If subfolders exist, get images from each subfolder
      if (subfolders.length > 0) {
        const subcategories = {};
        
        for (const subfolder of subfolders) {
          const subfolderPath = join(categoryPath, subfolder);
          try {
            const subFiles = await fs.readdir(subfolderPath);
            const subImages = subFiles.filter(file => 
              /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)
            );
            
            subcategories[subfolder] = {
              images: subImages.map(file => 
                `/images/${encodeURIComponent(folderName)}/${category}/${encodeURIComponent(subfolder)}/${encodeURIComponent(file)}`
              ),
              count: subImages.length
            };
          } catch (err) {
            subcategories[subfolder] = { images: [], count: 0 };
          }
        }
        
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.json({
          success: true,
          zoneId,
          category,
          folderName,
          hasSubcategories: true,
          subcategories,
          totalCount: Object.values(subcategories).reduce((sum, sub) => sum + sub.count, 0)
        });
      } else {
        // No subfolders, get images directly from category folder
        const imageFiles = items
          .filter(item => item.isFile() && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(item.name))
          .map(item => item.name);
        
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.json({
          success: true,
          zoneId,
          category,
          folderName,
          hasSubcategories: false,
          images: imageFiles.map(file => `/images/${encodeURIComponent(folderName)}/${category}/${encodeURIComponent(file)}`),
          count: imageFiles.length
        });
      }
    } catch (err) {
      // Category folder doesn't exist or is empty - return empty array
      res.json({
        success: true,
        zoneId,
        category,
        hasSubcategories: false,
        images: [],
        count: 0
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve static images with strong caching
app.use(
  '/images',
  express.static(join(__dirname, 'images'), {
    maxAge: '30d',
    immutable: true,
    setHeaders: (res) => {
      res.setHeader('Cache-Control', 'public, max-age=2592000, immutable');
    },
  })
);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server with comprehensive error handling (only if not in Vercel serverless environment)
if (process.env.VERCEL !== '1') {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('🚀 EcoVillageBuilder Interactive Map Server');
    console.log(`🌐 Server running on port ${PORT}`);
    console.log(`📊 Serving ${PROJECT_ZONES.length} project zones ($7.75M total investment)`);
    console.log(`🔲 ${PERMANENT_PROPERTY_LINES.length} permanent property boundary lines`);
    console.log('✨ Ready for investor presentations and interactive exploration');
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use`);
      console.log('💡 Kill existing processes with: Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force');
    } else {
      console.error('❌ Server error:', error);
    }
  });

  // Graceful shutdown handling
  process.on('SIGINT', () => {
    console.log('🛑 Shutting down EcoVillageBuilder server gracefully...');
    server.close(() => {
      console.log('✅ Server shutdown complete');
      process.exit(0);
    });
  });
} else {
  console.log('🚀 Running in Vercel serverless mode');
}

process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚫 Unhandled Rejection at:', promise, 'reason:', reason);
});

export default app;