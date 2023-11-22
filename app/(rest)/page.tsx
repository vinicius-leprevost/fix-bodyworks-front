"use client";
import { Button } from "@/components/ui/button";
import { InputForm } from "@/components/ui/input";
import { AuthContext } from "@/contexts/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
export default function Home() {
  const { signIn } = useContext(AuthContext);

  const schema = z.object({
    email: z.string().email("E-mail inválido!"),
    password: z.string().min(3, "Senha muito curta!"),
  });

  type SignInData = z.infer<typeof schema>;

  const methods = useForm<SignInData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  return (
    <main className="flex min-h-screen flex-col items-center justify-center lg:p-24 w-full lg:w-1/2 bg-primary">
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(signIn)}
          className="flex flex-col items-center max-w-xs w-full"
        >
          <div className="w-full bg-center h-52 bg-cover bg-no-repeat bg-[url(/assets/logo.png)]  lg:hidden" />
          <h1 className="text-2xl font-medium text-white">Seja bem-vindo!</h1>
          <div className="flex mt-10 w-full flex-col gap-2">
            <div className="flex flex-col h-16">
              <InputForm name="email" type="email" placeholder="E-mail" />
              <span className="text-sm">
                {methods.formState.errors.email &&
                  methods.formState.errors.email.message}
              </span>
            </div>
            <div className="flex flex-col h-16">
              <InputForm name="password" type="password" placeholder="Senha" />
              <span className="text-sm">
                {methods.formState.errors.password &&
                  methods.formState.errors.password.message}
              </span>
            </div>
          </div>
          <Link
            className="font-medium mt-4 w-full text-left text-sm"
            href="/forgotpassword"
          >
            Esqueci minha senha
          </Link>
          <Button type="submit" className="mt-4 w-full">
            Entrar
          </Button>
          <div className="mt-4 text-sm space-x-2">
            <span>Ainda não tem conta?</span>
            <Link
              href="/signup"
              className="font-medium text-white/90 hover:text-white"
            >
              Cadastre-se
            </Link>
          </div>
        </form>
      </FormProvider>
    </main>
  );
}
