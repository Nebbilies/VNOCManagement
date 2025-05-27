import { Ban, Check } from 'lucide-react';

const dummyRescheduleRequestsList = [
    {
        Id: 1,
        PlayerRequest: {
            id: 10635981,
            username: "- Nebby -",
            globalRanking: 2903,
            status: "QUALIFIED"
        },
        PlayerRespond: {
            id: 7696512,
            username: "Hoaq",
            globalRanking: 2903,
            status: "QUALIFIED"
        },
        MatchId: 1,
        Status: "PENDING",
        Reason: "I have a scheduling conflict on the original date.",
        NewTime: "2025-12-13 14:00:00"
    },
    {
        Id: 2,
        PlayerRequest: {
            id: 12561202,
            username: "TKieen",
            globalRanking: 29038,
            status: "QUALIFIED"
        },
        PlayerRespond: {
            id: 14047619,
            username: "Zeigler",
            globalRanking: 831,
            status: "QUALIFIED"
        },
        MatchId: 2,
        Status: "APPROVED",
        Reason: "I have a scheduling conflict on the original date.",
        NewTime: "2025-12-13 14:00:00"
    },
    {
        Id: 3,
        PlayerRequest: {
            id: 10635981,
            username: "- Nebby -",
            globalRanking: 2903,
            status: "QUALIFIED"
        },
        PlayerRespond: {
            id: 7696512,
            username: "Hoaq",
            globalRanking: 2903,
            status: "QUALIFIED"
        },
        MatchId: 1,
        Status: "REJECTED",
        Reason: "I have a scheduling conflict on the original date.",
        NewTime: "2025-12-13 14:00:00"
    }
]

interface Props {
    closeMainModal: () => void;
    openMainModal: () => void;
}

export function RescheduleRequestsModal({ closeMainModal, openMainModal }: Props) {
    const handleApprove = (requestId) => {

    }
    const handleReject = (requestId) => {

    }
    return (
        <>
            <div className={'flex-col w-full  lg:w-1/2 bg-[#23263a] p-6 rounded-lg shadow-2xl'}>
                <h2 className="text-xl font-semibold mb-4 text-white text-center">Reschedule Requests</h2>
                <div
                    className={'rounds-list flex flex-col rounded-md bg-[#1b1d2e] w-full h-60 overflow-y-scroll items-center'}>
                    {dummyRescheduleRequestsList.map((resRequest, index) => (
                        <div
                            key={resRequest.Id}
                            className="flex items-center justify-between w-full p-4 border-b border-gray-700 hover:bg-[#2c2f45] transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="text-lg font-semibold text-white">
                                    Match ID: {resRequest.MatchId}
                                </div>
                                <div className="text-sm text-gray-400">
                                    <span className={'font-bold'}>{resRequest.PlayerRequest.username}</span> requested a reschedule
                                </div>
                            </div>
                            <div className={'control-buttons flex items-center gap-2'}>
                                <button
                                    onClick={() => {
                                        // Handle approve action
                                        handleApprove(resRequest.Id)
                                        // Refresh list when done

                                    }}
                                    className="text-green-500 hover:text-green-700 hover:bg-[#1b1d2e] transition-colors p-1 rounded-md cursor-pointer"
                                    aria-label="Approve Request">
                                    <Check className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => {
                                        // Handle reject action
                                        handleReject(resRequest.Id)
                                        // Refresh list when done

                                    }}
                                    className="text-red-500 hover:text-red-700 hover:bg-[#1b1d2e] transition-colors p-1 rounded-md cursor-pointer"
                                    aria-label="Reject Request">
                                    <Ban className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}