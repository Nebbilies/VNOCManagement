import { motion } from "motion/react"
import { variants } from "../lib/variants.tsx";
import Header from "../Components/Header.tsx";
import Hero from "../Components/Hero.tsx";
function Home() {
    return (
        <>
            <Header/>
            <Hero/>
            <motion.main
                initial="hidden"
                animate="enter"
                exit="exit"
                variants={variants}
                transition={{type: "tween", duration: 1}}
            >
            </motion.main>
        </>
    )
}

export default Home;