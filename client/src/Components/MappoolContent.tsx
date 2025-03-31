import {motion} from "motion/react";
import MappoolContentCard from "./MappoolContentCard.tsx";
import MappoolContentCategory from "./MappoolContentCategory.tsx";
import {mappoolStyle} from "../lib/mappoolStyle.tsx";

export interface MappoolStyle {
    name: string,
    color: string,
    textColor: string,
    slotName: string,
    gradientVariants: string,
}

export interface PoolData {
    NM: MapData[],
    HD: MapData[],
    HR: MapData[],
    DT: MapData[],
    TB: MapData[],
}

export interface MapData {
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

function MappoolContent() {
    return (
        <div className={"mappool-content flex flex-col w-full mt-5"}>
            {mappoolStyle.map((style, index) => (
                <MappoolContentCategory style={style} index={index} key={style.slotName}/>
            ))}
        </div>
    )
}

export default MappoolContent;
