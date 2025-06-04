import {createContext} from "react";
import {RoundInfo} from "../Components/MappoolComponent.tsx";
import {ReactSelectOptions} from "../Components/MatchesComponent.tsx";

export type MatchesContextType =  {
    playerOptions: ReactSelectOptions[];
    roundsList: RoundInfo[];
    setRefresh: (refresh: boolean) => void;
}

export const MatchesContext = createContext<MatchesContextType>({
    playerOptions: [],
    roundsList: [],
    setRefresh: () => {},
});