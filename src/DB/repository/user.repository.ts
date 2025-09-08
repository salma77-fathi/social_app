import { CreateOptions, HydratedDocument, Model } from "mongoose";
import { IUser as TDocument } from "../models/User.model.js";
import { DatabaseRepository } from "./db.repository.js";
import { BadRequestException } from "../../utils/response/error.response.js";

export class UserRepository extends DatabaseRepository<TDocument> {
  constructor(protected override readonly model: Model<TDocument>) {
    super(model);
  }

  async createUser({
    data,
    options,
  }: {
    data: Partial<TDocument>[];
    options?: CreateOptions;
  }): Promise<HydratedDocument<TDocument>> {
    const [user] = (await this.create({ data, options })) || [];
    if (!user) {
      throw new BadRequestException("fail to create this user");
    }
    return user;
  }
}
