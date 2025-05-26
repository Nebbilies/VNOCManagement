// import PlayersComponent from "../Components/PlayersComponent.tsx";

// function Players() {
//     return (
//         <>
//             <main>
//                 <PlayersComponent/>
//             </main>
//         </>
//     )
// }

// export default Players;

import { useEffect, useState } from "react";
import PlayersComponent, { Player } from "../Components/PlayersComponent";

function Players() {
    const [newPlayer, setNewPlayer] = useState<Player | null>(null);

    useEffect(() => {
        const handleNewPlayer = () => {
            const data = localStorage.getItem("newPlayer");
            if (data) {
                try {
                    const parsed: Player = JSON.parse(data);
                    setNewPlayer(parsed);
                } catch (e) {
                    console.error("Không thể parse dữ liệu người chơi:", e);
                }
            }
        };

        handleNewPlayer();

        window.addEventListener("newPlayerRegistered", handleNewPlayer);

        return () => {
            window.removeEventListener("newPlayerRegistered", handleNewPlayer);
        };
    }, []);

    return (
        <main>
            <PlayersComponent newPlayer={newPlayer} />
        </main>
    );
}

export default Players;
