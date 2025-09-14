import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all project zones
  app.get("/api/project-zones", async (req, res) => {
    try {
      const zones = await storage.getProjectZones();
      res.json(zones);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project zones" });
    }
  });

  // Get specific project zone by ID
  app.get("/api/project-zones/:id", async (req, res) => {
    try {
      const zone = await storage.getProjectZone(req.params.id);
      if (!zone) {
        res.status(404).json({ error: "Project zone not found" });
        return;
      }
      res.json(zone);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project zone" });
    }
  });

  // Get project zone by type
  app.get("/api/project-zones/type/:type", async (req, res) => {
    try {
      const zone = await storage.getProjectZoneByType(req.params.type);
      if (!zone) {
        res.status(404).json({ error: "Project zone not found" });
        return;
      }
      res.json(zone);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project zone" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
