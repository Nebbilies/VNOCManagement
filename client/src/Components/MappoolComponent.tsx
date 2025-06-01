import MappoolContent from "./MappoolContent.tsx";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {motion, AnimatePresence} from "motion/react";
import {MappoolContext} from "../context/MappoolContext.tsx";
import {Plus, Search} from "lucide-react";
import {useToast} from "../context/ToastContext.tsx";

interface PoolData {
    NM: MapData[],
    HD: MapData[],
    HR: MapData[],
    DT: MapData[],
    TB: MapData[],
}

//AllPoolData: object with all rounds as keys and PoolData as values
export interface AllPoolData {
    [round: string]: PoolData;
}

interface MapData {
    id: number,
    beatmapsetId: number,
    name: string,
    artist: string,
    difficulty: string,
    mapper: string,
    SR: number,
    BPM: number,
    drain: number,
    CS: number,
    AR: number,
    OD: number,
    idx: number,
}

interface RawMapData {
    id: number,
    idx: number,
}

interface RawPoolData {
    NM: RawMapData[],
    HD: RawMapData[],
    HR: RawMapData[],
    DT: RawMapData[],
    TB: RawMapData[],
}

interface RoundInfo {
    Acronym: string,
    Round: string,
}

type MapResponse = {
    id: number,
    artist: string,
    title: string,
    creator: string,
    beatmaps: {
        id: number,
        difficulty_rating: number,
        version: string,
        accuracy: number,
        ar: number,
        cs: number,
        bpm: number,
        hit_length: number,
    }[]
}

function sortMapsByIndex(AllMappool: AllPoolData): AllPoolData {
    const sortedMappool: AllPoolData = {};
    for (const round in AllMappool) {
        if (Object.prototype.hasOwnProperty.call(AllMappool, round)) {
            sortedMappool[round] = {
                NM: AllMappool[round].NM.sort((a, b) => a.idx - b.idx),
                HD: AllMappool[round].HD.sort((a, b) => a.idx - b.idx),
                HR: AllMappool[round].HR.sort((a, b) => a.idx - b.idx),
                DT: AllMappool[round].DT.sort((a, b) => a.idx - b.idx),
                TB: AllMappool[round].TB.sort((a, b) => a.idx - b.idx),
            };
        }
    }
    return sortedMappool;
}

export async function fetchBeatmapData(beatmapSearchId: number) {
    const response = await fetch(`https://tryz.vercel.app/api/b/${beatmapSearchId}`);
    const json = await response.json();
    if ("error" in json) {
        return ({
            returnCode: json.error.status,
            id: -1,
            artist: '',
            title: '',
            difficulty: '',
        });
    } else {
        const jsonData: MapResponse = json;
        const beatmapData = jsonData.beatmaps.find((map) => map.id === beatmapSearchId);
        return ({
            returnCode: 200,
            id: json.id,
            artist: json.artist,
            title: json.title,
            difficulty: beatmapData!.version,
        });
    }
}

interface AddBeatmapButtonProps {
    toggleRefresh: (refresh: boolean) => void;
    roundList: RoundInfo[];
}

