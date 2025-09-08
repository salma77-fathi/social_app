import {
  CreateOptions,
  HydratedDocument,
  Model,
  MongooseUpdateQueryOptions,
  ProjectionFields,
  QueryOptions,
  RootFilterQuery,
  UpdateQuery,
  UpdateWriteOpResult,
} from "mongoose";

export abstract class DatabaseRepository<TDocument> {
  constructor(protected readonly model: Model<TDocument>) {}

  async findOne({
    filter,
    select,
  }: {
    filter: RootFilterQuery<TDocument>;
    select?: ProjectionFields<TDocument> | null;
    options?: QueryOptions<TDocument> | null;
  }): Promise<HydratedDocument<TDocument> | null> {
    return await this.model.findOne(filter).select(select || "");
  }
  async create({
    data,
    options,
  }: {
    data: Partial<TDocument>[];
    options?: CreateOptions | undefined;
  }): Promise<HydratedDocument<TDocument>[] | undefined> {
    return await this.model.create(data, options);
  }

  async update({
    filter,
    update,
    options,
  }: {
    filter: RootFilterQuery<TDocument>;
    update: UpdateQuery<TDocument>;
    options?: MongooseUpdateQueryOptions<TDocument> | null;
  }): Promise<UpdateWriteOpResult> {
    return await this.model.updateOne(
      filter,
      { ...update, $inc: { __v: 1 } },
      options
    );
  }
}

/*notes_______________________________؟ what is HydratedDocument ? ___________________________________________________*/
//here we use HydratedDocument to Blend typescript and mongoose types like the interface in the DB model
//so we also can say that this hybrid between the ts and mongoose
// the input type of IUser , output is HydratedIUser=> meaning IUser + mongoose doc like: _id ,save
/*notes___________________________________________________________________________________________________________*/
