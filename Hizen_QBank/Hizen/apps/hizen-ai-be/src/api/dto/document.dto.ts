import { tags } from "typia";

export interface Subject {
  id: string & tags.Format<"uuid">;
  name: string;
  description: string | null;
  parentId: (string & tags.Format<"uuid">) | null;
  createdAt: string & tags.Format<"date-time">;
  updatedAt: string & tags.Format<"date-time">;
}

export interface Document {
  id: string & tags.Format<"uuid">;
  name: string;
  description: string | null;
  sectionCount: number & tags.Type<"int32">;
  createdAt: string & tags.Format<"date-time">;
  updatedAt: string & tags.Format<"date-time">;
}

export interface DocumentSection {
  id: string & tags.Format<"uuid">;
  order: number & tags.Type<"int32">;
  title: string;
  description: string | null;
  contentCount: number & tags.Type<"int32">;
  createdAt: string & tags.Format<"date-time">;
  updatedAt: string & tags.Format<"date-time">;
}

export interface DocumentSectionContent {
  id: string & tags.Format<"uuid">;
  order: number & tags.Type<"int32">;
  type: "TEXT" | "IMAGE";
  /**
   * Available only for `TEXT` type
   */
  text: string | null;
  /**
   * Available only for `IMAGE` type
   */
  imageUrl: string | null;
}

export interface DocumentCursor {
  id?: string;
  name?: string;
}

export namespace CreateSubject {
  export interface RequestBody {
    name: string;
    description: string | null;
    parentId: (string & tags.Format<"uuid">) | null;
  }

  export type Response = Subject;
}

export namespace UpdateSubject {
  export interface RequestBody {
    name: string | undefined;
    description: string | null | undefined;
    parentId: (string & tags.Format<"uuid">) | null | undefined;
  }

  export type Response = Subject;
}

export namespace ListDocuments {
  export interface RequestQuery {
    lastId: (string & tags.Format<"uuid">) | undefined;
    lastName: string | undefined;
    limit: number & tags.Type<"uint32"> & tags.Minimum<1> & tags.Maximum<100>;
  }

  export type Response = Document[];
}

export namespace CreateDocument {
  export interface RequestBody {
    name: string;
    description: string | null;
    subjectId: (string & tags.Format<"uuid">) | null;
  }

  export type Response = Document;
}

export namespace CreateDocumentSection {
  export interface RequestBody {
    order: number & tags.Type<"int32">;
    title: string;
    description: string | null;
  }

  export type Response = DocumentSection;
}

export namespace CreateDocumentSectionContent {
  export interface RequestBody {
    order: number & tags.Type<"int32">;
    type: "TEXT" | "IMAGE";
    data: string;
  }

  export type Response = DocumentSectionContent;
}

export namespace UpdateDocument {
  export interface RequestBody {
    name: string | undefined;
    description: string | null | undefined;
  }

  export type Response = Document;
}

export namespace UpdateDocumentSection {
  export interface RequestBody {
    order: (number & tags.Type<"int32">) | undefined;
    title: string | undefined;
    description: string | null | undefined;
  }

  export type Response = DocumentSection;
}

export namespace UpdateDocumentSectionContent {
  export interface RequestBody {
    order: (number & tags.Type<"int32">) | undefined;
    type: "TEXT" | "IMAGE" | undefined;
    data: string | undefined;
  }

  export type Response = DocumentSectionContent;
}
