"use client";
import { Button } from "@/components/ui/button";
import { InputForm } from "@/components/ui/input";
import { AuthContext, ISignUpData, schemaSignUp } from "@/contexts/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";
export default function Page() {
  const { signUp } = useContext(AuthContext);
  const methods = useForm<ISignUpData>({
    resolver: zodResolver(schemaSignUp),
    defaultValues: {
      role: "USER",
      doc: "",
      name: "",
      email: "",
      birthdate: "",
      password: "",
    },
  });

  return (
    <div className="min-h-screen h-full bg-primary w-full flex items-center justify-center lg:w-1/2">
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(signUp)}
          className="flex flex-col items-center max-w-xs w-full"
        >
          <div className="w-full bg-center h-52 bg-cover bg-no-repeat bg-[url(/assets/logo.png)]  lg:hidden" />
          <h1 className="text-2xl font-medium text-white">Crie sua conta!</h1>
          <div className="flex mt-10 w-full flex-col gap-4">
            <div className="h-14 w-full flex flex-col">
              <InputForm name="name" type="text" placeholder="Nome" />
              <span className="text-sm">
                {methods.formState.errors.name &&
                  methods.formState.errors.name.message}
              </span>
            </div>

            <div className="h-14  w-full flex flex-col">
              <InputForm name="email" type="email" placeholder="E-mail" />
              <span className="text-sm">
                {methods.formState.errors.email &&
                  methods.formState.errors.email.message}
              </span>
            </div>
            <div className="h-14 flex flex-col">
              <select
                {...methods.register("gender")}
                className="w-full bg-gray px-3 py-3 gap-2 appearance-none rounded-md"
                defaultValue={"Select"}
                name="gender"
                placeholder="Gênero"
              >
                <option className="hidden" value="GENERO">
                  Genero
                </option>
                <option value="MASC">Masculino</option>
                <option value="FEM">Feminino</option>
                <option value="OUTROS">Outros</option>
              </select>
              <span className="text-sm">
                {methods.formState.errors.gender &&
                  methods.formState.errors.gender.message}
              </span>
            </div>
            <div className="flex gap-4 max-w-xs">
              <div className="h-14 w-1/2 flex flex-col">
                <InputForm
                  name="doc"
                  className="appearance-none w-full"
                  type="number"
                  placeholder="CPF"
                />
                <span className="text-sm">
                  {methods.formState.errors.gender &&
                    methods.formState.errors.gender.message}
                </span>
              </div>
              <div className="flex relative flex-col w-1/2 h-14">
                <InputForm
                  name="birthdate"
                  className="marker:text-primary w-full"
                  type="date"
                  placeholder="birthdate"
                />
                <span className="text-sm absolute -bottom-[14px]">
                  {methods.formState.errors.birthdate &&
                    methods.formState.errors.birthdate.message}
                </span>
              </div>
            </div>
            <div className="flex flex-col h-14">
              <InputForm name="password" type="password" placeholder="Senha" />
              <span className="text-sm  ">
                {methods.formState.errors.password &&
                  methods.formState.errors.password.message}
              </span>
            </div>
          </div>

          <Button type="submit" className="mt-4 w-full">
            Criar conta
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
        </form>
      </FormProvider>
    </div>
  );
}
