import { Nav } from "@/components/Nav";
import { BackToTop } from "@/components/ui/BackToTop";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";
import { PageWall } from "@/components/brickwall/PageWall";

export default function Home() {
  return (
    <>
      <Nav />
      {/* One continuous brick wall behind every section. */}
      <PageWall>
        <main id="main" className="pointer-events-none">
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Experience />
        </main>
        <Contact />
      </PageWall>
      <BackToTop />
    </>
  );
}
