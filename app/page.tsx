import Header from "./components/Header";
import Hero from "./components/Hero";
import FeatureGrid from "./components/FeatureGrid";
import DashboardShowcase from "./components/DashboardShowcase";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <FeatureGrid />
        <div className="hidden lg:block">

          <DashboardShowcase />
        </div>
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}
