import { useEffect, useRef, useState } from "react";

const sections = ['section 1', 'section2', 'section3', 'section4', 'section5'];

export const ScrollSpyPage: React.FC = () => {
    
    const [activeSection, setActiveSection] = useState('');
    const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.6, // Triggers when 60% of the section is visible
            }
        );
        // intesection observer ends

        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                sectionRefs.current[id] = el;
                observer.observe(el);
            }
        });

        return () => {
            sections.forEach(id => {
                const el = sectionRefs.current[id];
                if (el) observer.unobserve(el);
            });
        };
    }, []);

    return <>
    <div className="relative">
        {/* SIDEBAR NAVIGATION */}
        <div className="fixed right-6 top-1/2 transform -translate-y-1/2 flex flex-col space-y-4 text-gray-950">
        {sections.map((id) => (
            <a key={id} href={`#${id}`} className={`text-4xl transition ${
                activeSection === id ? 'text-cyan-600 font-bold animate-pulse ease-in-out duration-300 scale-120' : 'hover:text-white opacity-50'
            }`}>
                {id.replace('section', 'Section ')}
            </a>
        ))}
        </div>

        {/* SECTIONS */}
        <div>
            {sections.map((id, index) => (
                <section key={id} id={id} className="h-[100vh] flex items-center justify-center text-white text-3xl" style={{backgroundColor: index % 2 === 0 ? '#111' : '#222' }}>
                    {`SECTION ${index + 1}`}
                </section>
            ))}
        </div>
    </div>
    </>
}