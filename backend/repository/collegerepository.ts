import { CrudRepository } from "./crudrepository";
import { ICollege } from "../types/database/college";
import College from "../models/college";

class CollegeRepository extends CrudRepository<ICollege, any> {
  constructor() {
    super(College);
  }
}

export default new CollegeRepository();
