import {
  ConflictException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogCategoryEntity } from './entities/blogCategory.entity';
import { Repository } from 'typeorm';
import { BlogsEntity } from './entities/blog.entity';
import { CreateBlogCategoryDto } from './dto/createBlogCategory.dto';
import { CreateBlogDto } from './dto/createBlog.dto';
import { UpdateBlogCategoryDto } from './dto/updateBlogCategory.dto';
import { UpdateBlogDto } from './dto/updateBlog.dto';
import { ITransformedFile } from 'src/helpers/interfaces/fileTransform.interface';
import { MediaService } from 'src/libs/media/media.service';
import { MinioService } from 'src/libs/minio/minio.service';
import { CreateTagDto } from '../tags/dto/createTag.dto';
import { TagsService } from '../tags/tags.service';
import { CreateBlogCategoryResponse } from './responses/createBlogCategory.response';
import { GetBlogCategoriesResponse } from './responses/getBlogsCategory.response';
import { GetOneBlogCategoryResponse } from './responses/getOneBlogCategory.response';
import { UpdateBlogCategoryResponse } from './responses/updateBlogCategory.response';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';
import { CreateBlogResponse } from './responses/createBlog.response';
import { GetBlogsResponse } from './responses/getBlogs.response';
import { GetOneBlogResponse } from './responses/getOneBlog.response';
import { UpdateBlogResponse } from './responses/updateBlog.response';

@Injectable()
export class BlogService {
  private readonly logger = new Logger(BlogService.name);

  constructor(
    @InjectRepository(BlogCategoryEntity)
    private blogCategoryRepository: Repository<BlogCategoryEntity>,
    @InjectRepository(BlogsEntity)
    private blogRepository: Repository<BlogsEntity>,
    private mediaService: MediaService,
    private minioService: MinioService,
    private tagService: TagsService,
  ) {}

  async createBlogCategory(
    dto: CreateBlogCategoryDto,
  ): Promise<CreateBlogCategoryResponse> {
    this.logger.log(
      `Attempting to create blog category with title ${dto.title}`,
    );

    const candidate = await this.blogCategoryRepository.findOne({
      where: { title: dto.title },
    });

    if (candidate) {
      this.logger.error(`Blog category with title ${dto.title} already exists`);
      throw new ConflictException(
        'Blog category with this title already exists',
      );
    }

    const blogCategory = this.blogCategoryRepository.create({ ...dto });
    await this.blogCategoryRepository.save(blogCategory);

    this.logger.log(
      `Blog category with title ${dto.title} created successfully`,
    );
    return { blogCategory, message: 'Blog category created successfully!' };
  }

  async getBlogsCategory(): Promise<GetBlogCategoriesResponse> {
    this.logger.log('Fetching list of blog categories');

    const [blogCategories, totalCount] =
      await this.blogCategoryRepository.findAndCount({
        relations: { blogs: { medias: true, tags: true } },
      });

    this.logger.log('List of blog categories fetched successfully');
    return { totalCount, blogCategories };
  }

  async getOneBlogCategory(
    blogCategoryId: string,
  ): Promise<GetOneBlogCategoryResponse> {
    this.logger.log(`Fetching blog category with ID ${blogCategoryId}`);

    const blogCategory = await this.blogCategoryRepository.findOne({
      where: { id: blogCategoryId },
      relations: { blogs: { medias: true, tags: true } },
    });

    if (!blogCategory) {
      this.logger.error(`Blog category with ID ${blogCategoryId} not found`);
      throw new NotFoundException('Blog category not found!');
    }

    this.logger.log(
      `Blog category with ID ${blogCategoryId} fetched successfully`,
    );
    return { blogCategory };
  }

  async updateBlogCategory(
    dto: UpdateBlogCategoryDto,
    blogCategoryId: string,
  ): Promise<UpdateBlogCategoryResponse> {
    this.logger.log(`Updating blog category with ID ${blogCategoryId}`);

    const blogCategory = await this.findBlogCategoryById(blogCategoryId);

    Object.assign(blogCategory, dto);

    await this.blogCategoryRepository.save(blogCategory);

    this.logger.log(
      `Blog category with ID ${blogCategoryId} updated successfully`,
    );
    return { blogCategory, message: 'Blog category updated successfully!' };
  }

  async deleteBlogCategory(
    blogCategoryId: string,
  ): Promise<SuccessMessageType> {
    this.logger.log(`Deleting blog category with ID ${blogCategoryId}`);

    const blogCategory = await this.findBlogCategoryById(blogCategoryId);

    await this.deleteBlogs(blogCategory.id);

    await this.blogCategoryRepository.delete({ id: blogCategory.id });

    this.logger.log(
      `Blog category with ID ${blogCategoryId} deleted successfully`,
    );
    return { message: 'Blog category deleted successfully!' };
  }

  async createBlog(
    dto: CreateBlogDto,
    blogCategoryId: string,
  ): Promise<CreateBlogResponse> {
    this.logger.log(
      `Creating blog with title ${dto.title} in category with ID ${blogCategoryId}`,
    );

    const blogCategory = await this.findBlogCategoryById(blogCategoryId);

    const candidate = await this.blogRepository.findOne({
      where: { title: dto.title },
    });

    if (candidate) {
      this.logger.error(`Blog with title ${dto.title} already exists`);
      throw new ConflictException('Blog with this title already exists');
    }

    const blog = this.blogRepository.create({
      ...dto,
      blogCategoryId: blogCategory.id,
    });

    await this.blogRepository.save(blog);

    this.logger.log(`Blog with title ${dto.title} created successfully`);
    return { blog, message: 'Blog created successfully!' };
  }

