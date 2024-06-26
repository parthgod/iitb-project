import { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "VoltVault",
  description: "Power systems app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-screen w-screen overflow-hidden">
        <NextTopLoader />
        <div>{children}</div>
        <Toaster
          position="top-center"
          richColors
          closeButton={true}
          duration={4000}
        />
      </body>
    </html>
  );
}
