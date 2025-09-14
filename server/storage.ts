import { type User, type InsertUser, type ProjectZone, type InsertProjectZone } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getProjectZones(): Promise<ProjectZone[]>;
  getProjectZone(id: string): Promise<ProjectZone | undefined>;
  getProjectZoneByType(type: string): Promise<ProjectZone | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private projectZones: Map<string, ProjectZone>;

  constructor() {
    this.users = new Map();
    this.projectZones = new Map();
    this.initializeProjectZones();
  }

  private initializeProjectZones() {
    const zones: Omit<ProjectZone, 'id'>[] = [
      {
        name: "Agricultural Hub",
        type: "agricultural",
        budget: "$500K",
        timeline: "6 mo",
        monthlyRevenue: "$5K",
        description: "A comprehensive 3-acre agricultural operation featuring regenerative farming practices, advanced nursery operations, sacred geometry flower gardens, and fruit tree orchards. This zone serves as the productive heart of the eco-village, providing fresh produce for residents and generating revenue through CSA programs and farm-to-table experiences.",
        features: [
          "3-acre regenerative farmland with fertile topsoil",
          "Advanced nursery and propagation facilities", 
          "500+ fruit trees in terraced orchard design",
          "Sacred geometry flower garden with stone terracing",
          "Gravity-fed irrigation and water management systems",
          "Compost and soil building infrastructure",
          "Art creation center integration for farm-to-art experiences"
        ],
        investment: "Opportunity to invest in sustainable agriculture infrastructure that generates consistent revenue through CSA subscriptions, farm tours, and wholesale produce sales. Projected ROI of 15-20% annually once fully operational.",
        status: "Ready to Begin",
        imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
        coordinates: [
          [34.4712, -119.2982],
          [34.4712, -119.2975],
          [34.4708, -119.2975],
          [34.4708, -119.2982]
        ],
        color: "#22C55E"
      },
      {
        name: "Main Residence Compound",
        type: "residence",
        budget: "$2.5M", 
        timeline: "12 mo",
        monthlyRevenue: "$18K",
        description: "The flagship 7,200 sq ft luxury residence compound featuring panoramic Topa-Topa Mountain views and capturing the iconic Ojai Pink Moment each evening. This elevated sanctuary serves as both a private residence and premium retreat accommodation, designed with sustainable materials and sacred architectural principles.",
        features: [
          "7,200 sq ft main residence with 6 bedrooms",
          "Panoramic Topa-Topa Mountain views",
          "1,200 sq ft guest house for additional accommodation",
          "3,600 sq ft vintage pool structure for creative conversion",
          "Expansive green lawn and ceremonial outdoor spaces",
          "Solar power systems and sustainable building materials",
          "Private access road and elevated positioning for maximum privacy"
        ],
        investment: "Prime luxury real estate investment with immediate rental income potential of $18,000/month through high-end retreat bookings. Property value appreciation expected to exceed 200% upon completion.",
        status: "Permits Ready",
        imageUrl: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
        coordinates: [
          [34.4714, -119.2983],
          [34.4714, -119.2978],
          [34.4711, -119.2978],
          [34.4711, -119.2983]
        ],
        color: "#3B82F6"
      },
      {
        name: "Community Hub",
        type: "community",
        budget: "$750K",
        timeline: "8 mo", 
        monthlyRevenue: "$8K",
        description: "The social heart of the eco-village featuring a central community kitchen built around a historic 100+ year-old stone fireplace. This gathering space includes livestock paddocks, seasonal creek access, and flexible event hosting capabilities for workshops, ceremonies, and community meals.",
        features: [
          "Central community kitchen with commercial capabilities",
          "Historic stone fireplace and BBQ pit as focal point",
          "Livestock paddock with secure fencing for horses and goats",
          "Seasonal creek corridor with bridge access",
          "Flexible indoor/outdoor event hosting spaces",
          "Bathroom facilities and covered seating areas",
          "Integration with existing shed structures for expanded use"
        ],
        investment: "Community revenue generation through event hosting, workshop fees, and livestock programs. Additional income from community kitchen rentals and catering services for local events.",
        status: "Design Phase",
        imageUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
        coordinates: [
          [34.4710, -119.2980],
          [34.4710, -119.2976],
          [34.4706, -119.2976],
          [34.4706, -119.2980]
        ],
        color: "#F59E0B"
      },
      {
        name: "Retreat Village",
        type: "retreat",
        budget: "$1.2M",
        timeline: "18 mo",
        monthlyRevenue: "$25K",
        description: "An innovative collection of 20-50 unique lodging units scattered throughout the hillside and creek corridors. Featuring McQueen's Garage as a 3,200 sq ft creative venue, plus diverse accommodation options from luxury glamping to custom dome structures, all designed for immersive nature experiences.",
        features: [
          "McQueen's Garage: 3,200 sq ft creative and ceremonial venue",
          "20-30 glamping units along seasonal creek corridor",
          "Hillside cabin and dome village with mountain views", 
          "Elevated deck platforms and luxury tent accommodations",
          "Private healing sanctuaries and ceremonial grounds",
          "Network of hiking trails connecting all lodging areas",
          "Integrated art installations and sacred space design"
        ],
        investment: "High-revenue lodging operation with rates from $100-300/night depending on unit type. McQueen's Garage venue rentals add $8,000/month in additional revenue streams.",
        status: "Planning Phase",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
        coordinates: [
          [34.4708, -119.2974],
          [34.4708, -119.2968],
          [34.4702, -119.2968],
          [34.4702, -119.2974]
        ],
        color: "#8B5CF6"
      },
      {
        name: "Infrastructure Systems",
        type: "infrastructure",
        budget: "$400K",
        timeline: "24 mo",
        monthlyRevenue: "$2K",
        description: "Comprehensive infrastructure development including road extensions, water systems, solar power grid, and electrical distribution. These foundational systems enable all other project phases while incorporating sustainable technologies and regenerative design principles.",
        features: [
          "1/4-mile road extension to upper hillside areas",
          "Water line extensions from existing well to all zones",
          "Distributed solar power grid with battery storage",
          "Electrical infrastructure and trenching for power distribution",
          "Fiber optic internet connectivity throughout property",
          "Septic and waste management systems upgrades",
          "Emergency access roads and fire safety infrastructure"
        ],
        investment: "Essential infrastructure that enables revenue generation across all other project zones. Solar systems provide immediate utility cost savings and potential grid-tie revenue.",
        status: "Engineering Phase",
        imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
        coordinates: [
          [34.4715, -119.2972],
          [34.4710, -119.2972],
          [34.4705, -119.2972],
          [34.4700, -119.2972]
        ],
        color: "#6B7280"
      }
    ];

    zones.forEach(zone => {
      const id = randomUUID();
      this.projectZones.set(id, { ...zone, id });
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProjectZones(): Promise<ProjectZone[]> {
    return Array.from(this.projectZones.values());
  }

  async getProjectZone(id: string): Promise<ProjectZone | undefined> {
    return this.projectZones.get(id);
  }

  async getProjectZoneByType(type: string): Promise<ProjectZone | undefined> {
    return Array.from(this.projectZones.values()).find(zone => zone.type === type);
  }
}

export const storage = new MemStorage();
