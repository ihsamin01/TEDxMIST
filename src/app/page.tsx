import About from "@/components/About";
import ClosedToast from "@/components/ClosedToast";
import BackToTop from "@/components/BackToTop";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Nav from "@/components/Nav";
import Register from "@/components/Register";
import Schedule from "@/components/Schedule";
import ScrollProgress from "@/components/ScrollProgress";
import SiteBackdrop from "@/components/SiteBackdrop";
import Speakers from "@/components/Speakers";
import Stats from "@/components/Stats";
import { isRegistrationOpen } from "@/lib/settings";

/** The open/closed switch is read fresh, so flipping it shows up at once. */
export const dynamic = "force-dynamic";

export default async function Home() {
  const open = await isRegistrationOpen();

  return (
    <>
      <SiteBackdrop />

      <ScrollProgress />
      <Nav open={open} />

      {/* Sits above the fixed backdrop rather than being painted over by it. */}
      <main id="top" className="relative z-10">
        <Hero open={open} />
        <Marquee />
        <About />
        <Speakers />
        <Stats />
        <Schedule />
        <Register open={open} />
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
      <BackToTop />
      <ClosedToast />
    </>
  );
}
