import {useContext, useEffect, useRef, useState} from "react";
import {MapData} from "./MappoolContent.tsx";
import {MappoolStyle} from "./MappoolContent.tsx";
import {EllipsisVertical, Search} from 'lucide-react';
import {AnimatePresence, motion} from "motion/react";
import {fetchBeatmapData} from "./MappoolComponent.tsx";
import {MappoolContext} from "../../context/MappoolContext.tsx";
import {useToast} from "../../context/ToastContext.tsx";
import {useUser} from "../../context/UserContext.tsx";

//good habit
interface Props {
    map: MapData,
    style: MappoolStyle,
    mod: string,
}

export default function MappoolContentCard({map, style, mod}: Props) {
    const apiBase = import.meta.env.VITE_API_BASE_URL
    const {user} = useUser()
    let userRole = 'USER';
    if (user) {
        userRole = user.role;
    }
    const { currentRound, setRefresh } = useContext(MappoolContext);
    const [loading, setLoading] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [beatmapSearchId, setBeatmapSearchId] = useState(-1);
    const { showSuccess, showError } = useToast();
    const [ newMapData, setNewMapData ] = useState({
        id: 0,
        mod: "NM",
        idx: 0,
    })
    const [ searchLoading, setSearchLoading ] = useState<boolean>(false);
    const [beatmapSearchData, setBeatmapSearchData] = useState({
        returnCode: -1,
        id: -1,
        artist: '',
        title: '',
        difficulty: '',
    })
    const [editingMapData, setEditingMapData] = useState(
        {
            id: 0,
            mod: "NM",
            idx: 0,
        }
    );
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    async function deleteBeatmap({round, mod, index}: { round: string, mod: string, index: number }) {
        setLoading(true);
        const response = await fetch(`${apiBase}/maps/delete`, {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                round,
                index,
                mod
            }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            showError(errorData.error || 'Failed to delete beatmap');
            setLoading(false);
            throw new Error('Failed to delete beatmap');
        }
        setIsDeleteModalOpen(false);
        showSuccess('Beatmap deleted successfully!');
        setLoading(false);
        setRefresh(true);
    }
    async function editBeatmap({oldRound, oldMod, oldIndex}: { oldRound: string, oldMod: string, oldIndex: number }) {
        setLoading(true);
        console.log('all editing map data:',
            'round:', oldRound,
            'oldMod:', oldMod,
            'oldIndex:', oldIndex,
            'newMod:', newMapData.mod,
            'newIndex:', newMapData.idx,
            'newId:', beatmapSearchId
            )

        const response = await fetch(`${apiBase}/maps/edit`, {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "round": oldRound,
                "oldMod": oldMod,
                "oldIndex": oldIndex,
                "newMod": newMapData.mod,
                "newIndex": newMapData.idx,
                "newId": beatmapSearchId,
            }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            showError(errorData.error || 'Failed to edit beatmap');
            setLoading(false);
            throw new Error('Failed to edit beatmap');
        }
        setIsDeleteModalOpen(false);
        showSuccess('Beatmap edited successfully!');
        setLoading(false);
        setRefresh(true);
        setEditingMapData({
            id: 0,
            mod: "NM",
            idx: 0,
        });
        setBeatmapSearchId(-1);
    }
    // Close menu on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        }

        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen]);

    useEffect(() => {
        if (beatmapSearchId !== -1) {
            setSearchLoading(true);
            fetchBeatmapData(beatmapSearchId).then((data) => {
                setBeatmapSearchData(data);
                setSearchLoading(false);
            });
        }
    }, [beatmapSearchId]);
    return (
        <div className={'flex w-full items-center'}>
            <div key={map.id}
                 className={`mappool-content-map-item cursor-pointer inset-shadow-2xs inset-shadow-black flex w-full rounded-3xl text-black h-25 font-bold items-center bg-center bg-cover bg-white/70 sm:bg-white/90`}
                 style={{
                     backgroundImage: `url('https://assets.ppy.sh/beatmaps/${map.beatmapsetId}/covers/raw.jpg')`,
                     backgroundBlendMode: 'overlay'
                 }}
                 onClick={() => {
                     window.open(`https://osu.ppy.sh/b/${map.id}`, "_blank")
                 }}
            >
                <div
                    className={`mappool-content-map-item-slot w-1/12 h-full rounded-l-3xl ${style.slotName === "TB" ? 'text-black' : 'text-white'} text-lg lg:text-xl`}
                    style={{backgroundColor: style.color}}>
                                        <span
                                            className={'flex items-center justify-center h-full transform -rotate-90 tracking-widest'}>{mod}{map.idx}</span>
                </div>
                <div className={'h-full w-[178px] sm:flex hidden '}>
                    <img className={`object-cover object-center rounded-r-3xl w-full h-full`}
                         src={`https://assets.ppy.sh/beatmaps/${map.beatmapsetId}/covers/raw.jpg`}
                         alt={'bg'}/>
                </div>
                <div
                    className={`mappool-content-map-item-info flex flex-col w-7/12 h-full px-3 justify-start text-start overflow-hidden`}
                >
                    <div
                        className={'mappool-content-map-item-info-name text-lg font-bold truncate inline'}>
                        {map.name}
                    </div>
                    <div
                        className={`mappool-content-map-item-info-artist w-full text-xs font-normal truncate ${style.slotName === "TB" ? 'text-black' : ''}`}>
                        {map.artist}
                    </div>
                    <div
                        className={'mappool-content-map-item-info-mapper flex w-full text-xs font-bold mt-3 truncate inline'}>
                        {map.difficulty}
                    </div>
                </div>
                <div
                    className={'mappool-content-map-item-stats lg:w-1/3 w-1/2 bg-black/70 h-full text-xs font-normal rounded-r-3xl grid grid-cols-2 grid-rows-3 py-1 px-3 gap-x-1 '}>
                    <div
                        className={'mappool-content-map-item-stats-sr text-white flex items-center justify-start gap-1.5'}>
                                            <span className={"font-normal text-red-400"}><svg
                                                xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd"
                                                                          d="M12.908 1.581a1 1 0 0 0-1.816 0l-2.87 6.22l-6.801.807a1 1 0 0 0-.562 1.727l5.03 4.65l-1.335 6.72a1 1 0 0 0 1.469 1.067L12 19.426l5.977 3.346a1 1 0 0 0 1.47-1.068l-1.335-6.718l5.029-4.651a1 1 0 0 0-.562-1.727L15.777 7.8z"
                                                                          clip-rule="evenodd"/></svg></span>
                        <span className={'text-center'}>{map.SR}</span>
                    </div>
                    <div
                        className={'mappool-content-map-item-stats-cs text-white flex items-center justify-start gap-2'}>
                        <span className={"font-bold text-red-400"}>CS</span>
                        <span>{map.CS}</span>
                    </div>
                    <div
                        className={'mappool-content-map-item-stats-drain text-white flex items-center justify-start gap-1.5'}>
                                            <span className={"font-bold text-red-400"}><svg
                                                xmlns="http://www.w3.org/2000/svg" width="16px" height="16px"
                                                viewBox="0 0 48 48"><defs><mask id="ipSTime0"><g fill="none"
                                                                                                 stroke-linejoin="round"
                                                                                                 stroke-width="4"><path
                                                fill="#fff" stroke="#fff"
                                                d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"/><path
                                                stroke="#000" stroke-linecap="round"
                                                d="M24.008 12v12.01l8.479 8.48"/></g></mask></defs><path
                                                fill="currentColor" d="M0 0h48v48H0z"
                                                mask="url(#ipSTime0)"/></svg></span>
                        <span> {Math.round(map.drain / 60)}:{(map.drain % 60).toString().padStart(2, '0')}</span>
                    </div>
                    <div
                        className={'mappool-content-map-item-stats-ar text-white flex items-center justify-start gap-2'}>
                        <span className={"font-bold text-red-400"}>AR</span>
                        <span>{map.AR}</span>
                    </div>
                    <div
                        className={'mappool-content-map-item-stats-bpm text-white flex items-center justify-start gap-1.5'}>
                                            <span className={"font-bold text-red-400"}><svg
                                                xmlns="http://www.w3.org/2000/svg" width="16px" height="16px"
                                                viewBox="0 0 24 24"><path fill="currentColor"
                                                                          d="m12 1.75l-3.43.92l-4.5 16.83c-.01 0-.07.34-.07.5c0 1.11.89 2 2 2h12c1.11 0 2-.89 2-2c0-.16-.06-.5-.07-.5l-4.5-16.83zM10.29 4h3.42l3.49 13H13v-5h-2v5H6.8zM11 5v4h-1v2h4V9h-1V5z"/></svg></span>
                        <span>{map.BPM}</span>
                    </div>
                    <div
                        className={'mappool-content-map-item-stats-od text-white flex items-center justify-start gap-2'}>
                        <span className={"font-bold text-red-400"}>OD</span>
                        <span>{map.OD}</span>
                    </div>
                </div>
            </div>
            {/* Controller: Edit, Delete */}
            { userRole === 'ADMIN' || userRole === 'MAPPOOLER' ? (
                <div className={'relative w-1/30'}>
                    <button
                        className="mappool-content-map-item-controller w-full flex items-center justify-center cursor-pointer text-gray-400 hover:text-gray-600 transition duration-200 relative"
                        onClick={() => setMenuOpen(v => !v)}
                        aria-label="Open map options"
                    >
                        <EllipsisVertical/>
                    </button>
                    <AnimatePresence>
                        {menuOpen && (
                            <motion.div
                                initial={{height: 0}}
                                animate={{height: 'auto', transition: {duration: 0.2}}}
                                exit={{height: 0, transition: {delay: 0.2}}}
                                transition={{ease: 'easeInOut'}}
                                ref={menuRef}
                                className="absolute -left-15 top-full mt-2 z-50 bg-[#0e111a] rounded-lg shadow-lg w-35 flex flex-col animate-fade-in"
                            >
                                <motion.button
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    exit={{opacity: 0}}
                                    transition={{duration: 0.1, delay: 0.2}}
                                    className="px-4 pt-2 pb-1 text-left hover:bg-black w-full text-sm font-bold rounded-t-lg"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        setEditingMapData({
                                            id: map.id,
                                            mod: mod,
                                            idx: map.idx,
                                        })
                                        setBeatmapSearchId(map.id);
                                        setNewMapData({
                                            id: map.id,
                                            mod: mod,
                                            idx: map.idx,
                                        })
                                    }}
                                >
                                    Edit
                                </motion.button>
                                <motion.button
                                    initial={{opacity: 0}}
                                    animate={{
                                        opacity: 1,
                                        transition: {
                                            duration: 0.1, delay: 0.3
                                        }
                                    }}
                                    exit={{opacity: 0}}
                                    className="px-4 pb-2 pt-1 text-left hover:bg-black text-red-600 w-full font-bold text-sm rounded-b-lg"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        setIsDeleteModalOpen(true);
                                    }}
                                >
                                    Delete
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Edit Map Modal */}
                    <AnimatePresence>
                        {editingMapData.id === map.id && (
                            <>
                                {/* Overlay */}
                                <motion.div
                                    initial={{opacity: 0}}
                                    animate={{opacity: 0.6}}
                                    exit={{opacity: 0}}
                                    className="fixed inset-0 bg-gray-700 blur-l z-40"
                                    onClick={() => {
                                        setEditingMapData({
                                            id: 0,
                                            mod: "NM",
                                            idx: 0,
                                        })
                                    }}
                                />

                                {/* Modal */}
                                <motion.div
                                    initial={{opacity: 0, scale: 0.9, y: 20}}
                                    animate={{opacity: 1, scale: 1, y: 0}}
                                    exit={{opacity: 0, scale: 0.9, y: 20}}
                                    transition={{type: "spring", damping: 25, stiffness: 300}}
                                    className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#23263a] rounded-lg shadow-2xl p-6 z-50 sm:w-96 w-10/11"
                                >
                                    <h2 className="text-xl font-semibold mb-4 text-white">Edit Beatmap</h2>
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        editBeatmap({
                                            oldRound: currentRound,
                                            oldMod: editingMapData.mod,
                                            oldIndex: editingMapData.idx
                                        })
                                    }}>
                                        <div className="mb-4">
                                            <label htmlFor="beatmapId"
                                                   className="block text-sm font-medium text-white mb-1">
                                                Beatmap ID
                                            </label>
                                            <div className={'flex'}>
                                                <input
                                                    type="number"
                                                    id="beatmapId"
                                                    value={newMapData.id}
                                                    onChange={(e) => {
                                                        setNewMapData((prev => ({
                                                            ...prev,
                                                            id: parseInt(e.target.value)
                                                        })));
                                                    }
                                                    }
                                                    className="w-full p-2 border border-gray-300 font-normal text-xl rounded focus:ring-violet-500 focus:border-violet-500 text-white"
                                                    required
                                                />
                                                <div
                                                    className={`bg-gray-900/20 text-white text-2xl rounded w-1/6 hover:bg-gray-700 transition-colors flex justify-center items-center ml-2 border-white border-1 ${searchLoading ? 'pointer-event-none opacity-50' : 'cursor-pointer'}`}
                                                    onClick={() => {
                                                        setBeatmapSearchId(newMapData.id);
                                                    }}
                                                >
                                                    {searchLoading ? (
                                                        //Loading Spinner
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"
                                                             viewBox="0 0 24 24">
                                                            <path fill="currentColor"
                                                                  d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z"
                                                                  opacity="0.5"/>
                                                            <path fill="currentColor"
                                                                  d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z">
                                                                <animateTransform attributeName="transform" dur="1s"
                                                                                  from="0 12 12"
                                                                                  repeatCount="indefinite"
                                                                                  to="360 12 12" type="rotate"/>
                                                            </path>
                                                        </svg>
                                                    ) : (
                                                        <Search className={'w-[30px] w-[30px]'}/>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {/* Beatmap Search Result */
                                            //--------------------
                                            //--------------------
                                            // REMEMBER TO CHECK FOR ADDITIONAL CONDITIONS WHEN BACKEND FINISHES
                                            // 1. MAKE MAPPOOL NAME A DROP DOWN OF ROUNDS
                                            // 2. CHECK IF SLOT NAME EXISTS IN MAPPOOL
                                            //---------------------
                                            //--------------------
                                        }
                                        {beatmapSearchData.returnCode === 404 ? (
                                            <div className="text-red-500 text-sm">
                                                Beatmap not found
                                            </div>
                                        ) : null}
                                        {beatmapSearchData.returnCode === 200 ? (
                                            <>
                                                <div className={'w-full text-white text-lg font-bold mb-2 mt-4'}>
                                                    Submitting beatmap:
                                                </div>
                                                <div
                                                    className={`mappool-content-map-item flex w-full rounded-3xl text-black h-20 font-bold items-center bg-center bg-cover bg-white/70 sm:bg-white/90 border-2 border-white `}
                                                    style={{
                                                        backgroundImage: `url('https://assets.ppy.sh/beatmaps/${beatmapSearchData.id}/covers/raw.jpg')`,
                                                        backgroundBlendMode: 'overlay'
                                                    }}>
                                                    <img
                                                        className={`object-cover h-full w-auto sm:flex hidden rounded-r-3xl rounded-l-3xl`}
                                                        src={`https://assets.ppy.sh/beatmaps/${beatmapSearchData.id}/covers/raw.jpg`}
                                                        alt={'bg'}/>
                                                    <div
                                                        className={`mappool-content-map-item-info flex flex-col w-7/12 h-full px-3 justify-start text-start overflow-hidden`}
                                                    >
                                                        <div
                                                            className={'mappool-content-map-item-info-name text-lg font-bold truncate inline'}>
                                                            {beatmapSearchData.title}
                                                        </div>
                                                        <div
                                                            className={`mappool-content-map-item-info-artist  w-full text-xs font-normal truncate`}>
                                                            {beatmapSearchData.artist}
                                                        </div>
                                                        <div
                                                            className={'mappool-content-map-item-info-mapper flex w-full text-xs font-bold mt-3 truncate'}>
                                                            {beatmapSearchData.difficulty}
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : null}

                                        {/* Mappool Name and Slot Name */}
                                        <div className="flex gap-4 mt-4 mb-6">
                                            <div className="w-1/2">
                                                <label htmlFor="mod"
                                                       className="block text-sm font-medium text-white mb-1">
                                                    Mod
                                                </label>
                                                <select
                                                    id="mod"
                                                    value={newMapData.mod}
                                                    onChange={(e) => setNewMapData(
                                                        (prev) => ({...prev, mod: e.target.value})
                                                    )}
                                                    className="w-full p-[8.7px] border border-gray-300 font-normal text-xl rounded focus:ring-blue-500 bg-[#23263a] focus:border-blue-500"
                                                    required>
                                                    <option value="NM">NM</option>
                                                    <option value="HD">HD</option>
                                                    <option value="HR">HR</option>
                                                    <option value="DT">DT</option>
                                                    <option value="TB">TB</option>
                                                </select>
                                            </div>
                                            <div className="w-1/2">
                                                <label htmlFor="slotName"
                                                       className="block text-sm font-medium text-white mb-1">
                                                    Slot Name
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="9"
                                                    id="slotName"
                                                    value={newMapData.idx}
                                                    onChange={(e) => setNewMapData(
                                                        (prev) => ({...prev, idx: parseInt(e.target.value)})
                                                    )}
                                                    className="w-full p-2 border border-gray-300 font-normal text-xl rounded focus:ring-violet-500 focus:border-violet-500 text-white"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-center gap-2 w-full h-12">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingMapData({
                                                        id: 0,
                                                        mod: "NM",
                                                        idx: 0,
                                                    })
                                                }}
                                                className={`text-gray-700 text-2xl bg-gray-200 w-1/2 h-full rounded hover:bg-gray-300 transition-colors ${loading ? 'pointer-event-none opacity-50' : 'cursor-pointer'}`}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className={`bg-blue-500 text-white text-2xl rounded w-1/2 hover:bg-blue-600 transition-colors ${beatmapSearchData.returnCode === 200 && !loading ? 'cursor-pointer' : "pointer-event-none opacity-50"} `}
                                            >
                                                Confirm
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            </>
                        )}
                        {/* Delete Map Modal */}
                        {isDeleteModalOpen && (
                            <>
                                <motion.div
                                    initial={{opacity: 0}}
                                    animate={{opacity: 0.6}}
                                    exit={{opacity: 0}}
                                    className="fixed inset-0 bg-gray-600 blur-xl z-40"
                                    onClick={() => setIsDeleteModalOpen(false)}
                                />
                                <motion.div
                                    initial={{opacity: 0, scale: 0.9, y: 20}}
                                    animate={{opacity: 1, scale: 1, y: 0}}
                                    exit={{opacity: 0, scale: 0.9, y: 20}}
                                    transition={{type: "spring", damping: 25, stiffness: 300}}
                                    className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#23263a] rounded-lg shadow-2xl p-6 z-50 w-96"
                                >
                                    <h2 className="text-xl font-semibold mb-4 text-white">Delete Map</h2>
                                    <div className="text-white mb-4">
                                        Are you sure you want to delete this map?
                                    </div>
                                    <div className="flex gap-3 w-full h-12">
                                        <div
                                            onClick={() => setIsDeleteModalOpen(false)}
                                            className={`px-4 py-2 bg-gray-500 rounded hover:bg-gray-600 flex items-center font-bold ${loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                                        >
                                            Cancel
                                        </div>
                                        <div
                                            className={`px-4 py-2 bg-red-600 rounded hover:bg-red-700 flex items-center font-bold ${loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                                            onClick={() => {
                                                // Handle delete logic here
                                                deleteBeatmap({
                                                    round: currentRound,
                                                    mod: mod,
                                                    index: map.idx
                                                })
                                            }}
                                        >
                                            Confirm
                                        </div>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            ) : null}
        </div>
    )
}