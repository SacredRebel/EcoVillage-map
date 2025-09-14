import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectZoneSchema } from "@shared/schema";

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

  // Create new project zone (Admin)
  app.post("/api/admin/project-zones", async (req, res) => {
    try {
      const validatedData = insertProjectZoneSchema.parse(req.body);
      const newZone = await storage.createProjectZone(validatedData);
      res.status(201).json(newZone);
    } catch (error) {
      res.status(400).json({ error: "Invalid project zone data" });
    }
  });

  // Update project zone (Admin)
  app.put("/api/admin/project-zones/:id", async (req, res) => {
    try {
      const validatedData = insertProjectZoneSchema.partial().parse(req.body);
      const updatedZone = await storage.updateProjectZone(req.params.id, validatedData);
      if (!updatedZone) {
        res.status(404).json({ error: "Project zone not found" });
        return;
      }
      res.json(updatedZone);
    } catch (error) {
      res.status(400).json({ error: "Invalid project zone data" });
    }
  });

  // Delete project zone (Admin)
  app.delete("/api/admin/project-zones/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteProjectZone(req.params.id);
      if (!deleted) {
        res.status(404).json({ error: "Project zone not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete project zone" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
