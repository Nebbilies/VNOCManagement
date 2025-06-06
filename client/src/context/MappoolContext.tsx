import {createContext} from "react";
import {PoolData} from "../Components/MappoolContent.tsx";

export type MappoolContextType = {
    mappool: PoolData;
    currentRound: string;
    refresh: boolean;
    setRefresh: (refresh: boolean) => void;
};

export const MappoolContext = createContext<MappoolContextType>({
    mappool: { DT: [], HD: [], HR: [], NM: [], TB: [] },
    currentRound: '',
    refresh: false,
    setRefresh: () => {},
});


