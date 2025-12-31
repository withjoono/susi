import { Module } from "@nestjs/common";

import { FileModule } from "@app/file/file.module";
import { QuestionLabelService } from "@app/question/providers/question.label.service";
import { QuestionService } from "@app/question/providers/question.service";
import { QuestionController } from "@app/question/question.controller";
import { QuestionLabelController } from "@app/question/question.label.controller";

@Module({
  imports: [FileModule],
  providers: [QuestionService, QuestionLabelService],
  exports: [QuestionService, QuestionLabelService],
  controllers: [QuestionController, QuestionLabelController],
})
export class QuestionModule {}
