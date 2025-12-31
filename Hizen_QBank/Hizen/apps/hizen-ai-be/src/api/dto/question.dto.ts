import { tags } from "typia";

import { File, S3PresignedFileUrl } from "./file.dto";

export interface QuestionFilter {
  labelIds: (string & tags.Format<"uuid">)[];
}

export interface QuestionCursor {
  lastQuestionId: string & tags.Format<"uuid">;
  lastQuestionCreatedAt: Date;
}

export interface Question {
  id: string & tags.Format<"uuid">;
  htmlQuestionContent: string;
  htmlSolutionContent: string;
  answer: string;
  selections?: [string, string, string, string, string];
  createdAt: Date;
  updatedAt: Date;

  images: QuestionImage[];
  labels: QuestionLabel[];
}

export interface QuestionImage {
  id: string & tags.Format<"uuid">;
  file: File;
  fileDownloadUrl: S3PresignedFileUrl;
}

export interface QuestionLabel {
  id: string & tags.Format<"uuid">;
  name: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export namespace ListQuestions {
  export interface RequestQuery {
    pageSize: number &
      tags.Type<"uint32"> &
      tags.Minimum<1> &
      tags.Maximum<100>;
    filter?: (string & tags.Format<"uuid">)[];
    lastQuestionId?: string & tags.Format<"uuid">;
    lastQuestionCreatedAt: string | null;
  }

  export type Response = Question[];
}

export namespace GetQuestion {
  export type Response = Question;
}

export namespace CreateQuestion {
  export interface RequestBody {
    htmlQuestionContent: string;
    htmlSolutionContent: string;
    answer: string;
    selections: [string, string, string, string, string] | null;
    imageFileIds: (string & tags.Format<"uuid">)[];
    labelIds: (string & tags.Format<"uuid">)[];
  }

  export type Response = Question;
}

export namespace UpdateQuestion {
  export interface RequestBody {
    htmlQuestionContent?: string;
    htmlSolutionContent?: string;
    answer?: string;
    selections?: [string, string, string, string, string] | null;
  }

  export type Response = Question;
}

export namespace UpdateQuestionImages {
  export interface RequestBody {
    adds: (string & tags.Format<"uuid">)[];
    removes: (string & tags.Format<"uuid">)[];
    updates: {
      id: string & tags.Format<"uuid">;
      fileId?: string & tags.Format<"uuid">;
    }[];
  }

  export type Response = QuestionImage[];
}

export namespace UpdateQuestionLabels {
  export interface RequestBody {
    adds: (string & tags.Format<"uuid">)[];
    removes: (string & tags.Format<"uuid">)[];
  }

  export type Response = QuestionLabel[];
}

export namespace CreateQuestionLabel {
  export interface RequestBody {
    name: string;
    content: string;
  }

  export type Response = QuestionLabel;
}

export namespace UpdateQuestionLabel {
  export interface RequestBody {
    name?: string;
    content?: string;
  }

  export type Response = QuestionLabel;
}
