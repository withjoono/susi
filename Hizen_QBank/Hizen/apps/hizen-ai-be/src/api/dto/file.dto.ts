import { tags } from "typia";

export interface S3PresignedFileUrl {
  url: string & tags.Format<"uri">;
  expiration: string & tags.Format<"date-time">;
}

export interface FileUrlPair {
  url: string & tags.Format<"uri">;
  presignedUrl: S3PresignedFileUrl;
}

export interface File {
  id: string & tags.Format<"uuid">;
  name: string;
  description: string | null;
  mimeType: string;
  createdAt: string & tags.Format<"date-time">;
}

export namespace CreateFile {
  export interface Request {
    name: string;
    description: string | null;
    mimeType: string;
  }

  export interface Response {
    file: File;
    uploadUrl: S3PresignedFileUrl;
  }
}
