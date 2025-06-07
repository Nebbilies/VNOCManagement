import {createContext} from "react";
import {RoundInfo} from "../Components/Mappool/MappoolComponent.tsx";
import {ReactSelectOptions, RescheduleRequest} from "../Components/Matches/MatchesComponent.tsx";

export type MatchesContextType =  {
    playerOptions: ReactSelectOptions[];
    roundsList: RoundInfo[];
    setRefresh: (refresh: boolean) => void;
    rescheduleRequests: RescheduleRequest[];
}

export const MatchesContext = createContext<MatchesContextType>({
    playerOptions: [],
    roundsList: [],
    setRefresh: () => {},
    rescheduleRequests: []
});