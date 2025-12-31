import { Module } from "@nestjs/common";

import { FileController } from "@app/file/file.controller";
import { FileS3Service } from "@app/file/providers/file.s3.service";
import { FileService } from "@app/file/providers/file.service";

@Module({
  providers: [FileService, FileS3Service],
  exports: [FileService, FileS3Service],
  controllers: [FileController],
})
export class FileModule {}
