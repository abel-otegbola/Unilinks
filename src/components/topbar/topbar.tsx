import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import AuthCTA from "../auhCTA/authCTA";

function Topbar() {
    const [open, setOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [activeSection, setActiveSection] = useState("")


    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10)

            // Detect active section
            const sections = ["features", "how-it-works", "pricing", "testimonials"]
            const scrollPosition = window.scrollY + 100 // Offset for better detection

            for (const sectionId of sections) {
                const element = document.getElementById(sectionId)
                if (element) {
                    const { offsetTop, offsetHeight } = element
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(`#${sectionId}`)
                        break
                    }
                }
            }

            // Clear active section if at the top
            if (window.scrollY < 100) {
                setActiveSection("")
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <>
        <div className={`flex justify-between items-center w-full md:px-[6%] p-4 z-[3] sticky top-0 bg-white dark:bg-dark backdrop-blur-sm transition-shadow duration-300 ${scrolled ? 'border-b border-gray-500/[0.09]' : ''}`}>
            <Link to={"/"} className="md:w-[13%] text-start flex gap-2 items-center">
                <img src="/logo.svg" alt="UniLinks logo" width={64} height={32} className="sm:ml-0 ml-1" />
            </Link>
            
            <div className="md:static fixed top-0 right-0 z-20 overflow-hidden md:h-auto h-screen">
                <ul className={`
                    flex md:flex-row flex-col md:px-0 md:py-0 py-12 px-6 bg-white dark:bg-dark md:w-auto h-full w-[100%] 
                    ${open ? "translate-x-[0px]" : "md:translate-x-[0] translate-x-[120%]"} duration-500
                `}>
                    {
                        [
                            { id: 0, title: "Home", href: "/" },
                            { id: 1, title: "Make Payment", href: "/pay" },
                            { id: 2, title: "About Us", href: "/about" },
                            { id: 3, title: "Docs", href: "/docs" },
                        ].map(link => (
                            <li key={link.id} className="px-2 py-3">
                                <Link
                                    to={link.href} 
                                    className={`font-medium p-4 duration-300 w-full ${activeSection === link.href ? 'text-primary' : 'text-text-black'} hover:text-primary dark:hover:text-primary`}
                                >
                                    <span>{link.title}</span> 
                                </Link>
                            </li>
                        ))
                    }
                </ul>
            </div>

            {/* Right actions + search */}
            <div className="flex items-center justify-end gap-6 md:w-[13%]">
                <AuthCTA />
                <button className="flex flex-col justify-center items-center gap-1 text-lg w-10 h-10 md:hidden z-[50]" onClick={() => setOpen(!open)}>
                    <span className={`w-[8px] h-[2px] py-[1px] px-[10px] duration-500 transition-all bg-black rounded-[2px] ${open ? "rotate-[45deg] translate-y-[4.5px]" : "rotate-[0deg]"}`}></span>
                    <span className={`duration-500 transition-all bg-black rounded-[2px] ${open ? "py-[0px] w-[0px] h-[0px] translate-x-[-12px]" : "translate-x-[4px] py-[1px] px-[4px] w-[8px] h-[2px]"}`}></span>
                    <span className={`w-[8px] h-[2px] py-[1px] px-[10px] duration-500 transition-all bg-black rounded-[2px] ${open ? "rotate-[-45deg] translate-y-[-4.5px]" : "rotate-[0deg]"}`}></span>
                </button>
            </div>
            
        </div>
        </>
    )
}

export default Topbar
