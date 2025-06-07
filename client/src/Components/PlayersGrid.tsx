import {PlayerData} from "./PlayersComponent.tsx";
import {AnimatePresence, motion} from "motion/react";
import {useEffect, useState} from "react";
import {Trash2, ChevronLeft, ChevronRight} from "lucide-react";
import {useToast} from "../context/ToastContext.tsx";
import {useUser} from "../context/UserContext.tsx";

interface Props {
    playerData: PlayerData
    toggleRefresh: (refresh: boolean) => void;
}

const hidden = {opacity: 0, x: 0, y: -10}
const enter = {opacity: 1, x: 0, y: 0}
const exit = {opacity: 0, x: 0, y: -10}

let ROWS_PER_PAGE = 5;

function PlayersGrid({playerData, toggleRefresh}: Props) {
    const apiBase = import.meta.env.VITE_API_BASE_URL
    const {user} = useUser();
    let userRole = "";
    if (user) {
        userRole = user.role;
    }
    const [ page, setPage ] = useState(1);
    const [ playersPerPage, setPlayersPerPage ] = useState(30);
    const { showSuccess, showError } = useToast();
    const [hoveredPlayer, setHoveredPlayer] = useState(-1)
    const [deletePlayer, setDeletePlayer] = useState(-1)
    const [loading, setLoading] = useState(false);
    //page related functions
    useEffect(() => {
        function calculatePlayersPerPage() {
            const width = window.innerWidth;
            let columns = 2;
            if (width >= 1280) {
                columns = 6;
                ROWS_PER_PAGE = 4;
            } else if (width >= 1024) {
                columns = 5;
                ROWS_PER_PAGE = 4;
            } else if (width >= 768) {
                columns = 4;
                ROWS_PER_PAGE = 5;
            } else if (width >= 640) {
                columns = 3;
                ROWS_PER_PAGE = 5;
            }
            setPlayersPerPage(columns * ROWS_PER_PAGE);
        }
        calculatePlayersPerPage();
        window.addEventListener('resize', calculatePlayersPerPage);
        return () => window.removeEventListener('resize', calculatePlayersPerPage);
    }, []);
    useEffect(() => {
        const totalPages = Math.ceil(playerData.length / playersPerPage);
        if (page > totalPages && totalPages > 0) {
            setPage(totalPages);
        }
    }, [playersPerPage, playerData.length, page]);
    const totalPages = Math.ceil(playerData.length / playersPerPage);
    const startIndex = (page - 1) * playersPerPage;
    const endIndex = startIndex + playersPerPage;
    const currentPlayers = playerData.slice(startIndex, endIndex);
    const nextPage = () => {
        if (page < totalPages) {
            setPage(page + 1);
        }
    }
    const prevPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    }

    async function onDeletePlayer() {
        setLoading(true);
        const response = await fetch(`${apiBase}/players/remove/${deletePlayer}`, {
            credentials: 'include',
            method: 'DELETE',
        });
        if (!response.ok) {
            const errorData = await response.json();
            showError(errorData.error || "Failed to delete player");
            setLoading(false);
            throw new Error("Failed to delete player");
        }
        showSuccess(`Player ${deletePlayer} deleted successfully!`);
        toggleRefresh(true);
        setDeletePlayer(0);
        setLoading(false);
    }
    return (
        <>
        <div
            className="players-grid grid grid-cols-2 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 auto-rows-auto w-full h-auto gap-x-3 md:gap-x-4 xl:gap-x-5 sm:gap-y-3 md:gap-y-6 lg:gap-y-10 place-items-center overflow-hidden mt-10 gap-y-10 py-5 px-1">
            {currentPlayers.map((player, index) => (
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
                        {hoveredPlayer === player.Id && userRole === "ADMIN" ? (
                            <button
                                onClick={() =>
                                    setDeletePlayer(player.Id)
                                }
                                className="absolute top-1.5 right-2 z-10 bg-[#0e111a] rounded-full p-2 hover:bg-red-900 transition-colors"
                                aria-label="Delete player"
                            >
                                <Trash2 className="w-5 h-5 text-white"/>
                            </button>
                        ) : null}
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
                                    className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg p-6 z-50 sm:w-96 w-10/11"
                                >
                                    <div className="bg-[#23263a] rounded-lg p-6 text-white">
                                        <div>Are you sure you want to delete <b>{player.Username}</b>?</div>
                                        <div className="mt-4 flex gap-3">
                                            <button onClick={() =>
                                                setDeletePlayer(-1)
                                            }
                                                    className={`px-4 py-2 bg-gray-500 rounded hover:bg-gray-600 ${loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}>
                                                Cancel
                                            </button>
                                            <button onClick={() => {
                                                onDeletePlayer();
                                            }} className={`px-4 py-2 bg-red-600 rounded hover:bg-red-700 ${loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}>
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
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 mb-4 gap-4">
                    <button
                        onClick={prevPage}
                        disabled={page === 1}
                        className={`flex items-center justify-center p-2 rounded-full ${page === 1 ? 'text-gray-500 cursor-not-allowed' : 'text-white hover:bg-[#353d60]'}`}
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <div className="text-white">
                        Page {page} of {totalPages}
                    </div>

                    <button
                        onClick={nextPage}
                        disabled={page === totalPages}
                        className={`flex items-center justify-center p-2 rounded-full ${page === totalPages ? 'text-gray-500 cursor-not-allowed' : 'text-white hover:bg-[#353d60]'}`}
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            )}
        </>
    )
}

export default PlayersGrid;