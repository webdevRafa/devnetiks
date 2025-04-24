import { useEffect, useRef, useState } from "react"
import { FaAngleDoubleDown } from "react-icons/fa";
import logo from "../assets/devnetiks-white.svg";
import computer from "../assets/computer.jpg";
import rafita from "../assets/rafita.jpg";
import rosebg from "../assets/rosebg.svg";

import reactLogo from "../assets/react.png";
import firebaseLogo from "../assets/firebase.png";
import tailwindLogo from "../assets/Tailwind CSS.png";

const sections = ['home', 'about', 'services', 'contact'];
const services = [
  { name: 'Starter Package (Brochure Website)', price: '$800', ideal: 'Small businesses, freelancers, service providers who just need an online presence.', content: <ul className="text-white list-disc"><li>5-page responsive website</li>
  <li>Built with React + Typescript</li>
  <li>Custom Design (no templates)</li>
  <li>Contact Form</li>
  <li>Basic SEO Optimization</li>
  <li>Hosting Setup Guidance</li></ul>,},
   { name: 'Professional Package (Interactive Website)', price: '$1,500', ideal: 'Businesses who want dynamic content or user interactivity', content: <ul className="text-white list-disc"><li>Everything in Starter Package, plus:</li>
    <li>Firebase integration <ul className="ml-4 list-disc"><li>Contact form sends submissions to Firestore or email</li>
    <li>Newsletter sign-up</li></ul></li>
    <li>CMS-lite Features (testimonials)</li>
    <li>Authentication system</li>
    <li>Admin Dashboard</li>
    <li>Advanced SEO Optimization</li></ul>,},
     { name: 'Premium Web Application Package (Full Dynamic Site)', price: '$3,000', ideal: 'Startups, real estate agents, gyms, businesses that need user accounts or complex functionality', content: <ul className="text-white list-disc"><li>Everything in Professional Package, plus:</li>
      <li>User Accounts (signup / login / profile)</li>
      <li>Custom Firestore Database setup</li>
      <li>Real-time Features (chat, comments, bookings, threads, etc.)</li>
      <li>Payment Integration</li>
      <li>Admin Portal (manage users, posts, products)</li>
      <li>Cloud Functions (send email notifications on bookings)</li>
      </ul>,}
];



