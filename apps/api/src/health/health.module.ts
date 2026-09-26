/**
 * Módulo de salud: registra el HealthController.
 * No necesita providers propios porque PrismaService es global.
 */

import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller.js";

@Module({
  controllers: [HealthController], // Expone GET /api/health
})
// Módulo que agrupa la funcionalidad de health check
export class HealthModule {}