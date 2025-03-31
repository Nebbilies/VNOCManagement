import {Link} from "react-router-dom";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import logo from "../assets/logo.png";

const links = [
    { name: "Staff", path: "/staff" },
    { name: "Info", path: "/info" },
    { name: "Players", path: "/players" },
    { name: "Mappool", path: "/mappool" },
    { name: "Matches", path: "/matches" },
]
function Header() {
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.scrollY;

            setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
            setPrevScrollPos(currentScrollPos);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [prevScrollPos]);
    return (
            <motion.div
                className={` ${visible ? '' : '-translate-y-18'} bg-[#1b1d20]/50 text-white fixed z-999 duration-500 h-16 font-bold lg:text-xl left-0 top-0 text-md items-center justify-between w-screen border-violet-300 border-b-2 flex px-4 md:px-48 lg:px-64 shadow-violet-400/20 shadow-md`}>
                <div className="flex items-center justify-center h-full">
                    <a href="/" className="flex w-auto left-3 relative">
                        <div className="w-12 h-auto">
                            <img src={logo} alt="logo" className="h-full aspect-auto"/>
                        </div>
                    </a>
                    <ul className="relative items-center flex h-full ml-2 md:ml-8">
                        {links.map((link, index) => (
                            <motion.li className={" px-2 md:px-3 lg:px-4 duration-100"} key={link.name}
                                       whileHover={{scale: 1.1}}
                                       initial={{ opacity: 0, x: 0, y: 20 }}
                                       animate={{ opacity: 1, x: 0, y: 0}}
                                       exit={{ opacity: 0, x: 0, y: 0 }}
                                       transition={{ type: "spring", duration: 1.3, ease: "easeOut", delay: index*0.15}}>
                                <Link to={link.path}>
                                    {link.name}
                                </Link>
                            </motion.li>
                        ))}
                    </ul>

                </div>
                <motion.div whileHover={{ scale: 1.1 }}
                            initial={{ opacity: 0, x: 0, y: 20 }}
                            animate={{ opacity: 1, x: 0, y: 0}}
                            exit={{ opacity: 0, x: 0, y: 0 }}
                            transition={{ type: "spring", duration: 1, ease: "easeInOut", delay: 1}}>
                    <Link to={"/login"}>Login</Link>
                </motion.div>
            </motion.div>

    )
}

export default Header