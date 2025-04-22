import { variants } from "../lib/variants.tsx";
import InfoComponent from "../Components/InfoComponent.tsx";
import Header from "../Components/Header.tsx";
import {motion} from "motion/react";

function Info() {
    return (
        <>
            <Header/>
            <InfoComponent/>
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

export default Info;