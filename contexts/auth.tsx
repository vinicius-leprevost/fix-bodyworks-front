"use client";
import { User } from "@/models/user";
import { env } from "@/utils/env";
import cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { ReactNode, createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { z } from "zod";

export const schemaSignUp = z.object({
  role: z.enum(["ADMIN", "INSTRUCTOR", "USER"]),
  doc: z.string().min(11, "CPF inválido!"),
  name: z.string().min(1, "Nome inválido!"),
  email: z.string().email("E-mail inválido!"),
  gender: z
    .string()
    .refine((v) => v !== "GENERO", { message: "Selecione um gênero!" }),
  birthdate: z.string().refine((v) => v !== "", { message: "Data inválida!" }),
  password: z.string().min(3, "Senha muito curta!"),
});

export type ISignUpData = z.infer<typeof schemaSignUp>;
export type IAuthContext = {
  refreshToken: () => Promise<void>;
  user: User | undefined;
  signIn: (data: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (data: ISignUpData) => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
};

export const AuthContext = createContext({} as IAuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [user, setUser] = useState<User>();

  async function signIn(data: { email: string; password: string }) {
    try {
      await fetch(env.api + "/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "access-control-allow-origin": "*",
        },
        body: JSON.stringify(data),
      }).then(async (res) => {
        if (res.status !== 200) {
          return toast.error("E-mail ou senha incorreto!");
        }
        const data = await res.json();

        setUser(data.data.user);
        cookies.set("rt", data.data.refreshToken, {
          expires: 60 * 60 * 24 * 7,
        });
        cookies.set("at", data.data.accessToken, { expires: 60 * 60 });
        router.push("/app");
      });
    } catch (err) {
      toast.error("Erro ao fazer login!");
    }
  }

  async function refreshToken() {
    const rt = cookies.get("rt");
    const at = cookies.get("at");

    if (!rt || !at) router.push("/");

    await fetch(env.api + "/auth", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${rt}`,
        "access-control-allow-origin": "*",
      },
    }).then(async (res) => {
      if (res.status !== 200) {
        return signOut();
      }

      const data = await res.json();
      console.log(data.data.user);
      cookies.set("rt", data.data.refreshToken, {
        expires: 60 * 60 * 24 * 7,
      });
      cookies.set("at", data.data.accessToken, { expires: 60 * 60 });
      setUser(data.data.user);
    });
  }

  async function signOut() {
    setUser(undefined);
    cookies.remove("rt");
    cookies.remove("at");
    router.push("/");
  }

  async function signUp(data: ISignUpData) {
    try {
      await fetch(env.api + "/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "access-control-allow-origin": "*",
        },
        body: JSON.stringify(data),
      }).then(async (res) => {
        if (res.status !== 201) {
          return toast.error("Dados já cadastrados");
        }
        const data = await res.json();

        setUser(data.data.user);

        cookies.set("rt", data.data.refreshToken, {
          expires: 60 * 60 * 24 * 7,
        });
        cookies.set("at", data.data.accessToken, { expires: 60 * 60 });
        router.push("/app");
      });
    } catch (err) {
      toast.error("Erro ao realizar requisição!");
    }
  }

  useEffect(
    () => {
      async function t() {
        const rt = cookies.get("rt");
        const at = cookies.get("at");
        if (rt && at) {
          await refreshToken();
        }
      }
      t();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <AuthContext.Provider
      value={{ user, signIn, signOut, signUp, setUser, refreshToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}
