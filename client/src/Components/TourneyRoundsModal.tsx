import {useState} from "react";
import {motion} from "motion/react";

interface Props {
    openAddRoundModal: () => void
    hideMainModal: () => void
}

const dummyRoundsList = [
    {
        round: "Round of 16",
        acronym: "RO16",
    },
    {
        round: "Quarter Finals",
        acronym: "QF",
    },
    {
        round: "Semi Finals",
        acronym: "SF",
    },
    {
        round: "Finals",
        acronym: "F",
    },
    {
        round: "Grand Finals",
        acronym: "GF",
    },
]

export function TourneyRoundsModal({ openAddRoundModal, hideMainModal }: Props) {
    return (
        <>
            <div className="flex-col w-full lg:w-1/2 bg-[#23263a] p-6 rounded-lg shadow-2xl">
                <h2 className="text-xl font-semibold mb-4 text-white text-center">Tourney Rounds</h2>
                <div className={'rounds-list flex flex-col rounded-md bg-[#1b1d2e] w-full h-60 overflow-y-scroll items-center'}>
                    {dummyRoundsList.map((round, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between w-full p-4 border-b border-gray-700 hover:bg-[#2c2f45] transition-colors"
                        >
                            <span className="text-white text-lg font-bold">{round.round}</span>
                            <span className="text-gray-400 text-sm font-semibold">{round.acronym}</span>
                        </div>
                    ))}
                </div>
                <button className={'w-full cursor-pointer bg-green-500 hover:bg-green-600 mt-4 rounded-md p-2 font-bold text-xl transition-color duration-300'} onClick={() => {
                    openAddRoundModal()
                    hideMainModal()
                }}>
                    Add Round
                </button>
            </div>
        </>
    );
}