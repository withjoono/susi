import { TypedBody, TypedRoute } from "@nestia/core";
import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { CreateFile } from "@app/api/dto/file.dto";
import { FileService } from "@app/file/providers/file.service";

@ApiTags("files")
@Controller("files")
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @TypedRoute.Post()
  async createFile(
    @TypedBody() body: CreateFile.Request,
  ): Promise<CreateFile.Response> {
    const [file, fileUrlPair] = await this.fileService.createFile(
      body.name,
      body.description,
      body.mimeType,
    );

    return {
      file,
      uploadUrl: fileUrlPair.presignedUrl,
    };
  }
}
