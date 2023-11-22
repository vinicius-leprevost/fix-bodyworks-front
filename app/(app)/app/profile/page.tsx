"use client";
import { Button } from "@/components/ui/button";
import { InputForm } from "@/components/ui/input";
import { AuthContext } from "@/contexts/auth";
import { env } from "@/utils/env";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const schema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nome inválido!").optional(),
  email: z.string().email("E-mail inválido!").optional(),
  weigth: z.string().optional(),
  height: z.string().optional(),
  password: z.string().min(3, "A senha precisa ter no mínimo 3 caracteres!"),
});

type IForm = z.infer<typeof schema>;

const schemaPassword = z
  .object({
    id: z.string(),
    oldPassword: z
      .string()
      .min(3, "A senha precisa ter no mínimo 3 caracteres!"),
    password: z.string().min(3, "A senha precisa ter no mínimo 3 caracteres!"),
    passwordConfirmation: z
      .string()
      .min(3, "A senha precisa ter no mínimo 3 caracteres!"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "As senhas precisam ser iguais!",
    path: ["passwordConfirmation"],
  });

type IFormPassword = z.infer<typeof schemaPassword>;
export default function Page() {
  const router = useRouter();
  const { user, setUser } = useContext(AuthContext);
  const methods = useForm<IForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: user?.id,
      name: user?.name,
      email: user?.email,
      weigth: user?.weigth?.toFixed(1),
      height: user?.height?.toFixed(2),
    },
  });

  const submit = async (data: IForm) => {
    const payload: IForm = {
      id: user!.id,
      name: data.name !== "" ? data.name : undefined,
      email: data.email !== "" ? data.email : undefined,
      password: data.password,
      weigth: Number(data.weigth).toFixed(2),
      height: Number(data.height).toFixed(2),
    };
    const cookie = cookies.get("at");
    await fetch(env.api + "/user", {
      method: "PATCH",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        "access-control-allow-origin": "*",
        authorization: `Bearer ${cookie}`,
      },
    })
      .then(async (res) => {
        if (res.status !== 200){
          return toast.error("Erro ao alterar as informações!");
        }
        toast.success("Informações alteradas com sucesso!");
        const data = await res.json();
        setUser(data.data);
        router.push("/app");
        methods.reset({ id: user?.id, password: "" })
      })
  };
  const methodsPassword = useForm<IFormPassword>({
    resolver: zodResolver(schemaPassword),
    defaultValues: {
      id: user?.id,
    },
  });

  useEffect(() => {
    methodsPassword.reset({
      id: user?.id,
    });
  }, [user, methodsPassword]);

  async function submitPassword(data: IFormPassword) {
    await fetch(env.api + "/user/password", {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        "access-control-allow-origin": "*",
        authorization: `Bearer ${cookies.get("at")}`,
      },
    })
      .then(async (res) => {
        if (res.status !== 200) {
          return toast.error("Erro ao alterar a senha!");
        }
          toast.success("Senha alterada com sucesso!");
        const data = await res.json();
        methodsPassword.reset({
          id: user?.id,
          oldPassword: "",
          password: "",
          passwordConfirmation: "",
        });
      })
      .catch((err) => {console.log(err)});
  }
  const [active, setActive] = useState(1);

  return (
    <div className="min-h-screen px-4 w-full flex items-center justify-center">
      <div className="max-w-md w-full flex items-center flex-col border border-black/20 shadow drop-shadow-md  bg-dark rounded-md py-4 px-5 ">
        <div className="w-full flex flex-nowrap">
          <Button
            onClick={() => setActive(1)}
            className={clsx("  rounded-r-none w-full", {
              "!bg-gray1 text-white/80": active === 2,
            })}
          >
            Editar perfil
          </Button>
          <Button
            onClick={() => setActive(2)}
            className={clsx("  rounded-l-none w-full", {
              "!bg-gray1 text-white/80": active === 1,
            })}
          >
            Alterar senha
          </Button>
        </div>
        <motion.div
          animate={{ height: "auto" }}
          layoutRoot
          className="w-full relative overflow-hidden"
        >
          <AnimatePresence mode="wait" initial={false} presenceAffectsLayout>
            <FormProvider {...methods}>
              <motion.form
                animate={{
                  translateX: active === 1 ? 0 : "-100%",
                  opacity: active === 1 ? 1 : 0,
                  position: active === 1 ? "relative" : "absolute",
                  top: 0,
                }}
                transition={{ duration: 0.5, display: { position: 0.5 } }}
                onSubmit={methods.handleSubmit(submit)}
                className="flex  w-full space-y-4 mt-10 flex-col"
              >
                <div className="space-x-4 h-14 flex flex-col w-full">
                  <InputForm
                    className="w-full"
                    placeholder={user?.name}
                    name="name"
                    type="text"
                  />
                  <span className="text-sm">
                    {methods.formState.errors.name &&
                      methods.formState.errors.name.message}
                  </span>
                </div>
                <div className="w-full flex-col h-14 flex">
                  <InputForm
                    className="w-full"
                    placeholder={user?.email}
                    name="email"
                    type="email"
                  />
                  <span className="text-sm">
                    {methods.formState.errors.email &&
                      methods.formState.errors.email.message}
                  </span>
                </div>
                <div className="flex w-full gap-4 justify-between">
                  <div className="h-14 flex flex-col w-1/2">
                    <InputForm
                      className="w-full"
                      placeholder={user?.weigth?.toFixed(1) || "Peso"}
                      name="weigth"
                      type="text"
                    />
                    <span className="text-sm">
                      {methods.formState.errors.weigth &&
                        methods.formState.errors.weigth.message}
                    </span>
                  </div>
                  <div className="h-14 flex flex-col w-1/2">
                    <InputForm
                      className="w-full"
                      placeholder={user?.height?.toFixed(2) || "Altura"}
                      name="height"
                      type="text"
                    />
                    <span className="text-sm">
                      {methods.formState.errors.height &&
                        methods.formState.errors.height.message}
                    </span>
                  </div>
                </div>
                <div className="space-x-4 h-14 w-full flex flex-col ">
                  <InputForm
                    className="w-full"
                    name="password"
                    placeholder="Senha"
                    type="password"
                  />
                  <span className="text-sm">
                    {methods.formState.errors.password &&
                      methods.formState.errors.password.message}
                  </span>
                </div>

                <Button intent="primary" type="submit">
                  Alterar informações
                </Button>
              </motion.form>
            </FormProvider>
            <FormProvider {...methodsPassword}>
              <motion.form
                animate={{
                  translateX: active === 2 ? 0 : "100%",
                  opacity: active === 2 ? 1 : 0,
                  position: active === 2 ? "relative" : "absolute",
                }}
                transition={{ duration: 0.5, display: { position: 0.5 } }}
                onSubmit={methodsPassword.handleSubmit(submitPassword)}
                className="flex w-full space-y-4 mt-10 flex-col"
              >
                <div className=" flex flex-col h-14 w-full">
                  <InputForm
                    className="w-full"
                    name="oldPassword"
                    placeholder="Senha atual"
                    type="password"
                  />
                  <span className="text-sm">
                    {methodsPassword.formState.errors.oldPassword &&
                      methodsPassword.formState.errors.oldPassword.message}
                  </span>
                </div>
                <div className=" flex flex-col h-14 w-full">
                  <InputForm
                    className="w-full"
                    name="password"
                    placeholder="Nova senha"
                    type="password"
                  />
                  <span className="text-sm">
                    {methodsPassword.formState.errors.password &&
                      methodsPassword.formState.errors.password.message}
                  </span>
                </div>
                <div className="flex flex-col h-14 w-full">
                  <InputForm
                    className="w-full"
                    name="passwordConfirmation"
                    placeholder="Confirme a nova senha"
                    type="password"
                  />
                  <span className="text-sm">
                    {methodsPassword.formState.errors.passwordConfirmation &&
                      methodsPassword.formState.errors.passwordConfirmation
                        .message}
                  </span>
                </div>

                <Button intent="primary" type="submit">
                  Alterar senha
                </Button>
              </motion.form>
            </FormProvider>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
