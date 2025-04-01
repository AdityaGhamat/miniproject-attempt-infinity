import { v4 as uuid } from "uuid";

export function generateUniqueCode() {
  return uuid().replace(/-/g, "").substring(0, 25);
}
