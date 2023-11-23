"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { StarsHistory } from "@/components/ui/stars-history";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AuthContext } from "@/contexts/auth";
import { History } from "@/models/history";
import { env } from "@/utils/env";
import { TrashIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Page() {
  const { user, refreshToken } = useContext(AuthContext);

  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const columns: ColumnDef<History>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Exercício",
      cell: ({ row }) => {
        const find = user?.sets.find((set) => set.id === row.original.setId);
        if (find) {
          return <div className="capitalize">{find?.exercise?.name}</div>;
        }
      },
    },
    {
      accessorKey: "stars",
      header: "Feedback",
      cell: ({ row }) => {
        return <StarsHistory history={row.original} />;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Realizado em",
      cell: ({ row }) => {
        return (
          <div>{new Date(row.original.createdAt).toLocaleString("pt-BR")}</div>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Avaliado em",
      cell: ({ row }) => {
        return (
          <div>{new Date(row.original.updatedAt).toLocaleString("pt-BR")}</div>
        );
      },
    },
    {
      accessorKey: "actions",
      header: () => (
        <div className="flex items-center justify-center">Ações</div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center">
            <button
              onClick={async (e) => {
                e.preventDefault();
                await handleRemove(row.original.id);
              }}
            >
              <TrashIcon color="#EB1D63" />
            </button>
          </div>
        );
      },
    },
  ];

  const handleRemove = async (id: string) => {
    const at = cookies.get("at");
    await fetch(env.api + "/history/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "access-control-allow-origin": "*",
        authorization: `Bearer ${at}`,
      },
    }).then((res) => {
      if (res.status !== 200) {
        return toast.error("Erro ao deletar a avaliação!");
      }
      toast.success("Avaliação deletada com sucesso!");
      reloadData();
    });
  };

  const [data, setData] = useState<History[]>(user?.history || []);

  useEffect(() => {
    if (user) setData(user.history);
  }, [user]);

  const router = useRouter();

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const reloadData = async () => {
    await refreshToken();
  };

  useEffect(() => {
    console.log(rowSelection);
    console.log(table.getSelectedRowModel());
  }, [rowSelection, table]);

  async function handleExcludeAllSelected() {
    const at = cookies.get("at");
    const ids = await table
      .getSelectedRowModel()
      .rows.map((row) => row.original.id);
    let errors = 0;
    let success = 0;
    for (let id of ids) {
      await fetch(env.api + "/history/" + id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "access-control-allow-origin": "*",
          authorization: `Bearer ${at}`,
        },
      }).then((res) => {
        if (res.status !== 200) {
          return errors++;
        }
        success++;
      });
    }
    if (errors > 1) {
      toast.error(`${errors} erros ao deletar as avaliações!`);
    }
    if (errors > 0 && errors < 2) {
      toast.error(`Erro ao deletar a avaliação!`);
    }

    if (success > 1) {
      toast.success(`${success} avaliações deletadas com sucesso!`);
    }
    if (success > 0 && success < 2) {
      toast.success(`Avaliação deletada com sucesso!`);
    }
    reloadData();
  }

  return (
    <div className="flex flex-col w-full gap-10 py-20 lg:px-20 sm:px-10 px-4">
      <div className="w-full items-center flex justify-between">
        <h1 className="text-2xl ">Histórico</h1>
        <Button
          onClick={(e) => {
            e.preventDefault();
            handleExcludeAllSelected();
          }}
          disabled={table.getSelectedRowModel().rows.length === 0}
        >
          Excluir selecionados
        </Button>
      </div>
      <div className="rounded-md border border-black/20 shadow drop-shadow-lg ">
        <Table className="bg-dark/70 outline-transparent outline-2">
          <TableHeader className="bg-dark">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className="border-none outline-none"
                      key={header.id}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} linha(s) selecionadas.
        </div>
        <div className="space-x-2">
          <Button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Voltar
          </Button>
          <Button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Avançar
          </Button>
        </div>
      </div>
    </div>
  );
}
