import { Set } from "./set";

export abstract class Machine {
  abstract id: string;
  abstract name: string;
  abstract createdAt: Date | string;
  abstract updatedAt: Date | string;
  abstract deletedAt?: Date | null | undefined;
  abstract sets?: Set[];
}
