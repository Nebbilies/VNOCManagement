import MappoolContent from "./MappoolContent.tsx";
import {useEffect, useState, createContext, useContext} from "react";
import {motion, AnimatePresence} from "motion/react";
import {MappoolContext} from "../context/MappoolContext.tsx";
import { Search } from "lucide-react";

const mapsId: RawPoolData = {
    "NM": [
        {
            "id": 1363001,
            "idx": 1,
        },
        {
            "id": 4977277,
            "idx": 2,
        },
    ],
    "HD": [
        {
            "id": 3621640,
            "idx": 1,
        },
        {
            "id": 1972244,
            "idx": 2,
        }
    ],
    "HR": [
        {
            "id": 1363001,
            "idx": 1,
        },
    ],
    "DT": [
        {
            "id": 4870736,
            "idx": 1,
        },
    ],
    "TB": [
        {
            "id": 4805696,
            "idx": 1,
        },
    ],
};

interface PoolData {
    NM: MapData[],
    HD: MapData[],
    HR: MapData[],
    DT: MapData[],
    TB: MapData[],
}

interface MapData {
    id: number,
    beatmapsetId: string,
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

type MapResponse = {
    id: string,
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

async function fetchMappoolData(modMaps: RawMapData[]): Promise<MapData[]> {
    return await Promise.all(modMaps.map(async ({ id }, idx) => {
        const response = await fetch(`https://tryz.vercel.app/api/b/${id}`);
        const json: MapResponse = await response.json();
        const beatmapData = json.beatmaps.find((map) => map.id === id);
        return {
            id,
            beatmapsetId: json.id,
            artist: json.artist,
            name: json.title,
            difficulty: beatmapData!.version,
            mapper: json.creator,
            SR: beatmapData!.difficulty_rating,
            BPM: beatmapData!.bpm,
            CS: beatmapData!.cs,
            AR: beatmapData!.ar,
            OD: beatmapData!.accuracy,
            drain: beatmapData!.hit_length,
            idx,
        }
    }));
}

const AddBeatmapsButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [beatmapId, setBeatmapId] = useState('');
    const [mappoolName, setMappoolName] = useState('');
    const [slotName, setSlotName] = useState('');
    const [beatmapSearchId, setBeatmapSearchId] = useState('');
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
        async function fetchBeatmapData() {
            const response = await fetch(`https://tryz.vercel.app/api/b/${beatmapSearchId}`);
            const json = await response.json();
            if ("error" in json) {
                setBeatmapSearchData({
                    returnCode: json.error.status,
                    id: -1,
                    artist: '',
                    title: '',
                    difficulty: '',
                });
            } else {
                const jsonData: MapResponse = json;
                const beatmapData = jsonData.beatmaps.find((map) => map.id === parseInt(beatmapSearchId));
                setBeatmapSearchData({
                    returnCode: 200,
                    id: json.id,
                    artist: json.artist,
                    title: json.title,
                    difficulty: beatmapData!.version,
                });
            }
            console.log(beatmapSearchData.returnCode)
        }
        if (beatmapSearchId) {
            fetchBeatmapData()
        }
    }, [beatmapSearchId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        /*try {
            const response = await fetch('api/add-beatmaps', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    beatmapId,
                    mappoolName,
                    slotName
                }),
            });

            if (response.ok) {
                console.log('Beatmap added successfully');
                closeModal();
                // Reset form
                setBeatmapId('');
                setMappoolName('');
                setSlotName('');
            } else {
                console.error('Failed to add beatmap');
            }
        } catch (error) {
            console.error('Error adding beatmap:', error);
        }*/
    };

