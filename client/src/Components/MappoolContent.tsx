import {useContext, useEffect, useState} from "react";
import MappoolContentCategory from "./MappoolContentCategory.tsx";
import {mappoolStyle} from "../lib/mappoolStyle.tsx";
import {MappoolContext} from "../context/MappoolContext.tsx";

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
    const mappoolData = useContext(MappoolContext);
    const [mappoolIsEmpty, setMappoolIsEmpty] = useState(false);
    const isMappoolEmpty = (mappool: PoolData): boolean => {
        return Object.values(mappool).every(category => category.length === 0);
    };
    useEffect(() => {
        if (isMappoolEmpty(mappoolData)) {
            setMappoolIsEmpty(true);
        } else {
            setMappoolIsEmpty(false);
        }
    }, [mappoolData]);
    return (
        <div className={"mappool-content flex flex-col w-full mt-5"}>
            {mappoolIsEmpty ? (
                <div className="flex flex-col w-full justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24">
                        <circle cx="18" cy="12" r="0" fill="currentColor">
                            <animate attributeName="r" begin=".67" calcMode="spline" dur="1.5s"
                                     keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                                     repeatCount="indefinite" values="0;2;0;0"/>
                        </circle>
                        <circle cx="12" cy="12" r="0" fill="currentColor">
                            <animate attributeName="r" begin=".33" calcMode="spline" dur="1.5s"
                                     keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                                     repeatCount="indefinite" values="0;2;0;0"/>
                        </circle>
                        <circle cx="6" cy="12" r="0" fill="currentColor">
                            <animate attributeName="r" begin="0" calcMode="spline" dur="1.5s"
                                     keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                                     repeatCount="indefinite" values="0;2;0;0"/>
                        </circle>
                    </svg>
                    <span className={`font-bold text-3xl text-center italic`}>
                        Loading...
                    </span>
                </div>
            ) : (
                mappoolStyle.map((style, index) => (
                        <MappoolContentCategory style={style} index={index} key={style.slotName}/>
                    )
                ))}
        </div>
    )
}

export default MappoolContent;
