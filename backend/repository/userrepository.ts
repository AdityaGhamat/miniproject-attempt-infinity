import User from "../models/user";
import { User as IUser } from "../types/database/user";
import { CrudRepository } from "./crudrepository";

class UserRepository extends CrudRepository<IUser, any> {
  constructor() {
    super(User);
  }
  async isEmailExists(email: string) {
    const isExists = await this.model.exists({ email }).lean();
    return !!isExists;
  }
}

export default new UserRepository();
