import {createContext} from "react";
import {PoolData} from "../Components/MappoolContent.tsx";

export const MappoolContext = createContext<PoolData>({DT: [], HD: [], HR: [], NM: [], TB: []})