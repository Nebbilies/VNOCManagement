import MappoolContent from "./MappoolContent.tsx";
import {useEffect, useState, createContext, useContext} from "react";
import {motion, AnimatePresence} from "motion/react";
import {MappoolContext} from "../context/MappoolContext.tsx";

const mapsId: RawPoolData = {
    "NM": [
        {
            "id": 2258243,
            "idx": 1,
        },
        {
            "id": 2223850,
            "idx": 2,
        },
        {
            "id": 2258243,
            "idx": 3,
        },
    ],
    "HD": [
        {
            "id": 2258243,
            "idx": 1,
        },
    ],
    "HR": [
        {
            "id": 2258243,
            "idx": 1,
        },
        {
            "id": 2223850,
            "idx": 2,
        },
        {
            "id": 2258243,
            "idx": 3,
        },
    ],
    "DT": [
        {
            "id": 4870736,
            "idx": 1,
        },
        {
            "id": 4870736,
            "idx": 2,
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

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

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
                className="bg-violet-500 text-2xl w-1/4 hover:bg-violet-700 text-white font-bold py-2 px-4 mx-4 cursor-pointer rounded rounded-2xl transition-colors duration-300"
            >
                Add Beatmaps
            </button>

            <AnimatePresence>
                {isModalOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.6 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-gray-600 blur-xl z-40"
                            onClick={closeModal}
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 z-50 w-96"
                        >
                            <h2 className="text-xl font-semibold mb-4 text-gray-500">Add Beatmap</h2>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="beatmapId" className="block text-sm font-medium text-gray-700 mb-1">
                                        Beatmap ID
                                    </label>
                                    <input
                                        type="text"
                                        id="beatmapId"
                                        value={beatmapId}
                                        onChange={(e) => setBeatmapId(e.target.value)}
                                        className="w-full p-2 border border-gray-300 font-normal text-xl rounded focus:ring-violet-500 focus:border-violet-500 text-black"
                                        required
                                    />
                                </div>

                                <div className="flex gap-4 mb-6">
                                    <div className="w-1/2">
                                        <label htmlFor="mappoolName" className="block text-sm font-medium text-gray-700 mb-1">
                                            Mappool Name
                                        </label>
                                        <input
                                            type="text"
                                            id="mappoolName"
                                            value={mappoolName}
                                            onChange={(e) => setMappoolName(e.target.value)}
                                            className="w-full p-2 border border-gray-300 font-normal text-xl rounded focus:ring-violet-500 focus:border-violet-500 text-black"
                                            required
                                        />
                                    </div>

                                    <div className="w-1/2">
                                        <label htmlFor="slotName" className="block text-sm font-medium text-gray-700 mb-1">
                                            Slot Name
                                        </label>
                                        <input
                                            type="text"
                                            id="slotName"
                                            value={slotName}
                                            onChange={(e) => setSlotName(e.target.value)}
                                            className="w-full p-2 border border-gray-300 font-normal text-xl rounded focus:ring-violet-500 focus:border-violet-500 text-black"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-center gap-2 w-full h-12">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="text-gray-700 text-2xl bg-gray-200 w-1/2 h-full rounded hover:bg-gray-300 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white text-2xl rounded w-1/2 hover:bg-blue-600 transition-colors"
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
            console.log(mappool);
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