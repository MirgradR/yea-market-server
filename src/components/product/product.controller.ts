import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { ITransformedFile } from 'src/helpers/interfaces/fileTransform.interface';
import { ImageTransformer } from 'src/common/pipes/imageTransform.pipe';
import { CreateProductResponse } from './responses/createProduct.response';
import { CreateProductOperation } from './decorators/createProductOperation.decorator';
import { GetProductsResponse } from './responses/getProducts.response';
import { GetProductsOperation } from './decorators/getProductsOperation.decorator';
import { GetOneProductOperation } from './decorators/getOneProductOperation.decorator';
import { UpdateProductOperation } from './decorators/updateProductOperation.decorator';
import { UpdateProductResponse } from './responses/updateProduct.response';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';
import { CreateProductColorResponse } from './responses/createProductColor.response';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateColorDto } from './dto/createColor.dto';
import { DeleteProductOperation } from './decorators/deleteProductOperation.decorator';
import { CreateProductColorOperation } from './decorators/createProductColorOperation.decorator';
import { DeleteProductColorOperation } from './decorators/deleteProductColorOperation.decorator';
import { CreateProductCategoryOperation } from './decorators/createProductCategoryOperation.decorator';
import { DeleteProductCategoryOperation } from './decorators/deleteProductCategory.decorator';
import { UploadProductImageOperation } from './decorators/uploadProductImageOperation.decorator';
import { DeleteProductImageOperation } from './decorators/deleteProductImageOperation.decorator';
import { GetNewArrivedProductsOperation } from './decorators/getNewArrivedProductsOperation.decorator';
import { GetProductsDto, GetProductsQuery } from './dto/getProducts.query';
import { GetColorsOperation } from './decorators/getColorsOperation.decorator';
import { GetOneProductResponse } from './responses/getOneProductResponse';
import { DeleteTagOperation } from './decorators/deleteTagOperation.decorator';
import { CreateTagDto } from '../tags/dto/createTag.dto';
import { CreateTagOperation } from './decorators/createTagOperation.decorator';

@ApiTags('products')
@ApiBearerAuth()
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @CreateProductOperation()
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<CreateProductResponse> {
    return await this.productService.createProduct(createProductDto);
  }

  @Get()
  @GetProductsOperation()
  async getProducts(
    @Query() query?: GetProductsQuery,
    @Body() dto?: GetProductsDto,
  ): Promise<GetProductsResponse> {
    return await this.productService.getProducts(query, dto);
  }

  @Get('/new-arrived')
  @GetNewArrivedProductsOperation()
  async getNewArrivedProducts() {
    return await this.productService.getNewArrivedProducts();
  }

  @Get(':productId')
  @GetOneProductOperation()
  async getOneProduct(
    @Param('productId', ParseUUIDPipe) productId: string,
  ): Promise<GetOneProductResponse> {
    return await this.productService.getOneProduct(productId);
  }

  @Patch(':productId')
  @UpdateProductOperation()
  async updateProduct(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<UpdateProductResponse> {
    return await this.productService.updateProduct(productId, updateProductDto);
  }

  @Delete(':productId')
  @DeleteProductOperation()
  async deleteProduct(
    @Param('productId', ParseUUIDPipe) productId: string,
  ): Promise<SuccessMessageType> {
    return await this.productService.deleteProduct(productId);
  }

  @Post('tags/:productId')
  @CreateTagOperation()
  async createTag(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() dto: CreateTagDto,
  ): Promise<SuccessMessageType> {
    return await this.productService.createTag(dto, productId);
  }

  @Delete('tags/:tagId')
  @DeleteTagOperation()
  async deleteTag(
    @Param('tagId', ParseUUIDPipe) tagId: string,
  ): Promise<SuccessMessageType> {
    return await this.productService.deleteTag(tagId);
  }

  @Post(':productId/colors')
  @CreateProductColorOperation()
  async createProductColor(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() colorDto: CreateColorDto,
  ): Promise<CreateProductColorResponse> {
    return await this.productService.createProductColor(productId, colorDto);
  }

  @Delete(':productId/colors/:colorId')
  @DeleteProductColorOperation()
  async deleteProductColor(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Param('colorId', ParseUUIDPipe) colorId: string,
  ): Promise<SuccessMessageType> {
    return await this.productService.deleteProductColor(productId, colorId);
  }

  @Post(':productId/categories/:categoryId')
  @CreateProductCategoryOperation()
  async createProductCategory(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
  ): Promise<SuccessMessageType> {
    return await this.productService.createProductCategory(
      productId,
      categoryId,
    );
  }

  @Delete(':productId/categories/:categoryId')
  @DeleteProductCategoryOperation()
  async deleteProductCategory(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
  ): Promise<SuccessMessageType> {
    return await this.productService.deleteProductCategory(
      productId,
      categoryId,
    );
  }

  @Post(':productId/images')
  @UploadProductImageOperation()
  async uploadImage(
    @UploadedFile(ImageTransformer) image: ITransformedFile,
    @Param('productId', ParseUUIDPipe) productId: string,
  ): Promise<SuccessMessageType> {
    return await this.productService.uploadImage(image, productId);
  }

  @Delete(':productId/images/:imageId')
  @DeleteProductImageOperation()
  async deleteImage(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Param('imageId', ParseUUIDPipe) imageId: string,
  ): Promise<SuccessMessageType> {
    return await this.productService.deleteImage(productId, imageId);
  }

  @Get('colors')
  @GetColorsOperation()
  async getColors() {
    return await this.productService.getColors();
  }
}
