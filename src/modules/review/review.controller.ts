import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/DB/enums/user.enum';
import { User } from 'src/common/decorators/user.decorator';
import { Types } from 'mongoose';
import { ParseObjectIdPipe } from '@nestjs/mongoose';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Roles(Role.USER)
  @Post()
  create(@Body() data: CreateReviewDto, @User('_id') userId: Types.ObjectId) {
    return this.reviewService.create(data, userId);
  }

  @Roles(Role.USER)
  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) reviewId: Types.ObjectId,
    @User('_id') userId: Types.ObjectId,
    @Body() data: UpdateReviewDto,
  ) {
    return this.reviewService.update(reviewId, userId, data);
  }

  @Roles(Role.USER, Role.ADMIN)
  @Delete(':id')
  remove(
    @Param('id', ParseObjectIdPipe) reviewId: Types.ObjectId,
    @User('_id') userId: Types.ObjectId,
  ) {
    return this.reviewService.remove(reviewId, userId);
  }
}
