import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "FPL Idétavle",
  description:
    "Indsend og stem på straffe, belønninger og regler for FPL-ligaen",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
