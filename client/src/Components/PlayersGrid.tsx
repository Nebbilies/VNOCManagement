import {PlayerData} from "./PlayersComponent.tsx";
import {AnimatePresence, motion} from "motion/react";
import {useState} from "react";
import {Trash2} from "lucide-react";
import {useToast} from "../context/ToastContext.tsx";

interface Props {
    playerData: PlayerData
    toggleRefresh: (refresh: boolean) => void;
}

const hidden = {opacity: 0, x: 0, y: -10}
const enter = {opacity: 1, x: 0, y: 0}
const exit = {opacity: 0, x: 0, y: -10}


function PlayersGrid({playerData, toggleRefresh}: Props) {
    const { showSuccess, showError } = useToast();
    const [hoveredPlayer, setHoveredPlayer] = useState(-1)
    const [deletePlayer, setDeletePlayer] = useState(-1)
    const [loading, setLoading] = useState(false);
    async function onDeletePlayer() {
        setLoading(true);
        const response = await fetch(`http://localhost:3001/api/players/remove/${deletePlayer}`, {
            credentials: 'include',
            method: 'DELETE',
        });
        if (!response.ok) {
            const errorData = await response.json();
            showError(errorData.error || "Failed to delete player");
            throw new Error("Failed to delete player");
        }
        showSuccess(`Player ${deletePlayer} deleted successfully!`);
        toggleRefresh(true);
        setDeletePlayer(0);
        setTimeout(() => {
            setLoading(false);
        }, 4000);
    }
    return (
        <div
            className="players-grid grid grid-cols-2 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 auto-rows-auto w-full h-auto gap-x-3 md:gap-x-4 xl:gap-x-5 sm:gap-y-3 md:gap-y-6 lg:gap-y-10 place-items-center overflow-hidden mt-10 gap-y-10 py-5 px-1">
            {playerData.map((player, index) => (
                <motion.div className={'w-full h-full'}
                            key={player.Id}
                            initial={hidden}
                            animate={enter}
                            exit={exit}
                            transition={{type: "spring", duration: 0.6, ease: "easeInOut", delay: index * 0.05}}>
                    <motion.div
                        whileHover={{scale: 1.05}}
                        onMouseEnter={() => setHoveredPlayer(player.Id)}
                        onMouseLeave={() => setHoveredPlayer(-1)}
                        key={player.Id}
                        className="player-card bg-[#131724] border-8 border-[#353d60] rounded-[12px] flex flex-col w-10/11 relative">
                        {hoveredPlayer === player.Id && (
                            <button
                                onClick={() =>
                                    setDeletePlayer(player.Id)
                                }
                                className="absolute top-1.5 right-2 z-10 bg-[#0e111a] rounded-full p-2 hover:bg-red-900 transition-colors"
                                aria-label="Delete player"
                            >
                                <Trash2 className="w-5 h-5 text-white"/>
                            </button>
                        )}
                        <div
                            className={"text-center px-2 py-3 truncate inline overflow-hidden text-md font-bold w-full border-b-8 border-[#353d60]"}>
                            {player.Username}
                        </div>
                        <div className={`player-info w-full relative cursor-pointer`} onClick={() => {
                            window.open(`https://osu.ppy.sh/users/${player.Id}`, "_blank")
                        }}>
                            <img alt="player avatar" src={`https://a.ppy.sh/${player.Id}`}
                                 className={"w-full aspect-auto rounded-b-[5px] "}/>
                            {hoveredPlayer == player.Id &&
                                <motion.div
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    exit={{opacity: 0}}
                                    className={`absolute flex items-center justify-center h-full top-0 text-center bg-black/80 w-full rounded-b-[5px] text-3xl font-bold `}>
                                    #{player.Rank}
                                </motion.div>

                            }
                        </div>
                    </motion.div>
                    {/* Confirmation modal */}
                    <AnimatePresence>
                        {deletePlayer == player.Id && (
                            <>
                                <motion.div
                                    initial={{opacity: 0}}
                                    animate={{opacity: 0.6}}
                                    exit={{opacity: 0}}
                                    className="fixed inset-0 bg-gray-600 blur-xl z-40"
                                    onClick={() => {
                                        setDeletePlayer(-1)
                                    }}
                                />

                                <motion.div
                                    initial={{opacity: 0, scale: 0.9, y: 20}}
                                    animate={{opacity: 1, scale: 1, y: 0}}
                                    exit={{opacity: 0, scale: 0.9, y: 20}}
                                    transition={{type: "spring", damping: 25, stiffness: 300}}
                                    className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg p-6 z-50 w-96"
                                >
                                    <div className="bg-[#23263a] rounded-lg p-6 text-white">
                                        <div>Are you sure you want to delete <b>{player.Username}</b>?</div>
                                        <div className="mt-4 flex gap-3">
                                            <button onClick={() =>
                                                setDeletePlayer(-1)
                                            }
                                                    className={`px-4 py-2 bg-gray-500 rounded hover:bg-gray-600 ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                                                Cancel
                                            </button>
                                            <button onClick={() => {
                                                onDeletePlayer();
                                            }} className={`px-4 py-2 bg-red-600 rounded hover:bg-red-700 ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                    {/*-----------*/}
                </motion.div>
            ))}
        </div>
    )
}

export default PlayersGrid;