    return (
        <>
            <button
                onClick={openModal}
                className="bg-green-500 text-2xl w-1/4 hover:bg-green-700 text-white font-bold py-2 px-4 mx-4 cursor-pointer rounded rounded-2xl transition-colors duration-300"
            >
                +
            </button>

            <AnimatePresence>
                {isModalOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.6 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-gray-700 blur-l z-40"
                            onClick={closeModal}
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
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
                                            type="text"
                                            id="beatmapId"
                                            value={beatmapId}
                                            onChange={(e) => setBeatmapId(e.target.value)}
                                            className="w-full p-2 border border-gray-300 font-normal text-xl rounded focus:ring-violet-500 focus:border-violet-500 text-white"
                                            required
                                        />
                                        <button className={'bg-gray-900/20 text-white text-2xl rounded w-1/6 hover:bg-gray-700 transition-colors flex justify-center items-center ml-2 border-white border-1'}
                                        onClick = {() => setBeatmapSearchId(beatmapId)}
                                        >
                                            <Search className={'w-8 h-8'}/>
                                        </button>
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
                                        <img className={`object-cover h-full w-auto sm:flex hidden rounded-r-3xl rounded-l-3xl`}
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
                                        <label htmlFor="mappoolName"
                                               className="block text-sm font-medium text-white mb-1">
                                            Mappool Name
                                        </label>
                                        <input
                                            type="text"
                                            id="mappoolName"
                                            value={mappoolName}
                                            onChange={(e) => setMappoolName(e.target.value)}
                                            className="w-full p-2 border border-gray-300 font-normal text-xl rounded focus:ring-violet-500 focus:border-violet-500 text-white"
                                            required
                                        />
                                    </div>

                                    <div className="w-1/2">
                                        <label htmlFor="slotName" className="block text-sm font-medium text-white mb-1">
                                            Slot Name
                                        </label>
                                        <input
                                            type="text"
                                            id="slotName"
                                            value={slotName}
                                            onChange={(e) => setSlotName(e.target.value)}
                                            className="w-full p-2 border border-gray-300 font-normal text-xl rounded focus:ring-violet-500 focus:border-violet-500 text-white"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-center gap-2 w-full h-12">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="text-gray-700 text-2xl bg-gray-200 w-1/2 h-full rounded hover:bg-gray-300 transition-colors cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className={`bg-blue-500 text-white text-2xl rounded w-1/2 hover:bg-blue-600 transition-colors ${beatmapSearchData.returnCode === 200 ? 'cursor-pointer' : "cursor-not-allowed opacity-50"} `}
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

async function fetchMods(mapsId: RawPoolData): Promise<PoolData> {
    //don't mutate the props
    let data: PoolData = {};
    for (const mod of Object.keys(mapsId)) {
        data[mod as keyof PoolData] = await fetchMappoolData(mapsId[mod as keyof PoolData]);
    }
    return data;
}



function MappoolComponent() {
    /*const mappool = [
        {id: "2258243", name: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", artist: "bbbbb", slotName: "NM1", difficulty: 'Map Difficulty', BPM: 120.5, drain: 180, CS: 4, AR: 9, OD: 10, SR: 6.5},
        {id: "2223850", name: "ccccc", artist: "ddddd", slotName: "HD1", difficulty: 'Map Difficulty', BPM: 120.5, drain: 189, CS: 4, AR: 9, OD: 10, SR: 6.5},
        {id: "2258243", name: "eeeee", artist: "fffff", slotName: "NM2", difficulty: 'Map Difficulty', BPM: 120.5, drain: 329, CS: 4, AR: 9, OD: 10, SR: 6.5},
    ];*/
    const [mappool, setMappool] = useState<PoolData>({DT: [], HD: [], HR: [], NM: [], TB: []});
    useEffect(() => {
        fetchMods(mapsId).then((data) => {
            setMappool(data);
        });
    }, [mappool]);
  return (
    <div className={"mappool-container flex flex-col max-w-screen h-auto px-4 lg:px-8 " +
        "mt-40 mb-20 pt-5 pb-10 md:mx-16 lg:mx-36 xl:mx-64 mx-4 self-center text-white bg-gray-900/20"}>
        <div className={"mappool-header flex w-full text-5xl font-black items-center"} >
            <div className={"mappool-header-text w-full italic text-start"}>
                MAPPOOL
            </div>
            <AddBeatmapsButton />
            <div className={"mappool-header-selection font-bold text-2xl"}>
                <select name={"mappool-selection"} id={"mappool-selection"} className={"bg-gray-900/20 text-white text-center"}>
                    <option value={"week1"}>Week 1</option>
                    <option value={"week2"}>Week 2</option>
                    <option value={"week3"}>Week 3</option>
                    <option value={"week4"}>Week 4</option>
                </select>
            </div>
        </div>
        <MappoolContext.Provider value={mappool}>
            <MappoolContent />
        </MappoolContext.Provider>
    </div>
  );
}

export default MappoolComponent;