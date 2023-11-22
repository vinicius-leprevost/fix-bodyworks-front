import { Exercise } from "./exercise";
import { Workout } from "./workout";

export abstract class Set {
  abstract reps: number;
  abstract type: Type;
  abstract weight?: number;
  abstract day: Day;
  abstract machineId: string;
  abstract exerciseId: string;

  abstract series: number;
}

export type Type = "BACK" | "CHEST" | "LEGS" | "SHOULDERS" | "ARMS" | "ABS";

export type Day =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export abstract class SetModel {
  abstract id: string;
  abstract reps: number;
  abstract weight?: number;
  abstract series: number;
  abstract type: Type;
  abstract day: Day;
  abstract userId: string;
  abstract machineId: string;
  abstract exercise: Exercise;

  abstract exerciseId: string;
  abstract workout?: Workout;
  abstract workoutId?: string;
  abstract createdAt: Date | string;
  abstract updatedAt: Date | string;
  abstract deletedAt?: Date | null | undefined;
  abstract history?: History[];
}
