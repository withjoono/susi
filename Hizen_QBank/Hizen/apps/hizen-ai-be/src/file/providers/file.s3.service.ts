import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Injectable } from "@nestjs/common";

import { FileUrlPair, S3PresignedFileUrl } from "@app/api/dto/file.dto";
import { GlobalConfig } from "@app/global/global";

@Injectable()
export class FileS3Service {
  private readonly s3 = new S3Client({
    region: GlobalConfig.Instance.AwsRegion,
    credentials: {
      accessKeyId: GlobalConfig.Instance.AwsAccessKeyId,
      secretAccessKey: GlobalConfig.Instance.AwsSecretAccessKey,
    },
  });

  async createPresignedUrlForUpload(
    directory: string,
    key: string,
    mimeType: string,
  ): Promise<FileUrlPair> {
    const command = new PutObjectCommand({
      Bucket: GlobalConfig.Instance.AwsS3BucketName,
      Key: `${directory}/${key}`,
      ContentType: mimeType,
    });

    const expirationInSeconds = 60 * 60 * 24;
    const expiration = new Date(Date.now() + 1000 * expirationInSeconds);

    const presignedUrl = await getSignedUrl(this.s3, command, {
      expiresIn: expirationInSeconds,
    });

    return {
      url: `https://${GlobalConfig.Instance.AwsS3BucketName}.s3.${GlobalConfig.Instance.AwsRegion}.amazonaws.com/${directory}/${key}`,
      presignedUrl: {
        url: presignedUrl,
        expiration: expiration.toISOString(),
      },
    };
  }

  async createPresignedUrlForDownload(
    directory: string,
    key: string,
    fileName: string,
  ): Promise<S3PresignedFileUrl> {
    const command = new GetObjectCommand({
      Bucket: GlobalConfig.Instance.AwsS3BucketName,
      Key: `${directory}/${key}`,
      ResponseContentDisposition: `attachment; filename="${encodeURIComponent(
        fileName,
      )}"`,
    });

    const expirationInSeconds = 60 * 60 * 24;
    const expiration = new Date(Date.now() + 1000 * expirationInSeconds);

    const presignedUrl = await getSignedUrl(this.s3, command, {
      expiresIn: expirationInSeconds,
    });

    return {
      url: presignedUrl,
      expiration: expiration.toISOString(),
    };
  }
}
