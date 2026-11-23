/**
 * All site copy lives here. Sourced from the Buzz Crew company profile,
 * "About Buzz Crew" deck, the marketing carousel and the social portfolio PDFs.
 */

export const CONTACT = {
  email: "hello@thebuzzcrew.com",
  instagram: "@itsbuzzcrew",
  instagramUrl: "https://www.instagram.com/itsbuzzcrew",
  website: "www.thebuzzcrew.com",
  websiteUrl: "https://www.thebuzzcrew.com",
  phone: "+6017-223 6439",
  phoneHref: "tel:+60172236439",
};

/** "Dial a Service" keypad — order matters: the key number is the index + 1. */
export const DIAL_SERVICES = [
  { title: "Social Media Management", text: "Planning, posting and community care across your channels, every week." },
  { title: "Video Editing", text: "Reels, ads and long-form cuts edited in-house with hooks that hold attention." },
  { title: "Content Creation", text: "Shoots, scripts and captions that give your feed a consistent voice." },
  { title: "Graphic Design", text: "Campaign visuals, posts and collateral designed to stop the scroll." },
  { title: "Website Development", text: "Fast, modern websites built around what your business needs them to do." },
  { title: "SEO Optimization", text: "Technical, on-page and local SEO so customers find you first." },
  { title: "Lead Generation", text: "Funnels, landing pages and follow-ups that turn attention into enquiries." },
  { title: "AI Content Creation", text: "AI-assisted visuals and copy, directed and polished by our creative team." },
  { title: "Paid Ads Campaigns", text: "Meta, Google and TikTok ads planned around real goals and revenue." },
];

export const DIAL_TIMES = ["11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"];

export const NAV_LINKS = [
  { label: "Home", href: "/", id: "top" },
  { label: "About", href: "/about", id: "about" },
  { label: "Services", href: "/services", id: "services" },
  { label: "Work", href: "/work", id: "work" },
  { label: "Process", href: "/process", id: "process" },
  { label: "Team", href: "/team", id: "team" },
];

/** Every routed page in menu order (Contact included). */
export const PAGES = [...NAV_LINKS, { label: "Contact", href: "/contact", id: "contact" }];

export const STATS = [
  { value: 90, suffix: "+", label: "Projects completed" },
  { value: 12, suffix: "+", label: "International clients" },
  { value: 4, suffix: "+", label: "Years of experience" },
  { value: 3, suffix: "", label: "Photography awards" },
];

/** Social campaign designs from the portfolio PDF. */
export const POSTS = [
  { src: "/images/work/post-01.jpg", title: "Social Media Marketing", tag: "Social" },
  { src: "/images/work/post-02.jpg", title: "Boost Your Brand", tag: "Campaign" },
  { src: "/images/work/post-03.jpg", title: "Digital Marketing Expert", tag: "Campaign" },
  { src: "/images/work/post-04.jpg", title: "Transform Your Brand's Story", tag: "Copywriting" },
  { src: "/images/work/post-05.jpg", title: "Graphic Design Service", tag: "Design" },
  { src: "/images/work/post-06.jpg", title: "Social Media Management", tag: "Social" },
  { src: "/images/work/post-07.jpg", title: "Need a New Website?", tag: "Web" },
  { src: "/images/work/post-08.jpg", title: "Public Relation Solution", tag: "PR" },
  { src: "/images/work/post-09.jpg", title: "6 Tips for Marketing Success", tag: "Content" },
  { src: "/images/work/post-10.jpg", title: "Videography Services", tag: "Video" },
  { src: "/images/work/post-11.jpg", title: "Video Editing Services", tag: "Video" },
  { src: "/images/work/post-12.jpg", title: "Benefits of Social Media Marketing", tag: "Content" },
  { src: "/images/work/post-13.jpg", title: "Digital Marketing Agency", tag: "Brand" },
  { src: "/images/work/post-14.jpg", title: "Digital Marketing", tag: "Campaign" },
  { src: "/images/work/post-15.jpg", title: "Grow Your Business", tag: "Campaign" },
  { src: "/images/work/post-16.jpg", title: "Make Your Business Digital", tag: "Web" },
  { src: "/images/work/post-17.jpg", title: "Digital Marketing Agency", tag: "Brand" },
];

