import {Match} from "./MatchesComponent.tsx";
import {AnimatePresence, motion} from "motion/react";
import horizontal_line from "../../assets/horizontal_line.png";
import RescheduleButton from "./Manage/RescheduleButton.tsx";
import {EditMatchButton} from "./EditMatchButton.tsx";
import {DeleteMatchButton} from "./DeleteMatchButton.tsx";
import {Staff} from "../Staff/StaffComponent.tsx";
import {StaffRole} from "./MatchesStaff.tsx";
import {ClaimMatchButton} from "./ClaimMatchButton.tsx";
import {useUser} from "../../context/UserContext.tsx";
import {useState} from "react";
import {UnclaimMatchButton} from "./UnclaimMatchButton.tsx";

interface Props {
    match: Match;
    index: number;
}

type groupedStaff = {
    COMMENTATOR: Staff[];
    REFEREE: Staff[];
    STREAMER: Staff[];
}

const hidden = {opacity: 0, x: 0, y: -30}
const enter = {opacity: 1, x: 0, y: 0}
const exit = {opacity: 0, x: 0, y: -30}

function MatchesContent({match, index}: Props) {
    const [hovering, setHovering] = useState(false);
    const {user} = useUser();
    let userRole: string = "";
    let userId: number = 0;
    if (user) {
        userRole = user.role;
        userId = user.id;
    }
    let claimed = false;
    if (match.staff) {
        claimed = match.staff.some(staffMember => staffMember.Id === userId);
    }
    const processStaffData = (staffArray: Staff[]) => {
        const groupedStaff: groupedStaff = {
            COMMENTATOR: [],
            REFEREE: [],
            STREAMER: []
        };
        staffArray.forEach(member => {
            if (member.Role === "COMMENTATOR") {
                groupedStaff.COMMENTATOR.push(member);
            } else if (member.Role === "REFEREE") {
                groupedStaff.REFEREE.push(member);
            } else if (member.Role === "STREAMER") {
                groupedStaff.STREAMER.push(member);
            }
        });

        return groupedStaff;
    };
    const matchDate = match.time.split("T")[0];
    const matchTime = match.time.split("T")[1].split(":").slice(0, 2).join(":");
    const staffByRole = processStaffData(match.staff);
    return (
                    <motion.div key={match.id} className={"match-card flex flex-col items-center mb-12 h-auto "}
                                initial={hidden}
                                animate={enter}
                                exit={exit}
                                transition={{ type: "spring", duration: 1, ease: "easeInOut", delay: index * 0.15 }}>
                        <div className={`match-card-id w-30 rounded-t-xl bg-[#b65959] text-black text-center align-middle px-1 py-0.7 flex items-center justify-center relative`}>
                            {(match.matchLink !== "" && match.matchLink !== null ? (
                                <a href={match.matchLink || undefined} target="_blank" rel="noopener noreferrer"
                                   className={'absolute top-0 left-0 w-full h-full z-10'}></a>
                            ) : null)}
                            <span className={"text-md font-bold text-[#3d1515]"}>Match {match.id}</span>
                        </div>
                        <div className={`match-card-info flex mt-0 bg-[#353d60] justify-between rounded-t-xl w-full items-center h-30 relative ${match.status === 'FINISHED' ? 'border-t-3 border-x-3 border-green-300/80' : ''}`}
                            onMouseEnter={() => setHovering(true)}
                            onMouseLeave={() => setHovering(false)}
                        >
                            <div
                                className={`match-card-player-1 w-3/10 flex rounded-xl bg-[#131724] ml-4 my-4 items-center relative ${match.player1.Id === userId ? 'border-2 border-yellow-300' : ''}`}>
                                {hovering && match.status === 'FINISHED' ? (
                                    <AnimatePresence>
                                        <motion.div
                                            className="absolute top-0 left-0 w-full h-full bg-black/90 rounded-xl text-3xl flex items-center justify-center"
                                            initial={{opacity: 0}}
                                            animate={{opacity: 1}}
                                            exit={{opacity: 0}}
                                            transition={{duration: 0.2}}
                                        >
                                            <span className={`${match.player1Score > match.player2Score ? 'text-red-600' : "text-blue-600"} font-semibold`}>
                                                {match.player1Score}
                                            </span>
                                        </motion.div>
                                    </AnimatePresence>
                                ) : null}
                                    <img alt="player avatar" src={`https://a.ppy.sh/${match.player1.Id}`}
                                         className={"h-20 w-auto aspect-square rounded-xl hidden md:flex"}/>
                                <div className={`player-1-info flex flex-col w-full py-1 px-2 text-start truncate inline overflow-hidden`}>
                                    <div className={'font-extrabold text-2xl lg:text-3xl inline'}>
                                        {match.player1.Username}
                                    </div>
                                    <h3 className={'lg:text-2xl text-lg font-bold text-start text-[#71747c]'}>
                                        #{match.player1.Rank}
                                    </h3>
                                </div>
                            </div>
                            <div className={"font-bold flex flex-col justify-center w-3/10"}>
                                <div className={'hidden lg:flex w-full h-1/2 justify-center items-center gap-4'}>
                                    <div className="text-xl font-semibold">{matchDate}</div>
                                    <div className="text-xl font-bold text-red-400">{matchTime}</div>
                                </div>
                                <div className={'flex flex-col lg:hidden w-full h-1/2 justify-center items-center -gap-0.5'}>
                                    <div className="text-lg font-semibold">{matchDate}</div>
                                    <div className="text-lg font-bold text-red-400">{matchTime}</div>
                                </div>
                                <img src={horizontal_line} alt={'horizontal line'} className={'opacity-50'}/>
                                <div className={'controllers flex w-full h-1/2 justify-center items-center gap-4 mt-1'}>
                                    {userId === match.player1.Id || userId === match.player2.Id ? (
                                        <RescheduleButton matchId={match.id}/>
                                    ) : null}
                                    {userRole === "ADMIN" || userRole === "REFEREE" ? (
                                        <>
                                            <EditMatchButton currentMatch={match}/>
                                            <DeleteMatchButton matchId={match.id}/>
                                        </>
                                    ) : null}
                                    {(userRole === "REFEREE" || userRole === "ADMIN" || userRole === "COMMENTATOR" || userRole === "STREAMER") && !claimed ? (
                                        <ClaimMatchButton matchId={match.id}/>
                                    ): null}
                                    {claimed ? (
                                        <UnclaimMatchButton matchId={match.id}/>
                                    ) : null}
                                </div>
                            </div>
                            <div
                                className={`match-card-player-2 w-3/10 flex rounded-xl bg-[#131724] mr-4 my-4 items-center relative ${match.player2.Id === userId ? 'border-2 border-yellow-300' : ''}`}>
                                {hovering && match.status === 'FINISHED' ? (
                                    <AnimatePresence>
                                        <motion.div
                                            className="absolute top-0 left-0 w-full h-full bg-black/90 rounded-xl text-3xl flex items-center justify-center"
                                            initial={{opacity: 0}}
                                            animate={{opacity: 1}}
                                            exit={{opacity: 0}}
                                            transition={{duration: 0.2}}
                                        >
                                            <span className={`${match.player2Score > match.player1Score ? 'text-red-600' : "text-blue-600"} font-semibold`}>
                                                {match.player2Score}
                                            </span>
                                        </motion.div>
                                    </AnimatePresence>
                                ) : null}
                                <div
                                    className={`player-2-info flex flex-col w-full text-end py-1 px-2 overflow-hidden `}>
                                    <div
                                        className={"text-2xl lg:text-3xl font-bold truncate inline "}>
                                        {match.player2.Username}
                                    </div>
                                    <h3 className={'lg:text-2xl text-lg font-bold text-[#71747c]'}>
                                        #{match.player2.Rank}
                                    </h3>
                                </div>
                                <img alt="player avatar" src={`https://a.ppy.sh/${match.player2.Id}`}
                                     className={"h-20 w-auto aspect-square rounded-[10px] hidden md:flex"}/>
                            </div>
                        </div>
                        {/* Staff Section */}
                        <div className={`staff-section w-full bg-[#2a2f45] rounded-b-xl px-6 py-4 ${match.status === 'FINISHED' ? 'border-b-3 border-x-3 border-green-300/80' : ''}`}>
                            <div className="flex justify-center items-start gap-8 lg:gap-12">
                                {/* Commentators */}
                                {staffByRole.COMMENTATOR.length > 0 && (
                                    <StaffRole
                                        title="Commentator"
                                        members={staffByRole.COMMENTATOR}
                                    />
                                )}

                                {/* Referee */}
                                {staffByRole.REFEREE.length > 0 && (
                                    <StaffRole
                                        title="Referee"
                                        members={staffByRole.REFEREE}
                                    />
                                )}

                                {/* Streamer */}
                                {staffByRole.STREAMER.length > 0 && (
                                    <StaffRole
                                        title="Streamer"
                                        members={staffByRole.STREAMER}
                                    />
                                )}
                            </div>
                        </div>
                    </motion.div>
    )
}

export default MatchesContent;