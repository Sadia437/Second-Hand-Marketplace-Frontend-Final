import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function Blog() {
  const [openFaq, setOpenFaq] = useState(null);
  const [email, setEmail] = useState('');
  const canvasRef = useRef(null);

  // --- Particles Logic (Home Page Style) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const particles = [];
    const particleCount = 40;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: (Math.random() - 0.5) * 0.8,
        opacity: Math.random() * 0.5 + 0.2
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  const faqs = [
    {
      question: "React vs Angular: Which one is better for frontend development?",
      answer: `Both React and Angular are powerful frameworks for frontend development, but they have key differences:\n\n**React:**\n- Library developed and maintained by Facebook\n- Uses JSX (JavaScript XML) for templating\n- Virtual DOM for efficient rendering\n- One-way data binding\n- Large ecosystem with flexible third-party libraries\n- Easier learning curve\n\n**Angular:**\n- Full-fledged framework by Google\n- Uses TypeScript by default\n- Two-way data binding\n- Built-in dependency injection\n- Steeper learning curve but more features out of the box\n\n**Verdict:** For most projects in Bangladesh's market, React is preferred due to its flexibility, larger community, and easier integration with other technologies.`,
      category: "technology",
      readTime: "5 min read"
    },
    {
      question: "What is Prototypical Inheritance in JavaScript?",
      answer: `Prototypical Inheritance is a fundamental concept in JavaScript that allows objects to inherit properties and methods from other objects.\n\n**Key Concepts:**\n\n1. **Prototype Chain:** Every JavaScript object has a hidden [[Prototype]] property that points to another object (its prototype).\n\n2. **__proto__ accessor:** Used to get/set the prototype of an object.\n\n3. **Object.create():** Creates a new object with a specified prototype.\n\n4. **prototype property:** Functions have a prototype property used when creating instances.\n\n**Example:**\nconst parent = { name: 'Parent' };\nconst child = Object.create(parent);\nchild.name = 'Child'; // Inherits from parent\n\nThis is why ES6 classes are called "syntactic sugar" - they use prototypes underneath.`,
      category: "javascript",
      readTime: "4 min read"
    },
    {
      question: "Why is Unit Testing important in modern web development?",
      answer: `Unit testing is crucial for building reliable web applications:\n\n**Benefits:**\n\n1. **Early Bug Detection:** Catches bugs before they reach production\n2. **Refactoring Confidence:** Allows safe code changes\n3. **Documentation:** Tests serve as executable documentation\n4. **Time Savings:** Automated tests are faster than manual testing\n5. **Better Code Design:** Writing testable code improves overall architecture\n\n**Popular Testing Tools:**\n- Jest (Facebook) - Most popular\n- Mocha + Chai - Flexible\n- React Testing Library - For React apps\n- Cypress - End-to-end testing\n\n**Best Practices:**\n- Test one thing per test case\n- Use descriptive test names\n- Follow AAA pattern (Arrange, Act, Assert)\n- Aim for high code coverage but prioritize critical paths`,
      category: "testing",
      readTime: "6 min read"
    },
    {
      question: "What are the best practices for State Management in React?",
      answer: `State management is critical for React applications. Here's a comprehensive guide:\n\n**State Options:**\n\n1. **Local State (useState):** For component-specific data\n2. **Context API:** For global data shared across components\n3. **Redux:** For complex global state with middleware support\n4. **Zustand/Recoil:** Modern, simplified alternatives\n\n**Best Practices:**\n\n1. **Lift State Up:** When multiple components need the same data\n2. **Use Context Wisely:** Don't over-context; split contexts by domain\n3. **Normalize State:** For complex nested data structures\n4. **Immutability:** Always create new objects/arrays, don't mutate\n5. **Performance:** Use useMemo, useCallback for expensive operations\n6. **State Colocation:** Keep state as close to where it's used as possible\n\n**Modern Recommendation:** For most apps, start with Context + useState, move to Redux Toolkit for complex needs, or try Zustand for simplicity.`,
      category: "react",
      readTime: "7 min read"
    }
  ];

  const popularArticles = [
    { title: "How to Take Great Product Photos", icon: "📸", category: "selling", date: "Nov 15, 2024" },
    { title: "Pricing Strategies for Second-hand Items", icon: "💰", category: "selling", date: "Nov 12, 2024" },
    { title: "Safe Meeting Spots in Dhaka", icon: "📍", category: "safety", date: "Nov 10, 2024" },
    { title: "Building Trust as a New Seller", icon: "⭐", category: "selling", date: "Nov 8, 2024" }
  ];

  const stats = [
    { number: "10,000+", label: "Happy Customers", icon: "😊" },
    { number: "2,500+", label: "Active Listings", icon: "🛍️" },
    { number: "500+", label: "Verified Sellers", icon: "✅" },
    { number: "98%", label: "Success Rate", icon: "⭐" }
  ];

  const supportChannels = [
    { icon: "📞", title: "Phone Support", contact: "+880 96X XXXX XXX", hours: "9 AM - 6 PM, Sat - Thu", color: "from-blue-500 to-cyan-500" },
    { icon: "✉️", title: "Email Support", contact: "support@secondhand.com", hours: "24/7 Response", color: "from-primary to-indigo-500" },
    { icon: "💬", title: "Live Chat", contact: "In-app messaging", hours: "Real-time support", color: "from-purple-500 to-pink-500" }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      
      <section className="relative bg-linear-to-r from-[#4F46E5] via-[#6366F1] to-[#4338CA] text-white py-24 lg:py-32 overflow-hidden">
        
        <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-40" />
        
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-7xl font-black mb-6 tracking-tight animate-fade-in">
              Secondhand <span className="text-indigo-200">Marketplace</span>
            </h1>
            <p className="text-xl lg:text-2xl opacity-90 mb-10 leading-relaxed font-medium">
              Ultimate guide to buying and selling in Bangladesh. 
              Master the marketplace with expert tips and safety measures.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products" className="px-10 py-4 bg-white text-[#4F46E5] rounded-2xl hover:bg-gray-50 hover:scale-105 transition-all duration-300 font-bold shadow-xl">
                🛍️ Start Shopping
              </Link>
              <Link to="/register" className="px-10 py-4 border-2 border-white/50 text-white rounded-2xl hover:bg-white/10 transition-all duration-300 font-bold backdrop-blur-sm">
                🚀 Start Selling
              </Link>
            </div>
          </div>
        </div>
      </section>

      
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const colors = [
                "bg-amber-50 text-amber-700 border-amber-100",
                "bg-indigo-50 text-[#4338CA] border-indigo-100",
                "bg-emerald-50 text-[#10B981] border-emerald-100",
                "bg-orange-50 text-orange-700 border-orange-100"
              ];
              return (
                <div key={index} className={`text-center p-10 rounded-[2.5rem] border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${colors[index]}`}>
                  <div className="text-5xl mb-4 drop-shadow-sm">{stat.icon}</div>
                  <div className="text-4xl font-black mb-1">{stat.number}</div>
                  <div className="font-bold uppercase text-[10px] tracking-[0.2em] opacity-70">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col lg:flex-row gap-16">
          <main className="flex-1">
            
            <section className="mb-24">
              <div className="mb-12">
                <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                  Developer <span className="text-[#4F46E5]">Exam Guide</span>
                </h2>
                <div className="h-1.5 w-24 bg-[#4F46E5] rounded-full"></div>
              </div>

              <div className="space-y-5">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:border-indigo-100 transition-all duration-500 overflow-hidden">
                    <button onClick={() => toggleFaq(index)} className="flex justify-between items-center w-full text-left p-8 hover:bg-indigo-50/30">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="px-3 py-1 bg-indigo-100 text-[#4F46E5] text-[10px] font-black uppercase tracking-widest rounded-lg">{faq.category}</span>
                          <span className="text-xs text-gray-400 font-bold">{faq.readTime}</span>
                        </div>
                        <h3 className="text-xl lg:text-2xl font-extrabold text-gray-800 pr-4 leading-tight">{faq.question}</h3>
                      </div>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${openFaq === index ? 'bg-[#2563EB] text-white rotate-180' : 'bg-gray-100 text-gray-400'}`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </button>
                    
                    {openFaq === index && (
                      <div className="px-8 pb-8 animate-fade-in">
                        <div className="pt-6 border-t border-gray-50 text-gray-600 space-y-4">
                          {faq.answer.split('\n\n').map((paragraph, pIndex) => (
                            <p key={pIndex} className="leading-relaxed whitespace-pre-line">
                              {paragraph.includes('**') ? 
                                paragraph.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} className="text-gray-900">{part}</strong> : part) 
                                : paragraph}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </main>

          
          <aside className="lg:w-96 shrink-0">
            <div className="sticky top-24 space-y-8">
              <div className="bg-white rounded-[2.5rem] shadow-xl shadow-indigo-100/20 border border-gray-50 p-8">
                <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-2">
                  <span className="w-2 h-8 bg-[#4F46E5] rounded-full"></span>
                  Must Read
                </h3>
                <div className="space-y-6">
                  {popularArticles.map((article, index) => (
                    <Link key={index} to="#" className="flex items-center gap-4 group">
                      <div className="w-14 h-14 shrink-0 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 group-hover:bg-indigo-50 transition-all duration-300 shadow-sm border border-gray-100">
                        {article.icon}
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-black text-[#4F46E5] uppercase tracking-tighter">{article.category}</span>
                        <h4 className="font-bold text-gray-800 group-hover:text-[#4F46E5] transition-colors leading-tight line-clamp-2">{article.title}</h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-linear-to-br from-[#4F46E5] to-[#4338CA] rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-200/50">
                <h3 className="text-2xl font-black mb-4">Newsletter</h3>
                <p className="text-indigo-100 text-sm mb-6 font-medium">Get the latest marketplace tips directly in your inbox.</p>
                <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                  <input type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:bg-white/20 outline-hidden font-medium" required />
                  <button type="submit" className="w-full py-4 bg-white text-[#4F46E5] rounded-2xl font-black hover:scale-105 transition-all shadow-lg active:scale-95">
                    Join Now
                  </button>
                </form>
              </div>
            </div>
          </aside>
        </div>

        
        <section className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-6xl font-black text-gray-900 mb-4 tracking-tighter">
              Get <span className="text-[#4F46E5]">Support</span>
            </h2>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Available Sat - Thu | 9 AM - 6 PM</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {supportChannels.map((channel, index) => (
              <div key={index} className={`bg-linear-to-br ${channel.color} rounded-[2.5rem] p-10 text-white shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 group`}>
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:rotate-12 transition-transform">{channel.icon}</div>
                <h3 className="text-2xl font-black mb-2">{channel.title}</h3>
                <p className="text-lg font-bold mb-4 opacity-90">{channel.contact}</p>
                <div className="h-px w-full bg-white/20 mb-4"></div>
                <p className="text-xs font-black uppercase tracking-widest opacity-70">{channel.hours}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
}