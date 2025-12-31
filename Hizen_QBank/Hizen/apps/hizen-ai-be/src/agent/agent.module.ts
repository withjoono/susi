import { Module } from "@nestjs/common";

import { AgentContextService } from "@app/agent/providers/agent.context.service";
import { AgentMemoryService } from "@app/agent/providers/agent.memory.service";
import { AgentService } from "@app/agent/providers/agent.service";

@Module({
  providers: [AgentService, AgentContextService, AgentMemoryService],
  exports: [AgentService, AgentContextService, AgentMemoryService],
})
export class AgentModule {}
