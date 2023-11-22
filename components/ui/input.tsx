"use client";
import { VariantProps, cva } from "class-variance-authority";
import clsx from "clsx";
import { useFormContext } from "react-hook-form";

const styles = cva(
  "bg-gray px-3 py-3 rounded-md  focus:border-primary border-transparent border-[1px] !ring-transparent !outline-none active:outline-none ",
  {
    variants: {},
    defaultVariants: {},
  }
);

export function Input({ className, isInForm, name, ...rest }: InputProps) {
  return <input {...rest} className={clsx(styles({}), className)} />;
}

export function InputForm({ className, name, ...rest }: InputFormProps) {
  const methods = useFormContext();

  return (
    <input
      {...methods.register(name)}
      {...rest}
      className={clsx(styles({}), className)}
    />
  );
}

export interface InputFormProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof styles> {
  name: string;
}

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof styles> {
  isInForm?: boolean;
  name?: string;
}
