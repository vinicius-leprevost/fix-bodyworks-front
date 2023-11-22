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
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.statusCode === 400 || res.statusCode === 500) {
            return toast.error("E-mail ou senha incorreto!");
          }
          setUser(res.data.user);
          cookies.set("rt", res.data.refreshToken, {
            expires: 60 * 60 * 24 * 7,
          });
          cookies.set("at", res.data.accessToken, { expires: 60 * 60 });
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
      })
        .then((res) => res.json())
        .then((res) => {
          cookies.set("rt", res.data.refreshToken, {
            expires: 60 * 60 * 24 * 7,
          });
          cookies.set("at", res.data.accessToken, { expires: 60 * 60 });
          setUser(res.data.user);
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
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.statusCode === 400 || res.statusCode === 500) {
            cookies.remove("rt");
            cookies.remove("at");
            throw new Error("Dados já cadastrados");
          }
          setUser(res.data.user);

          cookies.set("rt", res.data.refreshToken, {
            expires: 60 * 60 * 24 * 7,
          });
          cookies.set("at", res.data.accessToken, { expires: 60 * 60 });
          router.push("/app");
        });
    } catch (err) {
      toast.error("Dados já cadastrados");
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
