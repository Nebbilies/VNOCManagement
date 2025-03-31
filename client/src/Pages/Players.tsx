import Header from "../Components/Header.tsx";
import PlayersComponent from "../Components/PlayersComponent.tsx";
import {motion} from "motion/react";
import {variants} from "../lib/variants.tsx";

function Players() {
    return (
        <>
            <Header/>
            <motion.main
                initial="hidden"
                animate="enter"
                exit="exit"
                variants={variants}
                transition={{type: "tween", duration: 1}}
            >
                <PlayersComponent/>
            </motion.main>
        </>
    )
}

export default Players;