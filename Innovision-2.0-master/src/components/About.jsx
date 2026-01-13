import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BookOpen, Cpu } from 'lucide-react';
import useScrollHover from '../hooks/useScrollHover';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
    const sectionRef = useRef(null);

    // Auto-trigger hover effects on mobile
    useScrollHover('.college-info-card', { threshold: 0.5 });
    useScrollHover('.dept-info-card', { threshold: 0.5 });

    useEffect(() => {
        const ctx = gsap.context(() => {

            // Section Title Animation
            gsap.from(".about-title", {
                scrollTrigger: {
                    trigger: ".about-title",
                    start: "top 85%",
                    end: "bottom 60%",
                    scrub: 1,
                },
                y: 50,
                opacity: 0,
                scale: 0.9,
            });

            // College Info Animation - Side Slide with Strict Reverse
            gsap.from(".college-info-card", {
                scrollTrigger: {
                    trigger: ".college-info",
                    start: "top 80%",
                    toggleActions: "play reverse play reverse"
                },
                x: -100, // Slide from left
                opacity: 0,
                duration: 1,
                ease: "power2.out",
                stagger: 0.2
            });

            // IT Dept Info Animation - Side Slide with Strict Reverse
            gsap.from(".dept-info-card", {
                scrollTrigger: {
                    trigger: ".dept-info",
                    start: "top 80%",
                    toggleActions: "play reverse play reverse"
                },
                x: 100, // Slide from right
                opacity: 0,
                duration: 1,
                ease: "power2.out",
                stagger: 0.2
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="about" className="relative py-24 px-4 bg-void-black overflow-hidden font-mono min-h-screen">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyber-blue/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-neon-purple/20 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto relative z-10">

                {/* Section Header */}
                <div className="text-center mb-20 about-title">
                    <h2 className="text-cyber-blue tracking-[0.5em] text-sm font-bold mb-4 uppercase">Legacy & Future</h2>
                    <h3 className="text-4xl md:text-6xl font-orbitron font-bold text-white">
                        ABOUT <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-cyber-blue">THE CREATORS</span>
                    </h3>
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyber-blue to-transparent mx-auto mt-6"></div>
                </div>

                {/* College & Dept Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-32">

                    {/* College Info */}
                    <div className="college-info space-y-8">
                        <div className="college-info-card p-8 border-l-4 border-cyber-blue bg-white/5 backdrop-blur-sm rounded-r-xl hover:bg-white/10 transition-colors duration-300">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="p-3 bg-cyber-blue/20 rounded-lg text-cyber-blue"><BookOpen size={24} /></span>
                                <h4 className="text-xl md:text-2xl font-orbitron font-bold text-white">K.V. Pendharkar College</h4>
                            </div>
                            <p className="text-gray-400 leading-relaxed">
                                DOMBIVLI SHIKSHAN PRASARAK MANDAL'S <strong className="text-white">K.V. Pendharkar College of Arts, Science and Commerce</strong>.
                                An Autonomous institution accredited by NAAC. Established in 1979, playing a pivotal role in providing quality higher education in the region.
                            </p>
                        </div>
                        <div className="college-info-card p-8 border-l-4 border-neon-purple bg-white/5 backdrop-blur-sm rounded-r-xl hover:bg-white/10 transition-colors duration-300">
                            <h4 className="text-lg font-bold text-white mb-2">Vision & Mission</h4>
                            <p className="text-gray-400 text-sm">
                                To foster a rational and tolerant temperament among students and focus on developing skill sets for the future.
                            </p>
                        </div>
                    </div>

                    {/* IT Dept Info */}
                    <div className="dept-info space-y-8">
                        <div className="dept-info-card p-8 border-r-4 border-neon-purple bg-white/5 backdrop-blur-sm rounded-l-xl text-right hover:bg-white/10 transition-colors duration-300">
                            <div className="flex items-center gap-4 mb-4 justify-end">
                                <h4 className="text-xl md:text-2xl font-orbitron font-bold text-white">Department of IT</h4>
                                <span className="p-3 bg-neon-purple/20 rounded-lg text-neon-purple"><Cpu size={24} /></span>
                            </div>
                            <p className="text-gray-400 leading-relaxed">
                                Offering <strong className="text-white">B.Sc. IT</strong> and <strong className="text-white">M.Sc. Computer Science</strong>.
                                We prioritize practical learning with state-of-the-art computer labs, high-speed networks, and a curriculum focused on modern technologies like Python, Data Science, and Embedded Systems.
                            </p>
                        </div>
                        <div className="dept-info-card p-8 border-r-4 border-cyber-blue bg-white/5 backdrop-blur-sm rounded-l-xl text-right hover:bg-white/10 transition-colors duration-300">
                            <h4 className="text-lg font-bold text-white mb-2">Innovation Hub</h4>
                            <p className="text-gray-400 text-sm">
                                A center for aspiring tech enthusiasts to experiment, learn, and grow in the field of Information Technology.
                            </p>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
};

export default About;
