"use client";
import { Button } from "@/components/ui/button";
import { InputForm } from "@/components/ui/input";
import { env } from "@/utils/env";
import { zodResolver } from "@hookform/resolvers/zod";
import cookies from "js-cookie";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

export default function Page() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const schema = z.object({
    id: z.string(),
    name: z.string().min(1, "O campo precisa ter no mínimo 1 caracter!"),
  });
  type IForm = z.infer<typeof schema>;
  const methods = useForm<IForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: params.id[0] as string,
      name: searchParams.get("name") as string,
    },
  });
  async function submit(data: IForm) {
    const at = cookies.get("at");
    await fetch(env.api + `/machine`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${at}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.statusCode !== 200) {
          return toast.error("Erro ao atualizar o equipamento!");
        }
        router.push("/app/machines");
      })
      .catch((err) => {
        return toast.error("Erro ao atualizar o equipamento!");
      });
  }
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full flex items-center flex-col bg-dark rounded-md py-4 px-5 ">
        <div className="w-full flex flex-nowrap">
          <div className="w-full relative overflow-hidden">
            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit(submit)}
                className="flex  w-full space-y-4  flex-col"
              >
                <div className="h-14 flex flex-col w-full">
                  <InputForm
                    className="w-full"
                    placeholder="Digite o nome do equipamento"
                    name="name"
                    type="text"
                  />
                  <span className="text-sm">
                    {methods.formState.errors.name &&
                      methods.formState.errors.name.message}
                  </span>
                </div>

                <Button intent="primary" type="submit">
                  Atualizar equipamento
                </Button>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