const AddBeatmapButton = ({toggleRefresh, roundList}: AddBeatmapButtonProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [HoveringAddBeatmap, setHoveringAddBeatmap] = useState(false);
    const [beatmapId, setBeatmapId] = useState('');
    const [roundName, setRoundName] = useState(roundList.length > 0 ? roundList[0].Acronym : '');
    const [mod, setMod] = useState('NM');
    const [index, setIndex] = useState('');
    const [beatmapSearchId, setBeatmapSearchId] = useState(-1);
    const {showSuccess, showError} = useToast();
    const [loading, setLoading] = useState(false);
    const [beatmapSearchData, setBeatmapSearchData] = useState({
        returnCode: -1,
        id: -1,
        artist: '',
        title: '',
        difficulty: '',
    })
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        if (beatmapSearchId !== -1) {
            fetchBeatmapData(beatmapSearchId).then((data) => {
                setBeatmapSearchData(data);
            });
        }
    }, [beatmapSearchId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3001/api/maps/add', {
                method: 'POST',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    round: roundName,
                    mod: mod,
                    index: parseInt(index),
                    id: parseInt(beatmapId),
                }),
            });

            if (response.ok) {
                showSuccess('Beatmap added successfully!');
                closeModal();
                // Reset form
                setBeatmapId('');
                setRoundName(roundList.length > 0 ? roundList[0].Acronym : '');
                setMod('NM');
                setIndex('');
                setBeatmapSearchId(-1);
                setBeatmapSearchData({
                    returnCode: -1,
                    id: -1,
                    artist: '',
                    title: '',
                    difficulty: '',
                });
                toggleRefresh(true);
            } else {
                console.error('Failed to add beatmap');
                const errorData = await response.json();
                showError(errorData.error || 'Failed to add beatmap');
            }
        } catch (error) {
            console.error('Error adding beatmap:', error);
        }
        setLoading(false);
    };

    return (
        <>
            <div onMouseEnter={() => setHoveringAddBeatmap(true)}
                 onMouseLeave={() => setHoveringAddBeatmap(false)}
                 className="text-white font-bold w-[39px] h-1/2 cursor-pointer rounded-full transition-colors duration-300 flex justify-center items-center">
                <Plus className={'h-full w-full'}
                      onClick={openModal}
                >
                </Plus>
                <AnimatePresence>
                    {HoveringAddBeatmap && (
                        <motion.div
                            initial={{opacity: 0, y: -10}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -10}}
                            transition={{type: "spring", damping: 25, stiffness: 300}}
                            className="absolute text-white text-sm p-2 rounded-md mt-2 translate-y-[-150%] bg-gray-800 shadow-lg z-50"
                        >
                            Add Beatmap
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 0.6}}
                            exit={{opacity: 0}}
                            className="fixed inset-0 bg-gray-700 blur-l z-40"
                            onClick={closeModal}
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{opacity: 0, scale: 0.9, y: 20}}
                            animate={{opacity: 1, scale: 1, y: 0}}
                            exit={{opacity: 0, scale: 0.9, y: 20}}
                            transition={{type: "spring", damping: 25, stiffness: 300}}
                            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#23263a] rounded-lg shadow-2xl p-6 z-50 w-96"
                        >
                            <h2 className="text-xl font-semibold mb-4 text-white">Add Beatmap</h2>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="beatmapId" className="block text-sm font-medium text-white mb-1">
                                        Beatmap ID
                                    </label>
                                    <div className={'flex'}>
                                        <input
                                            type="number"
                                            id="beatmapId"
                                            value={beatmapId}
                                            onChange={(e) => setBeatmapId(e.target.value)}
                                            className="w-full p-2 border border-gray-300 font-normal text-xl rounded focus:ring-violet-500 focus:border-violet-500 text-white"
                                            required
                                        />
                                        <div
                                            className={'bg-gray-900/20 text-white text-2xl rounded w-1/6 hover:bg-gray-700 transition-colors flex justify-center items-center ml-2 border-white border-1 cursor-pointer'}
                                            onClick={() => setBeatmapSearchId(parseInt(beatmapId))}
                                        >
                                            <Search className={'w-8 h-8'}/>
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
                                ) : null}

                                {/* Mappool Name and Slot Name */}
                                <div className="flex gap-4 mt-4 mb-6">
                                    <div className="w-1/2">
                                        <label htmlFor="roundName"
                                               className="block text-sm font-medium text-white mb-1">
                                            Round Acronym
                                        </label>
                                        <select name={"roundName"} id={"roundName"}
                                                className={"w-full p-[8.7px] border border-gray-300 font-normal text-xl rounded focus:ring-blue-500 bg-[#23263a] focus:border-blue-500"}
                                                value={roundName}
                                                onChange={(e) => setRoundName(e.target.value)}
                                        >
                                            {roundList.map((round) => (
                                                <option key={round.Acronym} value={round.Acronym}>
                                                    {round.Round}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="w-1/4">
                                        <label htmlFor="mod" className="block text-sm font-medium text-white mb-1">
                                            Mod
                                        </label>
                                        <select
                                            id="mod"
                                            value={mod}
                                            onChange={(e) => setMod(e.target.value)}
                                            className="w-full p-[8.7px] border border-gray-300 font-normal text-xl rounded focus:ring-blue-500 bg-[#23263a] focus:border-blue-500"
                                            required>
                                            <option value="NM">NM</option>
                                            <option value="HD">HD</option>
                                            <option value="HR">HR</option>
                                            <option value="DT">DT</option>
                                            <option value="TB">TB</option>
                                        </select>
                                    </div>
                                    <div className="w-1/4">
                                        <label htmlFor="index" className="block text-sm font-medium text-white mb-1">
                                            Index
                                        </label>
                                        <input
                                            id="index"
                                            value={index}
                                            type="number"
                                            onChange={(e) => setIndex(e.target.value)}
                                            className="w-full p-[8.7px] border border-gray-300 font-normal text-xl rounded focus:ring-blue-500 bg-[#23263a] focus:border-blue-500"
                                            required>
                                        </input>
                                    </div>
                                </div>

                                <div className="flex justify-center gap-2 w-full h-12">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className={`text-gray-700 text-2xl bg-gray-200 w-1/2 h-full rounded hover:bg-gray-300 transition-colors ${loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className={`bg-blue-500 text-white text-2xl rounded w-1/2 hover:bg-blue-600 transition-colors ${beatmapSearchData.returnCode === 200 && !loading ? 'cursor-pointer' : "pointer-events-none opacity-50"} `}
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};


function MappoolComponent() {
    const [roundList, setRoundList] = useState<RoundInfo[]>([]);
    const [currentRound, setCurrentRound] = useState<string>('');
    const [allMappool, setAllMappool] = useState<AllPoolData>({});
    const [refresh, setRefresh] = useState<boolean>(false);
    useEffect(() => {
        fetch(`http://localhost:3001/api/round`, {})
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch round data");
                return res.json();
            })
            .then((data: RoundInfo[]) => {
                setRoundList(data);
                if (data.length > 0) {
                    setCurrentRound(data[0].Acronym); // Set the first round as the current round
                }
            })
            .catch((error) => {
                console.error("Error fetching round data:", error);
            });
    }, []);
    useEffect(() => {
        fetch(`http://localhost:3001/api/maps/all`, {})
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch mappool data");
                return res.json();
            })
            .then((data: AllPoolData) => {
                setAllMappool(sortMapsByIndex(data));
            })
            .catch((error) => {
                console.error("Error fetching mappool data:", error);
            });
        setRefresh(false);
    }, [refresh]);

    return (
        <div className={"mappool-container flex flex-col max-w-screen h-auto px-4 lg:px-8 " +
            "mt-40 mb-20 pt-5 pb-10 md:mx-10 lg:mx-36 xl:mx-64 self-center text-white bg-gray-900/20"}>
            <div className={"mappool-header flex flex-col w-full text-5xl font-black gap-4 lg:gap-0"}>
                <div className={"w-full italic flex lg:flex-row items-center justify-between"}>
                    <div className={"mappool-header-text italic lg:text-start text-center"}>
                        MAPPOOL
                    </div>
                    <AddBeatmapButton toggleRefresh={setRefresh} roundList={roundList}/>
                </div>
                <div
                    className={"mappool-header-selection font-bold text-2xl justify-center items-center flex mt-4 gap-4"}>
                    <div>
                        <span className={"text-white"}>Round: </span>
                    </div>
                    <select name={"mappool-selection"} id={"mappool-selection"}
                            className={"text-white text-center focus:ring-blue-500 bg-[#23263a] focus:border-blue-500 rounded-xl p-1"}
                            value={currentRound}
                            onChange={(e) => setCurrentRound(e.target.value)}
                    >
                        {
                            roundList.map((round) => {
                                return (
                                    <option key={round.Acronym} value={round.Acronym}>
                                        {round.Round}
                                    </option>
                                )
                            })
                        }
                    </select>
                </div>


            </div>
            <MappoolContext.Provider
                value={{
                    mappool: allMappool[currentRound] || {NM: [], HD: [], HR: [], DT: [], TB: []},
                    currentRound: currentRound,
                    refresh,
                    setRefresh
                }}>
                <MappoolContent/>
            </MappoolContext.Provider>
        </div>
    );
}

export default MappoolComponent;