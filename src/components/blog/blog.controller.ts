import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { CreateBlogCategoryDto } from './dto/createBlogCategory.dto';
import { CreateBlogDto } from './dto/createBlog.dto';
import { UpdateBlogCategoryDto } from './dto/updateBlogCategory.dto';
import { UpdateBlogDto } from './dto/updateBlog.dto';
import { ITransformedFile } from 'src/helpers/interfaces/fileTransform.interface';
import { CreateTagDto } from '../tags/dto/createTag.dto';
import { GetBlogCategoriesResponse } from './responses/getBlogsCategory.response';
import { GetOneBlogCategoryResponse } from './responses/getOneBlogCategory.response';
import { GetBlogsResponse } from './responses/getBlogs.response';
import { GetOneBlogResponse } from './responses/getOneBlog.response';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';
import { CreateBlogCategoryResponse } from './responses/createBlogCategory.response';
import { CreateBlogCategoryOperation } from './decorators/createBlogCategoryOperation.decorator';
import { GetBlogsCategoryOperation } from './decorators/getBlogsCategoryOperation.decorator';
import { GetOneBlogCategoryOperation } from './decorators/getOneBlogCategoryOperation.decorator';
import { UpdateBlogCategoryOperation } from './decorators/updateBlogCategoryOperation.decorator';
import { UpdateBlogCategoryResponse } from './responses/updateBlogCategory.response';
import { DeleteBlogCategoryOperation } from './decorators/deleteBlogCategoryOperation.decorator';
import { CreateBlogResponse } from './responses/createBlog.response';
import { CreateBlogOperation } from './decorators/createBlogOperation.decorator';
import { GetBlogsOperation } from './decorators/getBlogsOperation.decorator';
import { GetOneBlogOperation } from './decorators/getOneBlogOperation.decorator';
import { UpdateBlogResponse } from './responses/updateBlog.response';
import { UpdateBlogOperation } from './decorators/updateBlogOperation.decorator';
import { DeleteBlogOperation } from './decorators/deleteBlogOperation.decorator';
import { UploadBlogImageOperation } from './decorators/uploadBlogImageOperation.decorator';
import { DeleteBlogImageOperation } from './decorators/deleteBlogImageOperation.decorator';
import { CreateTagOperation } from './decorators/createTagOperation.decorator';
import { DeleteTagOperation } from './decorators/deleteTagOperation.decorator';
import { ImageTransformer } from 'src/common/pipes/imageTransform.pipe';

@ApiTags('blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('category')
  @CreateBlogCategoryOperation()
  async createBlogCategory(
    @Body() dto: CreateBlogCategoryDto,
  ): Promise<CreateBlogCategoryResponse> {
    return this.blogService.createBlogCategory(dto);
  }

  @Get('category')
  @GetBlogsCategoryOperation()
  async getBlogsCategory(): Promise<GetBlogCategoriesResponse> {
    return this.blogService.getBlogsCategory();
  }

  @Get('category/:blogCategoryId')
  @GetOneBlogCategoryOperation()
  async getOneBlogCategory(
    @Param('blogCategoryId') blogCategoryId: string,
  ): Promise<GetOneBlogCategoryResponse> {
    return this.blogService.getOneBlogCategory(blogCategoryId);
  }

  @Patch('category/:blogCategoryId')
  @UpdateBlogCategoryOperation()
  async updateBlogCategory(
    @Param('blogCategoryId') blogCategoryId: string,
    @Body() dto: UpdateBlogCategoryDto,
  ): Promise<UpdateBlogCategoryResponse> {
    return this.blogService.updateBlogCategory(dto, blogCategoryId);
  }

  @Delete('category/:blogCategoryId')
  @DeleteBlogCategoryOperation()
  async deleteBlogCategory(
    @Param('blogCategoryId') blogCategoryId: string,
  ): Promise<SuccessMessageType> {
    return this.blogService.deleteBlogCategory(blogCategoryId);
  }

  @Post(':blogCategoryId')
  @CreateBlogOperation()
  async createBlog(
    @Param('blogCategoryId') blogCategoryId: string,
    @Body() dto: CreateBlogDto,
  ): Promise<CreateBlogResponse> {
    return this.blogService.createBlog(dto, blogCategoryId);
  }

  @Get('')
  @GetBlogsOperation()
  async getBlog(): Promise<GetBlogsResponse> {
    return this.blogService.getBlog();
  }

  @Get(':blogId')
  @GetOneBlogOperation()
  async getOneBlog(
    @Param('blogId') blogId: string,
  ): Promise<GetOneBlogResponse> {
    return this.blogService.getOneBlog(blogId);
  }

  @Patch(':blogId')
  @UpdateBlogOperation()
  async updateBlog(
    @Param('blogId') blogId: string,
    @Body() dto: UpdateBlogDto,
  ): Promise<UpdateBlogResponse> {
    return this.blogService.updateBlog(dto, blogId);
  }

  @Delete(':blogId')
  @DeleteBlogOperation()
  async deleteBlog(
    @Param('blogId') blogId: string,
  ): Promise<SuccessMessageType> {
    return this.blogService.deleteBlog(blogId);
  }

  @Post(':blogId/image')
  @UploadBlogImageOperation()
  async uploadImage(
    @UploadedFile(ImageTransformer) image: ITransformedFile,
    @Param('blogId') blogId: string,
  ): Promise<SuccessMessageType> {
    return this.blogService.uploadImage(image, blogId);
  }

  @Delete(':blogId/image/:imageId')
  @DeleteBlogImageOperation()
  async deleteImage(
    @Param('blogId') blogId: string,
    @Param('imageId') imageId: string,
  ): Promise<SuccessMessageType> {
    return this.blogService.deleteImage(imageId, blogId);
  }

  @Post(':blogId/tag')
  @CreateTagOperation()
  async createTag(
    @Param('blogId') blogId: string,
    @Body() dto: CreateTagDto,
  ): Promise<SuccessMessageType> {
    return this.blogService.createTag(blogId, dto);
  }

  @Delete('tag/:tagId')
  @DeleteTagOperation()
  async deleteTag(@Param('tagId') tagId: string): Promise<SuccessMessageType> {
    return this.blogService.deleteTag(tagId);
  }
}
