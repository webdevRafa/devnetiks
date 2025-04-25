



export const StoredCode: React.FC = () => {
   
    return <>
       {/* SERVICES */}
       <section id="services" className="relative h-[100vh] w-full flex items-center justify-center">
           <div className="w-full flex flex-col items-center justify-center">
         <div className="md:pt-0">
          {/* PACKAGES HEADER */}
         <h1 className={`text-center text-3xl md:text-4xl lg:text-6xl text-rose-400 mb-5 transition duration-800z-50 dark py-3 delay-300 ${activeSection === 'services' ? 'translate-y-0 opacity-100 animate-pulse' : 'translate-y-[1000px] opacity-0'}`}>PACKAGES</h1>
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

    
    </>
}