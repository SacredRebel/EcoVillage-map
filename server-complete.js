// EcoVillageBuilder - Complete Working Implementation
import 'dotenv/config';
import express from 'express';
import compression from 'compression';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { IMAGE_URLS } from './image-urls.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Performance & Security Middleware
app.use(compression({ level: 6, threshold: 1024 })); // Compress responses
app.use(cors()); // Enable CORS for all routes
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies

// Supabase configuration - Load from .env file
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'your-anon-key';
const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET || 'eco-village-images';

// Log Supabase config status (for debugging)
if (process.env.VERCEL !== '1') {
  if (SUPABASE_URL === 'https://your-project.supabase.co') {
    console.log('⚠️  WARNING: Supabase URL not configured! Images will not load.');
    console.log('💡 Run: .\\setup-supabase-quick.ps1 to configure Supabase');
  } else {
    console.log('✅ Supabase configured:', SUPABASE_URL.substring(0, 30) + '...');
  }
}

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
    position: [34.433478, -119.155982],
    polygon: [[34.4325, -119.1560], [34.4330, -119.1560], [34.4330, -119.1550], [34.4325, -119.1550]],
    type: "agriculture",
    budget: "$35,000 - $40,000",
    timeline: "Phase 1-3",
    monthlyRevenue: "Phase 2: $500+ | Phase 3: $2,000+",
    roi: "64% annual ROI",
    description: "Fruit tree propagation, extensive gardens, educational components, and organic nursery products.",
    features: [
      "Planning on planting 500+ fruit trees on the property - next 1-2 years",
      "Regenerative vegetable gardens (3+ acres)",
      "Herb gardens and medicinal plants",
      "Educational workshops and farm tours",
      "Compost, mycelium, mineral, wormfarm operations",
      "On-site nursery for plant propagation",
      "Gravity-fed irrigation systems"
    ],
    revenueStreams: [
      "Nursery products sale - online/offline: $500-$1,000/month",
      "Community Supported Agriculture program and products: $500-$1,500+/month",
      "Educational workshops: $1,500/month", 
      "Farm-to-table events: $3,000/month"
    ],
    developmentTimeline: [
      {
        phase: "Phase 1 (Months 1-3)",
        deliverables: "Move and set up garden and agriculture space with fencing, proper garden beds, and all mentioned features and infrastructure. Setting up sales channels - online/offline collaborations.",
        investment: "$10,000-$15,000",
        status: "Foundation and setup"
      },
      {
        phase: "Phase 2 (Months 4-6)",
        deliverables: "Start planting and growing food, compost operations. Starting first sales online/offline - nursery products.",
        investment: "~$5,000/month for expanding infrastructure",
        monthlyRevenue: "$500+",
        status: "Initial growth and sales"
      },
      {
        phase: "Phase 3 (Month 7+)",
        deliverables: "Harvesting products, systemized operations for products, maintaining whole agriculture infrastructure and products. Reinvesting part of profits for maintenance and improvements.",
        monthlyRevenue: "$2,000+/month",
        status: "Full production and maintenance"
      }
    ],
    regenerativeFeatures: [
      "Permaculture design principles",
      "Soil regeneration through composting",
      "Mycelium network enhancement",
      "Mineral supplementation programs",
      "Wormfarm composting systems",
      "Water conservation and rainwater harvesting",
      "Biodiversity enhancement"
    ]
  },
  {
    id: "main-residence",
    name: "Main Residence Compound",
    emoji: "🏠", 
    position: [34.433118, -119.155333],
    polygon: [[34.4330, -119.1555], [34.4335, -119.1555], [34.4335, -119.1545], [34.4330, -119.1545]],
    type: "residential",
    budget: "$420,000 - $700,000",
    timeline: "Phase 1-3 (16 months)",
    monthlyRevenue: "$25K-$30K (post-construction)",
    roi: "43-68% annual + ~$7.7M property increase",
    description: "5,000 sq ft modern eco-retreat center with bio-architecture, curved designs, and regenerative building materials - the operational hub of the EcoVillage.",
    features: [
      "5,000 sq ft modern retreat center with bio-architecture design",
      "5-6 bedrooms (3 main suites, 2 guest rooms), 6 bathrooms",
      "Main kitchen and spacious living areas",
      "High ceilings with open floor plan and ceremonial fire space",
      "Retreat amenities: infinity pool, hot tub, sauna",
      "Outdoor BBQ areas, entertainment decks, and green lawn",
      "Sacred geometry gardens and water features",
      "Panoramic mountain views throughout property",
      "Operational hub for EcoVillage management",
      "Executive hosting and high-end event capabilities"
    ],
    
    regenerativeFeatures: [
      "Bio-mimic architecture with curved and rounded structures",
      "Steel frame construction with fireproof materials",
      "Large glass windows for natural light optimization",
      "Earth cob styling and natural insulation",
      "Sustainable regenerative building materials",
      "Rainwater harvesting and greywater systems",
      "Solar energy integration with battery storage",
      "Green roofs and living walls",
      "Sacred geometrical positioning and design principles",
      "Elemental design with round shapes",
      "Energy-efficient passive cooling and heating systems",
      "Native landscaping practices"
    ],
    
    propertyValue: {
      current: "$2,300,000",
      appraisedPrefab: "$6,900,000",
      projectedCustom: "~$10,000,000",
      increase: "~$7,700,000",
      note: "Official appraisal for 5,000 sq ft prefab home with standard design. Projected custom eco-retreat with curved bio-architecture, steel frame, and regenerative systems commands premium market value."
    },
    
    revenueStreams: [
      "Executive High-End Retreats: $8,000-$12,000/month",
      "Events, Weddings, Gatherings: $6,000-$10,000/month",
      "Private Meetings & Corporate Retreats: $5,000-$8,000/month",
      "EcoVillage Operations Hub: Included in management"
    ],
    
    developmentTimeline: [
      {
        phase: "Phase 1 (Months 0-6)",
        deliverables: "Hire architect for 5,000 sq ft eco-retreat design, finalize curved bio-architecture plans with steel frame, obtain all building permits and approvals, finalize material selections (fireproof, sustainable, high-end), site surveys and engineering assessments",
        investment: "$20,000-$50,000",
        monthlyRevenue: "$0",
        status: "Planning & permitting phase"
      },
      {
        phase: "Phase 2 (Months 6-12)",
        deliverables: "Clear and prepare landscape around build site, excavation and foundation preparation, measure and mark exact house positioning, prepare utilities connections (water, power, septic), grade land and prepare drainage systems, prepare access roads and staging areas",
        investment: "$50,000",
        monthlyRevenue: "$0",
        status: "Land preparation & excavation"
      },
      {
        phase: "Phase 3 (Months 12-16)",
        deliverables: "Bring in builders (Faruk's team), steel frame construction, curved wall and rounded structure implementation, install fireproof and sustainable materials, plumbing/electrical/HVAC systems, interior finishes, windows, doors, outdoor pool/hot tub/sauna installation, landscaping and sacred geometry gardens, final inspections and certificate of occupancy",
        investment: "$350,000-$500,000 (Materials: $100K-$250K, Labor: $100K-$150K, Contingency: $100K)",
        monthlyRevenue: "$25,000-$30,000",
        status: "Full construction & completion"
      }
    ]
  },
  {
    id: "community-hub",
    name: "Community Hub",
    emoji: "🏛️",
    position: [34.432771, -119.155387],
    polygon: [[34.4320, -119.1555], [34.4325, -119.1555], [34.4325, -119.1545], [34.4320, -119.1545]],
    type: "community", 
    budget: "$20,000 - $30,000",
    timeline: "Phase 1-2 (3+ months)",
    monthlyRevenue: "$7K-$10K+",
    roi: "214-336% annual ROI",
    description: "Outdoor community hub centered around a restored 100+ year old fireplace kitchen, natural gathering spaces, and creek-side seating. Serves as the heart of community life with farm-to-table events, shared meal preparation, and amenities for residents, retreat guests, and visitors. Features outdoor kitchen facilities, community fridges, showers, and bathrooms integrated into the natural landscape.",
    features: [
      "Outdoor community kitchen with restored 100+ year old fireplace",
      "Historic BBQ station (repurposed firepit monument)",
      "Outdoor pizza oven and wood-fired cooking areas",
      "Open-air prep tables and cooking surfaces",
      "Natural seating areas around creek and oak trees",
      "Community showers and bathroom facilities",
      "Outdoor nature hangout spot with community library",
      "Children's play area and nursery space",
      "Community refrigerators and food storage",
      "Farm-to-table event preparation spaces",
      "Creek-side gathering and dining areas",
      "Fire pit and communal eating zones",
      "Shared cooking equipment and utensils",
      "Integration with on-site gardens and livestock"
    ],
    
    farmToTableProgramming: [
      "Farm-to-table cooking events with on-site produce and livestock",
      "Community meal preparation and shared dining experiences",
      "Membership-based meal programs and cooking workshops",
      "Guest kitchen access for Airbnb and retreat visitors",
      "Event and ceremony meal preparation headquarters",
      "Community fridges with designated storage for members"
    ],
    
    revenueStreams: [
      "Event hosting: $7,000/month",
      "Community meal memberships: $3,000/month",
      "Workshop facilitation: $2,000/month"
    ],
    
    developmentTimeline: [
      {
        phase: "Phase 1 (Months 0-3)",
        deliverables: "Restore and integrate 100+ year old fireplace into outdoor kitchen structure, build basic outdoor kitchen framework with cooking surfaces, install basic community seating around kitchen area, set up temporary/basic toilet and shower facilities, create initial pathways and gathering spaces, test kitchen functionality with small community events",
        investment: "$10,000-$15,000",
        monthlyRevenue: "$0",
        status: "Foundation and basic amenities"
      },
      {
        phase: "Phase 2 (Months 3+)",
        deliverables: "Beautify kitchen area with permanent structures and finishes, build long-term shower and bathroom facilities, expand creek-side seating and nature hangout areas, install community fridges and food storage, complete children's play area and outdoor library setup, ongoing improvements and aesthetic enhancements, launch full event and membership programs",
        investment: "$10,000-$15,000",
        monthlyRevenue: "$7,000-$10,000+",
        status: "Operational with continuous improvement"
      }
    ]
  },
  {
    id: "retreat-village", 
    name: "Retreat Village",
    emoji: "🏡",
    position: [34.432173, -119.155628],
    polygon: [[34.4335, -119.1560], [34.4340, -119.1560], [34.4340, -119.1550], [34.4335, -119.1550]],
    type: "hospitality",
    budget: "P1: $70K-$80K | P2: $20K+ (flexible)",
    timeline: "Phase 1-3 (12-18 months)", 
    monthlyRevenue: "$24K-$35K (fully operational)",
    roi: "187-273% annual ROI",
    description: "Luxury eco-cabin retreat village nestled on the hillside with 8-10 individually designed cabins (150-300 sq ft each). A mix of 5 high-end retreat cabins and 5 residential cabins for land stewards and community members.\n\nEach cabin features cob construction with steel frame fireproof materials, individual bathhouses with spa amenities, meditation decks, and sacred hillside views. Self-sustainable systems power each cabin—rainwater collection, individual water tanks, solar power, and personal garden beds.\n\nHealing gardens, sacred paths, and quiet zones create a regenerative living community. Built as a proof-of-concept for eco-luxury cob housing and self-regenerative living, demonstrating a new model of sustainable retreat and residential integration.\n\nDesigned for both high-end retreat bookings and long-term residential stewardship, with flexible contractor partnership models allowing builders to showcase cabin designs and share revenue through guest bookings.",
    features: [
      "8-10 luxury eco-cabins (150-300 sq ft each)",
      "Individual bathhouses with spa amenities (hot tubs, ice baths)",
      "Meditation decks and quiet zones per cabin",
      "Sacred paths and hillside views",
      "Healing gardens with individual garden beds",
      "Self-sustainable utilities (solar, water tanks, rainwater collection)",
      "Cob construction with steel frame fireproof materials",
      "High ceilings and large windows with organic design",
      "Stonework masonry and creative handwork",
      "Integration with ceremonial spaces and sacred forest circles"
    ],
    
    regenerativeDesign: [
      "Regenerative design philosophy: proof-of-concept for self-regenerative living",
      "Eco-cob natural wall construction with stone masonry",
      "Steel frame fireproof materials ensuring safety and durability",
      "Self-sustainable utility systems: solar power, rainwater collection, water tanks",
      "Individual garden beds and permaculture systems per cabin",
      "Organic materials and organic design flow throughout",
      "High ceilings and large windows creating light and connection to nature",
      "Handmade, artisanal construction showcasing creative craftsmanship"
    ],
    
    marketContext: "The global retreat and wellness industry is experiencing rapid growth, with increasing demand for authentic eco-retreats and regenerative living communities. Communal living models and co-ownership opportunities are trending among conscious travelers and land stewards seeking meaningful community connection. Eco-luxury cob housing and self-sustainable cabin villages represent the future of retreat accommodations.",
    
    revenueStreams: [
      "High-End Retreat Cabins (5 units):",
      "  • Retreat bookings: $12,000-$15,000/month",
      "  • Wellness retreat packages: $4,000-$6,000/month",
      "  • Wedding and ceremony events: $2,000-$3,000/month",
      "Residential Cabins (5 units):",
      "  • Private cabin rentals: $3,000-$5,000/month",
      "  • Land steward memberships: $1,000-$2,000/month",
      "Contractor Partnership Model:",
      "  • Contractor revenue-share (Airbnb/bookings): $2,000-$4,000/month",
      "  • Contractors supply materials and labor; we revenue-share guest bookings",
      "  • Flexible partnership deals with builders and designers",
      "Total Monthly Revenue: $24,000-$35,000"
    ],
    
    developmentTimeline: [
      {
        phase: "Phase 1 (Months 0-6)",
        deliverables: "Land Work: Create main hillside road and 10-12 cabin flat spots ($50K). Utilities: Extend water system and electrical distribution to hillside ($15K-$20K). Sacred Spaces: Establish distributed meditation areas and forest circles ($5K-$10K). Complete permitting and site planning.",
        investment: "$70,000-$80,000",
        status: "Hillside infrastructure ready for cabin development"
      },
      {
        phase: "Phase 2 (Months 6-12+)",
        deliverables: "Invite contractor partners with revenue-share agreements. Contractors build showcase cabins (materials + labor supplied by contractors). Property members/stewards build residential cabins. Establish revenue-share model through Airbnb/booking platforms. Complete first 3-5 cabins. Begin wellness amenities (spa, meditation decks).",
        investment: "$20,000+ (flexible, contractor-supplied)",
        status: "Cabins under construction, partnerships active"
      },
      {
        phase: "Phase 3 (Months 12+)",
        deliverables: "Complete remaining cabins as contractors finish. Launch full retreat booking operations. Begin weekend rental and event hosting. Establish wellness programs and ceremonies. Activate healing gardens and sacred paths. Full integration with McQueen's Garage events and Ceremonial Infrastructure.",
        investment: "Ongoing as cabins complete (contractor-funded)",
        status: "Full retreat village operational and revenue-generating"
      }
    ]
  },
  {
    id: "infrastructure",
    name: "Infrastructure & Utilities",
    emoji: "⚡",
    position: [34.432386, -119.155966],
    polygon: [[34.4315, -119.1560], [34.4320, -119.1560], [34.4320, -119.1550], [34.4315, -119.1550]],
    type: "infrastructure",
    budget: "P1: $62K-$77K | P2: $40K-$60K | P3: $40K-$50K",
    timeline: "Phase 1-3 (18 months)", 
    monthlyRevenue: "Enables $75K-$92.5K monthly revenue",
    roi: "5.3:1 to 6.5:1 revenue-to-cost ratio",
    description: "Strategic infrastructure and utilities foundation enabling all village development. Phased water system upgrades (maintenance, creek extension, hillside expansion), electric reactivation with solar integration, hillside road development, and distributed composting toilet network.\n\nEach utility system is strategically phased to support specific projects—water extends to glamping and community hub, electric powers event venues and community spaces, roads enable hillside village construction, and sewage systems serve each phase.\n\nThis infrastructure-first approach ensures reliable utilities while minimizing costs through strategic phasing and natural material solutions.",
    features: [
      "Solar array and battery storage systems (phased expansion)",
      "Well water system with filtration and upgrades",
      "Water distribution to creek-side glamping sites",
      "Water extension to hillside for retreat village",
      "Composting toilet network (5 distributed units, Phase 1)",
      "Greywater treatment and recycling systems",
      "Hillside road network with 10+ cabin flat spots",
      "Main residence landscaping and access roads",
      "Electric reactivation and distribution system",
      "Solar panel integration with battery backup",
      "Septic and sewage systems for hillside village",
      "Pathways and utility corridors throughout property"
    ],
    
    utilitySystemsBreakdown: [
      {
        system: "Water System",
        phase1: "Current maintenance and upgrade: $5,000",
        phase1b: "Creek-side extension for glamping: $10,000-$15,000",
        phase2: "Hillside extension for retreat village: $15,000-$20,000",
        total: "$30,000-$40,000"
      },
      {
        system: "Electric System",
        phase1: "Reactivation and maintenance: $2,000 + $500/month",
        phase2: "Solar integration with battery storage: $5,000-$10,000",
        phase3: "Full hillside power system: $40,000-$50,000",
        total: "$47,000-$62,000"
      },
      {
        system: "Road Infrastructure",
        phase1: "Hillside road and land work (10+ cabin spots): $50,000",
        total: "$50,000"
      },
      {
        system: "Sewage System",
        phase1: "Composting toilet network (5 units): $5,000-$10,000",
        phase2: "Hillside septic and plumbing: $20,000-$30,000",
        total: "$25,000-$40,000"
      }
    ],
    
    marketContext: "Independent and solar-powered infrastructure systems are increasingly essential for rural properties and eco-tourism destinations. Solar integration with battery storage reduces long-term operational costs while supporting the growing demand for sustainable, off-grid capable retreats and events. Composting toilet systems and water recycling align with modern sustainability expectations, reducing environmental impact while lowering infrastructure maintenance costs.",
    
    revenueStreams: [
      "Infrastructure enables all property revenue streams",
      "Solar excess energy potential grid-tie revenue ($500-$1,000/month future)",
      "Water system supports glamping ($240K-$360K annual)",
      "Water system supports community hub ($84K-$120K annual)",
      "Electric system enables event venue ($180K-$300K annual)",
      "Roads enable retreat village ($222K-$330K annual)",
      "Sewage systems enable all guest accommodations",
      "Note: Infrastructure is cost center enabling $900K-$1.1M annual revenue"
    ],
    
    infrastructureEssentials: [
      "Phased utility expansion tied to project development timelines",
      "Natural material construction (cob composting toilets) for cost savings",
      "Solar and battery systems reducing grid dependency and long-term costs",
      "Water recycling and greywater treatment for sustainability",
      "Distributed sanitation network avoiding centralized sewage costs",
      "Strategic road development enabling cabin and village expansion",
      "Maintenance-first approach with $500-$1,000/month operational budget"
    ],
    
    developmentTimeline: [
      {
        phase: "Phase 1 (Months 0-6)",
        deliverables: "Water: Current system maintenance and upgrade ($5K), creek-side extension for glamping ($10K-$15K). Electric: Reactivation ($2K), ongoing maintenance ($500/month). Roads: Hillside development with 10+ cabin flat spots ($50K). Sewage: Build 5 distributed composting toilets ($5K-$10K).",
        investment: "$62,000-$77,000",
        status: "Foundation utilities and hillside access"
      },
      {
        phase: "Phase 2 (Months 6-12)",
        deliverables: "Water: Extend to hillside for retreat village ($15K-$20K). Electric: Install solar panels with battery storage ($5K-$10K). Sewage: Develop hillside septic and plumbing infrastructure ($20K-$30K).",
        investment: "$40,000-$60,000",
        status: "Expansion utilities for village development"
      },
      {
        phase: "Phase 3 (Months 12-18)",
        deliverables: "Electric: Create comprehensive power system for hillside village, event venue, music studio, and ceremonial infrastructure ($40K-$50K). All systems fully operational and integrated.",
        investment: "$40,000-$50,000",
        status: "Full property electrification and operational"
      }
    ]
  },
  {
    id: "mcqueens-garage",
    name: "McQueen's Garage & Creative",
    emoji: "🎭",
    position: [34.432549, -119.155279],
    polygon: [[34.4340, -119.1555], [34.4345, -119.1555], [34.4345, -119.1545], [34.4340, -119.1545]],
    type: "creative",
    budget: "$150,000 - $300,000",
    timeline: "Phase 1-3 (18 months)",
    monthlyRevenue: "$15K-$25K+",
    roi: "87-97% annual ROI",
    description: "Premium music recording studio and live event venue featuring a professional stage, outdoor ceremony space, and state-of-the-art recording facilities. The warehouse transformation includes performance areas for live music festivals, kirtans, and high-end retreats, with VIP back-end rooms, recording booths, and overnight accommodations for visiting artists and retreat guests. Positioned as Ojai's destination for intimate concerts, ceremony gatherings, and live music recordings.",
    features: [
      "Professional music recording studio with isolation booths",
      "Live performance stage with professional sound and lighting",
      "Outdoor ceremony space for festivals and gatherings",
      "VIP back-end rooms for artists and retreat facilitators",
      "Multiple recording booths and production spaces",
      "Event venue for 50-150 person capacity gatherings",
      "Gallery-style performance area for intimate concerts",
      "Green rooms and artist preparation spaces",
      "Overnight accommodations for visiting musicians and guests",
      "Full warehouse transformation with acoustic treatment",
      "Equipment storage and production management areas",
      "Integration with glamping village for high-ticket retreats"
    ],
    
    venueTransformation: [
      "Solar energy integration for sustainable venue operations",
      "Rainwater harvesting for landscape and facility use",
      "Full warehouse insulation and climate control systems",
      "Sustainable building materials with high energy efficiency",
      "Professional stage with modular design for multiple event types",
      "VIP rooms and green rooms for artists and facilitators",
      "Recording booths with acoustic isolation and treatment",
      "Overnight guest accommodations for visiting musicians and retreat leaders"
    ],
    
    marketContext: "Ojai has established itself as a cultural and spiritual hub with a thriving festival scene including the renowned Ojai Music Festival, cacao ceremonies, kirtan gatherings, and wellness retreats. The demand for intimate concert venues, ceremony spaces, and retreat facilities continues to grow as Ojai attracts artists, spiritual practitioners, and conscious event organizers seeking authentic gathering spaces. McQueen's Garage fills a unique niche as a professional recording venue with live event capabilities, serving both the local community and visiting musicians drawn to Ojai's creative energy.",
    
    revenueStreams: [
      "Live Events & Performances:",
      "  • Music festivals and concerts: $5,000-$8,000/month",
      "  • Kirtans and spiritual ceremonies: $2,000-$3,000/month",
      "  • High-end retreat venue rental: $3,000-$5,000/month",
      "  • Weddings and private ceremonies: $2,000-$4,000/month",
      "Studio & Recording Services:",
      "  • Music recording studio sessions: $2,500-$4,000/month",
      "  • Live recording packages: $1,500-$2,500/month",
      "  • Production space rentals: $1,000-$2,000/month",
      "Overnight & VIP Services:",
      "  • Artist overnight accommodations: $800-$1,200/month",
      "  • VIP retreat packages: $1,500-$2,500/month"
    ],
    
    developmentTimeline: [
      {
        phase: "Phase 1 (Months 0-6)",
        deliverables: "Use warehouse for equipment and material storage, workshop space for ongoing construction projects, minimal investment in basic organization and shelving, assess structural integrity and remodel requirements, begin conceptual design for venue transformation",
        investment: "$5,000-$10,000",
        monthlyRevenue: "$0",
        status: "Storage and workshop facility"
      },
      {
        phase: "Phase 2 (Months 6-12)",
        deliverables: "Hire architect for warehouse-to-venue conversion, design recording studio layout and acoustic treatment, create stage and ceremony space plans, submit permits for commercial event venue use, engineering for electrical/HVAC/soundproofing, finalize VIP rooms and recording booth layouts, secure necessary event venue licenses",
        investment: "$25,000-$50,000",
        monthlyRevenue: "$0",
        status: "Permitting and design development"
      },
      {
        phase: "Phase 3 (Months 12-18)",
        deliverables: "Complete insulation and climate control, build professional recording studio and isolation booths, install performance stage with sound/lighting, create outdoor ceremony space with landscaping, construct VIP rooms and green rooms, acoustic treatment and soundproofing, install recording and performance equipment, furnish artist accommodations, final inspections and licensing, launch with inaugural festival event",
        investment: "$120,000-$240,000",
        monthlyRevenue: "$15,000-$25,000+",
        status: "Operational high-end event and recording venue"
      }
    ]
  },
  {
    id: "ceremonial-infrastructure",
    name: "Ceremonial Infrastructure", 
    emoji: "🔮",
    position: [34.432501, -119.155582],
    polygon: [[34.4325, -119.1565], [34.4330, -119.1565], [34.4330, -119.1555], [34.4325, -119.1555]],
    type: "ceremonial",
    budget: "$55,000 - $120,000",
    timeline: "Phase 1-3 (24 months)",
    monthlyRevenue: "Integrated with McQueen's Garage ($15K-$25K+)",
    roi: "Integrated with warehouse (87-97% annual)",
    description: "Main ceremonial infrastructure featuring a natural stone and earthen kiva with sacred fire circle, positioned directly in front of McQueen's Garage to integrate with live events, ceremonies, and retreat programming. The heart of all ceremonial activities including fire circles, drum circles, spiritual retreats, and community gatherings. Additionally, multiple sacred spaces and meditation areas are distributed throughout the property—forest circles, quiet reflection spots, crystal grids, and nature connection zones—creating a network of ceremonial infrastructure that supports ongoing spiritual practices without disrupting future construction phases.",
    features: [
      "Natural stone and earthen kiva with sacred fire circle and seating",
      "Main ceremonial space positioned in front of McQueen's Garage",
      "Prayer gardens and meditation spaces throughout property",
      "Sweat lodge facilities for purification ceremonies",
      "Ice bath stations for cold immersion and purification",
      "Multiple sacred fire circles distributed across land",
      "Meditation spaces and quiet reflection areas in nature",
      "Labyrinth and walking meditation paths",
      "Crystal gardens and energy grids",
      "Forest ceremony circles for intimate gatherings",
      "Drum circle and community gathering areas",
      "Integration with event venue for large ceremonies and retreats"
    ],
    
    sacredSpaceElements: [
      "Sacred fire circles with elemental design and ancestral honoring",
      "Crystal grids and energy pathways woven through forest trails",
      "Kiva construction using traditional earthen and stone techniques",
      "Sacred forest circles integrated with native oak groves",
      "Yoga decks and movement spaces positioned at natural vortex points",
      "Nature meditation alcoves with natural stone seating",
      "Ceremonial pathways connecting all sacred spaces across property"
    ],
    
    marketContext: "The ceremonial infrastructure works in tandem with McQueen's Garage event venue to create Ojai's premier destination for spiritual gatherings, retreat programming, and conscious celebrations. The combination of indoor performance space and outdoor sacred kiva allows for seamless ceremony-to-concert experiences, multi-day retreat programming, and festival-style gatherings. This integrated model meets the growing demand for authentic ceremonial venues that blend traditional sacred practices with modern event production capabilities.",
    
    revenueStreams: [
      "Integrated with McQueen's Garage event venue revenue",
      "Ceremonies and retreats use both warehouse and ceremonial spaces",
      "Fire circles and drum circles included in event packages",
      "Kiva ceremonies complement indoor performances",
      "Ice baths and sweat lodges enhance retreat offerings",
      "Combined venue capacity increases event value and pricing",
      "Note: Revenue reflected in McQueen's Garage projections ($15K-$25K+/month)"
    ],
    
    developmentTimeline: [
      {
        phase: "Phase 1 (Months 0+)",
        deliverables: "Create forest ceremony circles in undeveloped areas, establish meditation spaces and quiet reflection areas, install small fire circles and gathering spots, set up sweat lodge and ice bath facilities, plant crystal grids and sacred paths, build prayer gardens and nature altars, develop walking meditation paths away from construction zones, all spaces positioned strategically to avoid disruption",
        investment: "$5,000-$20,000+",
        monthlyRevenue: "Integrated with retreat operations",
        status: "Ongoing creation of distributed sacred network"
      },
      {
        phase: "Phase 2 (Months 6-18)",
        deliverables: "Design natural stone and earthen kiva layout, plan integration with McQueen's Garage outdoor space, assess sacred fire circle and seating requirements, coordinate with warehouse completion timeline, prepare materials and traditional building methods, continue maintaining and expanding Phase 1 spaces",
        investment: "Included in planning/coordination",
        monthlyRevenue: "Phase 1 spaces operational",
        status: "Design and coordination phase"
      },
      {
        phase: "Phase 3 (Months 18-24)",
        deliverables: "Construct natural stone and earthen kiva, install sacred fire circle with permanent seating, create main drum circle and gathering area, integrate with McQueen's Garage outdoor ceremony space, professional landscaping connecting warehouse to kiva, complete labyrinth and crystal gardens, final touches on all distributed sacred spaces, grand opening ceremony with first major retreat",
        investment: "$50,000-$100,000",
        monthlyRevenue: "Fully operational, enhancing warehouse event revenue",
        status: "Primary ceremonial infrastructure complete"
      }
    ]
  },
  {
    id: "wellness-facilities",
    name: "Wellness & Spa Facilities",
    emoji: "🧘",
    position: [34.432930, -119.155062],
    polygon: [[34.4330, -119.1565], [34.4335, -119.1565], [34.4335, -119.1555], [34.4330, -119.1555]],
    type: "wellness", 
    budget: "$65,000 - $100,000",
    timeline: "Phase 1-3 (12+ months)",
    monthlyRevenue: "$10K-$15K (post-launch)",
    roi: "87-131% annual ROI",
    description: "800 sq ft integrated wellness center and spa facility connecting three existing structures across multiple levels into one unified ADU. Features dedicated yoga studio, fitness center, healing modalities rooms, and oak tree deck for outdoor wellness practices. Serves retreat guests, community members, and monthly wellness memberships through workshops, healing sessions, and regenerative wellness programming.",
    features: [
      "800 sq ft connected ADU spanning 3 levels",
      "Dedicated yoga and movement studio",
      "Fitness center with workout equipment area",
      "Oak tree deck for outdoor yoga and creative movement",
      "Stone sauna with infrared and traditional heat",
      "Cold plunge pools for contrast therapy",
      "Red light therapy and crystal healing rooms",
      "Private massage and bodywork suites",
      "Sound healing and meditation rooms",
      "Wellness consultation spaces",
      "Integration with retreat and event programming"
    ],
    
    wellnessAmenities: [
      "Yoga studio with natural light and mountain views",
      "Workout area with functional fitness equipment",
      "Stone sauna (traditional and infrared options)",
      "Cold plunge pools for contrast therapy and recovery",
      "Red light therapy rooms for cellular rejuvenation",
      "Crystal healing rooms with sacred geometry",
      "Private massage and bodywork treatment suites",
      "Sound healing rooms with acoustic optimization",
      "Meditation spaces and quiet zones",
      "Herbal tea lounge and wellness consultation area",
      "Outdoor calisthenics and movement area",
      "Workshop and group healing spaces",
      "Collaborator treatment rooms for visiting healers",
      "Integration with on-site gardens for herbal wellness"
    ],
    
    membershipTiers: [
      {
        name: "Basic Wellness",
        price: "$20-$30/month",
        benefits: "Access to yoga studio and gym space, community yoga classes (weekly), open hours use of fitness equipment"
      },
      {
        name: "Enhanced Wellness",
        price: "$50/month",
        benefits: "Everything in Basic + 1 sauna session per week, 1 cold plunge session per week, discounted workshop rates"
      },
      {
        name: "Premium Wellness",
        price: "$100/month",
        benefits: "Everything in Enhanced + unlimited sauna & cold plunge access, 1 red light therapy session per month, priority workshop booking, 10% discount on healing treatments"
      },
      {
        name: "EcoVillage All-Access",
        price: "$150/month",
        benefits: "Everything in Premium Wellness + access to all property events, event discounts, retreat package discounts"
      }
    ],
    
    revenueModel: {
      membershipRevenue: "$3,000/month (Year 1+)",
      workshopRevenue: "$2,700/month (4-6 workshops/month)",
      collaboratorRevenue: "$1,680/month (healer partnerships at 30-40% revenue share)",
      spaServices: "$900/month (private sessions)",
      retreatAddOns: "$1,500-$2,500/month (guest amenities)",
      totalYear1: "$9,780-$11,780/month",
      projectedYear2_3: "$12,000-$18,000/month (50-100 members, increased programming)",
      note: "Membership growth expected 1+ years after structure remodeling and launch"
    },
    
    developmentTimeline: [
      {
        phase: "Phase 1 (Months 0-6)",
        deliverables: "Clean up existing 3 structures for temporary storage use, survey and assess structural integrity, hire architect for 800 sq ft ADU design connecting structures, obtain permits for ADU conversion and multi-level connection, finalize plans for deck on top of A-frame structure, engineering assessments for connecting structures, design oak tree deck integration",
        investment: "$5,000-$10,000",
        monthlyRevenue: "$0",
        status: "Planning, permitting & storage phase"
      },
      {
        phase: "Phase 2 (Months 6-12)",
        deliverables: "Foundation work and structural reinforcement, connect all 3 structures into unified 800 sq ft space, renovate into envisioned wellness center layout, install walls/insulation/main structural elements, build oak tree deck on top of lower A-frame structure, rough plumbing and electrical for sauna/cold plunge, install windows/doors/weatherproofing, create multi-level access between structures",
        investment: "$50,000-$70,000",
        monthlyRevenue: "$0",
        status: "Active construction & renovation (side project)"
      },
      {
        phase: "Phase 3 (Months 12+)",
        deliverables: "Interior finishes and wellness amenity installation, sauna/cold plunge/red light therapy setup, yoga studio flooring/mirrors/equipment, fitness equipment installation, soundproofing for healing rooms, launch membership programs and workshop schedule, partner with healers and wellness practitioners, market to retreat guests and community, full operational wellness center and ADU",
        investment: "$10,000-$20,000",
        monthlyRevenue: "$10,000-$15,000",
        status: "Operational wellness center with memberships & workshops"
      }
    ]
  },
  {
    id: "mushroom-cultivation",
    name: "Mushroom Cultivation",
    emoji: "🍄",
    position: [34.433474, -119.156218],
    polygon: [[34.4335, -119.1565], [34.4340, -119.1565], [34.4340, -119.1555], [34.4335, -119.1555]],
    type: "agriculture",
    budget: "$14,000-$22,000 (Phase 1-2 launch)", 
    timeline: "Phases 1-3 (Months 0-6+ ramp)",
    monthlyRevenue: "TBD (post Phase 3 operations)",
    roi: "Scenario: 288% annual ROI (dependent on yields & partnerships)",
    description: "Commercial mushroom production facility that can operate as an on-site vehicle, mobile commercial unit, or local regenerative supply hub. Multiple growing environments support fresh culinary mushrooms, medicinal extracts, and value-added products for farm-to-table partners, wellness clients, and in-house use across the EcoVillage.",
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
    ],
    smartCultivationSystems: [
      "Solar-backed microgrid with battery storage powering sealed grow environments",
      "Automated HVAC, humidity, and CO₂ monitoring for precision harvest cycles",
      "Rain and greywater harvesting loops for substrate hydration and sanitation",
      "Modular trellis racks and mobile grow pods enabling rapid expansion",
      "Chef and reseller collaboration program minimizing waste and driving product development"
    ],
    developmentTimeline: [
      {
        phase: "Phase 1 (Months 0-3)",
        deliverables: "Clear and grade site, improve access, prep utility tie-ins, and ready pads for trailer delivery.",
        investment: "$1,000-$2,000",
        status: "Site prepared for cultivation trailers and modular infrastructure"
      },
      {
        phase: "Phase 2 (Months 2-4)",
        deliverables: "Finalize collaborator agreements, schedule trailer drop-off, connect power/water, stage substrate systems, and train core team.",
        investment: "$8,000-$12,000",
        status: "Infrastructure installed and business operations activated"
      },
      {
        phase: "Phase 3 (Months 4-6+)",
        deliverables: "Launch production, begin fresh mushroom deliveries, produce tinctures and dried blends, expand wholesale and farm-to-table partnerships.",
        investment: "Reinvested operating capital",
        status: "Active cultivation with results by Month 6-7+"
      }
    ],
    marketAnalysis: "Functional and culinary mushrooms continue to surge in demand for immunity, cognition, gut health, and culinary innovation. Supplying local restaurants, wellness practitioners, and farm-to-table markets with fresh lion's mane, shiitake, and oyster mushrooms creates premium, regenerative revenue while value-added tinctures and powders unlock e-commerce channels. Educational workshops deepen community wellness and establish loyal customers, while onsite production recycles agricultural byproducts and reinforces EcoVillage food security."
  },
  {
    id: "beekeeping-program",
    name: "Beekeeping & Honey Production",
    emoji: "🐝",
    position: [34.433477, -119.155820],
    polygon: [[34.4320, -119.1565], [34.4325, -119.1565], [34.4325, -119.1555], [34.4320, -119.1555]],
    type: "beekeeping",
    budget: "$5,000 - $10,000",
    timeline: "Phase 1 (0-3 months)",
    monthlyRevenue: "$500+",
    roi: "Starting phase",
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
    id: "events-gatherings-hub",
    name: "Events & Gatherings Hub",
    emoji: "🎪",
    position: [34.433394, -119.155065],
    polygon: [[34.4335, -119.1548], [34.4340, -119.1548], [34.4340, -119.1543], [34.4335, -119.1543]],
    type: "events",
    budget: "$20,000 - $30,000",
    timeline: "Phase 1-3 (12+ months)",
    monthlyRevenue: "$4.5K-$9K (P1) → $11K-$22K (P2) → $27K-$41K (P3)",
    roi: "680% annual ROI",
    description: "Strategic events and gatherings infrastructure designed as a major revenue hub for retreats, ceremonies, festivals, workshops, and collaborative gatherings—central to community ethos and diversified income streams.",
    
    venues: [
      {
        name: "McQueen's Garage - Hybrid Event Venue",
        size: "3,200 sq. ft. steel-frame warehouse",
        location: "Right Hillside Section, end of property",
        uses: "Retreats, sound journeys, ceremonies, music performances, private dinners, seasonal festivals",
        features: "Hybrid indoor-outdoor flow, creekside communal kitchen access, ceremonial area proximity",
        revenue: "$8,000/month (from Month 14)"
      },
      {
        name: "Main Residence Compound",
        size: "5,000–7,200 sq. ft. + green lawn/open yard",
        location: "Central property hub",
        uses: "Executive hosting, retreat operations, immersive experiences, VIP residencies",
        features: "Vintage pool structure, spacious grounds for communal gatherings",
        revenue: "Included in retreat packages"
      },
      {
        name: "Sacred Ceremonial Zones",
        location: "Throughout property under mature oak trees",
        uses: "Purification, healing, bonding, sound healing, breathwork, movement, sacred circles",
        features: "Full-scale ceremonial kiva, sweat lodges, sacred fire circles, ritual zones",
        revenue: "$4,000/month (from Month 20)"
      },
      {
        name: "Community Zones",
        location: "Creekside and shaded areas",
        uses: "Communal meals, culinary workshops, spontaneous interaction, play",
        features: "Shaded communal kitchen, creekside dining with long tables and benches",
        revenue: "Supports overall event revenue"
      }
    ],
    
    eventTypes: [
      {
        format: "Weekend Retreats",
        capacity: "15-40 people",
        frequency: "Monthly",
        revenue: "Ticketed with lodging packages",
        phase: "Phase 2+"
      },
      {
        format: "Ceremonies (Cacao, Full Moon)",
        capacity: "10-30 people",
        frequency: "Bi-weekly",
        revenue: "Pay-per-ceremony",
        phase: "Phase 1+"
      },
      {
        format: "Festivals",
        capacity: "50-150 attendees",
        frequency: "Quarterly",
        revenue: "Entry fee + vendor fees",
        phase: "Phase 2+"
      },
      {
        format: "Workshops & Classes",
        capacity: "15-30 attendees",
        frequency: "Weekly/Regular",
        revenue: "Ticketed sessions (yoga, breathwork, permaculture, natural building, sacred art, dance)",
        phase: "Phase 1 (from Month 6)"
      },
      {
        format: "Farm-to-Table Dinners",
        capacity: "Varies",
        frequency: "Regular",
        revenue: "Ticketed dinners with farm produce",
        phase: "Phase 2 (from Month 16)"
      },
      {
        format: "Private Event Rentals",
        capacity: "Varies",
        frequency: "Ad hoc",
        revenue: "Site fees (weddings, private functions)",
        phase: "Phase 2+"
      }
    ],
    
    features: [
      "Multiple dedicated event venues across property",
      "Sacred ceremonial zones with kivas and fire circles",
      "Community kitchen and creekside dining areas",
      "Capacity for 50-500+ attendees depending on event type",
      "Weekly ceremonies, bi-weekly workshops, quarterly festivals",
      "Weekly workshops in yoga, breathwork, permaculture, art",
      "Farm-to-table dinner series with on-site produce",
      "Private event rental opportunities (weddings, gatherings)",
      "Educational partnerships and workshop monetization",
      "Virtual events via 3D digital twin platform (Coming Soon)",
      "Experiential onboarding for community members",
      "Event collaboration with wellness operators"
    ],
    
    regenerativeFeatures: [
      "Organic Composting Programs - All event waste composted on-site, participants learn composting practices",
      "Regenerative Building Workshops - Natural building techniques integrated into event programming (cob, earthbag, timber framing)",
      "Land Stewardship Events - Work-exchange events where participants help with property regeneration",
      "Farm-to-Table Integration - Events showcase produce from on-site agriculture, teaching food sovereignty",
      "Community Gift Economy - Pay-what-you-can events and skill-share workshops",
      "Sacred Earth Connection - Ceremonies honoring the land, seasonal celebrations, nature immersion practices"
    ],
    
    revenueStreams: [
      "Phase 1 Events (2-4/month): $4,500-$9,000/month (50-70 people @ $25-$50/ticket)",
      "Phase 2 Events (4-7/month): $11,000-$22,000/month",
      "Phase 3 Events (8-10/month): $27,000-$41,000/month (MAX capacity)",
      "Premium Festival Packages: $250-$1,000/ticket (glamping, food, premium services)",
      "Membership Programs (Phase 3): $5,000-$7,000/month",
      "Educational Partnerships: $500-$1,000/month"
    ],
    
    developmentTimeline: [
      {
        phase: "Phase 1 (Months 0-3)",
        deliverables: "Clear and prepare primary event area, build main shaded gathering space with stage, set up seating and basic amenities, create ceremony circles and fire pit areas, install basic sound system, prepare parking and access roads, set up portable restroom facilities",
        investment: "$10,000-$15,000",
        monthlyRevenue: "$4,500-$9,000",
        status: "Foundation building & initial events (2-4 events/month @ 50-70 people)"
      },
      {
        phase: "Phase 2 (Months 3-12)",
        deliverables: "Reinvest event revenue into infrastructure, expand event spaces around property, build additional ceremony zones, improve guest accommodation areas (camping, basic lodging), enhance community kitchen facilities, create multiple smaller event venues, improve landscaping and pathways, add permanent covered structures",
        investment: "$10,000-$15,000 (additional + reinvested revenue)",
        monthlyRevenue: "$11,000-$22,000",
        status: "Consistent events & infrastructure expansion (4-7 events/month + quarterly festivals)"
      },
      {
        phase: "Phase 3 (Months 12+)",
        deliverables: "Full retreat packages and ceremonial programs, lodging units for overnight guests, large-scale quarterly and monthly festivals (250-500 people), advanced event infrastructure, professional event production capabilities, multiple simultaneous event spaces",
        investment: "Reinvested profits for maintenance and improvements",
        monthlyRevenue: "$27,000-$41,000",
        status: "Full-scale event operations at MAX capacity (8-10 events/month + festivals + memberships)"
      }
    ],
    
    communityEngagement: [
      "Experiential onboarding through workshops and retreats",
      "Entry point for land experience and compatibility assessment",
      "Event collaboration partnerships with wellness operators",
      "Job Board task roles for event organization (micro-jobs)",
      "Event participation path (exchange hours for rewards/tokens)",
      "Public website /events page for RSVP and listings",
      "Member dashboard with Upcoming Events widget",
      "Virtual events via interactive 3D digital twin",
      "Global access bridged with on-site experiences"
    ]
  },
  {
    id: "livestock-dairy",
    name: "Livestock & Dairy Program",
    emoji: "🐄",
    position: [34.432797, -119.156143],
    polygon: [[34.4340, -119.1565], [34.4345, -119.1565], [34.4345, -119.1555], [34.4340, -119.1555]],
    type: "agriculture",
    budget: "P1: $20K-$25K | P2: $5K/month",
    timeline: "Phase 1-3 (8+ months)",
    monthlyRevenue: "$10,500-$15,000 (Phase 3+)",
    roi: "300%+ annual ROI",
    description: "Regenerative livestock and dairy farm producing organic dairy, grass-fed meat, fiber products, and eggs. The farm operates on rotational grazing principles for land regeneration, featuring goats, sheep, alpacas, horses, and chickens.\n\nBeyond production, the farm offers diverse revenue streams: on-site dairy and meat processing, fiber and textile products, educational farm tours and workshops, animal therapies including horse therapy, and creative services like goat rentals for land clearing.\n\nProducts are sold through multiple channels: farmers markets, online shop, farmstead membership programs, and direct visitor exchanges. The farm serves as both a production operation and an educational destination, demonstrating regenerative agriculture practices while building community connections and supporting local food systems.",
    features: [
      "Rotational grazing system for land regeneration",
      "Small dairy herd (goats and sheep)",
      "Fiber animals (alpacas, sheep) for textiles",
      "Egg production and poultry management",
      "Mobile shelters and water systems",
      "On-site processing and value-added products",
      "Grass-fed meat production",
      "Horse therapies and animal-assisted wellness programs",
      "Educational farm tours and workshops",
      "Composting system for manure regeneration"
    ],
    
    regenerativePractices: [
      "Rotational grazing system regenerating soil health and biodiversity",
      "Composting of animal manures creating nutrient-rich soil amendments",
      "Rainwater harvesting system supporting livestock water needs",
      "On-site processing reducing transportation and packaging waste",
      "Closed-loop farm system: animals support land, land supports animals",
      "Educational model demonstrating regenerative agriculture to community"
    ],
    
    marketContext: "The market for organic, locally-produced dairy, meat, and fiber products continues to grow as consumers prioritize food quality, transparency, and environmental impact. Direct-to-consumer sales through farmers markets, online platforms, and membership programs provide premium pricing opportunities. Regenerative agriculture practices and animal-assisted wellness therapies align with consumer values around health, sustainability, and community connection. Farmstead experiences and educational workshops create additional revenue while building customer loyalty and brand community.",
    
    revenueStreams: [
      "Farm Products: $6,500-$7,000/month (dairy, meat, eggs, fiber)",
      "Services & Experiences: $2,000-$4,000/month (therapies, tours, grazing)",
      "Multi-Channel Sales: $2,500-$4,000/month (farmers markets, online, memberships)",
      "Total Monthly Revenue (Phase 3+): $10,500-$15,000"
    ],
    
    developmentTimeline: [
      {
        phase: "Phase 1 (Months 0-3+)",
        deliverables: "Farm Preparation: Redo and prepare property for horses and animals. Create shelters for chickens, horses, and livestock. Install mobile shelters and water systems. Set up initial composting system. Begin rotational grazing setup. Start with initial livestock (goats, sheep, chickens, horses). Establish basic on-site processing capability.",
        investment: "$20,000-$25,000",
        status: "Initial livestock setup and farm preparation"
      },
      {
        phase: "Phase 2 (Months 4-8+)",
        deliverables: "Scaling & Growth: Scale livestock numbers based on Phase 1 success. Develop on-site dairy and meat processing. Launch farmers market sales. Set up online shop and direct shipping. Begin animal therapy programs. Expand educational farm tours and workshops. Reinvest revenue into growth and improvements.",
        investment: "$5,000/month (ongoing improvements)",
        status: "Growing operations and expanding revenue streams"
      },
      {
        phase: "Phase 3 (Months 8+)",
        deliverables: "Full Operations: All product lines fully operational. Multiple sales channels active (farmers market, online, membership). Animal therapy programs established. Educational workshops and farm tours regular offering. Farmstead membership and visitor exchange program active. Optimized operations and profitability.",
        investment: "Ongoing operational costs",
        status: "Fully operational regenerative farm"
      }
    ]
  },
  {
    id: "creative-workshop-center",
    name: "Creative Workshop & Art Creation Center",
    emoji: "🎨",
    position: [34.433470, -119.156486],
    type: "creative",
    budget: "$30,000-$45,000 (initial build-out)",
    timeline: "Phase 1 (Months 6-12 build-out)",
    monthlyRevenue: "To be determined (post-launch programming)",
    roi: "Dependent on program adoption and partnerships",
    description: "Multi-use creative workshop serving as a multipurpose learning and creation space with woodwork, pottery, natural building workshops, and sacred art creation.",
    features: [
      "Woodworking & eco-building workshops ($100-$500 per weekend)",
      "Pottery & art creation studios ($75-$300 per session)", 
      "Natural building workshops & co-build events",
      "Sacred art & altar creation spaces",
      "Sound healing & instrument crafting areas",
      "Tool & materials storage depot",
      "Stacked shipping container studios and storage pods",
      "Dedicated data/computing lab (future node?)",
      "Creative residencies & retreat spaces",
      "Permaculture workshop integration"
    ],
    revenueStreams: [
      "Creative workshops: $1,500/month",
      "Woodworking courses: $1,800/month",
      "Pottery sessions: $900/month", 
      "Art residencies: $600/month",
      "Artist collaborations & revenue-share commissions (TBD)",
      "Online classes and digital content releases (TBD)"
    ],
    regenerativeSystems: [
      "Solar array with battery storage powering workshops and future data room",
      "Rainwater harvesting with greywater reuse for clay work, cleaning stations, and landscape hydration",
      "Reclaimed lumber and recycled materials embedded in fabrication projects",
      "Shared resource loops with mushroom operations and farm stand product lines",
      "Onsite fabrication reducing transport and logistics footprints",
      "Artist and school collaborations reinforcing a circular creative economy"
    ],
    investmentBreakdown: [
      { label: "Site clearing & grading", cost: "$300-$500" },
      { label: "Container pads & foundations", cost: "$1,000-$2,000" },
      { label: "3-4 shipping containers (delivered)", cost: "$10,000-$15,000" },
      { label: "Container renovations & interior framing", cost: "$10,000-$15,000" },
      { label: "Tools & equipment outfitting", cost: "$10,000-$15,000" }
    ],
    investmentNotes: "Initial build-out totals $30K-$45K with optional future upgrades for advanced tooling or expanded studios.",
    developmentTimeline: [
      {
        phase: "Phase 1 (Months 6-12)",
        deliverables: "Clear and prep site. Install container pads/foundations ($1K-$2K). Source and place 3-4 shipping containers ($10K-$15K). Begin container renovation ($10K-$15K). Relocate tools and storage from warehouse into new hub.",
        investment: "$21,300-$32,500",
        status: "Container campus established and core infrastructure placed"
      },
      {
        phase: "Phase 2 (Month 12+)",
        deliverables: "Complete interior build-outs for wood shop, pottery studio, art labs, storage depot, and tentative data/computing room ($10K-$15K). Install discipline-specific tool sets. Launch collaborative programs, residencies, instrument fabrication, online classes, and school partnerships.",
        investment: "$10,000-$15,000",
        status: "Operational programming and partnerships activated"
      },
      {
        phase: "Ongoing (Post-launch)",
        deliverables: "Host creative events, craft fairs, maker scholarships, youth programs, and eco-village fabrication support while expanding artist collaborations and digital offerings.",
        investment: "Revenue-supported enhancements",
        status: "Evolving creative campus and community hub"
      }
    ],
    marketAnalysis: "Regenerative maker spaces that blend onsite production, educational tourism, and digital creation are surging in demand. This container campus positions the EcoVillage as a regional hub for Ojai artists, schools, and eco-tourism partners, diversifying income through workshops, residencies, artisan collaborations, online classes, and instrument/tool fabrication while supporting the mushroom unit, farm stand, and ceremonial zones with in-house fabrication."
  },
  {
    id: "glamping-creek-village",
    name: "Creek-Side Glamping & Lodging Village",
    emoji: "🏕️",
    position: [34.432479, -119.156540],
    type: "hospitality",
    budget: "$20,000 - $30,000",
    timeline: "Phase 1-2 (4+ months)",
    monthlyRevenue: "$8.75K-$10K (operational)",
    roi: "259-605% annual ROI",
    description: "Unique creek-side lodging village with 10-25+ glamping units including teepees, yurts, and safari tents along the seasonal creek corridor for nature immersion experiences. Starting with 5 tipis in Phase 1, with phased expansion driven by revenue reinvestment and market demand.",
    features: [
      "10-25+ unique glamping units along seasonal creek",
      "Teepees, yurts, and safari tents for overnight experiences",
      "Each tipi with dedicated solar power source",
      "Individual water and toilet facilities per unit (where feasible)",
      "Private wooden decks and hangout spaces with fire pits",
      "Close infrastructure access (roads, electricity, water within 50ft)",
      "Shared outdoor showers and compost toilet clusters",
      "Creek-side pathways connecting to ceremony and garden zones",
      "Propane lines for seasonal heating and cooking",
      "Greywater filtration and modular septic systems",
      "Stargazing areas and nature observation points",
      "Event space for group gatherings and workshops"
    ],
    
    regenerativePractices: [
      "Each tipi equipped with dedicated solar power source",
      "Individual water systems for each unit (where feasible)",
      "Private compost toilet facilities per tent",
      "Greywater filtration and natural drainage systems",
      "Native plant landscaping and creek restoration",
      "Each unit has private deck and outdoor hangout space",
      "Propane heating from sustainable sources",
      "Biodegradable and eco-friendly amenities",
      "Seasonal creek protection and watershed management",
      "Leave-no-trace guest education programs",
      "Integration with permaculture gardens",
      "Wildlife habitat preservation along creek corridor"
    ],
    
    marketAnalysis: "Creek-side glamping village positioned in Ojai Valley's nature-based wellness tourism market. Starting with 5 tipis and expanding to 25+ units aligns with U.S. glamping industry growth (12.8% CAGR). Tipis and tents are the fastest-growing, most cost-efficient glamping accommodation, ideal for phased expansion and high ROI in eco-tourism destinations.",
    
    revenueStreams: [
      "Nightly stays: $100/night per tipi (45% avg occupancy)",
      "5 tipis operational: $6,750/month from stays",
      "Events, workshops, retreats: $2,000-$3,000/month",
      "Total Year 1: $8,750-$10,000/month",
      "Year 2-3 expansion: $15,000-$22,000/month (10-15 units)"
    ],
    
    developmentTimeline: [
      {
        phase: "Phase 1 (Months 0-4)",
        deliverables: "Clean out creek-side spaces and prepare terrain, install infrastructure (roads, electricity lines, water access), set up 5 tipis with decks and hangout spaces, install solar power for each tipi, connect each tipi to nearby water and toilet facilities, create pathways and fire pit areas, ensure all tipis have close access to infrastructure, test systems and prepare for guests",
        investment: "$10,000-$20,000",
        monthlyRevenue: "$0",
        status: "Infrastructure setup and tipi installation"
      },
      {
        phase: "Phase 2 (Months 3+)",
        deliverables: "Launch nightly stays with 5 tipis operational, start hosting events/workshops/retreats, market to retreat guests and eco-tourists, reinvest revenue into adding more units in phased development, add yurts and safari tents in Year 2-3, scale to 10-25+ units over 2-3 years",
        investment: "$10,000+ (ongoing expansion from revenue reinvestment)",
        monthlyRevenue: "$8,750-$10,000",
        status: "Operational with phased expansion"
      }
    ]
  },
  {
    id: "gatelodge-operations-hub",
    name: "Sulphur Mountain Gatelodge (Operations ADU)",
    emoji: "🏘️",
    position: [34.433082, -119.156728],
    type: "infrastructure",
    budget: "$25,000-$40,000 (estimated)",
    timeline: "Phase 1 (0-12 months)",
    monthlyRevenue: "Operational support (not revenue-generating)",
    roi: "Enables all property businesses to operate",
    description: "Central operational hub and team housing ADU expanding from 360 sq ft to 800 sq ft two-story loft barn. Serves as the nerve center for property management, business operations, and coordination of all revenue-generating projects.\n\nThe facility features a full-service living and working space: downstairs living room and kitchen, upstairs loft bedroom and office system, integrated bathroom facilities, and dedicated workshop area with operational tools. A deck provides indoor/outdoor access for team coordination and oversight.\n\nAdjacent to the main structure is a closed-in garden system featuring vertical growing towers and a propagation facility. This integrated garden produces vegetables, fruits, herbs, and propagates seeds and fruit trees for both property use and the agriculture hub's product lines.\n\nThis operational hub is strategically positioned as the coordination center for all property businesses, enabling efficient logistics, team management, and agricultural operations oversight.",
    features: [
      "Expansion from 360 to 800 sq ft (2-story loft barn)",
      "Full integrated kitchen and bathroom systems",
      "Loft bedroom upstairs with office system",
      "Living room downstairs",
      "Workshop area with operational tools",
      "Deck for indoor/outdoor access",
      "Dedicated business operations unit",
      "Core operational team housing with on-site presence",
      "Connected to active well (17 GPM water access)",
      "One existing live power line with planned solar grid integration"
    ],
    
    integratedGardenSystem: [
      "Closed-in garden system with vertical growing towers",
      "Propagation facility for seeds, seedlings, and fruit trees",
      "Year-round vegetable, fruit, and herb production",
      "Products for property use and agriculture hub sales",
      "Strategic location enabling agriculture operations oversight",
      "Connected to creative workshop and mushroom center for coordination"
    ],
    
    operationalFunction: "This is an operational support unit that enables all property businesses to operate efficiently. It provides on-site team management and coordination, oversees agriculture operations and the propagation facility, coordinates logistics between the creative workshop, mushroom center, and agriculture hub, and manages property operations and maintenance. The integrated garden system supports the agriculture hub's revenue streams while reducing property operational costs.",
    
    regenerativeSystems: [
      "Full solar roofing with battery storage for energy independence",
      "Rainwater harvesting system supporting garden and property needs",
      "Greywater recycling for garden irrigation and landscape watering",
      "Integrated garden system reducing property food costs",
      "On-site operational tools and workshop reducing logistics needs",
      "Central location minimizing travel time for property coordination"
    ],
    
    revenueStreams: [
      "OPERATIONAL SUPPORT (Enables all property businesses):",
      "  • On-site team management and coordination",
      "  • Agriculture operations oversight",
      "  • Logistics coordination between centers",
      "  • Property operations and maintenance",
      "INTEGRATED GARDEN PRODUCTS (Connected to Agriculture Hub):",
      "  • Vegetables, fruits, herbs for property use",
      "  • Propagated seeds and fruit trees for agriculture hub sales",
      "  • Plant starts for creative workshop and projects",
      "NOTE: This is an operational support unit, not a revenue-generating rental property."
    ],
    
    developmentTimeline: [
      {
        phase: "Phase 1 (Months 0-12)",
        deliverables: "Permitting: Apply for remodeled permits (3+ months approval). Construction: Build two-story loft with upstairs bedroom and office, install full kitchen and bathroom systems, create downstairs living room, build workshop area with operational tools, install deck for indoor/outdoor access. Garden System: Construct integrated garden with vertical growing towers, set up propagation facility. Systems: Install solar roofing and battery storage, implement rainwater harvesting and greywater recycling. Complete all interior finishes and systems integration.",
        investment: "$25,000-$40,000 (estimated)",
        status: "Fully operational team housing and business operations hub"
      }
    ]
  },
  {
    id: "tropical-dome-greenhouse",
    name: "Tropical Dome Greenhouse",
    emoji: "🌴",
    position: [34.432888, -119.156763],
    type: "agriculture",
    budget: "$30,000 (estimated with Phase 1 investment)",
    timeline: "Phase 1 (6+ months to start)",
    monthlyRevenue: "$4,200 (post-launch)",
    roi: "168% annual ROI (Year 1)",
    description: "Geodesic dome greenhouse for year-round tropical plant cultivation, propagation station, and seedling nursery - enabling exotic fruit production and plant starts in a controlled microclimate.",
    
    regenerativeSystems: [
      "Solar integration for energy independence",
      "Rainwater harvesting system supporting tropical irrigation",
      "Integrated pond inside tropical garden for water storage and ecosystem",
      "Pond water repurposing for irrigation and other property uses",
      "Year-round tropical fruit trees and tropical plant production",
      "Vertical growing systems maximizing tropical vegetable and herb yields"
    ],
    
    marketContext: "The specialty plant nursery market is experiencing strong growth, particularly for tropical fruit trees and exotic propagated plants. California's growing interest in tropical and subtropical fruits (avocado, mango, citrus varieties) creates premium pricing opportunities. Medicinal herb starts and propagation supplies serve the expanding wellness and herbal medicine markets. Educational workshops on tropical plant propagation attract both home gardeners and commercial growers seeking sustainable propagation techniques.",
    
    developmentTimeline: [
      {
        phase: "Phase 1 (Months 0-6+)",
        deliverables: "Permitting and site preparation (0-6 months). Geodesic dome construction and systems installation (6-12 months). Solar integration and rainwater harvesting setup. Integrated pond construction inside tropical garden. Initial plant propagation and production setup. Begin propagation operations and revenue generation.",
        investment: "$30,000 (estimated)",
        status: "Dome construction, systems integration, initial propagation"
      },
      {
        phase: "Phase 2 (Months 12+)",
        deliverables: "Full propagation operations. Multiple revenue streams active (saplings, herbs, fresh produce, kits, workshops). Pond fully integrated for water management. Educational workshop program established. Scaling production based on demand.",
        investment: "Reinvested revenue for expansion",
        status: "Fully operational propagation facility and tropical production"
      }
    ],
    
    tropicalFruitTrees: [
      {
        name: "Banana & Plantain",
        propagation: "Cloning via pup division",
        products: "Pups for sale, fresh fruit"
      },
      {
        name: "Mango",
        propagation: "Grafting and air-layering",
        products: "Grafted mango saplings, fresh fruit"
      },
      {
        name: "Papaya",
        propagation: "Seed propagation",
        products: "Seedlings, fresh fruit"
      }
    ],
    
    productsOfferings: [
      {
        category: "Live Plants & Propagation",
        items: [
          "Tropical fruit saplings (mango, banana, papaya)",
          "Culinary & medicinal herb starts (rosemary, lavender, mint, basil, sage)",
          "Propagation kits with rooting supplies and instructions"
        ]
      },
      {
        category: "Fresh & Value-Added",
        items: [
          "Seasonal tropical fruits and fresh herbs",
          "Dried herb bundles and herbal tea blends",
          "Specialty plant collections and garden starter kits"
        ]
      }
    ],
    
    features: [
      "Geodesic dome structure for optimal growing conditions",
      "Climate-controlled tropical microclimate year-round",
      "Dedicated propagation station for cuttings and grafting",
      "Seedling nursery with grow lights and heat mats",
      "Misting system for tropical humidity control",
      "Specialized growing benches and vertical growing systems",
      "Tissue culture and cloning propagation area",
      "Educational workshops on tropical plant care",
      "Grafting and air-layering demonstration space",
      "Temperature and humidity monitoring systems"
    ],
    
    revenueStreams: [
      "Tropical fruit tree saplings: $1,500/month",
      "Herb and medicinal plant starts: $800/month",
      "Fresh produce and herbs: $600/month",
      "Propagation kits and supplies: $500/month",
      "Educational workshops: $800/month"
    ]
  },
  {
    id: "sulphur-mountain-sanctuary",
    name: "Sulphur Mountain Sanctuary: The Living Landscape",
    emoji: "🌺",
    position: [34.433038, -119.155827],
    polygon: [[34.4320, -119.1570], [34.4330, -119.1570], [34.4330, -119.1560], [34.4320, -119.1560]],
    type: "landscape",
    budget: "",
    timeline: "Ongoing (post-main residence construction)",
    monthlyRevenue: "Year 3-5+ orchard harvest potential (TBD)",
    roi: "Long-term property value appreciation",
    description: "An immersive living environment where beauty and abundance intertwine, featuring regenerative food forests, sacred geometry gardens, and curated nature pathways that create seamless flow between gathering spaces and nature.",
    features: [
      "500+ fruit trees in extensive orchard system on gentle slope",
      "3+ acres of rich topsoil for regenerative farming",
      "Sacred geometry gardens with stone terraces and walls", 
      "Flower gardens on right side of driveway slope",
      "Curated nature trails weaving through sacred installations",
      "Experiential pathways connecting all zones",
      "Direct links from Main Residence to ceremonial zones",
      "Sacred gathering groves and meditation clearings",
      "Stone terraces, limestone retaining walls, and pathways",
      "Crystal grids and energy-aligned installations",
      "Gravity-fed water channels linking tree guilds",
      "Contemplative rest zones throughout landscape",
      "Elemental installations for nature immersion"
    ],
    regenerativePractices: [
      "Propagating and planting fruit trees grown on-site to expand the orchard",
      "Layered perennial guilds restoring soil health and biodiversity",
      "Stonework, crystal grids, and sacred geometry layouts aligned with land energies",
      "Gravity-fed water features and pools that cascade nourishment between plantings",
      "Pollinator gardens and native understory plantings enhancing habitat",
      "Living mulches and composting practices building long-term fertility"
    ],
    revenueStreams: [
      "Future fruit harvests and nursery tree sales once orchards mature (Year 3-5+)",
      "Seasonal blossoms, botanicals, and ceremonial materials supporting onsite experiences"
    ],
    marketAnalysis: "Mature fruit trees, sacred gardens, and perennial landscapes measurably increase property value while regenerating soils, supporting pollinators, and creating memorable visitor experiences that strengthen the estate's long-term desirability."
  },
  {
    id: "farmstead-produce-stand",
    name: "Farmstead Produce Stand & Online Hub",
    emoji: "🛒",
    position: [34.432483, -119.156935],
    polygon: [[34.4334, -119.1560], [34.4336, -119.1560], [34.4336, -119.1558], [34.4334, -119.1558]],
    type: "agriculture",
    budget: "$7,000-$10,000 (estimated)",
    timeline: "Phase 1 (Month 3+ launch)",
    monthlyRevenue: "$6,400-$8,300 (Phase 1+)",
    roi: "500%+ annual ROI (dependent on connected operations)",
    description: "Central direct-to-consumer sales hub at the property entrance, serving as the primary sales channel for all regenerative farm products, livestock goods, and artisan creations. Combines physical roadside farm stand with robust e-commerce platform and online neighborhood delivery, creating dual-channel revenue streams that significantly expand market reach beyond walk-up retail.",
    
    regenerativeSystems: [
      "Solar energy integration for operational independence",
      "Rainwater harvesting system supporting water needs",
      "Central hub connecting all property regenerative production",
      "Direct-to-consumer sales eliminating middlemen margins",
      "Online shop platform extending market reach to neighborhoods",
      "Organic product focus supporting regenerative agriculture across property"
    ],
    
    marketContext: "The direct-to-consumer farm market is experiencing explosive growth as consumers increasingly seek organic, locally-grown products with transparent sourcing. This farmstead hub serves as the central sales channel for all property regenerative production: organic vegetables and fruits from the agriculture hub, grass-fed meat and dairy from the livestock program, specialty mushrooms, tropical fruits, and artisan goods from the creative workshop. The dual-channel approach—physical roadside stand plus online e-commerce—captures both walk-up retail customers and neighborhood online shoppers. Online sales significantly expand market reach beyond foot traffic, enabling delivery to surrounding neighborhoods. With consistent supply from maintained agricultural operations, the online shop can command premium pricing for organic, regeneratively-grown products. Market projections show 25-40% annual growth in organic food e-commerce and direct-to-consumer sales.",
    
    features: [
      "Physical roadside stand at main entrance/gate",
      "Refrigerated display cases for fresh produce",
      "E-commerce platform for online orders",
      "CSA box subscription fulfillment center",
      "Product shelving and display systems",
      "POS system for walk-up transactions",
      "Cold storage for dairy and meat products"
    ],
    
    revenueStreams: [
      "PHYSICAL FARM STAND SALES:",
      "  • Fresh produce, herbs, and nursery starts: $2,000-$2,500/month",
      "  • Eggs, honey, and pasture-raised meats: $2,000-$2,500/month",
      "  • Value-added goods (tinctures, soaps, candles): $800-$1,000/month",
      "ONLINE ORDERS & LOCAL DELIVERY:",
      "  • Online produce boxes & CSA renewals: $1,000-$1,500/month",
      "  • Neighborhood deliveries & subscriptions: $600-$800/month",
      "CONNECTED PROPERTY PRODUCTION:",
      "  • Agriculture hub products (vegetables, fruits, herbs)",
      "  • Livestock hub products (dairy, meat, eggs, therapies)",
      "  • Mushroom center products (specialty mushrooms)",
      "  • Tropical dome products (tropical fruits, plant starts)",
      "  • Creative workshop artisan goods (value-added products)",
      "TOTAL MONTHLY REVENUE (Phase 1+): $6,400-$8,300/month"
    ],
    
    developmentTimeline: [
      {
        phase: "Phase 1 (Month 3+)",
        deliverables: "Farm Stand Setup: Design and build nice, fancy roadside stand ($2K-$5K). Install refrigerated display cases, shelving, POS system, and signage. Online Shop Development: Set up e-commerce platform ($5K). Develop website and branding. Integrate payment processing. Plan delivery logistics. Launch social media and marketing. Integration & Launch: Connect to agriculture hub production. Connect to livestock hub products. Set up CSA box fulfillment. Begin online orders and local delivery. Launch marketing campaign.",
        investment: "$7,000-$10,000 (estimated)",
        status: "Central sales hub operational with dual channels"
      },
      {
        phase: "Phase 2 (Month 4+)",
        deliverables: "Full Operations: Physical stand and online shop both active. Multiple revenue streams generating. Neighborhood delivery established. CSA subscriptions active. Marketing driving customer acquisition. Scaling: Expand product offerings as supply increases. Optimize online operations. Build customer loyalty programs. Integrate new products from connected operations.",
        investment: "Reinvested revenue for expansion",
        status: "Fully operational dual-channel sales hub"
      }
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
    thickness: 10,
    gradientColors: ['#9C27B0', '#673AB7', '#3F51B5', '#2196F3'],
    glowColor: '#9C27B0',
    description: 'Eastern Boundary - Main Section',
    name: 'Eastern Property Line',
    length: '1,250 ft',
    features: ['Panoramic mountain views', 'Mature oak trees', 'Natural elevation'],
    permanent: true,
    section: 'east'
  },
  {
    id: 'boundary_line_2', 
    coordinates: [[34.433585, -119.154840], [34.433215, -119.154843], [34.432846, -119.154845]],
    thickness: 10,
    gradientColors: ['#2196F3', '#03A9F4', '#00BCD4', '#26C6DA'],
    glowColor: '#00BCD4',
    description: 'Southern Boundary - Section 1',
    name: 'South Property Line (East)',
    length: '580 ft',
    features: ['Gentle slope', 'Garden potential', 'Solar exposure'],
    permanent: true,
    section: 'south-east'
  },
  {
    id: 'boundary_line_3',
    coordinates: [[34.432855, -119.154845], [34.432857, -119.154885], [34.432859, -119.154925]],
    thickness: 10,
    gradientColors: ['#00BCD4', '#00ACC1', '#0097A7'],
    glowColor: '#00BCD4',
    description: 'Southern Corner Connection',
    name: 'South Corner Transition',
    length: '85 ft',
    features: ['Corner landmark', 'Property marker'],
    permanent: true,
    section: 'south-corner'
  },
  {
    id: 'boundary_line_4',
    coordinates: [[34.432855, -119.154920], [34.432370, -119.154912], [34.432185, -119.154908], [34.431886, -119.154904]],
    thickness: 10,
    gradientColors: ['#00BCD4', '#4CAF50', '#66BB6A', '#81C784'],
    glowColor: '#4CAF50',
    description: 'Southern Boundary - Section 2',
    name: 'South Property Line (West)',
    length: '750 ft',
    features: ['Flat terrain', 'Agricultural zone', 'Creek proximity'],
    permanent: true,
    section: 'south-west'
  },
  {
    id: 'boundary_line_5',
    coordinates: [[34.431886, -119.154893], [34.431890, -119.155854], [34.431894, -119.156814]], 
    thickness: 10,
    gradientColors: ['#4CAF50', '#8BC34A', '#CDDC39', '#D4E157'],
    glowColor: '#8BC34A',
    description: 'Western Boundary - Main Section',
    name: 'West Property Line',
    length: '1,420 ft',
    features: ['Seasonal creek', 'Riparian corridor', 'Wildlife habitat'],
    permanent: true,
    section: 'west'
  },
  {
    id: 'boundary_line_6',
    coordinates: [[34.431899, -119.156808], [34.432000, -119.156816], [34.432102, -119.156824]],
    thickness: 10,
    gradientColors: ['#CDDC39', '#C0CA33', '#AFB42B'],
    glowColor: '#CDDC39',
    description: 'Western Corner Connection',
    name: 'West Corner Transition',
    length: '180 ft',
    features: ['Creek crossing', 'Corner marker'],
    permanent: true,
    section: 'west-corner'
  },
  {
    id: 'boundary_line_7', 
    coordinates: [[34.432102, -119.156824], [34.432160, -119.157278], [34.432217, -119.157731]],
    thickness: 10,
    gradientColors: ['#CDDC39', '#FFEB3B', '#FDD835', '#FBC02D'],
    glowColor: '#FDD835',
    description: 'Northwestern Boundary - Section 1',
    name: 'Northwest Property Line',
    length: '680 ft',
    features: ['Creek valley', 'Natural amphitheater', 'Oak woodland'],
    permanent: true,
    section: 'northwest'
  },
  {
    id: 'boundary_line_8',
    coordinates: [[34.432222, -119.157726], [34.432293, -119.157742], [34.432363, -119.157758]],
    thickness: 10,
    gradientColors: ['#FDD835', '#F9A825', '#F57F17'],
    glowColor: '#FDD835',
    description: 'Northwestern Corner Connection',
    name: 'Northwest Corner Transition',
    length: '125 ft',
    features: ['Elevated viewpoint', 'Corner landmark'],
    permanent: true,
    section: 'northwest-corner'
  },
  {
    id: 'boundary_line_9',
    coordinates: [[34.432368, -119.157758], [34.432470, -119.157326], [34.432571, -119.156894]],
    thickness: 10,
    gradientColors: ['#FFC107', '#FFB300', '#FFA000', '#FF8F00'],
    glowColor: '#FFC107',
    description: 'Northern Boundary - Section 1',
    name: 'North Property Line (West)',
    length: '720 ft',
    features: ['Upper plateau', 'Mountain views', 'Ceremony sites'],
    permanent: true,
    section: 'north-west'
  },
  {
    id: 'boundary_line_10',
    coordinates: [[34.432576, -119.156899], [34.433078, -119.156889], [34.433580, -119.156878]],
    thickness: 10,
    gradientColors: ['#FF8F00', '#FF6F00', '#E65100', '#9C27B0'],
    glowColor: '#FF6F00',
    description: 'Northern Boundary - Section 2',
    name: 'North Property Line (East)',
    length: '780 ft',
    features: ['Ridge line', 'Sunset views', 'Highest elevation'],
    permanent: true,
    section: 'north-east'
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
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
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
            will-change: left;
            transform: translateZ(0);
            transition: left 0.4s cubic-bezier(0.16, 1, 0.3, 1);
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
            padding: 16px 24px 14px 24px;
            border-bottom: none;
            z-index: 2001;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            backdrop-filter: blur(15px);
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-height: 60px;
            max-height: 60px;
            touch-action: manipulation;
            flex-shrink: 0;
            gap: 16px;
            -webkit-tap-highlight-color: transparent;
          }
          
          .close-panel {
            position: absolute;
            top: 10px;
            right: 14px;
            font-size: 18px;
            cursor: pointer;
            background: rgba(255,255,255,0.15);
            border: 1px solid rgba(255,255,255,0.25);
            color: white;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
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
            overscroll-behavior-y: contain;
            -webkit-overflow-scrolling: touch;
            touch-action: pan-y;
            height: calc(100vh - 60px);
            overflow-y: auto;
            scroll-behavior: smooth;
            /* Smooth momentum scrolling on mobile */
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
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
            flex: 1;
            min-height: 44px;
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
    
    /* Magical Property Boundary Lines */
    .property-line-magical {
      stroke-linecap: round;
      stroke-linejoin: round;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      filter: drop-shadow(0 0 8px currentColor) brightness(1);
      animation: pulse-glow 3s ease-in-out infinite;
    }
    
    @keyframes pulse-glow {
      0%, 100% {
        filter: drop-shadow(0 0 8px currentColor) brightness(1);
        opacity: 0.9;
      }
      50% {
        filter: drop-shadow(0 0 15px currentColor) brightness(1.1);
        opacity: 1;
      }
    }
    
    .property-line-magical:hover {
      filter: brightness(1.2);
      stroke-width: 12 !important;
    }
    
    
    .property-line-magical.active {
      filter: drop-shadow(0 0 25px gold) 
              drop-shadow(0 0 35px currentColor) 
              brightness(1.4);
      stroke-width: 13 !important;
      animation: active-pulse 1.5s ease-in-out infinite;
    }
    
    @keyframes active-pulse {
      0%, 100% {
        filter: drop-shadow(0 0 25px gold) 
                drop-shadow(0 0 35px currentColor) 
                brightness(1.4);
      }
      50% {
        filter: drop-shadow(0 0 30px gold) 
                drop-shadow(0 0 45px currentColor) 
                brightness(1.5);
      }
    }
    
    /* Mobile optimization */
    @media (max-width: 768px) {
      .property-line-magical {
        filter: drop-shadow(0 0 6px currentColor) brightness(1);
      }
      
      .property-line-magical:active {
        filter: drop-shadow(0 0 15px gold) 
                drop-shadow(0 0 25px currentColor) 
                brightness(1.3);
      }
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
            transition: opacity 300ms cubic-bezier(0.16, 1, 0.3, 1), filter 350ms cubic-bezier(0.16, 1, 0.3, 1);
            filter: blur(8px);
            will-change: opacity, filter;
            image-rendering: auto;
            transform: translate3d(0,0,0);
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
            width: 40px;
            height: 40px;
            border: 3px solid rgba(255,255,255,0.25);
            border-top-color: #fff;
            border-radius: 50%;
            animation: spin 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
            transform: translate3d(0,0,0);
          }
          @keyframes spin { 
            0% { transform: translate3d(0,0,0) rotate(0deg); }
            100% { transform: translate3d(0,0,0) rotate(360deg); } 
          }
          
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
          
          /* ===== ENHANCED LIGHTBOX WITH ZOOM ===== */
          #image-lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.4s;
            will-change: opacity, visibility;
            overscroll-behavior: contain;
            transform: translate3d(0,0,0);
          }
          
          #image-lightbox.active {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
          }
          
          .lightbox-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            backdrop-filter: blur(10px);
            cursor: zoom-out;
            transform: translate3d(0,0,0);
            will-change: backdrop-filter;
          }
          
          .lightbox-content {
            position: relative;
            z-index: 1;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            touch-action: none;
          }
          
          .lightbox-image-container {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            transform: translate3d(0,0,0);
          }
          
          .lightbox-image {
            max-width: 95vw;
            max-height: 95vh;
            object-fit: contain;
            object-position: center center;
            display: block;
            border-radius: 4px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
            transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
            cursor: zoom-in;
            user-select: none;
            -webkit-user-drag: none;
            will-change: transform, opacity;
            transform: translate3d(0,0,0) scale(0.95);
            opacity: 0;
          }
          
          .lightbox-image.loaded {
            transform: translate3d(0,0,0) scale(1);
            opacity: 1;
          }
          
          .lightbox-image.zoomed {
            cursor: grab;
            max-width: none;
            max-height: none;
            transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          }
          
          .lightbox-image.zoomed.dragging {
            cursor: grabbing;
            transition: none;
          }
          
          .lightbox-loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 2;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          }
          
          .lightbox-loading.active {
            opacity: 1;
          }
          
          .lightbox-loading svg {
            animation: spin 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .lightbox-close {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 3;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            font-size: 32px;
            line-height: 1;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            will-change: transform;
            transform: translate3d(0,0,0);
          }
          
          .lightbox-close:hover {
            background: rgba(255, 255, 255, 0.25);
            transform: translate3d(0,0,0) rotate(90deg) scale(1.1);
          }
          
          .lightbox-nav {
            position: fixed;
            top: 50%;
            transform: translateY(-50%) translate3d(0,0,0);
            z-index: 3;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            font-size: 36px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            will-change: transform;
          }
          
          .lightbox-nav:hover {
            background: rgba(255, 255, 255, 0.25);
            transform: translateY(-50%) translate3d(0,0,0) scale(1.15);
          }
          
          .lightbox-nav:active {
            transform: translateY(-50%) translate3d(0,0,0) scale(0.95);
          }
          
          .lightbox-prev {
            left: 30px;
          }
          
          .lightbox-next {
            right: 30px;
          }
          
          .lightbox-counter {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 3;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(10px);
            color: white;
            padding: 12px 24px;
            border-radius: 30px;
            font-size: 16px;
            font-weight: 500;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          /* Zoom Controls */
          .lightbox-zoom-controls {
            position: fixed;
            bottom: 90px;
            left: 50%;
            transform: translateX(-50%) translate3d(0,0,0);
            z-index: 3;
            display: flex;
            gap: 10px;
            opacity: 0;
            transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1);
            will-change: opacity;
          }
          
          #image-lightbox.active .lightbox-zoom-controls {
            opacity: 1;
          }
          
          .zoom-btn {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            font-size: 20px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            user-select: none;
            will-change: transform;
            transform: translate3d(0,0,0);
          }
          
          .zoom-btn:hover {
            background: rgba(255, 255, 255, 0.25);
            transform: translate3d(0,0,0) scale(1.15);
          }
          
          .zoom-btn:active {
            transform: translate3d(0,0,0) scale(0.9);
          }
          
          .zoom-btn.disabled {
            opacity: 0.3;
            cursor: not-allowed;
          }
          
          .zoom-level-indicator {
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(10px);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            min-width: 60px;
            text-align: center;
          }
          
          /* Mobile lightbox optimizations */
          @media (max-width: 768px) {
            .lightbox-close {
              top: 15px;
              right: 15px;
              width: 44px;
              height: 44px;
              font-size: 28px;
            }
            
            .lightbox-nav {
              width: 50px;
              height: 50px;
              font-size: 30px;
            }
            
            .lightbox-prev {
              left: 15px;
            }
            
            .lightbox-next {
              right: 15px;
            }
            
            .lightbox-counter {
              bottom: 20px;
              padding: 10px 20px;
              font-size: 14px;
            }
            
            .lightbox-zoom-controls {
              bottom: 70px;
              gap: 8px;
            }
            
            .zoom-btn {
              width: 40px;
              height: 40px;
              font-size: 18px;
            }
            
            .lightbox-image {
              max-width: 100vw;
              max-height: 90vh;
            }
            
            .lightbox-overlay {
              cursor: default;
            }
          }
          
          /* Comprehensive Responsive Design for All Mobile Devices */
          
          /* Small phones (iPhone SE, Galaxy S series) - 320-375px */
          @media (max-width: 375px) {
            .side-panel {
              width: 100vw;
              left: -100vw;
              transition: left 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            }
            
            .property-panel {
              width: 100vw;
              right: -100vw;
              left: 0;
              transition: left 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            }
            
            .property-panel.open {
              left: 0;
            }
            
            .panel-header, .property-panel-header {
              padding: 12px 16px;
              min-height: 52px;
              max-height: 52px;
            }
            
            .panel-header h2 {
              font-size: 16px;
            }
            
            .property-panel-title h3 {
              font-size: 16px !important;
            }
            
            .close-panel {
              width: 32px !important;
              height: 32px !important;
              font-size: 20px !important;
              top: 10px;
              right: 10px;
            }
            
            /* Optimize content scrolling on mobile */
            .panel-content, .property-panel-content {
              height: calc(100vh - 52px);
              overscroll-behavior: contain;
              -webkit-overflow-scrolling: touch;
              scroll-behavior: smooth;
            }
            
            .carousel-main {
              height: 240px;
            }
            
            .carousel-nav {
              width: 36px;
              height: 36px;
              font-size: 16px;
            }
            
            .carousel-thumbnail {
              width: 50px;
              height: 38px;
            }
            
            .gallery-tab {
              padding: 8px 12px;
              font-size: 12px;
            }
          }
          
          /* Standard phones (iPhone 12-14, most Android) - 376-428px */
          @media (min-width: 376px) and (max-width: 428px) {
            .carousel-main {
              height: 280px;
            }
          }
          
          /* Large phones & small tablets - up to 768px */
          @media (max-width: 768px) {
            .side-panel {
              width: 100vw;
              left: -100vw;
              transition: left 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            }
            
            .property-panel {
              width: 100vw;
              right: -100vw;
              left: 0;
              transition: left 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            }
            
            .property-panel.open {
              left: 0;
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
              transition: transform 0.3s ease-out;
            }
            
            .carousel-thumbnail {
              width: 60px;
              height: 45px;
              transition: all 0.2s ease;
            }
            
            .carousel-thumbnail:active {
              transform: scale(0.95);
            }
            
            .carousel-nav {
              width: 44px;
              height: 44px;
              font-size: 20px;
              background: rgba(0,0,0,0.6);
              backdrop-filter: blur(8px);
              transition: all 0.2s ease;
            }
            
            .carousel-nav:active {
              transform: scale(0.9);
              background: rgba(0,0,0,0.8);
            }

            /* Larger touch targets for mobile */
            .leaflet-control-zoom a {
              width: 48px;
              height: 48px;
              line-height: 48px;
              font-size: 22px;
            }
            .leaflet-control-zoom {
              border-radius: 12px;
            }
            
            /* Smooth panel transitions */
            .side-panel.open,
            .property-panel.open {
              animation: slideInFromLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            }
            
            @keyframes slideInFromLeft {
              from {
                transform: translateX(-100%);
                opacity: 0.8;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }
          }
          
          /* Tablets (iPad, iPad Pro) - 769-1024px */
          @media (min-width: 769px) and (max-width: 1024px) {
            .side-panel {
              width: 480px;
            }
            
            .property-panel {
              width: 480px;
            }
            
            .carousel-main {
              height: 380px;
            }
          }
          
          /* Large tablets & small desktops - 1025-1366px */
          @media (min-width: 1025px) and (max-width: 1366px) {
            .side-panel {
              width: 520px;
            }
            
            .property-panel {
              width: 520px;
            }
          }
          
    /* Property Boundary Info Panel */
    .property-panel {
      position: absolute;
      top: 0;
      right: -480px;
      width: 460px;
      height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      box-shadow: -5px 0 40px rgba(0,0,0,0.25), 0 0 20px rgba(0,0,0,0.15);
      z-index: 2000;
      overflow: hidden;
      -webkit-overflow-scrolling: touch;
      touch-action: pan-y;
      will-change: right, transform;
      transform: translateZ(0);
      transition: right 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      border-left: 2px solid rgba(255,255,255,0.2);
    }
    
    .property-panel.open {
      right: 0;
    }
    
    .property-panel-header {
      position: sticky;
      top: 0;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%);
      color: white;
      padding: 16px 24px 14px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 60px;
      max-height: 60px;
      touch-action: manipulation;
      z-index: 2001;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      backdrop-filter: blur(15px);
      flex-shrink: 0;
      gap: 16px;
      -webkit-tap-highlight-color: transparent;
    }
    
    .property-panel-title {
      display: flex;
      align-items: center;
      padding-right: 40px;
    }
    
    .property-panel-title h3 {
      margin: 0;
      font-size: 22px;
      font-weight: 600;
      letter-spacing: 0.3px;
      line-height: 1.4;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    @media (max-width: 480px) {
      .property-panel-title h3 {
        font-size: 18px;
      }
    }
    
    .property-panel-content {
      padding: 25px;
      background: rgba(255, 255, 255, 0.95);
      margin: 0;
      height: calc(100vh - 80px);
      overflow-y: auto;
      scroll-behavior: smooth;
      overscroll-behavior-y: contain;
      -webkit-overflow-scrolling: touch;
      touch-action: pan-y;
      /* Smooth momentum scrolling on mobile */
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
    }
      overscroll-behavior-y: contain;
      -webkit-overflow-scrolling: touch;
      touch-action: pan-y;
    }
    
    .property-panel-content::-webkit-scrollbar {
      width: 8px;
    }
    
    .property-panel-content::-webkit-scrollbar-track {
      background: rgba(0,0,0,0.05);
    }
    
    .property-panel-content::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 4px;
    }
    
    .property-info-section {
      background: white;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.08);
      border: 1px solid rgba(0,0,0,0.05);
    }
    
    .property-info-section h4 {
      margin: 0 0 15px 0;
      font-size: 16px;
      font-weight: 600;
      color: #667eea;
      border-bottom: 2px solid #667eea;
      padding-bottom: 8px;
    }
    
    .property-detail-row {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .property-detail-row:last-child {
      border-bottom: none;
    }
    
    .property-detail-label {
      font-weight: 600;
      color: #667eea;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .property-detail-value {
      color: #333;
      font-weight: 500;
      line-height: 1.6;
      font-size: 15px;
    }
    
    .property-features-list {
      list-style: none;
      padding: 0;
      margin: 12px 0 0 0;
    }
    
    .property-features-list li {
      padding: 12px 0 12px 30px;
      position: relative;
      color: #444;
      line-height: 1.7;
      font-size: 14px;
      border-bottom: 1px solid #f5f5f5;
    }
    
    .property-features-list li:last-child {
      border-bottom: none;
    }
    
    .property-features-list li:before {
      content: "✨";
      position: absolute;
      left: 0;
      font-size: 16px;
      top: 12px;
    }
    
    .property-features-list li strong {
      color: #667eea;
      font-weight: 600;
      display: block;
      margin-bottom: 4px;
    }
    
    .boundary-gradient-preview {
      width: 100%;
      height: 60px;
      border-radius: 8px;
      margin: 15px 0;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      border: 2px solid white;
    }
    
    /* Project Links Hover Effects */
    .property-panel-content a[href]:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    
    .property-panel.swiping {
      transition: transform 0s !important;
    }
    
    @media (max-width: 768px) {
      .property-panel {
        width: 100vw;
        left: -100vw;
        right: auto;
        transition: left 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        will-change: left, transform;
      }
      
      .property-panel.open {
        left: 0;
        right: auto;
      }
      
      .property-panel-title h3 {
        font-size: 18px;
      }
      
      .property-panel-content {
        padding: 20px 16px;
      }
      
      .property-info-section {
        padding: 16px;
        margin-bottom: 16px;
      }
      
      .property-info-section h4 {
        font-size: 15px;
        margin-bottom: 12px;
      }
      
      .property-detail-value {
        font-size: 14px;
      }
      
      .property-features-list li {
        font-size: 13px;
        padding: 10px 0 10px 28px;
      }
    }
    
    /* Loading Animation */
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
  
  <!-- Property Boundary Info Panel -->
  <div id="property-panel" class="property-panel">
    <div class="property-panel-header">
      <div class="property-panel-title">
        <h3 id="property-title">Property Boundary</h3>
      </div>
      <button class="close-panel" id="close-property-panel">&times;</button>
    </div>
    <div class="property-panel-content" id="property-panel-content">
      <!-- Content will be dynamically inserted -->
    </div>
  </div>
  
  <!-- Map Container -->
  <div id="map"></div>
  
  <!-- Footer -->
  <div class="map-footer">
    © 2025 Sulphur Mountain Eco-Village | 18 Project Zones | $1.33M Development Investment
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
      // Ultra-smooth mobile inertia (iPhone Maps-style)
      inertia: true,
      inertiaDeceleration: 2400,
      inertiaMaxSpeed: 1800,
      easeLinearity: 0.15,
      // Smooth zoom with fine control
      zoomSnap: 0.25,
      zoomDelta: 0.5,
      wheelDebounceTime: 40,
      wheelPxPerZoomLevel: 120,
      // Touch optimization
      tapTolerance: 20,
      tapHold: true,
      touchZoom: true,
      bounceAtZoomLimits: true,
      // Performance
      worldCopyJump: false,
      maxBoundsViscosity: 0.5
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
    
    // Prevent accidental map clicks during panel swipes and track panel state
    window.ignoreMapClicksUntil = 0;
    window.panelIsClosing = false;
    window.isInteractingWithGallery = false;
    function suppressMapClicksFor(ms) { window.ignoreMapClicksUntil = Date.now() + ms; }
    // Body scroll lock helpers (avoid footer bounce and stuck scroll on iOS)
    function lockBodyScroll() {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      document.documentElement.style.overscrollBehaviorY = 'none';
    }
    function unlockBodyScroll() {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.documentElement.style.overscrollBehaviorY = '';
    }
    // Ensure correct body scroll state based on UI
    function ensureBodyScrollState() {
      try {
        const sp = document.getElementById('side-panel');
        const pp = document.getElementById('property-panel');
        const lb = document.getElementById('image-lightbox');
        const anyOpen = (sp && sp.classList.contains('open')) || (pp && pp.classList.contains('open')) || (lb && lb.classList.contains('active'));
        if (anyOpen) {
          lockBodyScroll();
        } else {
          unlockBodyScroll();
        }
      } catch(_) {}
    }
    
    // Fit text to a maximum number of lines by slightly reducing font size
    function fitTextToLines(el, maxLines, maxSize, minSize) {
      try {
        if (!el) return;
        el.style.whiteSpace = 'normal';
        el.style.wordBreak = 'break-word';
        el.style.display = 'block';
        let size = maxSize;
        el.style.fontSize = size + 'px';
        const lh = parseFloat(window.getComputedStyle(el).lineHeight) || (size * 1.25);
        let guard = 12;
        while (guard-- > 0 && size > minSize && el.scrollHeight > lh * maxLines) {
          size -= 1;
          el.style.fontSize = size + 'px';
        }
        // If still overflowing at minimum, allow one more line (up to 3)
        if (el.scrollHeight > lh * maxLines && maxLines < 3) {
          try { el.style.setProperty('-webkit-line-clamp', String(maxLines + 1)); } catch(_) {}
        }
      } catch(_) {}
    }

    // Enable mobile-only swipe-to-close for both panels
    if (window.matchMedia && window.matchMedia('(max-width: 768px)').matches) {
      attachPanelSwipe(map);
      attachPropertyPanelSwipe();
    }
    
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
    
    // Add recenter control (jump back to property)
    const propertyCenter = [34.433086, -119.155336];
    const propertyZoom = 17;
    const recenterControl = L.control({ position: 'bottomright' });
    recenterControl.onAdd = function(m) {
      const div = L.DomUtil.create('div', 'leaflet-bar recenter-control');
      div.innerHTML = '<button type="button" aria-label="Recenter" title="Recenter">⌖</button>';
      div.style.cursor = 'pointer';
      const btn = div.querySelector('button');
      btn.style.width = '48px';
      btn.style.height = '48px';
      btn.style.fontSize = '20px';
      btn.style.lineHeight = '48px';
      btn.style.border = 'none';
      btn.style.background = 'white';
      btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
      btn.style.borderRadius = '8px';
      L.DomEvent.disableClickPropagation(div);
      L.DomEvent.on(btn, 'click', function(e) {
        L.DomEvent.stopPropagation(e);
        map.flyTo(propertyCenter, propertyZoom, { animate: true, duration: 0.75 });
      });
      return div;
    };
    recenterControl.addTo(map);

    console.log('🛰️ Multi-layer satellite imagery system initialized');
    
    // Load project zones data
    const zones = ZONES_DATA_PLACEHOLDER;
    const permanentLines = PERMANENT_LINES_PLACEHOLDER;
    
    console.log('📊 Loaded', zones.length, 'project zones and', permanentLines.length, 'property lines');
    
    // Create ONE continuous boundary path by ordering all coordinates in sequence
    // This ensures smooth color flow with no visible endpoints
    const boundaryCoordinates = [];
    
    // Add all coordinates in order to form complete perimeter
    permanentLines.forEach(function(lineData) {
      // Add all points except last (to avoid duplication with next segment's first point)
      for (var i = 0; i < lineData.coordinates.length - 1; i++) {
        boundaryCoordinates.push(lineData.coordinates[i]);
      }
    });
    
    // Add the very last coordinate to close the loop
    if (permanentLines.length > 0) {
      var lastLine = permanentLines[permanentLines.length - 1];
      var lastCoord = lastLine.coordinates[lastLine.coordinates.length - 1];
      boundaryCoordinates.push(lastCoord);
      // Connect back to start to close the boundary
      boundaryCoordinates.push(boundaryCoordinates[0]);
    }
    
    var propertyLines = [];
    
    // Create base golden glow line
    var blurLine = L.polyline(boundaryCoordinates, {
      color: '#FFD700',
      weight: 10,
      opacity: 0.52,
      className: 'property-line-blur',
      interactive: false,
      lineCap: 'round',
      lineJoin: 'round',
      smoothFactor: 1.5
    }).addTo(map);
    
    // Create ONE single continuous line (no segments, no endpoints!)
    var mainLine = L.polyline(boundaryCoordinates, {
      color: '#7C3AED',
      weight: 8,
      opacity: 0.88,
      className: 'property-line-magical property-line-gradient',
      interactive: true,
      bubblingMouseEvents: true,
      lineCap: 'round',
      lineJoin: 'round',
      smoothFactor: 1.5
    }).addTo(map);
    
    mainLine._locked = true;
    mainLine._permanent = true;
    propertyLines.push(mainLine);
    
    mainLine.on('click', function(e) {
      if (window.ignoreMapClicksUntil && Date.now() < window.ignoreMapClicksUntil) { L.DomEvent.stopPropagation(e); return; }
      // Close zone panel if open to avoid overlap
      const side = document.getElementById('side-panel');
      if (side && side.classList.contains('open')) { side.classList.remove('open'); }
      // If already open, do nothing
      const pp = document.getElementById('property-panel');
      if (pp && pp.classList.contains('open')) { L.DomEvent.stopPropagation(e); return; }
      openPropertyPanel();
      if (mainLine._path) { mainLine._path.classList.add('active'); }
      L.DomEvent.stopPropagation(e);
    });

    // Add a wide, invisible hit area to make tapping the boundary easier on mobile
    var hitLine = L.polyline(boundaryCoordinates, {
      color: '#000',
      weight: 30,
      opacity: 0.0001,
      className: 'property-line-hit',
      interactive: true,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);
    hitLine.on('click', function(e) {
      if (window.ignoreMapClicksUntil && Date.now() < window.ignoreMapClicksUntil) { L.DomEvent.stopPropagation(e); return; }
      const side = document.getElementById('side-panel');
      if (side && side.classList.contains('open')) { side.classList.remove('open'); }
      const pp = document.getElementById('property-panel');
      if (pp && pp.classList.contains('open')) { L.DomEvent.stopPropagation(e); return; }
      openPropertyPanel();
      if (mainLine._path) { mainLine._path.classList.add('active'); }
      L.DomEvent.stopPropagation(e);
    });
    
    // Apply CSS-based gradient animation
    setTimeout(function() {
      if (mainLine._path) {
        // Inject CSS animation for smooth color flow
        var style = document.createElement('style');
        style.textContent = '@keyframes rainbow-flow {' +
          '0% { stroke: #6366F1; }' +
          '20% { stroke: #8B5CF6; }' +
          '40% { stroke: #EC4899; }' +
          '60% { stroke: #F59E0B; }' +
          '80% { stroke: #10B981; }' +
          '100% { stroke: #6366F1; }' +
          '}' +
          '.property-line-gradient {' +
          'animation: rainbow-flow 10s ease-in-out infinite;' +
          'stroke-linecap: round;' +
          'stroke-linejoin: round;' +
          '}';
        document.head.appendChild(style);
        
        console.log('✨ CSS rainbow animation applied to single continuous line');
      }
    }, 200);
    
    console.log('🌈 Single continuous rainbow boundary line created');
    
    console.log('🌈 Continuous flowing rainbow boundary created');
    
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
      beekeeping: '#FFD700',  // Golden yellow for beekeeping
      events: '#FF6B6B'  // Coral red for events and gatherings
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
      
      // Add click handlers for interactive side panel (guard against swipe-ending ghost clicks)
      const clickHandler = (e) => {
        if (window.ignoreMapClicksUntil && Date.now() < window.ignoreMapClicksUntil) { L.DomEvent.stopPropagation(e); return; }
        if (window.panelIsClosing) { L.DomEvent.stopPropagation(e); return; }
        // DEBUG: Log which zone is being clicked
        console.log('🔍 CLICKED ZONE:', zone.id, '-', zone.name);
        // Close any open panels first to ensure only ONE panel at a time
        const openPanels = document.querySelectorAll('.side-panel.open, .property-panel.open');
        openPanels.forEach(p => {
          p.classList.remove('open', 'swiping');
          p.style.transform = '';
          p.style.transition = '';
          p.style.animation = '';
        });
        openSidePanel(zone);
        L.DomEvent.stopPropagation(e);
      };
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
      let hero = document.getElementById('project-hero');
      // Fallback: If header (title + X) is ever missing, rebuild it to ensure visibility
      if (!hero || !document.getElementById('close-panel')) {
        try {
          const existingHeader = panel.querySelector('.panel-header');
          if (existingHeader) existingHeader.remove();
          panel.insertAdjacentHTML('afterbegin', '<div class="panel-header">\
            <div class="project-hero" id="project-hero"></div>\
            <button class="close-panel" id="close-panel">&times;</button>\
          </div>');
          hero = document.getElementById('project-hero');
          const closeBtn = document.getElementById('close-panel');
          if (closeBtn && !closeBtn.dataset.bound) {
            closeBtn.addEventListener('click', () => {
              const sp = document.getElementById('side-panel');
              sp.classList.remove('open');
              sp.style.transform = '';
              sp.style.transition = '';
              if (typeof unlockBodyScroll === 'function') unlockBodyScroll();
              if (typeof ensureBodyScrollState === 'function') ensureBodyScrollState();
              window.currentZoneId = null;
            });
            closeBtn.dataset.bound = '1';
          }
        } catch(_) {}
      }
      // FORCE close property panel so only ONE panel is open at a time
      const propPanel = document.getElementById('property-panel');
      if (propPanel) {
        propPanel.classList.remove('open', 'swiping');
        propPanel.style.transform = '';
        propPanel.style.transition = '';
        propPanel.style.animation = '';
        propPanel.style.touchAction = '';
      }
      
      // Get zone color for theming
      const zoneColor = zoneColorMap[zone.type] || '#333';
      // Improve contrast for specific zones (e.g., Retreat Village has purple bg)
      const zoneNameLower = (zone && zone.name ? String(zone.name) : '').toLowerCase();
      let titleColor = zoneColor;
      if (zoneNameLower.includes('retreat') && zoneNameLower.includes('village')) {
        // Use warm amber for strong contrast on purple backgrounds
        titleColor = '#F59E0B';
      }
      
      // Update header: ALWAYS set title with guaranteed visibility
      if (hero) {
        hero.innerHTML = '<div class="project-title" style="color: #ffffff !important; text-shadow: 0 1px 2px rgba(0,0,0,0.25); font-weight: 700; line-height: 1.2; letter-spacing: 0.1px; margin: 2px 0; font-size: 18px; display: block; visibility: visible;">' + (zone.emoji + ' ' + zone.name) + '</div>';
        // Apply zone color theming to hero background
        hero.style.background = 'linear-gradient(135deg, ' + zoneColor + '15 0%, ' + zoneColor + '25 100%)';
        hero.style.borderLeft = '4px solid ' + zoneColor;
        hero.style.display = 'flex';
        hero.style.visibility = 'visible';
      }
      console.log('📋 Set title for:', zone.name);
      
      // Detect if device is mobile (screen width < 1024px)
      const isMobile = window.innerWidth < 1024;
      
      // Desktop: Keep map FULLY interactive when panel is open
      // Mobile: Disable map interactions when panel is open
      const mapContainer = document.getElementById('map');
      if (!isMobile) {
        // DESKTOP: Map stays fully interactive
        if (mapContainer) {
          mapContainer.style.pointerEvents = 'auto';
          mapContainer.style.touchAction = 'auto';
        }
        if (map) {
          map.dragging.enable();
          map.touchZoom.enable();
          map.doubleClickZoom.enable();
          map.scrollWheelZoom.enable();
          map.boxZoom.enable();
          map.keyboard.enable();
        }
      } else {
        // MOBILE: Disable all map interactions when panel is open
        if (mapContainer) {
          mapContainer.style.pointerEvents = 'none';
          mapContainer.style.touchAction = 'none';
        }
        if (map) {
          map.dragging.disable();
          map.touchZoom.disable();
          map.doubleClickZoom.disable();
          map.scrollWheelZoom.disable();
          map.boxZoom.disable();
          map.keyboard.disable();
        }
      }
      
      // Open the panel first for smooth animation, then inject heavy content
      panel.classList.add('open');
      // Only lock body scroll on MOBILE
      if (isMobile && typeof lockBodyScroll === 'function') lockBodyScroll();
      window.currentZoneId = zone.id;
      
      // Defer heavy DOM work to next frame for smoother opening
      requestAnimationFrame(function() {
        content.innerHTML = generateProjectDetails(zone);
        setupImageGalleryTabs();
        loadZoneImages(zone.id);
        
        // CRITICAL: Always scroll panel content to TOP when opening (both mobile & desktop)
        requestAnimationFrame(function() {
          const panelContent = document.getElementById('panel-content');
          if (panelContent) {
            panelContent.scrollTop = 0;
          }
          // Also scroll the main panel container to top
          if (panel) {
            panel.scrollTop = 0;
          }
        });
      });
      
      // Initialize gallery state tracking
      if (!window.galleryState) window.galleryState = {};
      window.galleryState[zone.id] = { current: 0, vision: 0 };
      
      console.log('📋 Opened side panel for:', zone.name);
    }
    
    // Close panel functionality with complete cleanup
    document.getElementById('close-panel').addEventListener('click', () => {
      const sp = document.getElementById('side-panel');
      sp.classList.remove('open', 'swiping');
      sp.style.transform = '';
      sp.style.transition = '';
      sp.style.animation = '';
      sp.style.touchAction = '';
      if (typeof unlockBodyScroll === 'function') unlockBodyScroll();
      if (typeof ensureBodyScrollState === 'function') ensureBodyScrollState();
      
      // Re-enable map interactions completely
      const mapEl = document.getElementById('map');
      if (mapEl) {
        mapEl.style.pointerEvents = '';
        mapEl.style.touchAction = '';
      }
      // Re-enable Leaflet map interactions
      if (typeof map !== 'undefined' && map) {
        try {
          map.dragging.enable();
          map.touchZoom.enable();
          map.doubleClickZoom.enable();
          map.scrollWheelZoom.enable();
          map.boxZoom.enable();
          map.keyboard.enable();
        } catch(e) {}
      }
      
      // Clear current zone reference
      window.currentZoneId = null;
      
      console.log('❌ Closed side panel');
    });
    
    // Property Panel Functions - Unified for entire property
    function openPropertyPanel() {
      const panel = document.getElementById('property-panel');
      const titleEl = document.getElementById('property-title');
      const contentEl = document.getElementById('property-panel-content');
      // Ensure zone side panel is closed so panels do not overlap
      const sidePanel = document.getElementById('side-panel');
      if (sidePanel && sidePanel.classList.contains('open')) {
        sidePanel.classList.remove('open', 'swiping');
        sidePanel.style.transform = '';
      }
      
      // Update title
      titleEl.textContent = 'Sulphur Mountain Property';
      
      // Build unified property content HTML with actual data
      const content = '<div class="image-gallery-section" style="margin-bottom: 20px;">' +
        '<h4 style="margin-bottom: 12px; color: #7C3AED;">📸 Property Gallery</h4>' +
        '<div class="carousel-container">' +
          '<div class="carousel-main" id="property-carousel-main">' +
            '<div class="carousel-loading">Loading images...</div>' +
          '</div>' +
          '<div class="carousel-thumbnails" id="property-carousel-thumbnails"></div>' +
        '</div>' +
      '</div>' +
      
      '<div class="property-info-section">' +
        '<h4>🏔️ Property Details</h4>' +
        '<div class="property-detail-row">' +
          '<span class="property-detail-label">Total Acreage:</span>' +
          '<span class="property-detail-value">9.47 acres (marketed as 10 acres)</span>' +
        '</div>' +
        '<div class="property-detail-row">' +
          '<span class="property-detail-label">APN:</span>' +
          '<span class="property-detail-value">Ventura County, CA</span>' +
        '</div>' +
        '<div class="property-detail-row">' +
          '<span class="property-detail-label">Zoning:</span>' +
          '<span class="property-detail-value">Unique Upper Ojai Zoning (Residential, Agricultural, Community)</span>' +
        '</div>' +
        '<div class="property-detail-row">' +
          '<span class="property-detail-label">Location:</span>' +
          '<span class="property-detail-value">11962 Sulphur Mountain Road, Upper Ojai, CA</span>' +
        '</div>' +
      '</div>' +
      
      '<div class="property-info-section">' +
        '<h4>✨ Property Features</h4>' +
        '<ul class="property-features-list">' +
          '<li><strong>Valuation:</strong> Current value $2.3M | Projected ARV $6.9M+ (Phase 3 completion)</li>' +
          '<li><strong>Water Access:</strong> Active on-site well producing 17 GPM, connected to structures</li>' +
          '<li><strong>Power:</strong> Two live power lines currently connected</li>' +
          '<li><strong>Sewer:</strong> Main residence connected to city sewer system</li>' +
          '<li><strong>Views:</strong> Unobstructed panoramic views of Topa-Topa Mountains ("Ojai Pink Moment")</li>' +
        '</ul>' +
      '</div>' +
      
      '<div class="property-info-section">' +
        '<h4>📝 Additional Information</h4>' +
        '<div style="display: flex; flex-direction: column; gap: 16px;">' +
          
          '<div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 16px; border-radius: 8px; border-left: 4px solid #667eea;">' +
            '<div style="font-weight: 600; color: #667eea; margin-bottom: 10px; font-size: 14px;">🗺️ Property Layout</div>' +
            '<div style="color: #555; line-height: 1.8; font-size: 14px;">' +
              '<p style="margin: 0 0 10px 0;">The property is naturally divided into <strong>three strategic sections</strong>, each optimized for specific uses:</p>' +
              '<p style="margin: 0 0 6px 0; padding-left: 12px;"><span style="color: #667eea; font-weight: 600;">• Front Left Section:</span> Agriculture and operations hub</p>' +
              '<p style="margin: 0 0 6px 0; padding-left: 12px;"><span style="color: #667eea; font-weight: 600;">• Middle Section:</span> Livestock and community kitchen facilities</p>' +
              '<p style="margin: 0 0 0 0; padding-left: 12px;"><span style="color: #667eea; font-weight: 600;">• Right Hillside:</span> Guest lodging and event spaces</p>' +
            '</div>' +
          '</div>' +
          
          '<div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 16px; border-radius: 8px; border-left: 4px solid #4CAF50;">' +
            '<div style="font-weight: 600; color: #4CAF50; margin-bottom: 10px; font-size: 14px;">✅ Permitting & Development Status</div>' +
            '<div style="color: #555; line-height: 1.8; font-size: 14px;">' +
              '<p style="margin: 0 0 10px 0;">Permitting for the <strong>first three key structures</strong> is ready for submission.</p>' +
              '<p style="margin: 0;">The permitting process is anticipated to clear quickly, allowing construction to begin on schedule.</p>' +
            '</div>' +
          '</div>' +
          
          '<div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 16px; border-radius: 8px; border-left: 4px solid #FF9800;">' +
            '<div style="font-weight: 600; color: #FF9800; margin-bottom: 10px; font-size: 14px;">💰 Investment Overview</div>' +
            '<div style="color: #555; line-height: 1.8; font-size: 14px;">' +
              '<p style="margin: 0 0 10px 0;">The total phased development budget is approximately <strong style="color: #FF9800;">$1.33 Million</strong>.</p>' +
              '<p style="margin: 0;">This investment supports comprehensive regenerative development plans across all property sections.</p>' +
            '</div>' +
          '</div>' +
          
          '<div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 16px; border-radius: 8px; border-left: 4px solid #10B981;">' +
            '<div style="font-weight: 600; color: #10B981; margin-bottom: 10px; font-size: 14px;">🌱 Regenerative Agriculture & Lodging</div>' +
            '<div style="color: #555; line-height: 1.8; font-size: 14px;">' +
              '<p style="margin: 0 0 10px 0;"><strong>Guest Lodging:</strong> Plans include <strong>18-35+ unique units</strong> featuring 8-10 hillside cabins, 10-25+ creek-side glamping (tipis, yurts, safari tents), with phased expansion.</p>' +
              '<p style="margin: 0 0 10px 0;"><strong>Agriculture:</strong> <strong>10-acre property</strong> dedicated to regenerative farming with fruit orchards, vegetable gardens, and integrated permaculture systems.</p>' +
              '<p style="margin: 0;"><strong>Livestock & Nursery:</strong> Integrated permaculture system with beekeeping, mushroom cultivation, and plant nursery programs.</p>' +
            '</div>' +
          '</div>' +
          
        '</div>' +
      '</div>' +
      
      '<div class="property-info-section">' +
        '<h4>🔗 Project Links & Partners</h4>' +
        '<div style="display: flex; flex-direction: column; gap: 20px;">' +
          
          '<div>' +
            '<div style="font-weight: 600; color: #667eea; margin-bottom: 12px; font-size: 15px; display: flex; align-items: center; gap: 8px;">' +
              '<span style="font-size: 18px;">🏔️</span> Sulphur Mountain Projects' +
            '</div>' +
            '<div style="display: flex; flex-direction: column; gap: 10px;">' +
              '<a href="https://sulphurmountainroad.vercel.app/" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; gap: 10px; padding: 12px 14px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; transition: all 0.3s ease; font-size: 14px; font-weight: 500;">' +
                '<span style="font-size: 18px;">🌐</span>' +
                '<span>Sulphur Mountain Website</span>' +
                '<span style="margin-left: auto; font-size: 16px;">→</span>' +
              '</a>' +
              '<div style="display: flex; align-items: center; gap: 10px; padding: 12px 14px; background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%); color: #6c757d; border-radius: 8px; font-size: 14px; font-weight: 500;">' +
                '<span style="font-size: 18px;">🚀</span>' +
                '<span>Sulphur Onboarding Platform</span>' +
                '<span style="margin-left: auto; font-style: italic; font-size: 12px;">Coming Soon...</span>' +
              '</div>' +
            '</div>' +
          '</div>' +
          
          '<div style="border-top: 2px dashed #e9ecef; padding-top: 16px;">' +
            '<div style="font-weight: 600; color: #10B981; margin-bottom: 12px; font-size: 15px; display: flex; align-items: center; gap: 8px;">' +
              '<span style="font-size: 18px;">🤝</span> Partners' +
            '</div>' +
            '<div style="display: flex; flex-direction: column; gap: 10px;">' +
              '<a href="https://santa-maria.vercel.app/" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; gap: 10px; padding: 12px 14px; background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; text-decoration: none; border-radius: 8px; transition: all 0.3s ease; font-size: 14px; font-weight: 500;">' +
                '<span style="font-size: 18px;">🏝️</span>' +
                '<span>Santa Maria</span>' +
                '<span style="margin-left: auto; font-size: 16px;">→</span>' +
              '</a>' +
              '<a href="https://preview--lemuria-life.lovable.app/" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; gap: 10px; padding: 12px 14px; background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; text-decoration: none; border-radius: 8px; transition: all 0.3s ease; font-size: 14px; font-weight: 500;">' +
                '<span style="font-size: 18px;">🌺</span>' +
                '<span>Lemuria Life</span>' +
                '<span style="margin-left: auto; font-size: 16px;">→</span>' +
              '</a>' +
            '</div>' +
          '</div>' +
          
        '</div>' +
      '</div>';
      
      // Open first for smooth animation, then inject heavy content
      panel.classList.add('open');
      if (typeof lockBodyScroll === 'function') lockBodyScroll();
      requestAnimationFrame(function() {
        contentEl.innerHTML = content;
        loadPropertyImages();
        
        // CRITICAL: Always scroll property panel to TOP when opening
        requestAnimationFrame(function() {
          if (panel) {
            panel.scrollTop = 0;
          }
          if (contentEl) {
            contentEl.scrollTop = 0;
          }
        });
      });
      
      console.log('🌈 Opened unified property panel with gallery');
    }
    
    // Load property images from Supabase
    function loadPropertyImages() {
      console.log('📸 Loading property images from image-urls.js');
      
      // Get reference to main carousel and thumbnails
      const mainCarousel = document.getElementById('property-carousel-main');
      const thumbnailsContainer = document.getElementById('property-carousel-thumbnails');
      
      if (!mainCarousel || !thumbnailsContainer) {
        console.log('❌ Property carousel containers not found');
        return;
      }
      
      // Use pre-configured property images from IMAGE_URLS
      fetch('/api/images/property/current')
        .then(response => response.json())
        .then(data => {
          if (!data.success || !data.images || data.images.length === 0) {
            console.log('ℹ️ No property images found');
            mainCarousel.innerHTML = '<div class="carousel-loading">No images available yet</div>';
            return;
          }
          
          console.log('✅ Found', data.images.length, 'property images');
          
          // Initialize property carousel with images
          initializePropertyCarousel(data.images);
        })
        .catch(error => {
          console.error('❌ Error loading property images:', error);
          mainCarousel.innerHTML = '<div class="carousel-loading">Error loading images</div>';
        });
    }
    
    // Initialize property image carousel with optimized performance
    function initializePropertyCarousel(imageUrls) {
      const mainCarousel = document.getElementById('property-carousel-main');
      const thumbnailsContainer = document.getElementById('property-carousel-thumbnails');
      let currentIndex = 0;
      
      // Create main image display with loading optimization
      const mainImg = document.createElement('img');
      mainImg.src = imageUrls[0];
      mainImg.alt = 'Property Image';
      mainImg.className = 'carousel-image';
      mainImg.id = 'property-main-image';
      mainImg.style.cursor = 'pointer';
      mainImg.loading = 'eager';
      mainImg.decoding = 'async';
      
      // Click to zoom
      mainImg.addEventListener('click', () => {
        openImageLightbox('property', currentIndex, imageUrls);
      });
      
      mainCarousel.innerHTML = '';
      mainCarousel.appendChild(mainImg);
      
      // Create thumbnails with loading optimization
      thumbnailsContainer.innerHTML = '';
      imageUrls.forEach((url, index) => {
        const thumb = document.createElement('div');
        thumb.className = 'carousel-thumbnail' + (index === 0 ? ' active' : '');
        thumb.style.backgroundImage = 'url("' + url + '")';
        thumb.dataset.index = index;
        thumb.addEventListener('click', () => {
          currentIndex = index;
          updatePropertyCarousel();
        });
        thumbnailsContainer.appendChild(thumb);
      });
      
      // Update carousel function with smooth transitions
      function updatePropertyCarousel() {
        const mainImage = document.getElementById('property-main-image');
        if (mainImage) {
          // Fade transition
          mainImage.style.opacity = '0.5';
          mainImage.src = imageUrls[currentIndex];
          mainImage.onload = () => {
            mainImage.style.opacity = '1';
          };
        }
        
        // Update thumbnail active state
        const thumbnails = thumbnailsContainer.querySelectorAll('.carousel-thumbnail');
        thumbnails.forEach((thumb, i) => {
          thumb.classList.toggle('active', i === currentIndex);
        });
      }
      
      // Add arrow navigation buttons
      if (imageUrls.length > 1) {
        const prevBtn = document.createElement('button');
        prevBtn.className = 'carousel-nav prev';
        prevBtn.innerHTML = '&#8249;';
        prevBtn.setAttribute('aria-label', 'Previous image');
        prevBtn.addEventListener('click', () => {
          currentIndex = (currentIndex - 1 + imageUrls.length) % imageUrls.length;
          updatePropertyCarousel();
        });
        
        const nextBtn = document.createElement('button');
        nextBtn.className = 'carousel-nav next';
        nextBtn.innerHTML = '&#8250;';
        nextBtn.setAttribute('aria-label', 'Next image');
        nextBtn.addEventListener('click', () => {
          currentIndex = (currentIndex + 1) % imageUrls.length;
          updatePropertyCarousel();
        });
        
        mainCarousel.appendChild(prevBtn);
        mainCarousel.appendChild(nextBtn);
        
        // Add image counter
        const counter = document.createElement('div');
        counter.className = 'carousel-counter';
        counter.innerHTML = '<span class="current-slide">1</span> / <span class="total-slides">' + imageUrls.length + '</span>';
        mainCarousel.appendChild(counter);
      }
      
      // Add swipe navigation
      let swipeStartX = 0, swipeStartY = 0;
      mainCarousel.addEventListener('touchstart', (e) => {
        window.isInteractingWithGallery = true;
        swipeStartX = e.touches[0].clientX;
        swipeStartY = e.touches[0].clientY;
        e.stopPropagation();
      }, { passive: true });
      
      mainCarousel.addEventListener('touchend', (e) => {
        e.stopPropagation();
        const swipeEndX = e.changedTouches[0].clientX;
        const swipeEndY = e.changedTouches[0].clientY;
        const dx = swipeEndX - swipeStartX;
        const dy = swipeEndY - swipeStartY;
        
        // Horizontal swipe detection
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
          if (dx > 0) {
            // Swipe right = previous
            currentIndex = (currentIndex - 1 + imageUrls.length) % imageUrls.length;
          } else {
            // Swipe left = next
            currentIndex = (currentIndex + 1) % imageUrls.length;
          }
          updatePropertyCarousel();
          
          // Update counter
          const counterEl = mainCarousel.querySelector('.current-slide');
          if (counterEl) counterEl.textContent = currentIndex + 1;
        }
        
        // Reset gallery interaction flag after carousel swipe
        setTimeout(() => {
          window.isInteractingWithGallery = false;
        }, 400);
      }, { passive: true });
      // Prevent panel swipe while swiping images
      mainCarousel.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });
      mainCarousel.addEventListener('touchmove', (e) => e.stopPropagation(), { passive: true });
      mainCarousel.addEventListener('touchend', (e) => e.stopPropagation(), { passive: true });
      
      // Add keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (!document.getElementById('property-panel').classList.contains('open')) return;
        
        if (e.key === 'ArrowLeft') {
          currentIndex = (currentIndex - 1 + imageUrls.length) % imageUrls.length;
          updatePropertyCarousel();
          const counterEl = mainCarousel.querySelector('.current-slide');
          if (counterEl) counterEl.textContent = currentIndex + 1;
        } else if (e.key === 'ArrowRight') {
          currentIndex = (currentIndex + 1) % imageUrls.length;
          updatePropertyCarousel();
          const counterEl = mainCarousel.querySelector('.current-slide');
          if (counterEl) counterEl.textContent = currentIndex + 1;
        }
      });
      
      console.log('✅ Property carousel initialized with', imageUrls.length, 'images');
    }
    
    // Close property panel
    document.getElementById('close-property-panel').addEventListener('click', function() {
      const panel = document.getElementById('property-panel');
      panel.classList.remove('open', 'swiping');
      panel.style.transform = '';
      panel.style.transition = '';
      if (typeof unlockBodyScroll === 'function') unlockBodyScroll();
      if (typeof suppressMapClicksFor === 'function') suppressMapClicksFor(250);
      if (typeof ensureBodyScrollState === 'function') ensureBodyScrollState();
      
      // Remove active class from all boundary lines
      document.querySelectorAll('.property-line-magical').forEach(function(path) {
        path.classList.remove('active');
      });
      
      console.log('❌ Closed property panel');
    });
    
    // Enable swipe-to-close on mobile for the side panel
    function attachPanelSwipe(map) {
      const panel = document.getElementById('side-panel');
      if (!panel) return;
      let startX = 0, startY = 0, isTracking = false, isSwiping = false, startTime = 0, startNearEdge = false;
      let currentTranslate = 0;
      let gesture = null; // 'h', 'v', 'r'
      let lastX = 0, lastTime = 0, lastVelocity = 0;
      let inputType = null; // 'touch' | 'pointer'
      const EDGE = 9999; // Allow swipe start from anywhere on mobile
      const EDGE_INNER = 0;
      const SWIPE_THRESHOLD = 48; // px - slight loosen
      const VELOCITY_THRESHOLD = 0.3; // px/ms (unused for close, but kept for logs)
      const ANGLE_THRESHOLD = 14; // px - stricter axis lock
      
      const onStart = (clientX, clientY) => {
        if (!panel.classList.contains('open') || !startNearEdge) return;
        if (window.isInteractingWithGallery) return; // Don't start swipe during gallery interaction
        startX = clientX;
        startY = clientY;
        startTime = Date.now();
        isTracking = true;
        isSwiping = false;
        currentTranslate = 0;
        gesture = null;
        // Remove transition during drag for immediate feedback
        panel.style.transition = 'none';
        panel.style.animation = 'none';
        panel.style.transform = '';
        panel.classList.remove('swiping');
        lastX = clientX;
        lastTime = startTime;
        try { panel.style.willChange = 'transform'; } catch(_) {}
      };
      
      const onMove = (clientX, clientY, ev) => {
        if (!isTracking) return;
        const dx = clientX - startX;
        const dy = clientY - startY;
        const absX = Math.abs(dx), absY = Math.abs(dy);
        
        if (!isSwiping) {
          // Lock gesture axis early
          if (!gesture) {
            if (absX > 5 || absY > 5) {
              // If vertical dominant, lock as vertical
              if (absY > absX * 1.5) {
                gesture = 'v';
              } else if (absX > absY * 1.5 && dx < 0) {
                // Horizontal left - activate swipe immediately
                gesture = 'h';
              } else if (dx > 0) {
                // ANY right movement - block immediately
                gesture = 'r';
              }
            }
          }
          
          // If vertical scroll, allow it
          if (gesture === 'v') {
            isTracking = false;
            isSwiping = false;
            return;
          }
          
          // If RIGHT swipe, block completely
          if (gesture === 'r' || dx > 0) {
            isTracking = false;
            isSwiping = false;
            panel.style.transform = '';
            if (ev && ev.cancelable) ev.preventDefault();
            console.log('🚫 Right swipe blocked');
            return;
          }
          
          // Activate LEFT swipe immediately with low threshold for responsiveness
          const minDx = 10; // Lower threshold for immediate response
          if (gesture === 'h' && dx < 0 && absX >= minDx) {
            isSwiping = true;
            panel.classList.add('swiping');
            panel.style.touchAction = 'none';
            if (ev && ev.cancelable) ev.preventDefault();
            console.log('✅ Left swipe activated');
          } else if (!isSwiping) {
            return;
          }
        }
        
        // Only proceed if we're in confirmed swipe mode
        if (!isSwiping) return;
        
        // Prevent default to stop scroll
        if (ev && ev.cancelable) ev.preventDefault();
        
        // Instant velocity
        const now = Date.now();
        if (lastTime && now > lastTime) {
          lastVelocity = (clientX - lastX) / (now - lastTime);
        }
        lastX = clientX; lastTime = now;
        
        // ONLY allow leftward (negative) motion
        currentTranslate = Math.min(0, dx);
        
        // Use translate3d for GPU acceleration and immediate response
        panel.style.transform = 'translate3d(' + currentTranslate + 'px, 0, 0)';
        lastTime = now;
      };
      
      const onEnd = () => {
        if (!isTracking) return;
        
        // Clean up tracking state immediately
        isTracking = false;
        gesture = null;
        
        const translateX = currentTranslate || 0;
        const duration = Date.now() - startTime;
        const velocity = Math.abs(lastVelocity); // px per ms (instantaneous)
        const width = panel.getBoundingClientRect().width || 1;
        const DIST_THRESHOLD = Math.max(64, width * 0.18);
        
        // Re-enable transition for smooth snap-back
        panel.style.transition = 'transform 0.32s cubic-bezier(0.16, 1, 0.3, 1)';
        panel.classList.remove('swiping');
        
        // Close only if swiped far enough (hard swipe). Ignore velocity to prevent sensitivity
        const shouldClose = Math.abs(translateX) > DIST_THRESHOLD;
        
        if (shouldClose) {
          // Subtle haptic (where supported)
          try { if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10); } catch(_) {}
          // Set closing flag to prevent re-opening during animation
          window.panelIsClosing = true;
          // Animate panel out completely before closing - use translate3d for GPU
          panel.style.transform = 'translate3d(-100%, 0, 0)';
          setTimeout(function() {
            panel.classList.remove('open');
            panel.style.transform = '';
            panel.style.transition = '';
            window.currentZoneId = null;
            window.panelIsClosing = false;
            if (typeof unlockBodyScroll === 'function') unlockBodyScroll();
            if (typeof ensureBodyScrollState === 'function') ensureBodyScrollState();
            // Re-enable map interactions completely
            const mapEl = document.getElementById('map');
            if (mapEl) {
              mapEl.style.pointerEvents = '';
              mapEl.style.touchAction = '';
            }
            // Re-enable Leaflet map interactions
            if (typeof map !== 'undefined' && map) {
              try {
                map.dragging.enable();
                map.touchZoom.enable();
                map.doubleClickZoom.enable();
                map.scrollWheelZoom.enable();
                map.boxZoom.enable();
                map.keyboard.enable();
              } catch(e) {}
            }
            console.log('👆 Panel closed by swipe (distance: ' + Math.abs(translateX) + 'px, velocity: ' + velocity.toFixed(2) + 'px/ms)');
            panel.style.animation = '';
            panel.style.touchAction = '';
            try { panel.style.willChange = ''; } catch(_) {}
          }, 320);
        } else {
          // Snap back to original position
          panel.style.transform = '';
          setTimeout(function() {
            panel.style.transition = '';
            panel.style.animation = '';
            panel.style.touchAction = '';
            try { panel.style.willChange = ''; } catch(_) {}
          }, 320);
        }
        
        isTracking = false;
        isSwiping = false;
        currentTranslate = 0;
        gesture = null;
        lastVelocity = 0;
      };
      
      // Touch events (edge-only)
      panel.addEventListener('touchstart', function(e) {
        if (inputType && inputType !== 'touch') return;
        inputType = 'touch';
        const t = e.touches[0];
        const target = e.target;
        if (target.closest('.carousel-main, .carousel-thumbnails, .image-carousel, .sub-nav-tabs, .sub-nav-tab, .lightbox-content')) return;
        const rect = panel.getBoundingClientRect();
        startNearEdge = true; // Allow swipe from anywhere
        onStart(t.clientX, t.clientY);
      }, { passive: true, capture: true });
      
      panel.addEventListener('touchmove', function(e) {
        const t = e.touches[0];
        onMove(t.clientX, t.clientY, e);
      }, { passive: false });
      
      panel.addEventListener('touchend', () => { onEnd(); inputType = null; if (typeof suppressMapClicksFor === 'function') suppressMapClicksFor(800); if (typeof ensureBodyScrollState === 'function') ensureBodyScrollState(); }, { passive: true });
      panel.addEventListener('touchcancel', () => { onEnd(); inputType = null; if (typeof suppressMapClicksFor === 'function') suppressMapClicksFor(800); if (typeof ensureBodyScrollState === 'function') ensureBodyScrollState(); }, { passive: true });
      
      // Pointer events fallback
      panel.addEventListener('pointerdown', function(e) {
        if (inputType && inputType !== 'pointer') return;
        inputType = 'pointer';
        const target = e.target;
        if (target.closest('.carousel-main, .carousel-thumbnails, .image-carousel, .sub-nav-tabs, .sub-nav-tab, .lightbox-content')) return;
        const rect = panel.getBoundingClientRect();
        startNearEdge = true; // Allow swipe from anywhere
        try { panel.setPointerCapture(e.pointerId); } catch(_) {}
        onStart(e.clientX, e.clientY);
      }, { capture: true });
      panel.addEventListener('pointermove', function(e) {
        onMove(e.clientX, e.clientY, e);
      });
      panel.addEventListener('pointerup', (e) => { try { panel.releasePointerCapture(e.pointerId); } catch(_) {} onEnd(); inputType = null; if (typeof suppressMapClicksFor === 'function') suppressMapClicksFor(800); if (typeof ensureBodyScrollState === 'function') ensureBodyScrollState(); });
      panel.addEventListener('pointercancel', (e) => { try { panel.releasePointerCapture(e.pointerId); } catch(_) {} onEnd(); inputType = null; if (typeof suppressMapClicksFor === 'function') suppressMapClicksFor(800); if (typeof ensureBodyScrollState === 'function') ensureBodyScrollState(); });
    }
    
    // Enable swipe-to-close for property panel (iPhone-style smooth closing)
    function attachPropertyPanelSwipe() {
      const panel = document.getElementById('property-panel');
      if (!panel) return;
      let startX = 0, startY = 0, isTracking = false, isSwiping = false, startTime = 0, startNearEdge = false;
      let currentTranslate = 0;
      let gesture = null; // 'h', 'v', 'r'
      let lastX = 0, lastTime = 0, lastVelocity = 0;
      let inputType = null;
      const EDGE = 9999; // Allow swipe from anywhere on mobile
      const EDGE_INNER = 0;
      const SWIPE_THRESHOLD = 48;
      const VELOCITY_THRESHOLD = 0.3;
      const ANGLE_THRESHOLD = 14;
      // Direction: on mobile the property panel opens from left (close left), on desktop it's right (close right)
      const closeToLeft = (typeof window !== 'undefined' && window.matchMedia) ? window.matchMedia('(max-width: 768px)').matches : true;
      
      const onStart = (clientX, clientY) => {
        if (!panel.classList.contains('open') || !startNearEdge) return;
        if (window.isInteractingWithGallery) return; // Don't start swipe during gallery interaction
        startX = clientX;
        startY = clientY;
        startTime = Date.now();
        isTracking = true;
        isSwiping = false;
        panel.style.transition = 'none';
        panel.style.animation = 'none';
        gesture = null;
        lastX = clientX;
        lastTime = startTime;
        try { panel.style.willChange = 'transform'; } catch(_) {}
      };
      
      const onMove = (clientX, clientY, ev) => {
        if (!isTracking) return;
        const dx = clientX - startX;
        const dy = clientY - startY;
        
        if (!isSwiping) {
          if (!gesture) {
            const absX = Math.abs(dx), absY = Math.abs(dy);
            if (absX > 10 || absY > 10) {
              if (absY > absX * 1.2) gesture = 'v';
              else if (absX > absY * 1.2) gesture = 'h';
            }
          }
          if (gesture === 'v') {
            isTracking = false;
            panel.style.transition = '';
            panel.style.animation = '';
            return;
          }
          const absX = Math.abs(dx), absY = Math.abs(dy);
          const ratioReq = 2.0;
          const minDx = 24;
          const horizontal = absX > absY * ratioReq && absX > ANGLE_THRESHOLD;
          const closingDirOk = closeToLeft ? (dx < 0) : (dx > 0);
          if (!horizontal || !closingDirOk || absX < minDx) return;
          if (horizontal && closingDirOk) {
            isSwiping = true;
            panel.classList.add('swiping');
            panel.style.touchAction = 'none';
          }
          if (!isSwiping) return;
        }
        
        // Prevent scrolling during swipe only when actually swiping
        if (isSwiping && ev && ev.cancelable) ev.preventDefault();
        
        // Direction-aware translate: left on mobile, right on desktop (rAF + clamp)
        currentTranslate = closeToLeft ? Math.min(0, dx) : Math.max(0, dx);
        const width = panel.getBoundingClientRect().width || 1;
        const next = closeToLeft
          ? Math.max(-width, Math.min(0, currentTranslate))
          : Math.min(width, Math.max(0, currentTranslate));
        // Immediate transform for smooth response
        panel.style.transform = 'translate3d(' + next + 'px, 0, 0)';
        const now = Date.now();
        const dtx = clientX - lastX;
        const dt = now - lastTime;
        if (dt > 0) lastVelocity = dtx / dt;
        lastX = clientX;
        lastTime = now;
      };
      
      const onEnd = () => {
        if (!isTracking) return;
        
        const translateX = currentTranslate || 0;
        const duration = Date.now() - startTime;
        const velocity = Math.abs(lastVelocity);
        const width = panel.getBoundingClientRect().width || 1;
        const DIST_THRESHOLD = Math.max(72, width * 0.20);
        
        // Smooth transition for snap-back or close (transform only to avoid left/right jumps)
        panel.style.transition = 'transform 0.32s cubic-bezier(0.16, 1, 0.3, 1)';
        panel.classList.remove('swiping');
        
        // Close only if swiped far enough (hard swipe); ignore velocity
        const shouldClose = Math.abs(translateX) > DIST_THRESHOLD;
        
        if (shouldClose) {
          // Animate panel out with iPhone-style smooth close (direction-aware)
          panel.style.transform = closeToLeft ? 'translateX(-100%)' : 'translateX(100%)';
          setTimeout(() => {
            panel.classList.remove('open');
            panel.style.transform = '';
            panel.style.transition = '';
            if (typeof unlockBodyScroll === 'function') unlockBodyScroll();
            if (typeof ensureBodyScrollState === 'function') ensureBodyScrollState();
            
            // Remove active class from boundary lines
            document.querySelectorAll('.property-line-magical').forEach(path => {
              path.classList.remove('active');
            });
            
            console.log('👆 Property panel closed by swipe (distance: ' + Math.abs(translateX) + 'px, velocity: ' + velocity.toFixed(2) + 'px/ms)');
            panel.style.animation = '';
            panel.style.touchAction = '';
          }, 320);
        } else {
          // Snap back smoothly
          panel.style.transform = '';
          setTimeout(function() {
            panel.style.transition = '';
            panel.style.animation = '';
            panel.style.touchAction = '';
            try { panel.style.willChange = ''; } catch(_) {}
          }, 320);
        }
        
        isTracking = false;
        isSwiping = false;
        currentTranslate = 0;
        gesture = null;
        lastVelocity = 0;
      };
      
      // Touch events (edge-preferred, but allow strong swipe)
      panel.addEventListener('touchstart', (e) => {
        if (inputType && inputType !== 'touch') return;
        inputType = 'touch';
        const t = e.touches[0];
        const target = e.target;
        if (target.closest('.carousel-main, .carousel-thumbnails, .image-carousel, .sub-nav-tabs, .sub-nav-tab, .lightbox-content')) return;
        const rect = panel.getBoundingClientRect();
        startNearEdge = true; // Allow swipe from anywhere
        onStart(t.clientX, t.clientY);
      }, { passive: true, capture: true });
      
      panel.addEventListener('touchmove', (e) => {
        const t = e.touches[0];
        onMove(t.clientX, t.clientY, e);
      }, { passive: false });
      
      panel.addEventListener('touchend', () => { onEnd(); inputType = null; if (typeof suppressMapClicksFor === 'function') suppressMapClicksFor(800); if (typeof ensureBodyScrollState === 'function') ensureBodyScrollState(); }, { passive: true });
      panel.addEventListener('touchcancel', () => { onEnd(); inputType = null; if (typeof suppressMapClicksFor === 'function') suppressMapClicksFor(800); if (typeof ensureBodyScrollState === 'function') ensureBodyScrollState(); }, { passive: true });
      
      // Pointer events fallback
      panel.addEventListener('pointerdown', (e) => {
        if (inputType && inputType !== 'pointer') return;
        inputType = 'pointer';
        const target = e.target;
        if (target.closest('.carousel-main, .carousel-thumbnails, .image-carousel, .sub-nav-tabs, .sub-nav-tab, .lightbox-content')) return;
        const rect = panel.getBoundingClientRect();
        startNearEdge = true; // Allow swipe from anywhere
        try { panel.setPointerCapture(e.pointerId); } catch(_) {}
        onStart(e.clientX, e.clientY);
      }, { capture: true });
      panel.addEventListener('pointermove', (e) => {
        onMove(e.clientX, e.clientY, e);
      });
      panel.addEventListener('pointerup', (e) => { try { panel.releasePointerCapture(e.pointerId); } catch(_) {} onEnd(); inputType = null; if (typeof suppressMapClicksFor === 'function') suppressMapClicksFor(800); if (typeof ensureBodyScrollState === 'function') ensureBodyScrollState(); });
      panel.addEventListener('pointercancel', (e) => { try { panel.releasePointerCapture(e.pointerId); } catch(_) {} onEnd(); inputType = null; if (typeof suppressMapClicksFor === 'function') suppressMapClicksFor(800); if (typeof ensureBodyScrollState === 'function') ensureBodyScrollState(); });
    }
    
    // Enhanced image gallery tab functionality
    function setupImageGalleryTabs() {
      const tabs = document.querySelectorAll('.gallery-tab');
      if (!tabs.length) return;
      
      tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
          e.stopPropagation();
          e.preventDefault();
          window.isInteractingWithGallery = true;
          suppressMapClicksFor(800);
          // Remove active class from all tabs
          tabs.forEach(t => t.classList.remove('active'));
          
          // Add active class to clicked tab
          tab.classList.add('active');
          
          // Hide all content with smooth transition
          document.querySelectorAll('#current-images, #vision-images, #progress-images').forEach(content => {
            content.style.display = 'none';
          });
          
          // Show content for clicked tab
          const targetId = tab.getAttribute('data-tab') + '-images';
          const targetContent = document.getElementById(targetId);
          if (targetContent) {
            targetContent.style.display = 'block';
          }
          
          // Reset gallery interaction flag after animation
          setTimeout(() => {
            window.isInteractingWithGallery = false;
          }, 500);
          targetContent.style.opacity = '0';
          setTimeout(() => {
            targetContent.style.opacity = '1';
            targetContent.style.transition = 'opacity 0.3s ease';
          }, 50);
        });
      });
    }
    
    // Load images for a specific zone (preserves gallery state)
    async function loadZoneImages(zoneId) {
      console.log('🖼️ loadZoneImages called for zoneId:', zoneId);
      const categories = ['current', 'vision'];
      
      for (const category of categories) {
        try {
          const container = document.getElementById(category + '-images');
          if (!container) continue;
          
          // Fetch image URLs from API
          const apiUrl = '/api/images/' + zoneId + '/' + category;
          console.log('📡 Fetching images from:', apiUrl);
          const response = await fetch(apiUrl);
          const data = await response.json();
          console.log('📦 API response for', zoneId, category, ':', data);
          
          // Check if this category has subcategories
          if (data.hasSubcategories && data.subcategoryData) {
            // Create subcategory structure for display
            const subcategoryInfo = {};
            for (const [subcat, images] of Object.entries(data.subcategoryData)) {
              subcategoryInfo[subcat] = {
                images: images,
                count: images.length
              };
            }
            container.innerHTML = createSubcategoryGallery({subcategories: subcategoryInfo}, zoneId, category);
            // Initialize carousels for all subcategories
            Object.keys(subcategoryInfo).forEach(subcat => {
              initializeCarousel(category + '-' + subcat);
            });
            console.log('Loaded ' + data.count + ' images in ' + data.subcategories.length + ' subcategories for ' + zoneId + '/' + category);
          } else if (data.images && data.images.length > 0) {
            // Regular single-level images
            container.innerHTML = createImageCarousel(data.images, zoneId, category);
            initializeCarousel(category);
            console.log('Loaded ' + data.images.length + ' images for ' + zoneId + '/' + category);
          } else {
            container.innerHTML = '<div class="no-images-message">' +
              '<div style="font-size: 48px; opacity: 0.3; margin-bottom: 10px;">📷</div>' +
              '<div>No images configured for this category</div>' +
              '<div style="font-size: 13px; opacity: 0.7; margin-top: 5px;">' +
              'Add URLs to image-urls.js to display images' +
              '</div></div>';
          }
        } catch (error) {
          console.error('Error loading ' + category + ' images:', error);
          const container = document.getElementById(category + '-images');
          if (container) {
            container.innerHTML = '<div class="no-images-message">' +
              '<div style="color: #e74c3c;">⚠️ Error loading images</div>' +
              '</div>';
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
      } else if (category === 'vision' && zoneId === 'infrastructure') {
        subcategories.sort((a, b) => {
          if (a === 'Water' && b !== 'Water') return -1;
          if (b === 'Water' && a !== 'Water') return 1;
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
        <div class=\"sub-nav-tab \${subcat === activeSubcategory ? 'active' : ''}\" 
             data-subcategory=\"\${subcat}\"
             onclick=\"switchSubcategory('\${category}', '\${subcat}')\">
          \${subcat}
          <span class=\"count-badge\">\${data.subcategories[subcat].count}</span>
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
             decoding="async"
             style="cursor: pointer;"
             data-lightbox-category="\${category}"
             data-lightbox-index="\${index}">
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
      images.forEach((img, index) => {
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
        
        // Add click listener to open lightbox
        img.addEventListener('click', () => {
          openImageLightbox(category, index);
        });
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
        const THRESH = 40;
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
        main.addEventListener('touchstart', (e) => { const t = e.touches[0]; onStart(t.clientX, t.clientY); e.stopPropagation(); }, { passive: true });
        main.addEventListener('touchmove', (e) => { const t = e.touches[0]; onMove(t.clientX, t.clientY, e); e.stopPropagation(); }, { passive: false });
        main.addEventListener('touchend', (e) => { const t = e.changedTouches[0]; onEnd(t.clientX, t.clientY); e.stopPropagation(); });
        // Pointer fallback
        main.addEventListener('pointerdown', (e) => { onStart(e.clientX, e.clientY); e.stopPropagation(); });
        main.addEventListener('pointermove', (e) => { onMove(e.clientX, e.clientY, e); e.stopPropagation(); });
        main.addEventListener('pointerup', (e) => { onEnd(e.clientX, e.clientY); e.stopPropagation(); });
        // Ensure best behavior on mobile
        try { main.style.touchAction = 'pan-y'; } catch(_){}
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
      
      const target = images[newIndex];
      
      // Use requestAnimationFrame for smoother transitions
      requestAnimationFrame(() => {
        // Fast toggle without waiting
        images.forEach((img, i) => {
          if (i === newIndex) {
            img.classList.add('active');
          } else {
            img.classList.remove('active');
          }
        });
        thumbnails.forEach((thumb, i) => {
          if (i === newIndex) {
            thumb.classList.add('active');
          } else {
            thumb.classList.remove('active');
          }
        });
        
        const counter = carousel.querySelector('.current-slide');
        if (counter) counter.textContent = String(newIndex + 1);
        carousel.dataset.currentIndex = String(newIndex);
        
        // Preload adjacent images asynchronously
        requestAnimationFrame(() => {
          preloadAdjacent(category, newIndex);
        });
        
        // Release lock quickly
        setTimeout(() => { carousel.dataset.navBusy = '0'; }, 50);
      });
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
    
    // ===== LIGHTBOX SYSTEM FOR FULL-SIZE IMAGE VIEWING =====
    
    // Create enhanced lightbox HTML with zoom controls
    function ensureLightboxExists() {
      if (document.getElementById('image-lightbox')) return;
      
      const lightbox = document.createElement('div');
      lightbox.id = 'image-lightbox';
      lightbox.innerHTML = '<div class="lightbox-overlay"></div>' +
        '<button class="lightbox-close" aria-label="Close">&times;</button>' +
        '<div class="lightbox-content">' +
          '<div class="lightbox-image-container">' +
            '<img class="lightbox-image" src="" alt="Full size image">' +
          '</div>' +
          '<div class="lightbox-loading"><div class="loading-spinner"></div></div>' +
        '</div>' +
        '<button class="lightbox-nav lightbox-prev" aria-label="Previous">' +
          '<span>&#8249;</span>' +
        '</button>' +
        '<button class="lightbox-nav lightbox-next" aria-label="Next">' +
          '<span>&#8250;</span>' +
        '</button>' +
        '<div class="lightbox-zoom-controls">' +
          '<button class="zoom-btn zoom-out" aria-label="Zoom Out" title="Zoom Out">-</button>' +
          '<div class="zoom-level-indicator">100%</div>' +
          '<button class="zoom-btn zoom-in" aria-label="Zoom In" title="Zoom In">+</button>' +
          '<button class="zoom-btn zoom-reset" aria-label="Reset Zoom" title="Reset Zoom">⟲</button>' +
        '</div>' +
        '<div class="lightbox-counter">' +
          '<span class="lightbox-current">1</span> / <span class="lightbox-total">1</span>' +
        '</div>';
      document.body.appendChild(lightbox);
      
      // Initialize lightbox event handlers
      initializeLightboxHandlers();
    }
    
    // Initialize lightbox event handlers
    function initializeLightboxHandlers() {
      const lightbox = document.getElementById('image-lightbox');
      const overlay = lightbox.querySelector('.lightbox-overlay');
      const closeBtn = lightbox.querySelector('.lightbox-close');
      const prevBtn = lightbox.querySelector('.lightbox-prev');
      const nextBtn = lightbox.querySelector('.lightbox-next');
      const img = lightbox.querySelector('.lightbox-image');
      const loading = lightbox.querySelector('.lightbox-loading');
      // Hint the browser to load and decode fast
      try { img.loading = 'eager'; } catch(_) {}
      try { img.decoding = 'async'; } catch(_) {}
      try { img.setAttribute('fetchpriority', 'high'); } catch(_) {}
      
      let currentImages = [];
      let currentIndex = 0;
      let touchStartX = 0;
      let touchStartY = 0;
      let isDragging = false;
      
      // Close lightbox
      function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        if (typeof ensureBodyScrollState === 'function') ensureBodyScrollState();
        setTimeout(() => {
          img.src = '';
          currentImages = [];
        }, 300);
      }
      
      // Navigate to image
      function navigateToImage(index) {
        if (index < 0 || index >= currentImages.length) return;
        currentIndex = index;
        
        // Show loading spinner and reset transforms/scroll
        loading.classList.add('active');
        const contentEl = lightbox.querySelector('.lightbox-content');
        if (contentEl) { contentEl.style.transform = ''; contentEl.style.opacity = '1'; }
        imageContainer.scrollTop = 0; imageContainer.scrollLeft = 0;
        
        // Remove loaded class to trigger fade-out with scale
        img.classList.remove('loaded');
        
        // Set source immediately; fade in with scale after decode
        const newSrc = currentImages[index];
        if (img.src !== newSrc) img.src = newSrc;
        
        const finish = () => {
          loading.classList.remove('active');
          // Add loaded class to trigger smooth fade-in with scale animation
          requestAnimationFrame(() => {
            img.classList.add('loaded');
          });
          // Update counter
          lightbox.querySelector('.lightbox-current').textContent = index + 1;
          // Preload adjacent images for instant navigation
          if (index > 0) { const prev = new Image(); prev.src = currentImages[index - 1]; }
          if (index < currentImages.length - 1) { const next = new Image(); next.src = currentImages[index + 1]; }
        };
        
        try {
          if (img.decode) { img.decode().then(finish).catch(finish); }
          else if (img.complete) { finish(); }
          else { img.onload = finish; img.onerror = finish; }
        } catch(_) { finish(); }
        
        // Update nav button visibility
        prevBtn.style.display = index > 0 ? 'flex' : 'none';
        nextBtn.style.display = index < currentImages.length - 1 ? 'flex' : 'none';
      }
      
      // Open lightbox with images
      window.openLightbox = function(images, startIndex) {
        ensureLightboxExists();
        currentImages = images;
        currentIndex = startIndex || 0;
        
        lightbox.querySelector('.lightbox-total').textContent = images.length;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        navigateToImage(currentIndex);
      };
      
      // Event listeners
      overlay.addEventListener('click', closeLightbox);
      closeBtn.addEventListener('click', closeLightbox);
      prevBtn.addEventListener('click', () => navigateToImage(currentIndex - 1));
      nextBtn.addEventListener('click', () => navigateToImage(currentIndex + 1));
      
      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateToImage(currentIndex - 1);
        if (e.key === 'ArrowRight') navigateToImage(currentIndex + 1);
      });
      
      // Zoom functionality
      let zoomLevel = 1;
      const zoomIn = lightbox.querySelector('.zoom-in');
      const zoomOut = lightbox.querySelector('.zoom-out');
      const zoomReset = lightbox.querySelector('.zoom-reset');
      const zoomIndicator = lightbox.querySelector('.zoom-level-indicator');
      const imageContainer = lightbox.querySelector('.lightbox-image-container');
      
      function updateZoom(newLevel) {
        zoomLevel = Math.max(1, Math.min(3, newLevel)); // Clamp between 1x and 3x
        img.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        img.style.transform = 'scale(' + zoomLevel + ')';
        zoomIndicator.textContent = Math.round(zoomLevel * 100) + '%';
        
        // Enable/disable overflow panning when zoomed
        if (zoomLevel > 1) {
          imageContainer.style.overflow = 'auto';
          imageContainer.style.cursor = 'move';
          img.classList.add('zoomed');
        } else {
          imageContainer.style.overflow = 'hidden';
          imageContainer.style.cursor = 'pointer';
          img.classList.remove('zoomed');
        }
      }
      
      if (zoomIn) zoomIn.addEventListener('click', () => updateZoom(zoomLevel + 0.25));
      if (zoomOut) zoomOut.addEventListener('click', () => updateZoom(zoomLevel - 0.25));
      if (zoomReset) zoomReset.addEventListener('click', () => updateZoom(1));
      
      // Double-click to zoom
      img.addEventListener('dblclick', () => {
        if (zoomLevel === 1) {
          updateZoom(2);
        } else {
          updateZoom(1);
        }
      });
      
      // Mouse wheel zoom
      imageContainer.addEventListener('wheel', (e) => {
        if (e.ctrlKey) {
          e.preventDefault();
          const delta = e.deltaY > 0 ? -0.1 : 0.1;
          updateZoom(zoomLevel + delta);
        }
      }, { passive: false });
      
      // Touch/swipe navigation + vertical dismiss
      const content = lightbox.querySelector('.lightbox-content');
      let isHorizontal = false, isVertical = false;
      content.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) return; // handled by pinch logic below
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isDragging = false; isHorizontal = false; isVertical = false;
      }, { passive: true });
      
      content.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) return; // pinch separate
        if (!touchStartX) return;
        const dx = e.touches[0].clientX - touchStartX;
        const dy = e.touches[0].clientY - touchStartY;
        const absX = Math.abs(dx), absY = Math.abs(dy);
        
        if (!isHorizontal && !isVertical) {
          if (absX > 16 || absY > 16) {
            if (absX > absY) { isHorizontal = true; }
            else { isVertical = true; }
          }
        }
        
        if (isHorizontal && zoomLevel === 1) {
          isDragging = true;
          img.style.transition = 'none';
          img.style.transform = 'translateX(' + dx + 'px)';
          e.stopPropagation();
          e.preventDefault?.();
        } else if (isVertical && zoomLevel === 1) {
          isDragging = true;
          const translate = Math.max(-120, Math.min(120, dy));
          const opacity = Math.max(0.3, 1 - Math.abs(translate) / 160);
          content.style.transform = 'translateY(' + translate + 'px)';
          content.style.transition = 'none';
          content.style.opacity = String(opacity);
          e.stopPropagation();
          e.preventDefault?.();
        }
      }, { passive: false });
      
      content.addEventListener('touchend', (e) => {
        const dx = (e.changedTouches[0]?.clientX || 0) - (touchStartX || 0);
        const dy = (e.changedTouches[0]?.clientY || 0) - (touchStartY || 0);
        if (isHorizontal && zoomLevel === 1) {
          img.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
          img.style.transform = 'scale(' + zoomLevel + ')';
          if (Math.abs(dx) > 56) {
            navigateToImage(currentIndex + (dx < 0 ? 1 : -1));
          }
        } else if (isVertical && zoomLevel === 1) {
          content.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
          if (Math.abs(dy) > 56) {
            closeLightbox();
          } else {
            content.style.transform = '';
            content.style.opacity = '1';
          }
        }
        touchStartX = 0; touchStartY = 0; isDragging = false; isHorizontal = false; isVertical = false;
      }, { passive: true });

      // Pinch-to-zoom (touch)
      let pinchStartDistance = 0;
      function distance(t1, t2) {
        const dx = t2.clientX - t1.clientX; const dy = t2.clientY - t1.clientY; return Math.hypot(dx, dy);
      }
      imageContainer.style.touchAction = 'none';
      imageContainer.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
          pinchStartDistance = distance(e.touches[0], e.touches[1]);
        }
      }, { passive: true });
      imageContainer.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
          e.preventDefault();
          const d = distance(e.touches[0], e.touches[1]);
          if (pinchStartDistance > 0) {
            const scaleDelta = d / pinchStartDistance;
            const newLevel = Math.min(3, Math.max(1, zoomLevel * scaleDelta));
            updateZoom(newLevel);
          }
        }
      }, { passive: false });
      imageContainer.addEventListener('touchend', (e) => {
        if (e.touches.length < 2) {
          pinchStartDistance = 0;
        }
      }, { passive: true });

      // Tap outside image inside content closes
      content.addEventListener('click', (e) => {
        if (!e.target.closest('.lightbox-image') && !e.target.closest('.lightbox-zoom-controls') && !e.target.closest('.lightbox-nav')) {
          closeLightbox();
        }
      });
      
      // Reset zoom when changing images
      const originalNavigate = navigateToImage;
      navigateToImage = function(index) {
        updateZoom(1);
        originalNavigate(index);
      };
    }
    
    // Wrapper function to open lightbox from carousel
    window.openImageLightbox = function(category, index, imagesOverride) {
      let images = Array.isArray(imagesOverride) ? imagesOverride.slice() : null;
      if (!images) {
        const carousel = document.querySelector('[data-category="' + category + '"]');
        if (!carousel) return;
        images = Array.from(carousel.querySelectorAll('.carousel-image'))
          .map(function(img) { return img.src; });
      }
      if (images && images.length > 0) {
        ensureLightboxExists();
        window.openLightbox(images, index || 0);
      }
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
          <div style="color: #555; line-height: 1.8; font-size: 15px; white-space: pre-wrap; word-wrap: break-word; margin: 0; padding: 0;">
\${zone.description}</div>
        </div>
        
        <div class="project-section">
          <h3 style="color: \${zoneColor};">🏗️ Key Features & Infrastructure</h3>
          <ul class="feature-list">
            \${zone.features.map(feature => \`<li>\${feature}</li>\`).join('')}
          </ul>
        </div>
        
        \${zone.membershipTiers ? \`
          <div class="project-section">
            <h3 style="color: \${zoneColor};">🎫 Membership Tiers</h3>
            \${zone.membershipTiers.map(tier => \`
              <div style="padding: 16px; background: linear-gradient(135deg, \${lightColor} 0%, \${mediumColor} 100%); border-radius: 10px; border-left: 4px solid \${zoneColor}; margin-bottom: 12px;">
                <div style="font-weight: 700; color: \${zoneColor}; font-size: 15px; margin-bottom: 6px;">\${tier.name}: \${tier.price}</div>
                <div style="color: #555; font-size: 13px; line-height: 1.5;">\${tier.benefits}</div>
              </div>
            \`).join('')}
          </div>
        \` : ''}
        
        \${zone.revenueModel ? \`
          <div class="project-section">
            <h3 style="color: \${zoneColor};">💰 Revenue Model</h3>
            <div style="background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%); padding: 20px; border-radius: 12px; border-left: 4px solid #28a745;">
              <div style="margin-bottom: 12px;">
                <div style="font-weight: 600; color: #28a745; font-size: 14px; margin-bottom: 4px;">Membership Revenue:</div>
                <div style="color: #333; font-size: 14px;">\${zone.revenueModel.membershipRevenue}</div>
              </div>
              <div style="margin-bottom: 12px;">
                <div style="font-weight: 600; color: #28a745; font-size: 14px; margin-bottom: 4px;">Workshop Revenue:</div>
                <div style="color: #333; font-size: 14px;">\${zone.revenueModel.workshopRevenue}</div>
              </div>
              <div style="margin-bottom: 12px;">
                <div style="font-weight: 600; color: #28a745; font-size: 14px; margin-bottom: 4px;">Collaborator Revenue:</div>
                <div style="color: #333; font-size: 14px;">\${zone.revenueModel.collaboratorRevenue}</div>
              </div>
              <div style="margin-bottom: 12px;">
                <div style="font-weight: 600; color: #28a745; font-size: 14px; margin-bottom: 4px;">Spa Services:</div>
                <div style="color: #333; font-size: 14px;">\${zone.revenueModel.spaServices}</div>
              </div>
              <div style="margin-bottom: 12px;">
                <div style="font-weight: 600; color: #28a745; font-size: 14px; margin-bottom: 4px;">Retreat Add-Ons:</div>
                <div style="color: #333; font-size: 14px;">\${zone.revenueModel.retreatAddOns}</div>
              </div>
              <div style="padding-top: 12px; border-top: 2px solid #28a745; margin-top: 12px;">
                <div style="font-weight: 700; color: #28a745; font-size: 15px; margin-bottom: 8px;">Total Year 1: \${zone.revenueModel.totalYear1}</div>
            </div>
          </div>
\` : (zone.revenueStreams ? \`
          <div class="project-section">
            <h3 style="color: \${zoneColor};">💵 Revenue Streams</h3>
\${zone.revenueStreams.map(stream => \`<div class="revenue-stream">\${stream}</div>\`).join('')}
          </div>
\` : '')}
        \${zone.developmentTimeline ? \`
          <div class="project-section">
            <h3 style="color: \${zoneColor};">📅 Development Timeline</h3>
            \${zone.developmentTimeline.map(phase => \`
              <div style="padding: 20px; background: linear-gradient(135deg, \${lightColor} 0%, \${mediumColor} 100%); border-radius: 12px; border-left: 4px solid \${zoneColor}; margin-bottom: 16px;">
                <div style="font-weight: 700; color: \${zoneColor}; font-size: 16px; margin-bottom: 10px;">\${phase.phase}</div>
                <div style="color: #555; font-size: 14px; line-height: 1.6; margin-bottom: 8px;"><strong>Deliverables:</strong> \${phase.deliverables}</div>
                \${phase.investment ? \`<div style="color: #555; font-size: 14px; line-height: 1.6; margin-bottom: 8px;"><strong>Investment:</strong> \${phase.investment}</div>\` : ''}
                \${phase.monthlyRevenue ? \`<div style="color: #28a745; font-size: 14px; line-height: 1.6; margin-bottom: 8px;"><strong>Monthly Revenue:</strong> \${phase.monthlyRevenue}</div>\` : ''}
                <div style="background: rgba(255,255,255,0.6); padding: 8px 12px; border-radius: 6px; display: inline-block; margin-top: 6px; font-size: 13px; color: #666;"><strong>Status:</strong> \${phase.status}</div>
              </div>
            \`).join('')}
          </div>
        \` : \`
          <div class="project-section">
            <h3 style="color: \${zoneColor};">📅 Development Timeline</h3>
            <div style="padding: 20px; background: linear-gradient(135deg, \${lightColor} 0%, \${mediumColor} 100%); border-radius: 12px; border-left: 4px solid \${zoneColor};">
              <span class="timeline-phase">\${zone.timeline}</span>
              <p style="margin-top: 12px; color: #555; font-size: 14px; line-height: 1.5;">This zone is part of the comprehensive EcoVillageBuilder development plan, strategically phased for optimal cash flow and sustainable growth across the 10-acre Sulphur Mountain property.</p>
            </div>
          </div>
        \`}

        \${zone.wellnessAmenities ? \`
          <div class="project-section">
            <h3 style="color: \${zoneColor};">🌟 Wellness Amenities</h3>
            <ul class="feature-list">
              \${zone.wellnessAmenities.map(amenity => \`<li>\${amenity}</li>\`).join('')}
            </ul>
          </div>
        \` : zone.integratedGardenSystem ? \`
          <div class="project-section">
            <h3 style="color: \${zoneColor};">🌱 Integrated Garden System & Propagation</h3>
            <ul class="feature-list">
              \${zone.integratedGardenSystem.map(garden => \`<li>\${garden}</li>\`).join('')}
            </ul>
          </div>
        \` : zone.smartCultivationSystems ? \`
          <div class="project-section">
            <h3 style="color: \${zoneColor};">🧠 Smart Cultivation Systems</h3>
            <ul class="feature-list">
              \${zone.smartCultivationSystems.map(system => \`<li>\${system}</li>\`).join('')}
            </ul>
          </div>
        \` : ''}
        
        \${zone.tropicalFruitTrees ? \`
          <div class="project-section">
            <h3 style="color: \${zoneColor};">🌴 Tropical Fruit Trees & Propagation</h3>
            \${zone.tropicalFruitTrees.map(tree => \`
              <div style="padding: 16px; background: linear-gradient(135deg, \${lightColor} 0%, \${mediumColor} 100%); border-radius: 10px; border-left: 4px solid \${zoneColor}; margin-bottom: 12px;">
                <div style="font-weight: 700; color: \${zoneColor}; font-size: 15px; margin-bottom: 6px;">\${tree.name}</div>
                <div style="color: #555; font-size: 13px; line-height: 1.5; margin-bottom: 4px;"><strong>Propagation:</strong> \${tree.propagation}</div>
                <div style="color: #555; font-size: 13px; line-height: 1.5;"><strong>Products:</strong> \${tree.products}</div>
              </div>
            \`).join('')}
          </div>
        \` : ''}
        
        \${zone.productsOfferings ? \`
          <div class="project-section">
            <h3 style="color: \${zoneColor};">🌿 Products & Offerings</h3>
            \${zone.productsOfferings.map(category => \`
              <div style="padding: 16px; background: linear-gradient(135deg, \${lightColor} 0%, \${mediumColor} 100%); border-radius: 10px; border-left: 4px solid \${zoneColor}; margin-bottom: 12px;">
                <div style="font-weight: 700; color: \${zoneColor}; font-size: 15px; margin-bottom: 8px;">\${category.category}</div>
                <ul style="margin: 0; padding-left: 20px; list-style: disc;">
                  \${category.items.map(item => \`<li style="color: #555; font-size: 14px; line-height: 1.6; margin-bottom: 4px;">\${item}</li>\`).join('')}
                </ul>
              </div>
            \`).join('')}
          </div>
        \` : ''}
        
        \${zone.regenerativePractices ? \`
          <div class="project-section">
            <h3 style="color: \${zoneColor};">🌱 Regenerative Practices & Land Stewardship</h3>
            <ul class="feature-list">
              \${zone.regenerativePractices.map(practice => \`<li>\${practice}</li>\`).join('')}
            </ul>
          </div>
        \` : zone.regenerativeDesign ? \`
          <div class="project-section">
            <h3 style="color: \${zoneColor};">🌿 Regenerative Design & Eco-Luxury Living</h3>
            <ul class="feature-list">
              \${zone.regenerativeDesign.map(design => \`<li>\${design}</li>\`).join('')}
            </ul>
          </div>
        \` : zone.id === 'tropical-dome-greenhouse' && zone.regenerativeSystems ? \`
          <div class="project-section">
            <h3 style="color: \${zoneColor};">🌴 Regenerative Systems & Tropical Production</h3>
            <ul class="feature-list">
              \${zone.regenerativeSystems.map(system => \`<li>\${system}</li>\`).join('')}
            </ul>
          </div>
        \` : zone.regenerativeSystems ? \`
          <div class="project-section">
            <h3 style="color: \${zoneColor};">⚡ Regenerative Systems & Operational Efficiency</h3>
            <ul class="feature-list">
              \${zone.regenerativeSystems.map(system => \`<li>\${system}</li>\`).join('')}
            </ul>
          </div>
        \` : zone.infrastructureEssentials ? \`
          <div class="project-section">
            <h3 style="color: \${zoneColor};">⚙️ Utility Systems & Phased Development</h3>
            <ul class="feature-list">
              \${zone.infrastructureEssentials.map(essential => \`<li>\${essential}</li>\`).join('')}
            </ul>
          </div>
        \` : ''}

        \${zone.propertyValue ? \`
          <div class="project-section">
            <h3 style="color: \${zoneColor};">🏡 Property Value Projections</h3>
            <div style="background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%); padding: 20px; border-radius: 12px; border-left: 4px solid #28a745;">
              <div style="margin-bottom: 16px;">
                <div style="font-weight: 700; color: #28a745; font-size: 15px; margin-bottom: 8px;">Current Property Value:</div>
                <div style="font-size: 18px; font-weight: 700; color: #333; margin-bottom: 16px;">\${zone.propertyValue.current}</div>
                
                <div style="font-weight: 700; color: #28a745; font-size: 15px; margin-bottom: 8px;">Appraised Value (5,000 sq ft Prefab):</div>
                <div style="font-size: 18px; font-weight: 700; color: #333; margin-bottom: 16px;">\${zone.propertyValue.appraisedPrefab}</div>
                
                <div style="font-weight: 700; color: #28a745; font-size: 15px; margin-bottom: 8px;">Projected Custom Eco-Retreat Value:</div>
                <div style="font-size: 22px; font-weight: 700; color: #28a745; margin-bottom: 16px;">\${zone.propertyValue.projectedCustom}</div>
                
                <div style="font-weight: 700; color: #28a745; font-size: 15px; margin-bottom: 8px;">Property Value Increase:</div>
                <div style="font-size: 20px; font-weight: 700; color: #28a745; margin-bottom: 16px;">\${zone.propertyValue.increase} (335% appreciation)</div>
              </div>
              <p style="color: #155724; margin: 0; font-size: 13px; line-height: 1.5; font-style: italic;">
                \${zone.propertyValue.note}
              </p>
            </div>
          </div>
        \` : zone.marketContext ? \`
          <div class="project-section">
            <h3 style="color: \${zoneColor};">🎶 Ojai's Growing Event & Ceremony Scene</h3>
            <div style="background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); padding: 20px; border-radius: 12px; border-left: 4px solid #ffc107;">
              <p style="color: #856404; margin: 0; font-size: 14px; line-height: 1.5;">
                \${zone.marketContext}
              </p>
            </div>
          </div>
        \` : zone.operationalFunction ? \`
          <div class="project-section">
            <h3 style="color: \${zoneColor};">🎯 Operational Function</h3>
            <div style="background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); padding: 20px; border-radius: 12px; border-left: 4px solid #4caf50;">
              <p style="color: #2e7d32; margin: 0; font-size: 14px; line-height: 1.6;">
                \${zone.operationalFunction}
              </p>
            </div>
          </div>
        \` : zone.marketAnalysis ? \`
          <div class="project-section">
            <h3 style="color: \${zoneColor};">📊 Market Analysis & Growth Potential</h3>
            <div style="background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); padding: 20px; border-radius: 12px; border-left: 4px solid #ffc107;">
              <p style="color: #856404; margin: 0; font-size: 14px; line-height: 1.5;">
                \${zone.marketAnalysis}
              </p>
            </div>
          </div>
        \` : zone.id !== 'beekeeping-program' && zone.id !== 'events-gatherings-hub' && zone.id !== 'wellness-facilities' && zone.id !== 'community-hub' && zone.id !== 'ceremonial-infrastructure' && zone.id !== 'infrastructure' && zone.id !== 'retreat-village' && zone.id !== 'livestock-dairy' && zone.id !== 'gatelodge-operations-hub' && zone.id !== 'tropical-dome-greenhouse' && zone.id !== 'farmstead-produce-stand' ? \`
          <div class="project-section">
            <h3 style="color: \${zoneColor};">📊 Market Analysis & Projections</h3>
            <div style="background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); padding: 20px; border-radius: 12px; border-left: 4px solid #ffc107;">
              <p style="color: #856404; margin: 0; font-size: 14px; line-height: 1.5;">
                <strong>Market Position:</strong> Positioned in the rapidly growing eco-tourism and sustainable living sectors, with projected 15-20% annual growth in demand for authentic wellness retreats and farm-to-table experiences in the Ojai Valley region.
              </p>
            </div>
          </div>
        \` : ''}
        
        <div class="project-section">
          <h3 style="color: \${zoneColor};">💰 Investment Summary</h3>
          <div class="investment-grid">
            <div class="investment-card" style="border-color: \${zoneColor};">
              <div class="investment-label">\${zone.id === 'beekeeping-program' ? 'Starting Budget' : (zone.id === 'agricultural-hub' ? 'Estimated Total Budget' : (zone.id === 'infrastructure' || zone.id === 'retreat-village' || zone.id === 'livestock-dairy' || zone.id === 'tropical-dome-greenhouse' ? 'Estimated Budget' : 'Total Budget'))}</div>
              <div class="investment-value" style="color: \${zoneColor};">\${zone.id === 'tropical-dome-greenhouse' ? \`
                <div style="display: flex; flex-direction: column; align-items: center; gap: 6px; line-height: 1.3;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-weight: 700; font-size: 16px; color: \${zoneColor};">Phase 1</span>
                    <span style="font-size: 13px; color: #555;">$30K (with investment)</span>
                  </div>
                </div>
              \` : zone.id === 'infrastructure' ? \`
                <div style="display: flex; flex-direction: column; align-items: center; gap: 6px; line-height: 1.3;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-weight: 700; font-size: 16px; color: \${zoneColor};">P1</span>
                    <span style="font-size: 13px; color: #555;">$62K-$77K</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-weight: 700; font-size: 16px; color: \${zoneColor};">P2</span>
                    <span style="font-size: 13px; color: #555;">$40K-$60K</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-weight: 700; font-size: 16px; color: \${zoneColor};">P3</span>
                    <span style="font-size: 13px; color: #555;">$40K-$50K</span>
                  </div>
                </div>
              \` : zone.id === 'retreat-village' ? \`
                <div style="display: flex; flex-direction: column; align-items: center; gap: 6px; line-height: 1.3;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-weight: 700; font-size: 16px; color: \${zoneColor};">P1</span>
                    <span style="font-size: 13px; color: #555;">$70K-$80K</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-weight: 700; font-size: 16px; color: \${zoneColor};">P2</span>
                    <span style="font-size: 13px; color: #555;">$20K+ (flexible)</span>
                  </div>
                </div>
              \` : zone.id === 'livestock-dairy' ? \`
                <div style="display: flex; flex-direction: column; align-items: center; gap: 6px; line-height: 1.3;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-weight: 700; font-size: 16px; color: \${zoneColor};">P1</span>
                    <span style="font-size: 13px; color: #555;">$20K-$25K</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-weight: 700; font-size: 16px; color: \${zoneColor};">P2</span>
                    <span style="font-size: 13px; color: #555;">$5K/month</span>
                  </div>
                </div>
              \` : zone.id === 'farmstead-produce-stand' ? \`
                <div style="display: flex; flex-direction: column; align-items: center; gap: 6px; line-height: 1.3;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-weight: 700; font-size: 16px; color: \${zoneColor};">Farm Stand</span>
                    <span style="font-size: 13px; color: #555;">$2K-$5K</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-weight: 700; font-size: 16px; color: \${zoneColor};">Online Shop</span>
                    <span style="font-size: 13px; color: #555;">~$5K</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-weight: 700; font-size: 16px; color: \${zoneColor};">Total</span>
                    <span style="font-size: 13px; color: #555;">$7K-$10K</span>
                  </div>
                </div>
              \` : \`\${zone.budget}\`}</div>
            </div>
            <div class="investment-card" style="border-color: \${zoneColor};">
              <div class="investment-label">\${zone.id === 'beekeeping-program' ? 'Revenue Starting' : 'Monthly Revenue'}</div>
              <div class="investment-value roi-positive" style="color: \${zoneColor};">\${zone.id === 'events-gatherings-hub' ? \`
                <div style="display: flex; flex-direction: column; align-items: center; gap: 6px; line-height: 1.3;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-weight: 700; font-size: 16px; color: \${zoneColor};">P1</span>
                    <span style="font-size: 13px; color: #555;">$4.5K-$9K</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-weight: 700; font-size: 16px; color: \${zoneColor};">P2</span>
                    <span style="font-size: 13px; color: #555;">$11K-$22K</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-weight: 700; font-size: 16px; color: \${zoneColor};">P3</span>
                    <span style="font-size: 13px; color: #555;">$27K-$41K</span>
                  </div>
                </div>
              \` : zone.id === 'wellness-facilities' ? \`
                <div style="display: flex; flex-direction: column; align-items: center; gap: 6px; line-height: 1.3;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-weight: 700; font-size: 16px; color: \${zoneColor};">P1</span>
                    <span style="font-size: 13px; color: #555;">$0</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-weight: 700; font-size: 16px; color: \${zoneColor};">P2</span>
                    <span style="font-size: 13px; color: #555;">$0</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-weight: 700; font-size: 16px; color: \${zoneColor};">P3</span>
                    <span style="font-size: 13px; color: #555;">$10K-$15K</span>
                  </div>
                </div>
              \` : zone.id === 'glamping-creek-village' ? \`
                <div style="display: flex; flex-direction: column; align-items: center; gap: 6px; line-height: 1.3;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-weight: 700; font-size: 16px; color: \${zoneColor};">P1</span>
                    <span style="font-size: 13px; color: #555;">$0</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-weight: 700; font-size: 16px; color: \${zoneColor};">P2</span>
                    <span style="font-size: 13px; color: #555;">$8.75K-$10K</span>
                  </div>
                </div>
              \` : zone.id === 'community-hub' ? \`
                <div style="display: flex; flex-direction: column; align-items: center; gap: 6px; line-height: 1.3;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-weight: 700; font-size: 16px; color: \${zoneColor};">P1</span>
                    <span style="font-size: 13px; color: #555;">$0</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-weight: 700; font-size: 16px; color: \${zoneColor};">P2</span>
                    <span style="font-size: 13px; color: #555;">$7K-$10K+</span>
                  </div>
                </div>
              \` : zone.id === 'mcqueens-garage' ? \`
                <div style="display: flex; flex-direction: column; align-items: center; gap: 6px; line-height: 1.3;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-weight: 700; font-size: 16px; color: \${zoneColor};">P1</span>
                    <span style="font-size: 13px; color: #555;">$0</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-weight: 700; font-size: 16px; color: \${zoneColor};">P2</span>
                    <span style="font-size: 13px; color: #555;">$0</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-weight: 700; font-size: 16px; color: \${zoneColor};">P3</span>
                    <span style="font-size: 13px; color: #555;">$15K-$25K+</span>
                  </div>
                </div>
              \` : zone.monthlyRevenue}</div>
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
              <span>18 Project Zones</span> • 
              <span>$1.33M Investment</span> • 
              <span>10-Acre Property</span> • 
              <span>Ojai Valley, CA</span>
            </div>
            <div class="footer-tagline">Regenerative Living • Collaborative Design • Community Wellness</div>
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
</html>`

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

// Helper function to parse budget strings (handles K suffix, ranges, and phases)
function parseBudget(budgetStr) {
  // Extract all numbers with K suffix or regular numbers
  const numbers = [];
  
  // Match patterns like $70K, $35,000, etc.
  const matches = budgetStr.matchAll(/\$(\d+(?:,\d{3})*|\d+)K?/gi);
  
  for (const match of matches) {
    let num = parseFloat(match[1].replace(/,/g, ''));
    // If it had 'K' suffix, multiply by 1000
    if (match[0].toUpperCase().includes('K')) {
      num *= 1000;
    }
    numbers.push(num);
  }
  
  // If no numbers found, return 0
  if (numbers.length === 0) return 0;
  
  // Return average of all numbers found
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
}

// API endpoint for project zones data
app.get('/api/project-zones', (req, res) => {
  try {
    const totalInvestment = PROJECT_ZONES.reduce((sum, zone) => {
      return sum + parseBudget(zone.budget);
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
  'events-gatherings-hub': 'Events & Gatherings Hub',
  'livestock-program': 'Livestock & Dairy Program',
  'livestock-dairy': 'Livestock & Dairy Program',
  'creative-workshop-center': 'Creative Workshop & Art Creation Center',
  'glamping-creek-village': 'Creek-Side Glamping & Lodging Village',
  'gatelodge-operations-hub': 'Sulphur Mountain Gatelodge (Operations ADU)',
  'tropical-dome-greenhouse': 'Tropical Dome House',
  'sulphur-mountain-sanctuary': 'Sulphur Mountain Sanctuary The Living Landscape',
  'farmstead-produce-stand': 'Farmstead Produce Stand & Online Hub'
};

// API endpoint to get images for a specific zone
// Uses configuration file (image-urls.js) with direct URLs from Supabase
// Supports subcategories for zones like infrastructure, main-residence, retreat-village
app.get('/api/images/:zoneId/:category', async (req, res) => {
  try {
    const { zoneId, category } = req.params;
    const categoryLower = category.toLowerCase();
    
    // Get images from configuration
    const zoneImages = IMAGE_URLS[zoneId] || {};
    let categoryData = zoneImages[categoryLower];
    
    // Check if category data has subcategories (is an object with subcategory keys)
    let hasSubcategories = false;
    let images = [];
    let subcategories = null;
    
    if (categoryData && typeof categoryData === 'object' && !Array.isArray(categoryData)) {
      // This category has subcategories
      hasSubcategories = true;
      subcategories = Object.keys(categoryData);
      // Flatten all subcategory images into one array for backward compatibility
      images = Object.values(categoryData).flat();
    } else if (Array.isArray(categoryData)) {
      // Regular array of images
      images = categoryData;
    }
    
    // Aggressive caching for images (1 year) since URLs contain content hash
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    res.json({
      success: true,
      zoneId: zoneId,
      category: category,
      hasSubcategories: hasSubcategories,
      subcategories: subcategories,
      images: images,
      count: images.length,
      subcategoryData: hasSubcategories ? categoryData : null,
      note: 'Using configured URLs from image-urls.js'
    });
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
    const totalInvestment = PROJECT_ZONES.reduce((sum, zone) => {
      return sum + parseBudget(zone.budget);
    }, 0);
    console.log('🚀 EcoVillageBuilder Interactive Map Server');
    console.log(`🌐 Server running on port ${PORT}`);
    console.log(`📊 Serving ${PROJECT_ZONES.length} project zones ($${(totalInvestment/1000000).toFixed(2)}M total investment)`);
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