import { motion } from "motion/react";
import {useState} from "react";
import { Link } from "react-router-dom";
import {LogOut, Menu, X} from 'lucide-react';
import { AnimatePresence } from "framer-motion";
import {handleLogOut} from "./Header.tsx";

interface Props {
    links: Array<{ name: string, path: string }>;
    logo: string;
}


function SidebarHeader({ links }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };
    const user = JSON.parse(window.localStorage.getItem("user") || "null");

    return (
        <div className="lg:hidden">
                <button
                    onClick={toggleSidebar}
                    className="p-2 focus:outline-none fixed top-4 right-4 z-999 bg-[#1b1d20] text-white rounded-full shadow-lg"
                    aria-label={isOpen ? "Close menu" : "Open menu"}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

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
                                className="mt-3 py-2"
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
                                    <div className="flex items-center justify-between w-full">
                                        <div className={'flex items-center gap-2'}>
                                            {user.avatar_url ? (
                                                <img
                                                    src={user.avatar_url}
                                                    alt="avatar"
                                                    className="rounded-full w-6 h-6 border border-white"
                                                />
                                            ) : null}
                                            <span className={'text-lg'}>{user.username}</span>
                                        </div>
                                        <motion.div
                                            className={''}
                                            whileHover={{scale: 1.1}}
                                            whileTap={{scale: 0.9}}
                                            transition={{type: "spring", stiffness: 300, duration: 200}}
                                            onClick={handleLogOut}>
                                            <LogOut className={'cursor-pointer w-6 h-6 ml-3'}/>
                                        </motion.div>
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
