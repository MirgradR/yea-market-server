import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Admin } from 'src/common/decorators/isAdmin.decorator';
import { CreateTagDto } from 'src/components/tags/dto/createTag.dto';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';

export function CreateTagOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a tag for a blog' }),
    ApiBody({ type: CreateTagDto }),
    ApiCreatedResponse({
      description: 'The tag has been successfully created.',
      type: SuccessMessageType,
    }),
    ApiConflictResponse({description:'Tag for this entity already exist'}),
    ApiBearerAuth(),
    Admin(),
  );
}
