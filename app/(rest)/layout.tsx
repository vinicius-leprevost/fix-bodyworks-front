export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex">
        <div className="w-1/2 hidden lg:flex bg-gray  bg-[url(/assets/logo.png)] bg-no-repeat bg-center" />
        {children}
      </div>
    </>
  );
}
