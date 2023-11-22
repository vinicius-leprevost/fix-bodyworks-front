import { AppProvider } from "@/contexts/app";
import { AuthProvider } from "@/contexts/auth";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: {
    template: "Bodyworks | %s",
    default: "Bodyworks",
  },
  description: "Sistema de gestão de academia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${roboto.variable}`}>
      <body>
        <ToastContainer
          closeOnClick
          // toastClassName="flex w-fit h-20 !bg-white"
          theme="dark"
          position="bottom-right"
          draggable
          newestOnTop={true}
        />
        <AuthProvider>
          <AppProvider>{children}</AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
