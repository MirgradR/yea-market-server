import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { ColorDto } from 'src/helpers/dto/color.dto';
import { ITransformedFile } from 'src/helpers/interfaces/fileTransform.interface';
import { FileFastifyInterceptor, diskStorage } from 'fastify-file-interceptor';
import { imageFilter } from 'src/common/filters/imageFilter';
import { randomUUID } from 'crypto';
import { ImageTransformer } from 'src/common/pipes/imageTransform.pipe';
import { CreateProductResponse } from './responses/createProduct.response';
import { CreateProductOperation } from './decorators/createProductOperation.decorator';
import { GetProductsResponse } from './responses/getProducts.response';
import { GetProductsOperation } from './decorators/getProductsOperation.decorator';
import { GetOneProductOperation } from './decorators/getOneProductOperation.decorator';
import { ProductType } from 'src/helpers/types/product.type';
import { UpdateProductOperation } from './decorators/updateProductOperation.decorator';
import { UpdateProductResponse } from './responses/updateProduct.response';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';
import { CreateProductColorResponse } from './responses/createProductColor.response';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

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
  async getProducts(): Promise<GetProductsResponse> {
    return await this.productService.getProducts();
  }

  @Get(':productId')
  @GetOneProductOperation()
  async getOneProduct(
    @Param('productId', ParseUUIDPipe) productId: string,
  ): Promise<ProductType> {
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
  async deleteProduct(
    @Param('productId', ParseUUIDPipe) productId: string,
  ): Promise<SuccessMessageType> {
    return await this.productService.deleteProduct(productId);
  }

  @Post(':productId/colors')
  async createProductColor(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() colorDto: ColorDto,
  ): Promise<CreateProductColorResponse> {
    return await this.productService.createProductColor(productId, colorDto);
  }

  @Delete(':productId/colors/:colorId')
  async deleteProductColor(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Param('colorId', ParseUUIDPipe) colorId: string,
  ): Promise<SuccessMessageType> {
    return await this.productService.deleteProductColor(productId, colorId);
  }

  @Post(':productId/categories/:categoryId')
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
  @UseInterceptors(
    FileFastifyInterceptor('image', {
      storage: diskStorage({
        destination: './temp',
        filename: (req, file, cb) => {
          const fileExtension = file.mimetype.split('/')[1];
          const uniqueFileName = `${randomUUID()}.${fileExtension}`;
          cb(null, uniqueFileName);
        },
      }),
      limits: { fileSize: 1024 * 1024 * 1500 },
      fileFilter: imageFilter,
    }),
  )
  async uploadImage(
    @UploadedFile(ImageTransformer) image: ITransformedFile,
    @Param('productId', ParseUUIDPipe) productId: string,
  ): Promise<SuccessMessageType> {
    return await this.productService.uploadImage(image, productId);
  }

  @Delete(':productId/images/:imageId')
  async deleteImage(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Param('imageId', ParseUUIDPipe) imageId: string,
  ): Promise<SuccessMessageType> {
    return await this.productService.deleteImage(productId, imageId);
  }
}