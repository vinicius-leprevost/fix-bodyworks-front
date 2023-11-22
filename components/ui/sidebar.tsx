"use client";
import { AuthContext } from "@/contexts/auth";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { Button } from "./button";

export function Sidebar() {
  const { user, signOut } = useContext(AuthContext);

  return (
    <aside className="bg-dark h-screen overflow-y-auto  hidden md:flex flex-col items-center justify-between sticky top-0  w-full max-w-xs">
      <div className="w-full flex  flex-col">
        <Link href="/app">
          <Image src="/assets/logo.png" alt="" width={500} height={500} />
        </Link>
        <h1 className="w-full text-center">
          Bem vindo{" "}
          <span className="font-medium text-primary">{user?.name}</span>!{" "}
        </h1>

        <div className="w-full   overflow-y-auto px-4 space-y-4 mt-20">
          {user?.role === "USER" && (
            <div className="flex    flex-col space-y-4">
              <Link passHref href="/app/workouts">
                <Button className="w-full !bg-gray1 text-white hover:bg-opacity-80 ">
                  Meus treinos
                </Button>
              </Link>
              <Link passHref href="/app/history">
                <Button className="w-full !bg-gray1 text-white hover:bg-opacity-80 ">
                  Histórico
                </Button>
              </Link>
            </div>
          )}
          {user?.role === "ADMIN" && (
            <div className="flex    flex-col space-y-4">
              <Link passHref href="/app/users">
                <Button className="w-full !bg-gray1 text-white hover:bg-opacity-80 ">
                  Todos os usuários
                </Button>
              </Link>
              <Link passHref href="/app/instructors">
                <Button className="w-full !bg-gray1 text-white hover:bg-opacity-80 ">
                  Todos os instrutores
                </Button>
              </Link>
              <Link passHref href="/app/instructors/new">
                <Button className="w-full !bg-gray1 text-white hover:bg-opacity-80 ">
                  Promover instrutor
                </Button>
              </Link>
              <Link passHref href="/app/admin">
                <Button className="w-full !bg-gray1 text-white hover:bg-opacity-80 ">
                  Todos os administradores
                </Button>
              </Link>
              <Link passHref href="/app/admin/new">
                <Button className="w-full !bg-gray1 text-white hover:bg-opacity-80 ">
                  Promover administrador
                </Button>
              </Link>
              <Link passHref href="/app/machines">
                <Button className="w-full !bg-gray1 text-white hover:bg-opacity-80 ">
                  Equipamentos
                </Button>
              </Link>
              <Link passHref href="/app/machines/new">
                <Button className="w-full !bg-gray1 text-white hover:bg-opacity-80 ">
                  Adicionar equipamento
                </Button>
              </Link>
            </div>
          )}
          {user?.role === "INSTRUCTOR" && (
            <div className="flex flex-col space-y-4">
              <Link passHref href="/app/exercises">
                <Button className="w-full !bg-gray1 text-white hover:bg-opacity-80 ">
                  Exercicios
                </Button>
              </Link>
              <Link passHref href="/app/exercises/new">
                <Button className="w-full !bg-gray1 text-white hover:bg-opacity-80 ">
                  Cadastrar exercícios
                </Button>
              </Link>

              <Link passHref href="/app/workouts">
                <Button className="w-full !bg-gray1 text-white hover:bg-opacity-80 ">
                  Treinos
                </Button>
              </Link>
              <Link passHref href="/app/workouts/new">
                <Button className="w-full !bg-gray1 text-white hover:bg-opacity-80 ">
                  Cadastrar treino
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="w-full space-y-3   p-4">
        {user?.role === "USER" && (
          <div>
            <p className="mt-2 text-primary font-medium w-full text-center">
              {user?.hash}
            </p>
            <p className="my-2 text-xs opacity-50 font-medium w-4/5 mx-auto text-center">
              Ao solicitar um treino, voce deve informar este número ao
              instrutor.
            </p>
          </div>
        )}
        <Link passHref href="/app/profile">
          <Button className="w-full !bg-gray1 text-white hover:bg-opacity-80 ">
            Editar perfil
          </Button>
        </Link>
        <Button
          onClick={(e) => {
            e.preventDefault();
            signOut();
          }}
          className="w-full"
          intent="primary"
        >
          Sair
        </Button>
      </div>
    </aside>
  );
}
