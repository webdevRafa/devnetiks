import { useEffect, useRef, useState } from "react"
import { FaAngleDoubleDown } from "react-icons/fa";
import logo from "../assets/devnetiks-white.svg";
import computer from "../assets/computer.jpg";
import rafita from "../assets/rafita.jpg";

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
          <div className="fixed px-4 z-50 dark right-0 pb-3 md:pb-0 top-20 md:top-1/2 transform -translate-y-1/2 flex flex-col space-y-4 text-gray-950">
        {sections.map((id) => (
            <a key={id} href={`#${id}`} className={`text-lg transition text-right ${
                activeSection === id ? 'text-white font-bold animate-pulse ease-in-out duration-300 scale-120' : 'text-white opacity-30'
            }`}>
                {id}
            </a>
        ))}
        </div>

        {/* SECTIONS */}
        <div>

            {/* HOME */}
           <section id="home" className="relative w-full z-[40] h-[100vh] flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center relative px-10 md:px-0">
         <div>
          {/* LOGO */}
        <img className={`transition ease-out delay-0 w-[250px] md:w-[500px] mb-2 duration-700 ${
            activeSection === 'home' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-2000px] '
        }`} src={logo} alt="" />
       
            <p className={`offwhite text-lg md:text-3xl transition delay-400 ease-out duration-700 ${
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
            {/* BACKGROUND IMAGE FOR HERO SECTION */}
            <div className="absolute z-[-1] overflow-hidden top-0 left-0 w-full h-full">
            <img className={`min-h-screen object-cover opacity-50 transition ease-in-out duration-2000 ${activeSection === 'home' ? ' scale-100' : ' scale-0'}`} src={computer} alt="" />
            </div>
           </section>

           {/* ABOUT */}
           <section id="about" className="relative h-[100vh] w-full flex items-center justify-center px-10">
            <div className="w-full h-full flex items-center justify-center relative">
             <div className="w-full max-w-[1200px] relative mx-auto">
                {/* NAV ITEMS */}
                <div className="darkest flex text-2xl md:text-4xl gap-5 justify-start transition duration-300 ease-out">
  <h1
    onClick={() => setActiveTab('what')}
    className={`cursor-pointer transition-all duration-500 delay-0  ease-in-out ${
      activeSection === 'about' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-200px]'
    } ${activeTab === 'what' ? 'text-white' : 'text-gray-700'}
    `}
  >
    WHAT
  </h1>

  <h1
    onClick={() => setActiveTab('why')}
    className={`cursor-pointer transition-all duration-500 delay-0 ease-in-out ${
      activeSection === 'about' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-200px]'
    } ${activeTab === 'why' ? 'text-white' : 'text-gray-700'}
    `}
  >
    WHY
  </h1>

  <h1
    onClick={() => setActiveTab('how')}
    className={`cursor-pointer transition-all duration-500 delay-0 ease-in-out ${
      activeSection === 'about' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-200px]'
    } ${activeTab === 'how' ? 'text-white' : 'text-gray-700'}
    `}
  >
    HOW
  </h1>
</div>

<div className={`transition duration-1200 ease-out delay-600 ${activeSection === 'about' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[500px]'}`}>
<div className="w-full  text-white mt-20 transition-all duration-700">
  <h1 className="text-2xl mb-2">
    {activeTab === 'what' && "WHAT I DO"}
    {activeTab === 'why' && "WHY I DO IT"}
    {activeTab === 'how' && "HOW I DO IT"}
  </h1>
  <p className={`text-2xl transition-all darkest py-5 duration-1000 ${activeTab === 'what' && 'translate-y-0 text-cyan-800'} ${activeTab === 'why' && 'translate-y-[20px] text-emerald-800'} ${activeTab === 'how' && 'translate-y-[40px] text-fuchsia-800'} `}>
    {activeTab === 'what' && "At Devnetiks, I craft custom web applications using cutting-edge technologies like React, TypeScript, and Google Firebase."}
    {activeTab === 'why' && "I believe great websites are more than just code — they’re a gateway to bigger opportunities. Helping businesses grow online drives me..."}
    {activeTab === 'how' && "I combine modern web development frameworks like React and TypeScript with powerful backend tools like Firebase to create seamless solutions..."}
  </p>
</div>

          
</div>
            {/* IMAGE CONTAINER */}
            <div className="absolute z-[-1] h-full right-0 top-0 w-[400px]">
            <img className={`object-cover transition ease-in-out duration-2000 delay-500  ${activeSection === 'about' ? ' scale-100 opacity-50 translate-x-0' : 'translate-x-[600px] opacity-0 scale-0'}`} src={rafita} alt="" />
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