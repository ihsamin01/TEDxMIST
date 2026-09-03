import About from "@/components/About";
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
import Team from "@/components/Team";

export default function Home() {
  return (
    <>
      <SiteBackdrop />

      <ScrollProgress />
      <Nav />

      {/* Sits above the fixed backdrop rather than being painted over by it. */}
      <main id="top" className="relative z-10">
        <Hero />
        <Marquee />
        <About />
        <Speakers />
        <Stats />
        <Schedule />
        <Register />
        <Team />
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
      <BackToTop />
    </>
  );
}
