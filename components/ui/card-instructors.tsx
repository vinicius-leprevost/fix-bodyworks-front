import { User } from "@/models/user";
import { env } from "@/utils/env";
import { TrashIcon } from "@radix-ui/react-icons";
import cookies from "js-cookie";
import { Dispatch, SetStateAction } from "react";

export function CardInstructors({
  data,
  setInstructors,
}: {
  data: User;
  setInstructors: Dispatch<SetStateAction<User[] | undefined>>;
}) {
  const handleDelete = async (id: string) => {
    const at = cookies.get("at");
    await fetch(env.api + `/user/toUser/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${at}`,
      },
    }).finally(async () => {
      await fetch(env.api + "/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${at}`,
        },
      })
        .then((res) => res.json())
        .then((res: { data: User[] }) =>
          setInstructors(
            res.data.filter((e) => e.role === "INSTRUCTOR" && !e.deletedAt)
          )
        );
    });
  };

  return (
    <div className=" h-24 flex items-center justify-between  gap-10 rounded-md  px-4 bg-dark">
      <div className="flex flex-col space-y-1 ">
        <h1 className="  font-medium rounded-md text-white text-center">
          {data.name}
        </h1>
        <p className="w-full h-6 font-light text-sm  text-white/50 text-center  ">
          {data.hash}
        </p>
      </div>
      <div className=" flex items-center h-full    text-center ">
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