export const SERVICES = [
  {
    title: "Digital Marketing",
    text: "Full-funnel campaigns and paid social built around real goals and revenue, not vanity metrics.",
    image: "/images/work/post-03.jpg",
  },
  {
    title: "SEO",
    text: "Technical, on-page and local search work that keeps you visible where customers are looking.",
    image: "/images/network.jpg",
  },
  {
    title: "Creative & Graphic Design",
    text: "Social posts, campaign visuals and brand collateral designed to stop the scroll.",
    image: "/images/about/svc-1.jpg",
  },
  {
    title: "Web & Software Development",
    text: "Modern websites, CRMs and custom software designed around the goals of the business.",
    image: "/images/about/svc-2.jpg",
  },
  {
    title: "UI/UX Design",
    text: "Clean, intuitive and purposeful interfaces that make digital products easy to love.",
    image: "/images/design.jpg",
  },
  {
    title: "Video & Content Production",
    text: "Scripting, shooting and editing reels and films in-house, on schedule.",
    image: "/images/about/svc-5.jpg",
  },
  {
    title: "Branding",
    text: "Identity systems, logos and a brand voice that feels unmistakably yours.",
    image: "/images/work/post-05.jpg",
  },
  {
    title: "Public Relations",
    text: "Positioning, reputation and media presence that put your business on the front line.",
    image: "/images/work/post-08.jpg",
  },
  {
    title: "Copywriting",
    text: "Captions, scripts and web copy with a hook up front and a call to action at the end.",
    image: "/images/about/svc-3.jpg",
  },
  {
    title: "AI & Automation",
    text: "AI-assisted content workflows, CRMs and automation systems for clinics, hospitals and lead flow.",
    image: "/images/about/svc-4.jpg",
  },
  {
    title: "IoT & Smart Digital Solutions",
    text: "Connected, data-aware tools that bring smarter operations to everyday businesses.",
    image: "/images/automation.jpg",
  },
];

export const PROCESS = [
  {
    step: "01",
    title: "Discovery & Audit",
    lead: "Understand",
    text: "We map the brand, the audience, the competition and every gap in the current marketing.",
    points: ["Brand & competitor mapping", "Content gap audit", "Clear objectives"],
  },
  {
    step: "02",
    title: "Strategy",
    lead: "Strategize",
    text: "A content and channel plan built around real goals, not vanity metrics.",
    points: ["Channel plan", "Creative direction", "KPIs that matter"],
  },
  {
    step: "03",
    title: "Execution & Creative",
    lead: "Create",
    text: "Scripting, shooting, designing and building, in-house and on schedule.",
    points: ["Reels & video", "Design & copy", "Web & automation"],
  },
  {
    step: "04",
    title: "Reporting & Growth",
    lead: "Execute",
    text: "Clear numbers each cycle, and a plan for what scales next.",
    points: ["Monthly reporting", "Testing & optimisation", "Scale what works"],
  },
];

export const COMPARE = [
  { others: "Run ads without strategy", us: "Full-funnel marketing approach" },
  { others: "Vanity metrics", us: "ROI & revenue-focused" },
  { others: "Poor communication", us: "Dedicated account manager" },
  { others: "Guesswork", us: "Data + testing + optimisation" },
];

export const INDUSTRIES = [
  { title: "Food & Beverages", text: "Restaurants, catering, cafés and home kitchens." },
  { title: "Farmhouses", text: "Event and picnic venues." },
  { title: "Healthcare & Dental", text: "Automation systems for clinics and hospitals." },
  { title: "Education", text: "Enrolment-focused marketing for schools and institutes." },
  { title: "E-commerce", text: "Customised e-commerce brand development." },
];

