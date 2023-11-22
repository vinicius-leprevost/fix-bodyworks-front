import { Machine } from "@/models/machine";
import { User } from "@/models/user";
import { env } from "@/utils/env";
import { Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import cookies from "js-cookie";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

export function CardMachines({
  data,
  setMachines,
}: {
  data: Machine;
  setMachines: Dispatch<SetStateAction<Machine[] | undefined>>;
}) {
  const handleDelete = async (id: string) => {
    const at = cookies.get("at");
    await fetch(env.api + `/machine/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${at}`,
      },
    }).finally(async () => {
      await fetch(env.api + "/machine", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${at}`,
        },
      })
        .then((res) => res.json())
        .then((res: { data: User[] }) =>
          setMachines(res.data.filter((e) => !e.deletedAt))
        );
    });
  };

  return (
    <div className=" h-12 flex items-center justify-between  gap-10 rounded-md  px-4 bg-dark">
      <div className="flex flex-col space-y-1 ">
        <h1 className="  font-medium rounded-md text-white text-center">
          {data.name}
        </h1>
      </div>
      <div className=" flex items-center h-full  gap-2  text-center ">
        <Link
          href={`/app/machines/edit/${data.id}?name=${data.name}`}
          className=" flex justify-center items-center w-fit p-1 hover:bg-opacity-80  rounded-md "
        >
          <Pencil2Icon color="#EB1D63" className=" w-5 h-5" />
        </Link>
        <button
          onClick={(e) => {
            e.preventDefault();
            handleDelete(data.id);
          }}
          className=" flex justify-center items-center w-fit p-1   rounded-md "
        >
          <TrashIcon color="#EB1D63" className=" w-5 h-5" />{" "}
        </button>
      </div>
    </div>
  );
}
