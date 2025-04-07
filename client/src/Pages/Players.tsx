import Header from "../Components/Header.tsx";
import PlayersComponent from "../Components/PlayersComponent.tsx";
import {motion} from "motion/react";
import {variants} from "../lib/variants.tsx";

function Players() {
    return (
        <>
            <Header/>
            <main>
                <PlayersComponent/>
            </main>
        </>
    )
}

export default Players;

