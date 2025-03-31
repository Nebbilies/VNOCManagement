import {playerData} from "./PlayersComponent.tsx";
import {motion} from "motion/react";
import {useState} from "react";

interface Props {
    playerData: playerData
}


function PlayersGrid({ playerData }: Props) {
    const [hoveredPlayer, setHoveredPlayer] = useState("")
    return (
        <div className="players-grid grid grid-cols-6 auto-rows-auto w-full h-auto gap-x-5 place-items-center overflow-hidden mt-10 gap-y-10 py-5">
            {Object.entries(playerData).map(([id, player]) => (
                <motion.div
                    whileHover={{scale: 1.05}}
                    onMouseEnter={() => setHoveredPlayer(id)}
                    onMouseLeave={() => setHoveredPlayer("")}

                    key={id}
                    className="player-card bg-black/40 border-3 rounded-[20px] flex flex-col  w-10/11 relative">
                    <div className={"text-center px-2 py-3 truncate inline overflow-hidden text-xl font-bold w-full"}>
                        {player.username}
                    </div>
                    <div className={`player-info w-full relative`}>
                        <img alt="player avatar" src={`https://a.ppy.sh/${id}`}
                             className={"w-full aspect-auto rounded-b-2xl"}/>

                        {hoveredPlayer == id &&
                            <motion.div
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                exit={{opacity: 0}}
                                className={`absolute flex items-center justify-center h-full top-0 text-center bg-black/80 w-full rounded-b-2xl text-3xl font-bold`}>
                                #{player.globalRanking}
                            </motion.div>
                        }
                    </div>

                </motion.div>
            ))}
        </div>
    )
}

export default PlayersGrid;