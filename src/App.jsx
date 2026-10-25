import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import Contact from "./sections/Contact";
import About from './sections/About';
import Projects from "./sections/Projects";


const App = () => {
  return (
    <div className="container mx-auto max-w-7xl">
      <Navbar />
      <Hero />
      <About/>
      <Projects/>
      <Contact />
    </div>
  );
};

export default App;
