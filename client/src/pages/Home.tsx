import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import SpecialBanner from "@/components/home/SpecialBanner";
import Menu from "@/components/home/Menu";
import About from "@/components/home/About";
import Testimonials from "@/components/home/Testimonials";
import Gallery from "@/components/home/Gallery";
import Reservation from "@/components/home/Reservation";
import Contact from "@/components/home/Contact";
import Newsletter from "@/components/home/Newsletter";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <SpecialBanner />
        <Menu />
        <About />
        <Testimonials />
        <Gallery />
        <Reservation />
        <Contact />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
