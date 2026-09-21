import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";

interface HealthResponse {
  status: "ok" | "degraded";
  database: "up" | "down";
  timestamp: string;
}

@Controller("health")
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async check(): Promise<HealthResponse> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: "ok", database: "up", timestamp: new Date().toISOString() };
    } catch {
      return { status: "degraded", database: "down", timestamp: new Date().toISOString() };
    }
  }
}