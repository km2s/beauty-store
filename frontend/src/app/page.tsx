import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Collections from "@/components/home/Collections";
import About from "@/components/home/About";
import QuizBanner from "@/components/home/QuizBanner";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Collections />
      <About />
      <QuizBanner />
      <Testimonials />
      <Newsletter />
    </>
  );
}
