import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ColorDto } from 'src/helpers/dto/color.dto';
import { CreateProductColorResponse } from '../responses/createProductColor.response';
import { Admin } from 'src/common/decorators/isAdmin.decorator';

export function CreateProductColorOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new product color' }),
    ApiBody({ type: ColorDto }),
    ApiCreatedResponse({
      description: 'Product color created successfully',
      type: CreateProductColorResponse,
    }),
    ApiNotFoundResponse({ description: 'Product with this ID not found' }),
    Admin(),
  );
}
