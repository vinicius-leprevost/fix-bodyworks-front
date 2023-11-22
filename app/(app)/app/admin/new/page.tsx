"use client";
import { Button } from "@/components/ui/button";
import { InputForm } from "@/components/ui/input";
import { AuthContext } from "@/contexts/auth";
import { env } from "@/utils/env";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence } from "framer-motion";
import cookies from "js-cookie";
import { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
type IForm = {
  hash: string;
};

export default function Page() {
  const { user, setUser } = useContext(AuthContext);
  const schema = z.object({
    hash: z.coerce.number().min(1, "O campo precisa ter no mínimo 1 caracter!"),
  });
  type IForm = z.infer<typeof schema>;
  const methods = useForm<IForm>({
    resolver: zodResolver(schema),
  });

  const submit = async (data: IForm) => {
    const cookie = cookies.get("at");
    await fetch(env.api + `/user/toAdmin/${data.hash}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        "access-control-allow-origin": "*",
        authorization: `Bearer ${cookie}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.statusCode !== 200) {
          return toast.error("Código do usuário não existe!");
        } else {
          toast.success("Administrador cadastrado com sucesso!");
        }

        methods.reset({ hash: undefined });
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
                  <div className="flex flex-col h-14 w-full">
                    <InputForm
                      className="w-full"
                      placeholder="Digite o código do usuário"
                      name="hash"
                      type="number"
                    />
                    <span className="text-sm">
                      {methods.formState.errors.hash &&
                        methods.formState.errors.hash.message}
                    </span>
                  </div>

                  <Button intent="primary" type="submit">
                    Tornar administrador
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
