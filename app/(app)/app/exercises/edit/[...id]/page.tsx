"use client";
import { Button } from "@/components/ui/button";
import { InputForm } from "@/components/ui/input";
import { Exercise } from "@/models/exercise";
import { env } from "@/utils/env";
import cookies from "js-cookie";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";

type IForm = {
  id: string;
  name?: string;
  description?: string;
};

export default function Page() {
  const params = useParams();
  const id = params.id as string;
  const [exercise, setExercise] = useState<Exercise>();

  const router = useRouter();

  const methods = useForm<IForm>({
    mode: "onChange",
    defaultValues: {
      id: id,
      description: exercise?.description,
      name: exercise?.name,
    },
  });

  useEffect(() => {
    async function getExercise() {
      const at = cookies.get("at");
      await fetch(env.api + `/exercise/` + params.id, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${at}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setExercise(res.data);
          methods.setValue("description", res.data.description);
          methods.setValue("name", res.data.name);
        });
    }
    getExercise();
  }, [params.id, methods]);

  const submit = async (data: IForm) => {
    const payload: IForm = {
      id: data.id,
      name: data.name,
      description: data.description,
    };
    const cookie = cookies.get("at");
    await fetch(env.api + "/exercise", {
      method: "PATCH",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${cookie}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.statusCode !== 200) {
          return toast.error("Erro ao cadastrar exercício!");
        }
        methods.reset({ name: "", description: "" });
        router.push("/app/exercises");
      })
      .catch((err) => {
        return toast.error("Erro ao cadastrar exercício!");
      });
  };

  return (
    <div className="w-full">
      <div className="min-h-screen w-full px-4 flex items-center justify-center">
        <div className="max-w-md w-full flex items-center flex-col border border-black/20 shadow drop-shadow-md  bg-dark rounded-md py-4 px-5 ">
          <div className="w-full">
            <h1 className=" text-center bg-white  text-gray  w-full font-medium px-3 py-3 rounded-md">
              Editar exercício
            </h1>
            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit(submit)}
                className="flex  w-full space-y-4 mt-10 flex-col"
              >
                <div className="space-x-4 w-full">
                  <InputForm
                    className="w-full"
                    placeholder="Nome do exercício"
                    name="name"
                    type="text"
                  />
                </div>
                <InputForm
                  placeholder="Descrição"
                  name="description"
                  type="text"
                />
                <Button intent="primary" type="submit">
                  Atualizar exercício
                </Button>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