  async getBlog(): Promise<GetBlogsResponse> {
    this.logger.log('Fetching list of blogs');

    const [blogs, totalCount] = await this.blogRepository.findAndCount({
      relations: { medias: true, tags: true },
    });

    this.logger.log('List of blogs fetched successfully');
    return { totalCount, blogs };
  }

  async getOneBlog(blogId: string): Promise<GetOneBlogResponse> {
    this.logger.log(`Fetching blog with ID ${blogId}`);

    const blog = await this.blogRepository.findOne({
      where: { id: blogId },
      relations: { medias: true, tags: true },
    });

    if (!blog) {
      this.logger.error(`Blog with ID ${blogId} not found`);
      throw new NotFoundException('Blog not found!');
    }

    this.logger.log(`Blog with ID ${blogId} fetched successfully`);
    return { blog };
  }

  async updateBlog(
    dto: UpdateBlogDto,
    blogId: string,
  ): Promise<UpdateBlogResponse> {
    this.logger.log(`Updating blog with ID ${blogId}`);

    const blog = await this.findBlogById(blogId);

    Object.assign(blog, dto);

    await this.blogRepository.save(blog);

    this.logger.log(`Blog with ID ${blogId} updated successfully`);
    return { blog, message: 'Blog updated successfully!' };
  }

  async deleteBlog(blogId: string): Promise<SuccessMessageType> {
    this.logger.log(`Deleting blog with ID ${blogId}`);

    const blog = await this.findBlogById(blogId);

    for (const blogImage of blog.medias) {
      await this.mediaService.deleteOneMedia(blogImage.id);
    }

    await this.tagService.deleteTags(blog.id, 'blogId');

    await this.blogRepository.delete({ id: blog.id });

    this.logger.log(`Blog with ID ${blogId} deleted successfully`);
    return { message: 'Blog deleted successfully!' };
  }

  async uploadImage(
    image: ITransformedFile,
    blogId: string,
  ): Promise<SuccessMessageType> {
    this.logger.log(`Uploading image for blog with ID ${blogId}`);

    const blog = await this.blogRepository.findOne({ where: { id: blogId } });
    if (!blog) {
      await this.minioService.deleteFile(image.fileName);
      this.logger.error(`Blog with ID ${blogId} not found`);
      throw new NotFoundException('Blog not found!');
    }

    await this.mediaService.createFileMedia(image, blog.id, 'blogId');

    this.logger.log(`Image for blog with ID ${blogId} uploaded successfully`);
    return { message: 'Image uploaded successfully!' };
  }

  async deleteImage(
    imageId: string,
    blogId: string,
  ): Promise<SuccessMessageType> {
    this.logger.log(
      `Deleting image with ID ${imageId} for blog with ID ${blogId}`,
    );

    await this.findBlogById(blogId);

    await this.mediaService.deleteOneMedia(imageId);

    this.logger.log(
      `Image with ID ${imageId} deleted successfully for blog with ID ${blogId}`,
    );
    return { message: 'Image deleted successfully!' };
  }

  async createTag(
    blogId: string,
    dto: CreateTagDto,
  ): Promise<SuccessMessageType> {
    this.logger.log(`Creating tag for blog with ID ${blogId}`);

    await this.findBlogById(blogId);

    await this.tagService.createTag(dto.tag, blogId, 'blogId');

    this.logger.log(`Tag for blog with ID ${blogId} created successfully`);
    return { message: 'Tag created successfully!' };
  }

  async deleteTag(tagId: string): Promise<SuccessMessageType> {
    this.logger.log(`Deleting tag with ID ${tagId}`);

    await this.tagService.deleteTag(tagId);

    this.logger.log(`Tag with ID ${tagId} deleted successfully`);
    return { message: 'Tag deleted successfully!' };
  }

  private async findBlogCategoryById(blogCategoryId: string) {
    this.logger.log(`Finding blog category with ID ${blogCategoryId}`);
    const blogCategory = await this.blogCategoryRepository.findOne({
      where: { id: blogCategoryId },
    });
    if (!blogCategory) {
      this.logger.error(`Blog category with ID ${blogCategoryId} not found`);
      throw new NotFoundException('Blog category not found!');
    }

    this.logger.log(`Blog category with ID ${blogCategoryId} found`);
    return blogCategory;
  }

  private async findBlogById(blogId: string) {
    this.logger.log(`Finding blog with ID ${blogId}`);
    const blog = await this.blogRepository.findOne({
      where: { id: blogId },
      relations: { medias: true, tags: true },
    });
    if (!blog) {
      this.logger.error(`Blog with ID ${blogId} not found`);
      throw new NotFoundException('Blog not found!');
    }

    this.logger.log(`Blog with ID ${blogId} found`);
    return blog;
  }

  private async deleteBlogs(blogCategoryId: string) {
    const blogs = await this.blogRepository.find({
      where: { blogCategoryId },
      relations: { medias: true, tags: true },
    });
    for (const blog of blogs) {
      for (const blogImage of blog.medias) {
        await this.mediaService.deleteOneMedia(blogImage.id);
      }
    }
    await this.blogRepository.delete({ blogCategoryId });
  }
}
