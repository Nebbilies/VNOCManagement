import {MatchData} from "./MatchesComponent.tsx";
import {motion} from "motion/react";
import horizontal_line from "../assets/horizontal_line.png";
import RescheduleButton from "./RescheduleButton.tsx";
import {EditMatchButton} from "./EditMatchButton.tsx";
import {DeleteMatchButton} from "./DeleteMatchButton.tsx";

interface Props {
    matchesData: MatchData
}

const hidden = {opacity: 0, x: 0, y: -30}
const enter = {opacity: 1, x: 0, y: 0}
const exit = {opacity: 0, x: 0, y: -30}

function MatchesContent({matchesData}: Props) {
    return (
        <div className={"matches-content flex flex-col w-full h-auto bg-gray-900/20 rounded-lg"}>
            <div className={"matches-list flex flex-col w-full h-auto rounded-lg p-0 md:p-5"}>
                {matchesData.map((match, index) => (
                    <motion.div key={match.id} className={"match-card flex flex-col items-center mb-12 h-auto"}
                                initial={hidden}
                                animate={enter}
                                exit={exit}
                                transition={{ type: "spring", duration: 1, ease: "easeInOut", delay: index * 0.15 }}>
                        <div className={`match-card-id w-30 rounded-t-xl bg-[#b65959] text-black text-center align-middle px-1 py-0.7`}>
                            <span className={"text-md font-bold text-[#3d1515]"}>Match {match.id}</span>
                        </div>
                        <div className={`match-card-info flex mt-0 bg-[#353d60] justify-between rounded-xl w-full items-center`}>
                            <div className={`match-card-player-1 w-3/10 flex rounded-xl bg-[#131724] ml-4 my-4 items-center`}>
                                    <img alt="player avatar" src={`https://a.ppy.sh/${match.players[0].id}`}
                                         className={"h-20 w-auto aspect-square rounded-xl hidden md:flex"}/>
                                <div className={'player-1-info flex flex-col w-full py-1 px-2 text-start truncate inline overflow-hidden'}>
                                    <div className={'font-extrabold text-2xl lg:text-3xl inline'}>
                                        {match.players[0].Username}
                                    </div>
                                    <h3 className={'lg:text-2xl text-lg font-bold text-start text-[#71747c]'}>
                                        #{match.players[0].Rank}
                                    </h3>
                                </div>
                            </div>
                            <div className={"font-bold flex flex-col justify-center w-3/10"}>
                                <div className={'hidden lg:flex w-full h-1/2 justify-center items-center gap-4'}>
                                    <div className="text-xl font-semibold">{match.date}</div>
                                    <div className="text-xl font-bold text-red-400">{match.time}</div>
                                </div>
                                <div className={'flex flex-col lg:hidden w-full h-1/2 justify-center items-center -gap-0.5'}>
                                    <div className="text-lg font-semibold">{match.date}</div>
                                    <div className="text-lg font-bold text-red-400">{match.time}</div>
                                </div>
                                <img src={horizontal_line} alt={'horizontal line'} className={'opacity-50'}/>
                                <div className={'controllers flex w-full h-1/2 justify-center items-center gap-4 mt-1'}>
                                    {/*localStorage.playerId = player1.id or player2.id?*/}
                                    <RescheduleButton/>
                                    <EditMatchButton currentMatch={match}/>
                                    <DeleteMatchButton matchId={match.id}/>
                                </div>
                            </div>
                            <div
                                className={`match-card-player-2 w-3/10 flex rounded-xl bg-[#131724] mr-4 my-4 items-center`}>
                                <div
                                    className={'player-2-info flex flex-col w-full text-end py-1 px-2'}>
                                    <div
                                        className={"text-2xl lg:text-3xl font-bold truncate inline overflow-hidden"}>
                                        {match.players[1].Username}
                                    </div>
                                    <h3 className={'lg:text-2xl text-lg font-bold text-[#71747c]'}>
                                        #{match.players[1].Rank}
                                    </h3>
                                </div>
                                <img alt="player avatar" src={`https://a.ppy.sh/${match.players[1].Id}`}
                                     className={"h-20 w-auto aspect-square rounded-xl hidden md:flex"}/>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default MatchesContent;