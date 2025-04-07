import {MatchData} from "./MatchesComponent.tsx";
import {motion} from "motion/react";

interface Props {
    matchesData: MatchData
}

const hidden = {opacity: 0, x: 0, y: -30}
const enter = {opacity: 1, x: 0, y: 0}
const exit = {opacity: 0, x: 0, y: -30}

const DateDisplay = ({ date }: { date: Date }) => {
    // Format the date
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    const formattedHours = (hours % 12 || 12).toString().padStart(2, '0'); // Convert 0 to 12
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return (
        <div className="text-white text-center p-4 rounded-md">
            <div className="text-2xl font-semibold">{`${day}th ${month}`}</div>
            <div className="text-3xl font-bold mt-2">{`${formattedHours}:${formattedMinutes} ${period}`}</div>
        </div>
    );
};

function MatchesContent({matchesData}: Props) {
    return (
        <div className={"matches-content flex flex-col w-full h-auto bg-gray-900/20 rounded-lg p-5"}>
            <div className={"matches-list flex flex-col w-full h-auto rounded-lg p-0 md:p-5"}>
                {matchesData.matches.map((match, index) => (
                    <motion.div key={match.id} className={"match-card flex flex-col items-center mb-12 h-auto"}
                                initial={hidden}
                                animate={enter}
                                exit={exit}
                                transition={{ type: "spring", duration: 1, ease: "easeInOut", delay: index * 0.15 }}>
                        <div className={`match-card-id w-30 rounded-t-xl bg-[#b65959] text-black text-center align-middle px-1 py-0.7`}>
                            <span className={"text-md font-bold text-[#3d1515]"}>Match {match.id}</span>
                        </div>
                        <div className={`match-card-info flex mt-0 bg-[#353d60] justify-between rounded-xl w-full items-center`}>
                            <div className={`match-card-player-1 w-3/10 flex rounded-xl bg-[#131724] ml-4 my-4`}>
                                    <img alt="player avatar" src={`https://a.ppy.sh/${Object.entries(match.players)[0][0]}`}
                                         className={"h-20 w-auto aspect-square rounded-xl hidden md:flex"}/>
                                <div className={'player-1-info flex flex-col justify-center py-1 px-2'}>
                                    <h2 className={'font-extrabold text-2xl lg:text-3xl text-start'}>
                                        {Object.entries(match.players)[0][1].username}
                                    </h2>
                                    <h3 className={'lg:text-2xl text-lg font-bold text-start text-[#71747c]'}>
                                        #{Object.entries(match.players)[0][1].globalRanking}
                                    </h3>
                                </div>
                            </div>
                            <h2 className={"text-3xl font-bold"}>{DateDisplay({date: new Date(match.date * 1000)})}</h2>
                            <div className={`match-card-player-2 w-3/10 flex rounded-xl bg-[#131724] mr-4 my-4 justify-between items-center`}>
                                <div
                                    className={'player-2-info flex flex-col w-full text-end py-1 px-2 truncate inline overflow-hidden'}>
                                    <div
                                        className={"text-3xl font-bold"}>
                                        {Object.entries(match.players)[1][1].username}
                                    </div>
                                    <h3 className={'text-2xl font-bold text-[#71747c]'}>
                                        #{Object.entries(match.players)[1][1].globalRanking}
                                    </h3>
                                </div>
                                <img alt="player avatar" src={`https://a.ppy.sh/${Object.entries(match.players)[1][0]}`}
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