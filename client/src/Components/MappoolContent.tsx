import {useContext, useEffect, useState} from "react";
import MappoolContentCategory from "./MappoolContentCategory.tsx";
import {mappoolStyle} from "../lib/mappoolStyle.tsx";
import {MappoolContext} from "../context/MappoolContext.tsx";
import {Loading} from "./Loading.tsx";

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


function MappoolContent() {
    const {mappool} = useContext(MappoolContext);
    const [mappoolIsEmpty, setMappoolIsEmpty] = useState(false);
    const isMappoolEmpty = (mappool: PoolData): boolean => {
        return Object.values(mappool).every(category => category.length === 0);
    };
    useEffect(() => {
        if (isMappoolEmpty(mappool)) {
            setMappoolIsEmpty(true);
        } else {
            setMappoolIsEmpty(false);
        }
    }, [mappool]);
    return (
        <div className={"mappool-content flex flex-col w-full mt-5"}>
            {mappoolIsEmpty ? (
                <Loading/>
            ) : (
                mappoolStyle.map((style, index) => (
                        <MappoolContentCategory style={style} index={index} key={style.slotName}/>
                    )
                ))}
        </div>
    )
}

export default MappoolContent;
