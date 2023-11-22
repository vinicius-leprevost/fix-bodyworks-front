import { History } from "./history";
import { SetModel } from "./set";
import { Workout } from "./workout";

export type User = {
  sets: SetModel[];
  id: string;
  role: Role;
  hash: number;
  doc: string;
  gender: string;
  weigth?: number;
  height?: number;
  name: string;
  email: string;
  history: History[];
  birthdate: string;
  password: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt?: Date | null | undefined;
  workouts: Workout[];
  instructorWorkouts: Workout[];
};

export type Role = "ADMIN" | "INSTRUCTOR" | "USER";
