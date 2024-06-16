import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ColorDto } from 'src/helpers/dto/color.dto';
import { CreateProductColorResponse } from '../responses/createProductColor.response';
import { Admin } from 'src/common/decorators/isAdmin.decorator';

export function CreateProductColorOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new product color' }),
    ApiBody({ type: ColorDto }),
    ApiResponse({
      status: 201,
      description: 'Product color created successfully',
      type: CreateProductColorResponse,
    }),
    ApiResponse({ status: 404, description: 'Product with this ID not found' }),
    ApiResponse({ status: 400, description: 'Bad request' }),
    Admin(),
  );
}
