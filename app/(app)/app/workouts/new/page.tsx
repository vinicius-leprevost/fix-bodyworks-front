"use client";
import { Button } from "@/components/ui/button";
import { InputForm } from "@/components/ui/input";
import { Exercise } from "@/models/exercise";
import { Machine } from "@/models/machine";
import { env } from "@/utils/env";
import { zodResolver } from "@hookform/resolvers/zod";
import { TrashIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { AuthContext } from "../../../../../contexts/auth";

export default function Page() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const schema = z.object({
    name: z.string().min(1, "O campo precisa ter no mínimo 1 caracter!"),
    active: z.boolean().default(true),
    sets: z.array(
      z.object({
        day: z.enum([
          "SUNDAY",
          "MONDAY",
          "TUESDAY",
          "WEDNESDAY",
          "THURSDAY",
          "FRIDAY",
          "SATURDAY",
        ]),
        machineId: z.string(),
        type: z.enum(["CHEST", "BACK", "LEGS", "SHOULDERS", "ARMS", "ABS"]),
        exerciseId: z.string(),
        reps: z.coerce.number(),
        series: z.coerce.number(),
      })
    ),
    userId: z.coerce
      .number()
      .min(1, "O campo precisa ter no mínimo 1 caracter!")
      .transform((data) => String(data)),
    instructorId: z.string(),
  });

  type IForm = z.infer<typeof schema>;
  const methods = useForm<IForm>({
    resolver: zodResolver(schema),
    defaultValues: { active: true, instructorId: user?.id },
  });

  const submit = async (data: IForm) => {
    const cookie = cookies.get("at");
    await fetch(env.api + "/workout", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${cookie}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.statusCode !== 201) {
          return toast.error("Erro ao cadastrar o treino!");
        }
        toast.success("Treino cadastrado com sucesso!");
        methods.reset({});
        router.push("/app/workouts");
      });
  };

  const { append, fields, remove } = useFieldArray({
    control: methods.control,
    name: "sets",
  });

  const [exercises, setExercises] = useState<Exercise[]>();
  const [machines, setMachines] = useState<Machine[]>();

  useEffect(() => {
    async function exercise() {
      const cookie = cookies.get("at");
      const res = await fetch(env.api + "/exercise", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${cookie}`,
        },
      });
      const data = await res.json();
      setExercises(
        data.data.filter((exercise: Exercise) => !exercise.deletedAt)
      );
    }
    exercise();

    async function machine() {
      const cookie = cookies.get("at");
      const res = await fetch(env.api + "/machine", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${cookie}`,
        },
      });
      const data = await res.json();

      setMachines(data.data.filter((machine: Machine) => !machine.deletedAt));
    }
    machine();
  }, []);

  return (
    <div className="min-h-screen w-full py-20 px-4 flex items-center justify-center">
      <div className="max-w-md w-full flex items-center flex-col border border-black/20 shadow drop-shadow-md  bg-dark rounded-md py-4 px-5 ">
        <div className="w-full">
          <h1
            className={clsx(
              " text-center bg-white  text-gray  w-full font-medium px-3 py-3 rounded-md"
            )}
          >
            Novo treino
          </h1>
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(submit)}
              className="flex   w-full space-y-4 mt-10 flex-col"
            >
              <div className="w-full h-14 flex flex-col">
                <InputForm
                  className="w-full"
                  type="number"
                  name="userId"
                  placeholder="Digite o código do usuário"
                />
                <span className="text-sm">
                  {methods.formState.errors.userId &&
                    methods.formState.errors.userId.message}
                </span>
              </div>
              <div className="flex flex-col h-14  w-full">
                <InputForm
                  className="w-full"
                  placeholder="Nome do treino"
                  name="name"
                  type="text"
                />
                <span className="text-sm">
                  {methods.formState.errors.name &&
                    methods.formState.errors.name.message}
                </span>
              </div>
              {fields.map((fields, i) => {
                return (
                  <div
                    className="flex flex-col p-2 border gap-y-7 border-gray rounded-md"
                    key={i}
                  >
                    <div className="flex justify-between">
                      <h2 className="font-bold">Exercicio {i + 1}</h2>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          remove(i);
                        }}
                      >
                        <TrashIcon className=" w-6 h-6" />
                      </button>
                    </div>
                    <div className="space-y-5">
                      <div className="w-full flex gap-4 justify-between">
                        <div className="w-1/2 flex flex-col">
                          <label className="w-full text-sm">Dia</label>
                          <select
                            className="w-full text-center h-8 appearance-none px-4 rounded-md bg-primary"
                            defaultValue={"MONDAY"}
                            {...methods.register(`sets.${i}.day`)}
                          >
                            <option
                              className="text-center hover:text-center"
                              value="SUNDAY"
                            >
                              Domingo
                            </option>
                            <option className="text-center" value="MONDAY">
                              Segunda
                            </option>
                            <option className="text-center" value="TUESDAY">
                              Terça
                            </option>
                            <option className="text-center" value="WEDNESDAY">
                              Quarta
                            </option>
                            <option className="text-center" value="THURSDAY">
                              Quinta
                            </option>
                            <option className="text-center" value="FRIDAY">
                              Sexta
                            </option>
                            <option className="text-center" value="SATURDAY">
                              Sábado
                            </option>
                          </select>
                        </div>
                        <div className="w-1/2 flex flex-col">
                          <label className="w-full text-sm">Tipo</label>
                          <select
                            className="w-full text-center h-8 appearance-none px-4 rounded-md bg-primary"
                            defaultValue={"CHEST"}
                            {...methods.register(`sets.${i}.type`)}
                          >
                            <option className="text-center" value="CHEST">
                              Peito
                            </option>
                            <option className="text-center" value="BACK">
                              Costa
                            </option>
                            <option className="text-center" value="LEGS">
                              Perna
                            </option>
                            <option className="text-center" value="SHOULDERS">
                              Ombro
                            </option>
                            <option className="text-center" value="ARMS">
                              Braço
                            </option>
                            <option className="text-center" value="ABS">
                              Abdômen
                            </option>
                          </select>
                        </div>
                      </div>
                      <div className="w-full flex gap-4 justify-between">
                        <div className="w-1/2 flex flex-col">
                          <label className="w-full text-sm">Exercício</label>
                          <select
                            className="w-full text-center h-8 appearance-none px-4 rounded-md bg-primary"
                            placeholder="Exercício"
                            {...methods.register(`sets.${i}.exerciseId`)}
                          >
                            {exercises &&
                              exercises?.map((exercise, i) => {
                                return (
                                  <option
                                    key={i}
                                    className="text-center"
                                    value={exercise.id}
                                  >
                                    {exercise.name}
                                  </option>
                                );
                              })}
                          </select>
                        </div>
                        <div className="w-1/2 flex flex-col">
                          <label className="w-full text-sm">Equipamento</label>
                          <select
                            className=" text-center w-full h-8 appearance-none px-4 rounded-md bg-primary"
                            defaultValue={"id1"}
                            {...methods.register(`sets.${i}.machineId`)}
                          >
                            {machines &&
                              machines.map((machine, i) => {
                                return (
                                  <option key={i} value={machine.id}>
                                    {machine.name}
                                  </option>
                                );
                              })}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="flex text-sm -mb-7 justify-between">
                      <label className="w-full px-1" htmlFor="">
                        Series
                      </label>
                      <label className="w-full px-1 text-end" htmlFor="">
                        Repetições
                      </label>
                    </div>
                    <div className="w-full h-full flex justify-between items-center gap-2">
                      <div className="w-1/2 h-full">
                        <InputForm
                          name={`sets.${i}.series`}
                          className=" text-center w-full rounded-md bg-primary"
                          type="number"
                        />
                      </div>
                      <div className="flex text-xs justify-center h-full  items-center">
                        x
                      </div>
                      <div className="w-1/2 text-end h-full">
                        <InputForm
                          name={`sets.${i}.reps`}
                          className=" text-center w-full rounded-md bg-primary"
                          type="number"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  append({
                    day: "MONDAY",
                    machineId:
                      machines && machines.length !== 0 ? machines[0].id : "",
                    type: "CHEST",
                    exerciseId: exercises![0].id,
                    reps: 0,
                    series: 0,
                  });
                }}
                className={clsx(
                  " text-center !bg-gray1 text-white  hover:bg-opacity-80 w-full font-medium px-3 py-3 rounded-md"
                )}
                type="submit"
              >
                Adicionar exercicio
              </Button>
              <Button intent="primary" type="submit">
                Cadastrar treino
              </Button>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
