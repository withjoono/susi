import { TypedRoute } from "@nestia/core";
import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { GetHealth } from "@app/api/dto/health.dto";
import { DbService } from "@app/db/db.service";

@ApiTags("_health")
@Controller()
export class HealthController {
  constructor(private readonly dbService: DbService) {}

  @TypedRoute.Get("_health")
  async getHealth(): Promise<GetHealth.Response> {
    try {
      const databaseRoundTripDelayStart = performance.now();
      await this.dbService.Prisma.$executeRaw`SELECT 1`;
      const databaseRoundTripDelay =
        performance.now() - databaseRoundTripDelayStart;

      return {
        status: "ok",
        databaseRoundTripDelay,
      };
    } catch {
      return {
        status: "db-not-reachable",
      };
    }
  }
}
