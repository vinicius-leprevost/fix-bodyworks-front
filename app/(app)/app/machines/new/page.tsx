"use client";
import { Button } from "@/components/ui/button";
import { InputForm } from "@/components/ui/input";
import { env } from "@/utils/env";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence } from "framer-motion";
import cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
type IForm = {
  name: string;
};

export default function Page() {
  const schema = z.object({
    name: z.string().min(1, "O campo precisa ter no mínimo 1 caracter!"),
  });
  const methods = useForm<IForm>({
    resolver: zodResolver(schema),
  });

  const router = useRouter();

  const submit = async (data: IForm) => {
    const cookie = cookies.get("at");
    await fetch(env.api + `/machine`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        "access-control-allow-origin": "*",
        authorization: `Bearer ${cookie}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.statusCode !== 201) {
          toast.error("Erro ao cadastrar o equipamento!");
        }
        toast.success("Equipamento cadastrado com sucesso!");
        methods.reset({ name: "" });
        router.push("/app/machines");
      });
  };

  return (
    <div className="min-h-screen px-4 w-full flex items-center justify-center">
      <div className="max-w-md w-full flex items-center flex-col bg-dark rounded-md py-4 px-5 ">
        <div className="w-full flex flex-nowrap">
          <div className="w-full relative overflow-hidden">
            <AnimatePresence mode="wait" initial={false} presenceAffectsLayout>
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
                    Adicionar equipamento
                  </Button>
                </form>
              </FormProvider>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