/** Client logos extracted from the "Notable clients" pages. `dark` = needs a dark tile. */
export const CLIENT_LOGOS = Array.from({ length: 24 }, (_, i) => {
  const n = i + 1;
  const names = [
    "Farzana's Kitchen", "Dua Greens", "Ibad Traders", "Decor Art", "Mercantile", "Pak Tape Industries",
    "Kamil Atelier", "IG Civil Contractor", "AZee Trading", "Nawab's Dynasty", "Discovery Homes", "Mr. Bawarchi",
    "Black Gold Farm", "AK Travels & Visa Consultant", "TEH Group", "Milton Group", "Halki Aanch by Ayesha", "Islamabad Now",
    "Awami Web", "The Farm Villa", "Frontline Pakistan", "Malay Wheels", "Meena Bazar", "Clothing by Hitler",
  ];
  return {
    src: `/images/clients/logo-${String(n).padStart(2, "0")}.png`,
    name: names[i],
    dark: n === 13 || n === 15,
  };
});

export const TEAM = [
  { initials: "AR", name: "Abdul Rafay", role: "Chief Executive Officer", group: "Founder" },
  { initials: "NK", name: "Noor Khan", role: "Chief Operating Officer", group: "Founder" },
];

export const VALUES = [
  { title: "Creativity", text: "Ideas that capture attention." },
  { title: "Strategy", text: "Purpose behind every execution." },
  { title: "Technology", text: "Smarter tools and modern workflows." },
  { title: "Growth", text: "A focus on meaningful business impact." },
];

export const TESTIMONIALS = [
  {
    quote: "Buzz Crew captured our sites beautifully. Every reel felt emotional and cinematic.",
    name: "IG Civil Contractor",
    place: "Pakistan",
    logo: "/images/clients/logo-08.png",
    tone: "cream",
  },
  {
    quote: "The content they made elevated my food campaign beyond expectations.",
    name: "Halki Aanch by Ayesha",
    place: "Australia",
    logo: "/images/clients/logo-17.png",
    tone: "pink",
  },
  {
    quote:
      "Buzz Crew made us a customised and tailored CRM system for our client and lead flow. They were extremely professional throughout.",
    name: "Discovery Homes",
    place: "Dubai, UAE",
    logo: "/images/clients/logo-11.png",
    tone: "blue",
  },
] as const;

/** Client pages from links.md (tracking parameters stripped). */
export const FEATURED_CLIENTS = [
  {
    name: "Farzana's Kitchen",
    category: "Food & beverage",
    handle: "@farzanakitchen",
    url: "https://www.instagram.com/farzanakitchen",
    logo: "/images/clients/logo-01.png",
  },
  {
    name: "Black Gold Farm",
    category: "Farmhouse & events",
    handle: "@blackgoldfarmofficial",
    url: "https://www.instagram.com/blackgoldfarmofficial",
    site: "https://www.blackgoldfarmhouse.com/",
    logo: "/images/clients/logo-13.png",
    dark: true,
  },
  {
    name: "Discovery Homes",
    category: "Real estate · Dubai",
    handle: "@discoveryhomesrealestate",
    url: "https://www.instagram.com/discoveryhomesrealestate",
    logo: "/images/clients/logo-11.png",
  },
  {
    name: "Mercantile",
    category: "Social media",
    handle: "@mercantile.pak",
    url: "https://www.instagram.com/mercantile.pak",
    logo: "/images/clients/logo-05.png",
  },
  {
    name: "Islamabad Now",
    category: "Social media",
    handle: "@islamabadnowpk",
    url: "https://www.instagram.com/islamabadnowpk",
    logo: "/images/clients/logo-18.png",
  },
  {
    name: "Frontline Pakistan",
    category: "Social media",
    handle: "@frontlinepak",
    url: "https://www.instagram.com/frontlinepak",
    logo: "/images/clients/logo-21.png",
  },
  {
    name: "Firpo Farm",
    category: "Farmhouse",
    handle: "@firpofarm.pk",
    url: "https://www.instagram.com/firpofarm.pk",
    initials: "FF",
  },
  {
    name: "Kayathe Restaurant",
    category: "Restaurant",
    handle: "@kayatherestaurant",
    url: "https://www.instagram.com/kayatherestaurant",
    initials: "K",
  },
] as {
  name: string;
  category: string;
  handle: string;
  url: string;
  site?: string;
  logo?: string;
  initials?: string;
  dark?: boolean;
}[];
