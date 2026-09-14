export type DetailPage = {
  path: string; kind: "service" | "case-study"; title: string; description: string;
  eyebrow: string; heading: string; intro: string;
  highlights: string[];
  sections: { id?: string; heading: string; paragraphs: string[] }[];
  questions?: { question: string; answer: string }[];
  images?: { src: string; width: number; height: number; alt: string; caption: string }[];
  links?: { href: string; label: string }[];
  related: { href: string; label: string; summary: string }[];
};

export const detailPages: DetailPage[] = [
  {
    path: "/web-design-san-antonio", kind: "service",
    title: "Custom Website Design for San Antonio Businesses | Devnetiks",
    description: "Custom website design for San Antonio businesses. Explore responsive marketing websites, service pages, estimate forms, and real work by Devnetiks.",
    eyebrow: "Website design / San Antonio, Texas",
    heading: "A website that makes your business easy to choose.",
    intro: "Custom website design and development for San Antonio businesses that need a clear introduction, a memorable presence, and a useful next step for their customers.",
    highlights: ["Designed around your business", "Built for mobile visitors", "Connected to your next step"],
    sections: [
      { heading: "Start with what your customers need to know.", paragraphs: [
        "A good business website answers practical questions: what do you offer, who is it for, and how does someone get started? We organize the content around those decisions, then build a visual experience that feels like your business.",
        "For a San Antonio service business, that can mean clearly explaining your services and service area, showing relevant work, and making an estimate request easy to find. For a product or venue, the journey may lead to a demo, an inquiry, or a reservation. The structure follows the customer’s task.",
      ] },
      { heading: "Design and development, considered together.", paragraphs: [
        "We build responsive layouts with readable type, clear navigation, and intentional spacing. Your content should work on a phone just as thoughtfully as it does on a larger screen. Forms need useful labels, keyboard access, and understandable feedback when something needs attention.",
        "The technical foundation includes descriptive page titles, crawlable content, sensible image sizing, and a consistent URL structure. These help people and search engines access the site; meaningful content and real business credibility remain essential to earning attention.",
      ] },
      { heading: "A focused scope for your next website.", paragraphs: [
        "Typical projects include a marketing homepage, individual service pages, a portfolio or project gallery, and a contact or estimate form. If you need booking, payments, or a customer account area, we’ll work out whether those belong in the website scope or in a connected web application.",
        "Have a site already? We can discuss a redesign around what is working, what customers struggle to find, and what your business needs next. We review existing pages and links before deciding what to keep, replace, or redirect.",
      ] },
      { heading: "From the first conversation to launch.", paragraphs: [
        "Start by sharing your business, the customers you want to reach, and the action you want visitors to take. Bring an existing website, logo, photos, or reference sites if you have them. We’ll discuss the page structure, content, functionality, budget, and timing before settling the scope.",
        "During the build, we review the design and working pages with you. Before launch, we check key journeys, responsive behavior, links, and form handling. Domain setup, hosting, and ongoing support are discussed as part of the project so you understand how the site will be maintained.",
      ] },
    ],
    questions: [
      { question: "Do you only work with San Antonio businesses?", answer: "San Antonio is a focus for our website services, and we also work with businesses beyond the area. Share your project and we can discuss how to work together." },
      { question: "How much does a custom website cost?", answer: "The scope drives the price: number of pages, content needs, integrations, and custom functionality. We discuss those details before proposing a budget. A marketing website and a booking application are different projects." },
      { question: "Can you add an estimate or inquiry form?", answer: "Yes. We can design a form around the information your business needs, with delivery and follow-up requirements agreed during scoping." },
    ],
    related: [
      { href: "/work/satx-ink", label: "SATX INK", summary: "Explore a product marketing website and its connected studio platform." },
      { href: "/custom-web-app-development", label: "Need more than a website?", summary: "Explore custom accounts, booking workflows, and business tools." },
    ],
  },
  {
    path: "/custom-web-app-development", kind: "service",
    title: "Custom Web App Development in San Antonio | Devnetiks",
    description: "Custom web application development for San Antonio businesses and beyond. Explore booking workflows, business dashboards, and SATX INK by Devnetiks.",
    eyebrow: "Custom web applications / San Antonio & beyond",
    heading: "Build the software your workflow calls for.",
    intro: "When your idea needs accounts, shared data, or a process that goes beyond a contact form, Devnetiks designs and develops a web application around the way it should work.",
    highlights: ["Purpose-built workflows", "Connected data and accounts", "Room to evolve"],
    sections: [
      { heading: "Begin with the workflow, then choose the features.", paragraphs: [
        "A useful application makes a task easier to complete. That might be reviewing incoming requests, managing a collection, inviting a team, or giving customers a way to see their next step. We map who uses the system, what they need to do, and what information each person should be able to access.",
        "That work helps define a focused first release. Instead of adding every possible feature, we identify the essential path and the exceptions that need deliberate handling: an incomplete request, a declined offer, or a change in availability.",
      ] },
      { id: "booking", heading: "Booking and payments that follow your rules.", paragraphs: [
        "Not every business needs an open calendar. Some need to review a request before offering an appointment. Others need a reservation or deposit before work can be confirmed. We design the steps around your approval process, customer choices, and payment requirements.",
        "SATX INK illustrates this approach: clients browse flash designs and send requests; artists review them and offer appointment options; clients accept an offer and pay a deposit through Stripe. The software supports that sequence rather than treating every inquiry as a confirmed booking.",
      ] },
      { heading: "The public experience and the working tools.", paragraphs: [
        "Customers and staff rarely need the same screen. A project may combine public pages, customer accounts, and a dashboard for the people managing the business. We plan those roles together so the visible experience and the underlying operations stay connected.",
        "Our work includes React and TypeScript interfaces with Firebase-backed data and authentication, and integrations such as Stripe where they fit the project. We select the approach around your requirements, including access rules, notifications, deployment, and the services the application depends on.",
      ] },
      { heading: "Make the first release maintainable.", paragraphs: [
        "We discuss the information the application stores, which outside services it needs, and how the business will manage it after launch. Testing focuses on complete journeys and important boundaries, including what happens when a step fails or a user lacks permission.",
        "Before estimating the work, we need to understand the users, the main process, and any existing software or data involved. Bring a sketch, a spreadsheet, or a description of the current process. We can turn that into a practical scope and discuss future phases separately.",
      ] },
    ],
    questions: [
      { question: "Can a web app work alongside my existing website?", answer: "Yes, depending on the integration. A separate portal can handle specialized tasks while your marketing website remains in place. SATX INK offers a branded portal approach alongside its full website option." },
      { question: "Can you build different experiences for customers and staff?", answer: "Yes. We can scope role-based experiences around what each user needs to view and manage. Roles and access requirements should be defined early, rather than added as an afterthought." },
      { question: "What should I send with my project inquiry?", answer: "Describe who will use the application, the process it should support, and the biggest problem with your current approach. Mention integrations, existing data, and any important launch constraints." },
    ],
    related: [
      { href: "/work/satx-ink", label: "Inside SATX INK", summary: "A marketing website and a studio platform with distinct customer and artist journeys." },
      { href: "/web-design-san-antonio", label: "Website design & development", summary: "For businesses that need a clear public presence and a path to inquiry." },
    ],
  },
  {
    path: "/work/satx-ink", kind: "case-study",
    title: "SATX INK Website & Tattoo Booking Platform | Devnetiks",
    description: "Explore Devnetiks’ SATX INK work: a product marketing website and tattoo studio platform for artist profiles, flash requests, appointment offers, and deposits.",
    eyebrow: "Things we’ve built / SATX INK",
    heading: "From discovering the product to booking the artwork.",
    intro: "Two connected builds for SATX INK: a marketing website that explains the product and a configurable studio system that brings artists, flash designs, and booking requests together.",
    highlights: ["Product marketing website", "Studio-branded platform", "Artist-led booking workflow"],
    images: [
      { src: "/work/satx-ink-flash.webp", width: 1442, height: 750, alt: "SATX INK flash gallery showing tattoo designs with artist names and prices", caption: "The SATX INK marketing website showcases a flash gallery with artwork, artist names, and prices." },
      { src: "/work/sweet-venom.jpg", width: 1440, height: 1000, alt: "Sweet Venom public demo of the SATX INK tattoo studio website", caption: "Sweet Venom is the demonstration studio for the SATX INK system, shown separately from the product’s marketing website." },
    ],
    sections: [
      { heading: "Two audiences, two connected experiences.", paragraphs: [
        "The product website speaks to shop owners deciding whether SATX INK fits their studio. The studio installation serves a different audience: people exploring artists and artwork, along with the team managing those experiences. Devnetiks built both sides of that journey.",
        "The marketing site explains the workflow, website and portal options, and how to explore the demo. The public demo uses Sweet Venom branding to show what a studio installation looks like. It is a demonstration of the system, not a separate client case study.",
      ] },
      { heading: "A request comes before an appointment.", paragraphs: [
        "The platform brings artist profiles and available flash into the studio’s own branded experience. Clients can discover artwork and submit a request with details such as placement, size, and timing. Artists review the request before deciding how to proceed.",
        "An artist can offer appointment options and set a deposit. The client then chooses an offered time and pays through Stripe. Keeping those steps distinct makes the approval process explicit: browsing, requesting, and confirming an appointment are different actions.",
      ] },
      { heading: "Tools for the people behind the studio.", paragraphs: [
        "Owner, artist, and client workspaces support different responsibilities. The product includes tools for artist and flash management, supported shop content, and booking activity. React and TypeScript provide the interface, with Firebase for application data and authentication and Stripe Connect for the payment integration.",
        "The system supports an individually configured shop website or a branded portal linked from an existing website. That lets the product serve studios starting from scratch and studios that already have a public site they want to keep.",
      ] },
      { heading: "What this work demonstrates.", paragraphs: [
        "SATX INK connects product storytelling with a working application. The public marketing site explains the value, while the studio experience makes the workflow tangible. It demonstrates custom web application development centered on real roles, content, and an approval-based booking process.",
      ] },
    ],
    links: [{ href: "https://www.satxink.com/", label: "Visit SATX INK" }, { href: "https://demo.satxink.com/", label: "Explore the Sweet Venom demo" }],
    related: [{ href: "/custom-web-app-development", label: "Custom web app development", summary: "Plan a workflow, portal, or booking system for your business." }, { href: "/web-design-san-antonio", label: "Website design & development", summary: "Explore custom websites for San Antonio businesses and beyond." }],
  },
];
