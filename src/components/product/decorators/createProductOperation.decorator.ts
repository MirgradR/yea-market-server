import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { CreateProductDto } from '../dto/createProduct.dto';
import { CreateProductResponse } from '../responses/createProduct.response';
import { Admin } from 'src/common/decorators/isAdmin.decorator';

export function CreateProductOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new product' }),
    ApiBody({ type: CreateProductDto }),
    ApiCreatedResponse({
      description: 'Product created successfully',
      type: CreateProductResponse,
    }),
    Admin(),
  );
}
