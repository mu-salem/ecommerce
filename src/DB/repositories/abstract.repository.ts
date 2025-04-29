import { FilterQuery, Model, UpdateQuery } from 'mongoose';

export interface IPaginate {
  page: number;
}

export type finderOneArg<TDocument> = {
  filter?: FilterQuery<TDocument>;
  populate?: string | string[] | any;
  select?: string;
};

export type findersArg<TDocument> = finderOneArg<TDocument> & {
  paginate?: IPaginate;
  sort?: Record<string, -1 | 1>;
};

export type updateArg<TDocument> = {
  filter: FilterQuery<TDocument>;
  update: UpdateQuery<TDocument>;
  populate?: any;
  select?: string;
};

export abstract class AbstractRepository<TDocument> {
  protected constructor(protected readonly model: Model<TDocument>) {}

  async findAll({
    filter = {},
    populate,
    select,
    paginate,
    sort,
  }: findersArg<TDocument>): Promise<TDocument[] | any> {
    let query = this.model.find(filter);
    if (populate) query = query.populate(populate);
    if (select) query = query.select(select);
    if (sort) query = query.sort(sort);

    const page = paginate?.page ?? 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const totalSize = await query.model.countDocuments(query.getQuery());
    const data = await query.skip(skip).limit(limit).exec();
    return {
      totalSize,
      totalPages: Math.ceil(totalSize / limit),
      pageSize: data.length,
      pageNumber: page,
      data,
    };
  }

  async findOne({
    filter = {},
    populate,
    select,
  }: finderOneArg<TDocument>): Promise<TDocument | null> {
    let query = this.model.findOne(filter);
    if (populate) query = query.populate(populate);
    if (select) query = query.select(select);
    return await query.exec();
  }

  async create(document: Partial<TDocument>): Promise<TDocument> {
    return await this.model.create({ ...document });
  }

  async update({
    filter,
    update,
    populate,
    select,
  }: updateArg<TDocument>): Promise<TDocument | null> {
    let query = this.model.findOneAndUpdate(filter, update, {
      new: true,
      runValidators: true,
    });

    if (populate) query = query.populate(populate);
    if (select) query = query.select(select);

    return await query.exec();
  }

  async delete(filter: FilterQuery<TDocument>): Promise<TDocument | null> {
    const query = this.model.findOneAndDelete(filter);
    return await query.exec();
  }
}