export const Devnetiks: React.FC = () => {

    const [activeSection, setActiveSection] = useState('');
    const [activeTab, setActiveTab] = useState<'what' | 'why' | 'how'>('what');
    const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
    const sectionColors: Record<string, string> = {
      home: 'text-cyan-400',
      about: 'text-emerald-400',
      services: 'text-rose-400',
      contact: 'text-'
    };

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
          <div className="fixed px-4 z-50  right-6 top-30 md:top-1/2 transform -translate-y-1/2 flex flex-col space-y-4 text-gray-950">
        {sections.map((id) => (
            <a key={id} href={`#${id}`} className={`text-lg transition text-right ${
                activeSection === id ? ` font-bold animate-pulse ease-in-out duration-300 scale-120 ${sectionColors[id]}` : ' opacity-30'
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
        <div className="fixed z-[40] w-full h-[20px] bottom-10 left-0">
       <a href="#about">
       <FaAngleDoubleDown className={`bottom-0 mx-auto size-10 text-cyan-400 animate-bounce cursor-pointer transition duration-700 ${
                activeSection === 'home' ? 'opacity-100 translate-y-0 delay-600' : 'hidden opacity-0 translate-y-20 delay-600'
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
           <section id="about" className="relative z-40 h-[100vh] w-full flex items-center justify-center px-10">
            <div className="w-full h-full flex items-center justify-center relative">
             <div className="w-full max-w-[1200px] relative mx-auto">
                {/* NAV ITEMS */}
                <div className="flex text-2xl md:text-4xl gap-5 justify-start transition duration-300 ease-out">
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
  <p className={`text-2xl transition-all darkest py-5 duration-1000 text-emerald-800 ${activeTab === 'what' && 'translate-y-0'} ${activeTab === 'why' && 'translate-y-[20px]'} ${activeTab === 'how' && 'translate-y-[40px]'} `}>
  {activeTab === 'what' && <><div>
      <p className="mb-5">I build fast, interactive websites using React, TypeScript, and Tailwind CSS, backed by Firebase for powerful real-time functionality. Whether it's a business site or a user dashboard, I focus on delivering polished, scalable solutions that are responsive and clean.</p>
      <div className="flex gap-5">
        <img src={reactLogo} alt="" />
        <img src={firebaseLogo} alt="" />
        <img className="max-w-[64px]" src={tailwindLogo} alt="" />
        
  
      </div>
    </div></>}
    {activeTab === 'why' && <><div>
      <p className="mb-5">I believe every brand deserves a web presence that’s just as unique and dynamic as they are. I'm passionate about taking the stress out of tech and helping people get online without confusion, frustration, or unnecessary cost. I love making ideas real.</p>
      <div className="flex gap-5">
        <img src={reactLogo} alt="" />
        <img src={firebaseLogo} alt="" />
        <img className="max-w-[64px]" src={tailwindLogo} alt="" />
        
  
      </div>
    </div></>}
    {activeTab === 'how' && <><div>
      <p className="mb-5">First, I listen—then I design and develop based on what you actually need. I use modern tools like Vite for fast performance, Firebase for real-time database and auth, and Tailwind for pixel-perfect styling. I keep my code clean, my workflow transparent, and my clients in the loop the whole time.</p>
      <div className="flex gap-5">
        <img src={reactLogo} alt="" />
        <img src={firebaseLogo} alt="" />
        <img className="max-w-[64px]" src={tailwindLogo} alt="" />
        
  
      </div>
    </div></>}
  </p>
</div>

          
</div>
            {/* IMAGE CONTAINER */}
            <div className="absolute z-[-1] h-full right-0 top-0 w-[400px]">
            <img className={`filter grayscale object-cover transition ease-in-out duration-2000 delay-500  ${activeSection === 'about' ? ' scale-100 opacity-20 translate-x-0' : 'translate-x-[600px] opacity-0 scale-0'}`} src={rafita} alt="" />
            </div>
             </div>
            </div>
            <div className="fixed bottom-5 w-full flex items-center justify-center ">
            <a href="#services">
       <FaAngleDoubleDown className={` size-10 text-emerald-400 animate-bounce cursor-pointer transition duration-700 ${
                activeSection === 'about' ? 'opacity-100 translate-y-0 delay-600 block' : 'hidden opacity-0 translate-y-20'
            }`} />
       </a>
            </div>
           </section>

           {/* SERVICES */}
           <section id="services" className="relative h-[100vh] flex items-center justify-center dark">
           <div className="h-full w-full flex items-center justify-center">
         <div>
         <h1 className={`text-6xl text-rose-400 mb-20 transition duration-700 delay-300 ${activeSection === 'services' ? 'translate-y-0 opacity-100' : 'translate-y-[-300px] opacity-0'}`}>PACKAGES</h1>
           <div className="flex gap-5 w-full max-w-[1400px]">
           {services.map((service, index) => {
  const delay = 300 + index * 150; // delay per card

  return (
    <div
      key={index}
      style={{ transitionDelay: `${delay}ms` }}
      className={`w-full transition-all duration-700 text-white ${
        activeSection === 'services'
          ? 'translate-x-0 opacity-100'
          : 'translate-x-[-1500px] opacity-0'
      }`}
    >
      <h1 className="mb-5 text-white text-4xl">{service.name}</h1>
      <h2 className="my-5 text-xl dtext-white">Ideal for: {service.ideal}</h2>
      {service.content}
      <p className="my-5 text-lg w-[200px] bg-rose-400 px-5 text-gray-950 font-bold">
        Price: {service.price}
      </p>
    </div>
  );
})}


           </div>
         </div>
        </div>
        {/* ABSOLUTE BG IMAGE */}
        <div className={`fixed z-10 top-0 left-0 w-full h-full transition duration-1000 delay-400 ${activeSection === "services" ? 'opacity-80' : 'opacity-0'}`}>
          <img className="object-cover" src={rosebg} alt="" />
        </div>
           </section>

           {/* CONTACT */}
           <section id="contact" className="h-[100vh] flex items-center justify-center"></section>
        </div>
    </div>
    </>
}