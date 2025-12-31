import { configDotenv } from "dotenv";
import * as path from "path";
import { assertGuard } from "typia";

const DEFAULT_PORT = 3000;

export class GlobalConfig {
  private static instance: GlobalConfig;

  static get Instance(): GlobalConfig {
    if (GlobalConfig.instance === undefined) {
      GlobalConfig.initialize();
    }

    return GlobalConfig.instance;
  }

  static initialize() {
    if (process.env.NODE_ENV === "build") {
      configDotenv({
        path: path.resolve(process.cwd(), ".env.example"),
      });
    } else if (process.env.NODE_ENV === "development") {
      configDotenv({
        path: path.resolve(process.cwd(), ".env"),
      });
    }

    const env = process.env;

    interface GlobalEnv {
      PORT?: string;
      CORS_ORIGIN?: string;
      DATABASE_URL: string;
      DATABASE_ENCRYPTION_KEY: string;
      TEST_ADMIN_EMAIL?: string;
      TEST_ADMIN_USERNAME?: string;
      TEST_ADMIN_PASSWORD?: string;
      OPENAI_API_KEY: string;
      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;
      AWS_REGION: string;
      AWS_S3_BUCKET_NAME: string;
    }

    assertGuard<GlobalEnv>(env);

    const port = Number.parseInt(env.PORT ?? `${DEFAULT_PORT}`);

    if (Number.isNaN(port) || port < 0 || 65535 < port) {
      throw new Error(
        "invalid port; port must be a valid integer between 0 and 65535",
      );
    }

    GlobalConfig.instance = new GlobalConfig(
      port,
      env.CORS_ORIGIN ?? "*",
      env.DATABASE_URL,
      env.DATABASE_ENCRYPTION_KEY,
      env.TEST_ADMIN_EMAIL,
      env.TEST_ADMIN_USERNAME,
      env.TEST_ADMIN_PASSWORD,
      env.OPENAI_API_KEY,
      env.AWS_ACCESS_KEY_ID,
      env.AWS_SECRET_ACCESS_KEY,
      env.AWS_REGION,
      env.AWS_S3_BUCKET_NAME,
    );
  }

  constructor(
    private readonly port: number,
    private readonly corsOrigin: string,
    private readonly databaseUrl: string,
    private readonly databaseEncryptionKey: string,
    private readonly testAdminEmail: string | undefined,
    private readonly testAdminUsername: string | undefined,
    private readonly testAdminPassword: string | undefined,
    private readonly openAiApiKey: string,
    private readonly awsAccessKeyId: string,
    private readonly awsSecretAccessKey: string,
    private readonly awsRegion: string,
    private readonly awsS3BucketName: string,
  ) {}

  public get Port(): number {
    return this.port;
  }

  public get CorsOrigin(): string {
    return this.corsOrigin;
  }

  public get DatabaseUrl(): string {
    return this.databaseUrl;
  }

  public get DatabaseEncryptionKey(): string {
    return this.databaseEncryptionKey;
  }

  public get TestAdminEmail(): string | undefined {
    return this.testAdminEmail;
  }

  public get TestAdminUsername(): string | undefined {
    return this.testAdminUsername;
  }

  public get TestAdminPassword(): string | undefined {
    return this.testAdminPassword;
  }

  public get OpenAiApiKey(): string {
    return this.openAiApiKey;
  }

  public get AwsAccessKeyId(): string {
    return this.awsAccessKeyId;
  }

  public get AwsSecretAccessKey(): string {
    return this.awsSecretAccessKey;
  }

  public get AwsRegion(): string {
    return this.awsRegion;
  }

  public get AwsS3BucketName(): string {
    return this.awsS3BucketName;
  }
}
