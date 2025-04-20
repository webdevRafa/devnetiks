import { useEffect, useRef, useState } from "react"
import { FaAngleDoubleDown } from "react-icons/fa";
import logo from "../assets/devnetiks-white.svg";

const sections = ['home', 'about', 'services', 'contact'];

export const Devnetiks: React.FC = () => {

    const [activeSection, setActiveSection] = useState('');
    const [activeTab, setActiveTab] = useState<'what' | 'why' | 'how'>('what');
    const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                        console.log(entry.target.id, entry.isIntersecting);
                    }
                });
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.6,
            }
        );

        // intersection observer ends

        // tell observer what to watch
        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                sectionRefs.current[id] = el;
                observer.observe(el);

            }
        });

        // take a snapshot with the current refs
        const sectionRefsSnapshot = {...sectionRefs.current };

        return () => {
            sections.forEach(id => {
                const el = sectionRefsSnapshot[id];
                if (el) observer.unobserve(el);
            });
        };
    }, []);

    

    
    return <>
    {/* MAIN CONTAINER */}

    <div className="relative">
          {/* FIXED SIDEBAR NAVIGATION */}
          <div className="fixed z-50 right-6 top-1/2 transform -translate-y-1/2 flex flex-col space-y-4 text-gray-950">
        {sections.map((id) => (
            <a key={id} href={`#${id}`} className={`text-lg transition ${
                activeSection === id ? 'text-white font-bold animate-pulse ease-in-out duration-300 scale-120' : 'hover:text-white opacity-50'
            }`}>
                {id}
            </a>
        ))}
        </div>

        {/* SECTIONS */}
        <div>

            {/* HOME */}
           <section id="home" className="relative z-[40] h-[100vh] flex items-center justify-center">
            <div className="w-full h-full dark flex items-center justify-center relative">
         <div>
        <img className={`transition ease-out delay-0 w-[500px] mb-2 duration-700 ${
            activeSection === 'home' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-2000px] '
        }`} src={logo} alt="" />
       
            <p className={`offwhite text-3xl transition delay-400 ease-out duration-700 ${
                activeSection === 'home' ? 'opacity-100 translate-y-0 delay-0' : 'opacity-0 translate-y-80'
            }`}>Building sleek, powerful websites tailored to your vision.</p>
         </div>
        <div className="absolute z-[40] w-full h-[20px] bottom-10 left-0">
       <a href="#about">
       <FaAngleDoubleDown className={`bottom-0 mx-auto size-10 text-white animate-bounce cursor-pointer transition duration-700 ${
                activeSection === 'home' ? 'opacity-100 translate-y-0 delay-600' : 'opacity-0 translate-y-20 delay-600'
            }`} />
       </a>

        </div>
            </div>
           </section>

           {/* ABOUT */}
           <section id="about" className="dark h-[100vh] w-full flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center relative">
             <div className="w-full max-w-[1200px] mx-auto">
                {/* NAV ITEMS */}
                <div className="flex text-5xl gap-5 justify-start transition duration-700 ease-out">
  <h1
    onClick={() => setActiveTab('what')}
    className={`cursor-pointer transition-all duration-300 delay-300 ease-in-out ${
      activeSection === 'about' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-200px]'
    } ${activeTab === 'what' ? 'text-white' : 'text-gray-400'}
    `}
  >
    what
  </h1>

  <h1
    onClick={() => setActiveTab('why')}
    className={`cursor-pointer transition-all duration-300 delay-100 ease-in-out ${
      activeSection === 'about' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-200px]'
    } ${activeTab === 'why' ? 'text-white' : 'text-gray-400'}
    `}
  >
    why
  </h1>

  <h1
    onClick={() => setActiveTab('how')}
    className={`cursor-pointer transition-all duration-300 delay-0 ease-in-out ${
      activeSection === 'about' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-200px]'
    } ${activeTab === 'how' ? 'text-white' : 'text-gray-400'}
    `}
  >
    how
  </h1>
</div>

<div className={`transition duration-1200 ease-out delay-600 ${activeSection === 'about' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[500px]'}`}>
    
            {/* ABOUT CONTENT */}
            {activeTab === 'what' && (
             <div className="w-full text-white mt-10">
             <h1 className="text-3xl md:text-4xl mb-5">what i do</h1>
             <p className="text-3xl offwhite">At Devnetiks, I craft custom web applications using cutting-edge technologies like React, TypeScript, and Google Firebase.
             I build fast, scalable, and fully tailored websites designed to meet the specific needs of each client — whether it’s a dynamic web app, a marketing site, or a full digital platform.</p>
             </div>
           )}

{activeTab === 'why' && (
             <div className="w-full text-white mt-10">
             <h1 className="text-3xl md:text-4xl mb-5">why i do it</h1>
             <p className="text-3xl offwhite">I believe great websites are more than just code — they’re a gateway to bigger opportunities.
Helping businesses grow online drives me, and I take pride in turning complex ideas into simple, functional, and impactful digital experiences.
Your success is my success, and every project is built with that mindset.</p>
             </div>
           )}

{activeTab === 'how' && (
             <div className="w-full text-white mt-10">
             <h1 className="text-3xl md:text-4xl mb-5">how i do it</h1>
             <p className="text-3xl offwhite">I combine modern web development frameworks like React and TypeScript with powerful backend tools like Firebase to create seamless, secure, and scalable solutions.
             Every project starts with understanding your vision, planning a strategy, and building a website that's not only visually striking but optimized for real-world performance.</p>
             </div>
           )}
</div>

             </div>
            </div>
           </section>

           {/* SERVICES */}
           <section id="services" className="h-[100vh] flex items-center justify-center"></section>

           {/* CONTACT */}
           <section id="contact" className="h-[100vh] flex items-center justify-center"></section>
        </div>
    </div>
    </>
}