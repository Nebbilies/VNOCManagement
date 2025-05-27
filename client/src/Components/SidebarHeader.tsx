import { motion } from "motion/react";
import {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import { Menu, X } from 'lucide-react';
import { AnimatePresence } from "framer-motion";

interface Props {
    links: Array<{ name: string, path: string }>;
    logo: string;
}


function SidebarHeader({ links, logo }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };
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
    const user = JSON.parse(window.localStorage.getItem("user") || "null");
    return (
        <div className="lg:hidden">
            {/* Mobile Header Bar */}
            <div className={` ${visible ? '' : '-translate-y-18'} bg-[#1b1d20]/50 text-white fixed z-999 duration-500 h-16 font-bold lg:text-xl left-0 top-0 text-md items-center justify-between w-screen border-violet-300 border-b-2 flex px-4 md:px-48 lg:px-64 shadow-violet-400/20 shadow-md`}>
                {/* Empty div to balance the layout */}
                <div className="w-10"></div>

                {/* Centered logo */}
                <a href="/" className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                    <div className="w-10 h-auto">
                        <img src={logo} alt="logo" className="h-full aspect-auto" />
                    </div>
                </a>

                {/* Menu button at the end */}
                <button
                    onClick={toggleSidebar}
                    className="p-2 focus:outline-none"
                    aria-label={isOpen ? "Close menu" : "Open menu"}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 z-998"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleSidebar}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Content */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed top-0 right-0 h-full w-64 bg-[#1b1d20] text-white z-999 shadow-lg"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 20 }}
                    >
                        <div className="flex justify-end p-4">
                            <button
                                onClick={toggleSidebar}
                                className="p-2 focus:outline-none"
                                aria-label="Close menu"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="px-4 py-2">
                            <ul className="space-y-4">
                                {links.map((link, index: number) => (
                                    <motion.li
                                        key={link.name}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="py-2 border-b border-gray-700"
                                    >
                                        <Link
                                            to={link.path}
                                            className="block w-full"
                                            onClick={toggleSidebar}
                                        >
                                            {link.name}
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>

                            <motion.div
                                className="mt-8 py-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >

                                {!user ? (
                                    <Link
                                        to="http://localhost:3001/api/auth/login"
                                        className="block w-full text-center py-2 px-4 bg-violet-600 rounded-md"
                                        onClick={toggleSidebar}
                                    >
                                        Login
                                    </Link>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        {user.avatar_url ? (
                                            <img
                                                src={user.avatar_url}
                                                alt="avatar"
                                                className="rounded-full w-6 h-6 border border-white"
                                            />
                                        ) : null}
                                        <span className={'text-lg'}>{user.username}</span>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default SidebarHeader;
