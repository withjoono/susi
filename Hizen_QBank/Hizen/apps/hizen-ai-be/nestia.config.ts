import { INestiaConfig } from "@nestia/sdk";
import { NestFactory } from "@nestjs/core";

import { SdkModule } from "./src/sdk.module";

const NESTIA_CONFIG: INestiaConfig = {
  input: async () => {
    return await NestFactory.create(SdkModule);
  },
  output: "src/api",
  distribute: "packages/api",
  swagger: {
    openapi: "3.1",
    output: "./src/swagger.json",
    security: {
      bearer: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
      },
    },
    servers: [
      {
        description: "local server",
        url: `http://localhost:3000`,
      },
      {
        description: "development server",
        url: `http://15.164.222.104`,
      },
    ],
    beautify: true,
  },
};

export default NESTIA_CONFIG;
