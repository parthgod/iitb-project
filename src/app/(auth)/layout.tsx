import NextTopLoader from "nextjs-toploader";
import "../globals.css";
import ToasterContext from "@/context/ToasterContext";

export const metadata = {
  title: "Next.js",
  description: "Generated by Next.js",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <NextTopLoader />
        <ToasterContext />
        {children}
      </body>
    </html>
  );
}
