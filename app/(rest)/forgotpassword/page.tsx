"use client";
import { Button } from "@/components/ui/button";
import { InputForm } from "@/components/ui/input";
import { env } from "@/utils/env";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
export default function Page() {
  const router = useRouter();

  const [steps, setSteps] = useState(1);
  const [code, setCode] = useState<number>();
  const schema1 = z.object({
    email: z.string().email("E-mail inválido!"),
  });
  const methods = useForm<{ email: string }>({
    resolver: zodResolver(schema1),
    defaultValues: {
      email: "",
    },
  });

  const schema2 = z.object({
    code: z
      .string()
      .refine((v) => Number(v) === code, { message: "Código inválido!" }),
  });
  const methods2 = useForm<{
    code: number;
  }>({
    resolver: zodResolver(schema2),
  });

  const schema3 = z
    .object({
      email: z.string().email("E-mail inválido!"),
      password: z.string().min(3, "Senha muito curta!"),
      confirmPassword: z.string().min(3, "Senha muito curta!"),
    })
    .refine(({ password, confirmPassword }) => password === confirmPassword, {
      path: ["confirmPassword"],
      message: "As senhas não conferem!",
    });
  const methods3 = useForm<{
    email: string;
    password: string;
    confirmPassword: string;
  }>({
    resolver: zodResolver(schema3),
  });

  const submit = async (data: { email: string }) => {
    await fetch(env.api + "/auth/recovery/" + data.email, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setCode(res);
        methods3.setValue("email", data.email);
        setTimeout(() => {
          setCode(undefined);
        }, 60000);
      })
      .then(() => setSteps(2));
  };

  const submit2 = async (data: { code: number }) => {
    if (!code) {
      methods.reset();
      methods3.reset();
      setSteps(1);
      return;
    }
    if (Number(data.code) === code) {
      setSteps(3);
    }
  };

  const submit3 = async (data: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    if (data.password === data.confirmPassword) {
      await fetch(env.api + "/auth/recovery", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          "access-control-allow-origin": "*",
        },
      }).finally(() => {
        router.push("/");
      });
    }
  };

  return (
    <div className="min-h-screen h-full bg-primary w-full flex items-center justify-center lg:w-1/2">
      <AnimatePresence mode="popLayout">
        <div className="flex w-full gap-10 items-center flex-col">
          <div className="flex w-full max-w-xs justify-between">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                scale: [0, 1.2, 1, 1.2, 1],
                background:
                  steps === 1 ? "#2f2c31" : steps > 1 ? "#fff" : "#00000000",
                border:
                  steps === 1
                    ? "2px solid #2f2c31"
                    : steps > 1
                    ? "2px solid transparent"
                    : "2px solid #2f2c31",
                color: steps === 1 || steps < 1 ? "#fff" : "#2f2c31",
                opacity: 1,
              }}
              className="w-10 h-10 rounded-full border border-dark flex items-center justify-center font-bold text-sm"
            >
              1
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                scale: steps === 2 ? [0, 1.2, 1, 1.2, 1] : 1,
                background:
                  steps === 2 ? "#2f2c31" : steps > 2 ? "#fff" : "#00000000",
                border:
                  steps === 2
                    ? "2px solid #2f2c31"
                    : steps < 2
                    ? "2px solid #fff"
                    : "2px solid transparent",
                color: steps === 2 || steps < 2 ? "#fff" : "#2f2c31",
                opacity: 1,
              }}
              className="w-10 h-10 rounded-full border border-dark flex items-center justify-center font-bold text-sm"
            >
              2
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                scale: steps === 3 ? [0, 1.2, 1, 1.2, 1] : 1,
                background:
                  steps === 3 ? "#2f2c31" : steps > 3 ? "#fff" : "#00000000",
                border:
                  steps === 3
                    ? "2px solid #2f2c31"
                    : steps < 3
                    ? "2px solid #fff"
                    : "2px solid transparent",
                color: steps === 3 || steps < 3 ? "#fff" : "#2f2c31",
                opacity: 1,
              }}
              className="w-10 h-10 rounded-full border border-dark flex items-center justify-center font-bold text-sm"
            >
              3
            </motion.div>
          </div>
          <div className="h-52 w-full max-w-xs flex justify-center ">
            {steps === 1 && (
              <FormProvider {...methods}>
                <motion.form
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={methods.handleSubmit(submit)}
                  className="flex flex-col items-center max-w-xs w-full"
                >
                  <div className="flex mt-10 w-full h-14 flex-col">
                    <InputForm
                      name="email"
                      type="email"
                      placeholder="Digite o seu e-mail"
                    />
                    <span className="text-sm">
                      {methods.formState.errors.email &&
                        methods.formState.errors.email.message}
                    </span>
                  </div>

                  <Button type="submit" className="mt-4 w-full">
                    Enviar
                  </Button>
                  <div className="mt-4 text-sm space-x-2">
                    <span>Ja possui uma conta?</span>
                    <Link
                      href="/"
                      className="font-medium text-white/90 hover:text-white"
                    >
                      Entrar
                    </Link>
                  </div>
                </motion.form>
              </FormProvider>
            )}
            {code && steps === 2 && (
              <FormProvider {...methods2}>
                <motion.form
                  layout
                  variants={{
                    initial: {
                      opacity: 0,
                    },
                    animate: {
                      opacity: 1,
                    },
                    exit: {
                      opacity: 0,
                    },
                  }}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ initial: { delay: 1 } }}
                  onSubmit={methods2.handleSubmit(submit2)}
                  className="flex flex-col items-center max-w-xs w-full gap-4"
                >
                  <div className="flex flex-col w-full">
                    <InputForm
                      type="number"
                      className="w-full"
                      name="code"
                      placeholder="Digite o código de acesso"
                    />
                    <span className="text-sm">
                      {methods2.formState.errors.code &&
                        methods2.formState.errors.code.message}
                    </span>
                  </div>
                  <Button className="w-full" type="submit">
                    Avançar
                  </Button>
                </motion.form>
              </FormProvider>
            )}
            {steps === 3 && (
              <FormProvider {...methods3}>
                <motion.form
                  layout
                  variants={{
                    initial: {
                      opacity: 0,
                    },
                    animate: {
                      opacity: 1,
                    },
                    exit: {
                      opacity: 0,
                    },
                  }}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ initial: { delay: 1 } }}
                  onSubmit={methods3.handleSubmit(submit3)}
                  className="flex flex-col items-center max-w-xs w-full gap-4"
                >
                  <div className="h-14 w-full flex flex-col">
                    <InputForm
                      type="password"
                      name="password"
                      className="w-full"
                      placeholder="Digite a nova senha"
                    />
                    <span className="text-sm">
                      {methods3.formState.errors.password &&
                        methods3.formState.errors.password.message}
                    </span>
                  </div>
                  <div className="h-14 w-full flex flex-col">
                    <InputForm
                      type="password"
                      className="w-full"
                      name="confirmPassword"
                      placeholder="Confirme a nova senha"
                    />
                    <span className="text-sm">
                      {methods3.formState.errors.confirmPassword &&
                        methods3.formState.errors.confirmPassword.message}
                    </span>
                  </div>
                  <Button type="submit" className="w-full ">
                    Alterar senha
                  </Button>
                </motion.form>
              </FormProvider>
            )}
          </div>
        </div>
      </AnimatePresence>
    </div>
  );
}
