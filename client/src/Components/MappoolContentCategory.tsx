import {motion} from "motion/react";
import MappoolContentCard from "./MappoolContentCard.tsx";
import {PoolData} from "./MappoolContent.tsx";
import {MappoolStyle} from "./MappoolContent.tsx";
import { useContext} from "react";
import {MappoolContext} from "../context/MappoolContext.tsx";

interface Props {
    style: MappoolStyle,
    index: number,
}

const hidden = {opacity: 0, x: 0}
const enter = {opacity: 1, x: 0, y: 0}
const exit = {opacity: 0, x: 0}

export default function MappoolContentCategory({style, index}: Props) {
    const { mappool: mappoolData } = useContext(MappoolContext);
    return (
        <motion.div key={style.name}
                    initial={hidden}
                    animate={enter}
                    exit={exit}
                    transition={{ delay: index*0.15 }}>
            <div
                className={'mappool-content-style flex w-full mt-5 rounded-3xl p-4 font-bold items-center h-12'}
                style={{backgroundColor: style.color, color: style.textColor}}>
                <div className={`mappool-content-style-name w-1/2 ${style.slotName === 'TB' ? 'text-black' : 'text-white'}`}>
                    {style.name}
                </div>
                {/*<div className={'expand-button w-1/2 text-right'}>
                            <button className={'bg-gray-900/20 rounded-lg p-1'}>Expand</button>
                        </div>*/}
            </div>
            <motion.div className={'mappool-content-map-container w-full flex mt-2 gap-4 justify-center px-1 lg:px-4 mt-5'}>
                <div className={'mappool-content-map-left-line w-[10px] h-auto rounded-full hidden lg:flex'}
                     style={{backgroundColor: style.color}}/>
                <div className={'mappool-content-map-data flex flex-col gap-4 w-full'}>
                    {Object.keys(mappoolData ?? {})?.map((mod) => {
                        return mappoolData[mod as keyof PoolData]?.map((map) => {
                            return mod === style.slotName && <MappoolContentCard map={map} style={style} mod={mod}/>
                        })
                    })}
                </div>
            </motion.div>
        </motion.div>
    )
}