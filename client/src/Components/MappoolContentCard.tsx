import {useEffect, useRef, useState} from "react";
import {MapData} from "./MappoolContent.tsx";
import {MappoolStyle} from "./MappoolContent.tsx";
import { EllipsisVertical } from 'lucide-react';
import {AnimatePresence, motion} from "motion/react";
//good habit
interface Props {
    map: MapData,
    style: MappoolStyle,
    mod: string,
}

export default function MappoolContentCard({map, style, mod}: Props) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Close menu on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
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
    return (
        <div className={'flex w-full items-center relative'}>
        <div key={map.id}
             className={`mappool-content-map-item inset-shadow-2xs inset-shadow-black flex w-full rounded-3xl text-black h-25 font-bold items-center bg-center bg-cover bg-white/70 sm:bg-white/90`}
             style={{
                 backgroundImage: `url('https://assets.ppy.sh/beatmaps/${map.beatmapsetId}/covers/raw.jpg')`,
                 backgroundBlendMode: 'overlay'
             }}>
            <div
                className={`mappool-content-map-item-slot w-1/12 h-full rounded-l-3xl ${style.slotName === "TB" ? 'text-black' : 'text-white'} text-lg lg:text-xl`}
                style={{backgroundColor: style.color}}>
                                        <span
                                            className={'flex items-center justify-center h-full transform -rotate-90'}>{mod}{map.idx + 1}</span>
            </div>
            <img className={`object-cover h-full w-auto sm:flex hidden rounded-r-3xl`}
                 src={`https://assets.ppy.sh/beatmaps/${map.beatmapsetId}/covers/raw.jpg`}
                 alt={'bg'}/>
            <div
                className={`mappool-content-map-item-info flex flex-col w-7/12 h-full px-3 justify-start text-start overflow-hidden`}
            >
                <div
                    className={'mappool-content-map-item-info-name text-lg font-bold truncate inline'}>
                    {map.name}
                </div>
                <div
                    className={`mappool-content-map-item-info-artist  w-full text-xs font-normal truncate ${style.slotName === "TB" ? 'text-black' : ''}`}>
                    {map.artist}
                </div>
                <div
                    className={'mappool-content-map-item-info-mapper flex w-full text-xs font-bold mt-3 truncate'}>
                    {map.difficulty}
                </div>
            </div>
            <div
                className={'mappool-content-map-item-stats w-1/3 bg-black/70 h-full text-xs font-normal rounded-r-3xl grid grid-cols-2 grid-rows-3 py-1 px-3 gap-x-1 '}>
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
            <button
                className="mappool-content-map-item-controller w-1/30 flex items-center justify-center cursor-pointer text-gray-400 hover:text-gray-600 transition duration-200 relative"
                onClick={() => setMenuOpen(v => !v)}
                aria-label="Open map options"
            >
                <EllipsisVertical />
            </button>
            <AnimatePresence>
            {menuOpen && (
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto', transition: {duration: 0.2} }}
                    exit={{ height: 0, transition: {delay: 0.2} }}
                    transition={{ ease: 'easeInOut' }}
                    ref={menuRef}
                    className="absolute -right-12 top-20 z-50 bg-[#0e111a] rounded-lg shadow-lg w-35 flex flex-col animate-fade-in"
                >
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1, delay: 0.2 }}
                        className="px-4 pt-2 pb-1 text-left hover:bg-black w-full text-sm font-bold rounded-t-lg"
                        onClick={() => { setMenuOpen(false); /*onEdit(map);*/ }}
                    >
                        Edit
                    </motion.button>
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: 1,
                            transition: {
                                duration: 0.1, delay: 0.3
                            }
                        }}
                        exit={{ opacity: 0 }}
                        className="px-4 pb-2 pt-1 text-left hover:bg-red-100 text-red-600 w-full font-bold text-sm rounded-b-lg"
                        onClick={() => { setMenuOpen(false); /*onDelete(map)*/ }}
                    >
                        Delete
                    </motion.button>
                </motion.div>
            )}
            </AnimatePresence>
            </div>
    )
}