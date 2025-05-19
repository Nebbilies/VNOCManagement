import { variants } from "../lib/variants.tsx";
import MappoolComponent from "../Components/MappoolComponent.tsx";
import Header from "../Components/Header.tsx";
import {motion} from "motion/react";

function Mappool() {
    return (
        <>
            <Header/>
            <MappoolComponent/>
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

export default Mappool;