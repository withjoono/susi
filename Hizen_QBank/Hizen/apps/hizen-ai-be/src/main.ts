import { ConsoleLogger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { OpenAPIObject, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "@app/app.module";
import { GlobalConfig } from "@app/global/global";

import document from "./swagger.json";

async function bootstrap() {
  GlobalConfig.initialize();

  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      json: process.env.NODE_ENV === "production",
      logLevels: ["error", "warn", "log"],
    }),
  });
  app.enableCors({
    origin: GlobalConfig.Instance.CorsOrigin,
    credentials: true,
  });
  app.enableShutdownHooks();

  if (process.env.NODE_ENV !== "production") {
    SwaggerModule.setup("api", app, () => document as OpenAPIObject);
  }

  await app.listen(GlobalConfig.Instance.Port);
}

bootstrap().catch((error: unknown) => {
  console.error(`instance crashed: ${String(error)}`);
});
