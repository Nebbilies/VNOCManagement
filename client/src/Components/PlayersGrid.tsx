import {playerData} from "./PlayersComponent.tsx";
import {motion} from "motion/react";
import {useState} from "react";

interface Props {
    playerData: playerData
}

const hidden = {opacity: 0, x: 0, y: -10}
const enter = {opacity: 1, x: 0, y: 0}
const exit = {opacity: 0, x: 0, y: -10}

function PlayersGrid({ playerData }: Props) {
    const [hoveredPlayer, setHoveredPlayer] = useState("")
    return (
        <div className="players-grid grid grid-cols-2 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 auto-rows-auto w-full h-auto gap-x-3 md:gap-x-4 xl:gap-x-5 sm:gap-y-3 md:gap-y-6 lg:gap-y-10 place-items-center overflow-hidden mt-10 gap-y-10 py-5">
            {Object.entries(playerData).map(([id, player], index) => (
                <motion.div className={'w-full h-full'}
                            key={id}
                            initial={hidden}
                            animate={enter}
                            exit={exit}
                            transition={{ type: "spring", duration: 0.6, ease: "easeInOut", delay: index*0.05 }}>
                <motion.div
                    whileHover={{scale: 1.05}}
                    onMouseEnter={() => setHoveredPlayer(id)}
                    onMouseLeave={() => setHoveredPlayer("")}
                    key={id}
                    className="player-card bg-[#131724] border-8 border-[#353d60] rounded-[12px] flex flex-col  w-10/11 relative">
                    <div className={"text-center px-2 py-3 truncate inline overflow-hidden text-md font-bold w-full"}>
                        {player.username}
                    </div>
                    <div className={`player-info w-full relative`}>
                        <img alt="player avatar" src={`https://a.ppy.sh/${id}`}
                             className={"w-full aspect-auto rounded-b-[5px] border-t-8 border-[#353d60]"}/>
                        {hoveredPlayer == id &&
                            <motion.div
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                exit={{opacity: 0}}
                                className={`absolute flex items-center justify-center h-full top-0 text-center bg-black/80 w-full rounded-b-[5px] text-3xl font-bold`}>
                                #{player.globalRanking}
                            </motion.div>

                        }
                    </div>

                </motion.div>
                </motion.div>
            ))}
        </div>
    )
}

export default PlayersGrid;