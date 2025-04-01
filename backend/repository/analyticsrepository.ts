import { IAnalytics } from "../types/database/analytics";
import Analytics from "../models/analytics";
import { CrudRepository } from "./crudrepository";

class AnalyticsRepository extends CrudRepository<IAnalytics, any> {
  constructor() {
    super(Analytics);
  }
}
export default new AnalyticsRepository();
