import { Character } from "./character";

export interface PaginateResponse<> {
  results: Character[];
  meta: any;
}
