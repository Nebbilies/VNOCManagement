import {Link} from "react-router-dom";
import {motion} from "motion/react";
import {useState, useEffect} from "react";
import {LogOut} from  "lucide-react";
import {handleLogOut} from "./Header.tsx";
import NotificationButton from "./NotificationButton.tsx";
import {useUser} from "../context/UserContext.tsx";

// Define the type for the props
interface Props {
    links: Array<{ name: string, path: string }>;
    logo: string;
}

function TopHeader({links, logo}: Props) {
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
    const {user} = useUser()
    return (
        <motion.div
            className={` ${visible ? '' : '-translate-y-18'} bg-[#1b1d20]/50 text-white fixed z-999 duration-500 h-16 font-bold lg:text-xl left-0 top-0 text-md items-center justify-between w-screen border-violet-300 border-b-2 hidden lg:flex px-4 lg:px-36 xl:px-64 shadow-violet-400/20 shadow-md`}>
            <div className="flex items-center justify-center h-full">
                <a href="/" className="flex w-auto left-3 relative">
                    <div className="w-12 h-auto">
                        <img src={logo} alt="logo" className="h-full aspect-auto"/>
                    </div>
                </a>
                <ul className="relative items-center flex h-full ml-2 md:ml-8">
                    {links.map((link, index) =>
                        link.name !== "Home" ? (
                                <motion.li className={" px-2 md:px-3 lg:px-4 duration-100"} key={link.name}
                                           initial={{opacity: 0, x: 0, y: 20}}
                                           animate={{opacity: 1, x: 0, y: 0}}
                                           exit={{opacity: 0, x: 0, y: 0}}
                                           transition={{
                                               type: "spring",
                                               duration: 1.3,
                                               ease: "easeOut",
                                               delay: index * 0.15
                                           }}>
                                    <motion.div className={'w-full h-full'} whileHover={{scale: 1.1}}>
                                        <Link to={link.path}>
                                            {link.name}
                                        </Link>
                                    </motion.div>

                                </motion.li>
                            ) : ""
                            )}
                        </ul>

                        </div>
                        <div>
                        <div className={'w-full h-full'}>
                    {!user ? (
                        <Link to={"http://localhost:3001/api/auth/login"}>Login</Link>
                    ) : (
                        <div className="flex items-center justify-center gap-2">
                            {user.avatar_url ? (
                                <img
                                    src={user.avatar_url}
                                    alt="avatar"
                                    className="rounded-full w-6 h-6 border border-white"
                                />
                            ) : null}
                            <span className={'text-lg'}>{user.username}</span>
                            <div
                                className={'ml-3 items-center flex'}>
                                <NotificationButton mode={'pc'}/>
                            </div>
                            <motion.div
                                whileHover={{scale: 1.1}}
                                whileTap={{scale: 0.9}}
                                transition={{type: "spring", stiffness: 300, duration: 200}}
                                className={'ml-3 cursor-pointer'}
                                onClick={handleLogOut}>
                                <LogOut size={24}/>
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>

    )
}

export default TopHeader;