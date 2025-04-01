import Session from "../models/session";
import { SessionDocument } from "../types/database/session";
import { CrudRepository } from "./crudrepository";

class SessionRepository extends CrudRepository<SessionDocument, any> {
  constructor() {
    super(Session);
  }
}
export default new SessionRepository();
