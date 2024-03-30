import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="bg-bulb-img bg-cover relative flex items-center justify-center w-screen h-screen">
      <Navbar />
      <div
        className="absolute top-0 left-0 w-screen h-screen opacity-70"
        style={{ backgroundImage: "linear-gradient(-20deg, #2b5876 0%, #4e4376 100%)" }}
      />
      <div className="z-50 relative flex justify-center items-center w-full h-full gap-3">
        <HeroSection />
        <div className="w-[30vw]">{children}</div>
      </div>
    </main>
  );
}
