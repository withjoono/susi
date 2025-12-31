import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { randomUUID } from "crypto";

import { File, FileUrlPair, S3PresignedFileUrl } from "@app/api/dto/file.dto";
import { DbService } from "@app/db/db.service";
import { FileS3Service } from "@app/file/providers/file.s3.service";

const FILE_UPLOAD_DIRECTORY = "uploaded-files";

@Injectable()
export class FileService {
  constructor(
    private readonly dbService: DbService,
    private readonly fileS3Service: FileS3Service,
  ) {}

  async createFile(
    name: string,
    description: string | null,
    mimeType: string,
  ): Promise<[File, FileUrlPair]> {
    const key = randomUUID();
    const fileUrlPair = await this.fileS3Service.createPresignedUrlForUpload(
      FILE_UPLOAD_DIRECTORY,
      key,
      mimeType,
    );
    const file = await this.dbService.Prisma.uploadedFile.create({
      data: {
        id: key,
        name,
        description,
        mimeType,
        url: fileUrlPair.url,
      },
      select: {
        id: true,
        name: true,
        description: true,
        mimeType: true,
        url: true,
        createdAt: true,
      },
    });

    return [
      {
        id: file.id,
        name: file.name,
        description: file.description,
        mimeType: file.mimeType,
        createdAt: file.createdAt.toISOString(),
      },
      fileUrlPair,
    ];
  }

  async getImageFileUrl(fileId: string): Promise<[File, S3PresignedFileUrl]> {
    const file = await this.dbService.Prisma.uploadedFile.findUnique({
      select: {
        id: true,
        name: true,
        description: true,
        mimeType: true,
        createdAt: true,
      },
      where: { id: fileId },
    });

    if (!file) {
      throw new NotFoundException(`file with id ${fileId} not found`);
    }

    if (!file.mimeType.startsWith("image/")) {
      throw new UnprocessableEntityException(
        `file with id ${fileId} is not an image`,
      );
    }

    const presignedUrl = await this.fileS3Service.createPresignedUrlForDownload(
      FILE_UPLOAD_DIRECTORY,
      file.id,
      file.name,
    );

    return [
      {
        id: file.id,
        name: file.name,
        description: file.description,
        mimeType: file.mimeType,
        createdAt: file.createdAt.toISOString(),
      },
      presignedUrl,
    ];
  }
}
