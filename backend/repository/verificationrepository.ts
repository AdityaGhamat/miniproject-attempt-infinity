import { CrudRepository } from "./crudrepository";
import Verification from "../models/verification";
import { VerficationCodeDocument } from "../types/database/verification";

class VerificationRepository extends CrudRepository<
  VerficationCodeDocument,
  any
> {
  constructor() {
    super(Verification);
  }
}

export default new VerificationRepository();
