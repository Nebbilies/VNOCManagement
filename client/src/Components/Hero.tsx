import bg from '../assets/vnoctb.mp4'
import vnoc2024 from '../assets/vnoc_2024.png'
import vcl from '../assets/vcl.png'
import { motion } from 'framer-motion'
import { variants } from "../lib/variants.tsx";

function Hero() {
    return (
        <>
            <div className="absolute inset-0 bg-gradient-to-t from-black from-20% to-transparent opacity-90 w-full h-full -z-50"></div>
            <video autoPlay muted loop id="heroBg"
                   className="absolute inset-0 w-full h-full object-cover opacity-30 -z-999" src={bg}/>
            <motion.main className={"relative w-screen h-screen flex flex-col justify-center items-center"}>
                <motion.img src={vnoc2024} alt="logo" className="w-1/2 flex shrink-2"
                            initial={"hidden"}
                            animate={"enter"}
                            exit={"exit"}
                            variants={variants}
                            transition={{type: "spring", duration: 1.3, ease: "easeInOut"}}
                />
                <motion.h1 className={"text-white text-4xl font-bold italic pt-8 tracking-wide"}
                           initial={"hidden"}
                           animate={"enter"}
                           exit={"exit"}
                           variants={variants}
                           transition={{type: "spring", duration: 1.3, ease: "easeInOut", delay: 0.2}}
                >
                    Giải đấu osu!standard hàng đầu Việt Nam.
                </motion.h1>
                <motion.div className={"flex space-x-4 pt-4 items-center justify-center"}
                            initial={"hidden"}
                            animate={"enter"}
                            exit={"exit"}
                            variants={variants}
                            transition={{type: "spring", duration: 1.3, ease: "easeInOut", delay: 0.4}}
                >
                    <h2 className={"font-normal italic text-white text-3xl"}>Được tổ chức bởi</h2>
                    <motion.img src={vcl} alt="vcl" className="w-1/4 pl-4 duration-200" whileHover={{scale: 1.05}}/>
                </motion.div>
            </motion.main>
        </>
    )
}

export default Hero