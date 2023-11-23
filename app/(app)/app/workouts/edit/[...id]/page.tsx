"use client";
import { Button } from "@/components/ui/button";
import { InputForm } from "@/components/ui/input";
import { AuthContext } from "@/contexts/auth";
import { Exercise } from "@/models/exercise";
import { Machine } from "@/models/machine";
import { Set, SetModel } from "@/models/set";
import { env } from "@/utils/env";
import { TrashIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import cookies from "js-cookie";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";

type IForm = {
  id: string;
  name: string;
  active: boolean;
  sets: Set[] | SetModel[];
  userId: number;
  instructorId: string;
};
export default function Page() {
  const params = useParams();
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const methods = useForm<IForm>({
    defaultValues: async () => {
      const at = cookies.get("at");
      const payload = await fetch(env.api + `/workout/${params.id}`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          authorization: "Bearer " + at,
        },
      }).then(async (res) => {
        if (res.status !== 200) {
          return toast.error("");
        }
        return await res.json();
      });

      return {
        id: payload.data.id,
        name: payload.data.name,
        active: payload.data.active,
        sets: payload.data.sets,
        userId: payload.data.userId,
        instructorId: payload.data.instructorId,
      };
    },
  });

  const [exercises, setExercises] = useState<Exercise[]>();
  const [machines, setMachines] = useState<Machine[]>();
  const [deleteds, setDeleteds] = useState<any[]>([]);
  const submit = async (data: IForm) => {
    const sets = [...data.sets, ...deleteds];

    const payload = {
      id: data.id,

      name: data.name,
      active: true,
      sets: sets.map((set, i) => {
        return {
          ...set,
          series: Number(set.series),
          reps: Number(set.reps),
          weight: Number(set.weight),
        };
      }),

      userId: String(data.userId),
      instructorId: data.instructorId,
    };

    const at = cookies.get("at");
    await fetch(env.api + "/workout", {
      method: "PATCH",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${at}`,
      },
    }).then((res) => {
      if (res.status !== 200) {
        return toast.error("Erro ao atualizar o treino!");
      }
      toast.success("Treino atualizado com sucesso!");
      methods.reset({});
      router.push("/app/workouts");
    });
  };

  const { append, fields, remove } = useFieldArray({
    control: methods.control,
    name: "sets",
    keyName: "id",
  });

  useEffect(() => {
    async function exercise() {
      const at = cookies.get("at");
      const res = await fetch(env.api + "/exercise", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${at}`,
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

  async function handleRemove(i: number) {
    const data = methods.getValues(`sets.${i}`);
    const payload = {
      ...data,
      deletedAt: "deleted",
    };

    setDeleteds((prev) => [...prev, payload]);
    remove(i);
  }

  return (
    <div className="min-h-screen w-full py-20 px-4 flex items-center justify-center">
      <div className="max-w-md w-full flex items-center flex-col bg-dark rounded-md py-4 px-5 ">
        <div className="w-full">
          <h1
            className={clsx(
              " text-center bg-white  text-gray  w-full font-medium px-3 py-3 rounded-md"
            )}
          >
            Editar treino
          </h1>
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(submit)}
              className="flex   w-full space-y-4 mt-10 flex-col"
            >
              <div className="space-x-4  w-full">
                <InputForm
                  className="w-full"
                  placeholder="Nome do treino"
                  name="name"
                  type="text"
                />
              </div>
              {fields
                .filter((set: any) => !set.deletedAt)
                .map((fields, i) => {
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
                            handleRemove(i);
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
                              className="w-full text-center h-8 appearance-none outline-none px-4 rounded-md bg-primary"
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
                              className="w-full text-center h-8 appearance-none outline-none px-4 rounded-md bg-primary"
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
                              className="w-full text-center h-8 appearance-none outline-none px-4 rounded-md bg-primary"
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
                            <label className="w-full text-sm">
                              Equipamento
                            </label>
                            <select
                              className=" text-center w-full h-8 appearance-none outline-none px-4 rounded-md bg-primary"
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
                        <label
                          className="w-full px-1  "
                          htmlFor={`input-series-${i}`}
                        >
                          Series
                        </label>
                        <label
                          className="w-full px-1 text-center"
                          htmlFor={`input-reps-${i}`}
                        >
                          Repetições
                        </label>
                        <label
                          className="w-full px-1 text-end"
                          htmlFor={`input-weight-${i}`}
                        >
                          Carga
                        </label>
                      </div>
                      <div className="w-full h-full flex justify-between items-center gap-2">
                        <div className="w-1/2 h-full">
                          <InputForm
                            id={`input-series-${i}`}
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
                            id={`input-reps-${i}`}
                            name={`sets.${i}.reps`}
                            className=" text-center w-full rounded-md bg-primary"
                            type="number"
                          />
                        </div>
                        <div className="flex text-xs justify-center h-full  items-center">
                          /
                        </div>

                        <div className="w-1/2 text-end h-full">
                          <InputForm
                            disabled={user?.role !== "USER" ? true : false}
                            id={`input-weight-${i}`}
                            name={`sets.${i}.weight`}
                            className=" text-center placeholder:text-white w-full rounded-md bg-primary"
                            type="number"
                            placeholder="0 Kg"
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
                Atualizar treino
              </Button>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
