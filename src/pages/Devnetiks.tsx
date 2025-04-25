import { useEffect, useRef, useState } from "react";
import logo from "../assets/devnetiks-white.svg";
import computer from "../assets/pc.svg";
import rafita from "../assets/rafita.jpg";
import rosebg from "../assets/rosebg.svg";
import aboutbg from "../assets/aboutbg.svg";

import reactLogo from "../assets/react.png";
import firebaseLogo from "../assets/firebase.png";
import tailwindLogo from "../assets/Tailwind CSS.png";
import { GoPackage } from "react-icons/go";
import { FiPackage } from "react-icons/fi";
import { LuPackagePlus } from "react-icons/lu";


const sections = ['home', 'about', 'services', 'contact'];
const services = [
  { name: 'Starter Package', sub: 'Brochure Website', icon: <GoPackage className="size-10" />
    , price: '$800', ideal: 'Small businesses, freelancers, service providers who just need an online presence.', content: <ul className="text-white list-disc"><li>5-page responsive website</li>
  <li>Built with React + Typescript</li>
  <li>Custom Design (no templates)</li>
  <li>Contact Form</li>
  <li>Basic SEO Optimization</li>
  <li>Hosting Setup Guidance</li></ul>,},
   { name: 'Professional Package', sub: 'Interactive Website', icon: <FiPackage className="size-10" />, price: '$1,500', ideal: 'Businesses who want dynamic content or user interactivity', content: <ul className="text-white list-disc"><li>Everything in Starter Package, plus:</li>
    <li>Firebase integration <ul className="ml-4 list-disc"><li>Contact form sends submissions to Firestore or email</li>
    <li>Newsletter sign-up</li></ul></li>
    <li>CMS-lite Features (testimonials)</li>
    <li>Authentication system</li>
    <li>Admin Dashboard</li>
    <li>Advanced SEO Optimization</li></ul>,},
     { name: 'Premium Web Application Package', sub: 'Full Dynamic Site', icon: <LuPackagePlus className="size-10" />, price: '$3,000', ideal: 'Startups, real estate agents, gyms, businesses that need user accounts or complex functionality', content: <ul className="text-white list-disc"><li>Everything in Professional Package, plus:</li>
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
                threshold: 0.8,
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

    <div className="relative overflow-hidden">
          {/* FIXED SIDEBAR NAVIGATION */}
          <div className="fixed px-4 z-60  right-6 top-30 md:top-1/2 transform -translate-y-1/2 flex flex-col space-y-4">
        {sections.map((id) => (
            <a key={id} href={`#${id}`} className={`text-lg transition text-right hover:scale-110 duration-300 ${
                activeSection === id ? ` font-bold animate-pulse ease-in-out duration-300 scale-120 ${sectionColors[id]}` : ' opacity-30 text-white'
            }`}>
                {id}
            </a>
        ))}
        </div>

        {/* SECTIONS */}
        <div>

            {/* HOME */}

            {/* HOME SECTION CONTAINER */}
           <section id="home" className="relative w-full z-[50] overflow-hidden h-[100vh] flex items-center justify-center">

            {/* FLEX CONTAINER */}
            <div className="w-full h-full flex items-center justify-center relative px-10 md:px-0">
         <div>
          {/* LOGO */}
        <img className={`transition ease-out delay-0 w-[250px] md:w-[350px] mb-2 duration-700 ${
            activeSection === 'home' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-2000px] '
        }`} src={logo} alt="" />
              {/* SUBTEXT FOR LOGO */}
            <p className={`offwhite text-lg md:text-2xl transition delay-400 ease-out duration-700 ${
                activeSection === 'home' ? 'opacity-100 translate-y-0 delay-0' : 'opacity-0 translate-y-80'
            }`}>Building sleek, powerful websites tailored to your vision.</p>
         </div>

        
            </div>
            {/* BACKGROUND IMAGE FOR HERO SECTION */}
            <div className="absolute z-[-1] overflow-hidden top-0 left-0 w-full h-full">
            <img className={`min-h-screen object-cover opacity-50 transition ease-in-out duration-2000 ${activeSection === 'home' ? ' scale-100' : ' scale-0'}`} src={computer} alt="" />
            </div>
           </section>

           {/* ABOUT SECTION*/}
           <section id="about" className="relative z-40 h-[100vh] w-full flex items-center justify-center px-4 md:px-10">

            {/* MAIN CONTAINER FOR ABOUT SECTION */}
            <div className="w-full h-full flex items-center justify-center relative">

              {/* CONTROLS THE MAX WIDTH OF 1200PX  */}
             <div className="w-full max-w-[1200px] relative mx-auto">
                {/* NAV ITEMS */}
                <div className="flex text-2xl md:text-3xl gap-5 justify-start transition duration-300 ease-out z-60">


                  {/* NAV WHAT */}
  <h1
    onClick={() => setActiveTab('what')}
    className={`relative z-50 cursor-pointer transition-all duration-800 delay-0  ease-in-out ${
      activeSection === 'about' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[-500px]'
    } ${activeTab === 'what' ? 'text-white' : 'text-gray-700'}
    `}
  >
    WHAT
  </h1>
                {/* NAV WHY */}
  <h1
    onClick={() => setActiveTab('why')}
    className={`cursor-pointer transition-all duration-800 delay-100 ease-in-out ${
      activeSection === 'about' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[500px]'
    } ${activeTab === 'why' ? 'text-white' : 'text-gray-700'}
    `}
  >
    WHY
  </h1>
                {/* NAV HOW */}
  <h1
    onClick={() => setActiveTab('how')}
    className={`cursor-pointer transition-all duration-800 delay-200 ease-in-out ${
      activeSection === 'about' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[500px]'
    } ${activeTab === 'how' ? 'text-white' : 'text-gray-700'}
    `}
  >
    HOW
  </h1>
</div>

{/* ABOUT CONTENT CONTAINER DISPLAYS BASED ON SELECTED NAV ITEM */}
<div className={`transition duration-1200 ease-out delay-600 ${activeSection === 'about' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[500px]'}`}>
<div className="w-full  text-white mt-20 transition-all duration-700">
  <h1 className="text-2xl mb-2">
    {activeTab === 'what' && "WHAT I DO"}
    {activeTab === 'why' && "WHY I DO IT"}
    {activeTab === 'how' && "HOW I DO IT"}
  </h1>
  <p className={`text-2xl transition-all darkest py-5 duration-1000 text-white ${activeTab === 'what' && 'translate-y-0'} ${activeTab === 'why' && 'translate-y-[20px]'} ${activeTab === 'how' && 'translate-y-[40px]'} `}>
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
            <div className="hidden md:block absolute z-[-1] h-full right-0 top-0 w-[400px]">
            <img className={`filter grayscale object-cover transition ease-in-out duration-2000 delay-500  ${activeSection === 'about' ? ' scale-100 opacity-20 lg:opacity-100 translate-x-0' : 'translate-x-[600px] opacity-0 scale-0'}`} src={rafita} alt="" />
            </div>
             </div>
            </div>

              {/* ABSOLUTE BG IMAGE */}
        <div className={`overflow-hidden fixed z-[-10] top-0 left-0 w-full h-full transition duration-1000 delay-200 ${activeSection === "about" ? 'opacity-30' : 'opacity-0'}`}>
          <img className={`min-h-screen object-cover transition duration-700 delay-400 opacity-10 ${activeSection === "about" && 'scale-120'}`} src={aboutbg} alt="" />
        </div>
           </section>

           {/* SERVICES */}
           <section id="services" className="relative min-h-screen w-full flex items-center justify-center">
           <div className="h-full w-full flex items-center justify-center">
         <div className="md:pt-0">
          {/* PACKAGES HEADER */}
         <h1 className={`text-center text-3xl md:text-4xl lg:text-6xl text-rose-400 mb-5 transition duration-800  z-50 dark py-3 delay-300 ${activeSection === 'services' ? 'translate-y-0 opacity-100 animate-pulse' : 'translate-y-[1000px] opacity-0'}`}>PACKAGES</h1>
         {/* PACKAGES SUBTEXT */}
         <h2 className={`text-center text-1xl md:text-2xl lg:text-4xl text-white mb-20 transition duration-800  z-50 delay-600 ${activeSection === 'services' ? 'translate-y-0 opacity-100' : 'translate-x-[-500px] opacity-0'}`}>ALL PACKAGES ARE BUILT WITH REACT + TYPESCRIPT</h2>
           <div className="flex flex-col lg:flex-row gap-5 w-full max-w-[1400px] px-10">
           {services.map((service, index) => {
  const delay = 300 + index * 150; // delay per card

  return (
    <div
      key={index}
      style={{ transitionDelay: `${delay}ms` }}
      className={`darkest border-2 border-box py-5 px-10 z-40  border-white text-sm w-full transition-all duration-700 text-white ${
        activeSection === 'services'
          ? 'translate-x-0 opacity-100'
          : 'translate-x-[-1500px] opacity-0'
      }`}
    > 
    {service.icon}
      <h1 className={`mb-0 text-white text-2xl md:text-3xl transition-all duration-700 ${activeSection === 'services' ? 'translate-x-0' : 'translate-x-[500px]'}`}>{service.name}</h1>
      <h1 className={`mb-5 text-rose-400 text-1xl md:text-2xl transition-all duration-700 ${activeSection === 'services' ? 'translate-x-0' : 'translate-x-[500px]'}`}>{service.sub}</h1>
      <h2 className="my-5 text-lg text-white"><span className="text-rose-400">Ideal for: </span>{service.ideal}</h2>
      {service.content}
      <p className="animate-pulse my-5 text-lg w-[200px] bg-rose-400 px-5 text-gray-950 font-bold">
        Price: {service.price}
      </p>
    </div>
  );
})}


           </div>
         </div>
        </div>
        {/* ABSOLUTE BG IMAGE */}
        <div className={`overflow-hidden fixed z-10 top-0 left-0 w-full h-full transition duration-1000 delay-200 ${activeSection === "services" ? 'opacity-80' : 'opacity-0'}`}>
          <img className={`min-h-screen object-cover transition duration-700 delay-400 ${activeSection === "services" && 'animate-pulse scale-120'}`} src={rosebg} alt="" />
        </div>
           </section>

           {/* CONTACT */}
           <section id="contact" className="h-[100vh] flex items-center justify-center"></section>
        </div>
    </div>
    </>
}