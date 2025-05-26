// import React, { useEffect, useState } from "react";
// import PlayersGrid from "./PlayersGrid";

// export type Player = {
//   id: string;
//   username: string;
//   globalRanking: number;
//   avatar_url?: string;
//   profile_url?: string;
// };

// export type playerData = Record<
//   string,
//   {
//     username: string;
//     globalRanking: number;
//     avatar_url: string;
//     profile_url: string;
//   }
// >;

// interface NewPlayer {
//   id: string;
//   username: string;
//   globalRanking: number;
//   avatar_url?: string;
//   profile_url?: string;
// }




// const rawPlayerData: Record<
//   string,
//   {
//     username: string;
//     globalRanking: number;
//   }
// > = {
//   "10635981": {
//     username: "- Nebby -",
//     globalRanking: 2903,
//   },
//   "12931959": {
//     username: "aaa",
//     globalRanking: 2903,
//   },
//   "12931932": {
//     username: "aab",
//     globalRanking: 29038,
//   },
//   "12931238": {
//     username: "baba",
//     globalRanking: 831,
//   },
//   "13489359": {
//     username: "Nick",
//     globalRanking: 2109831,
//   },
//   "12930293": {
//     username: "Ben",
//     globalRanking: 299831,
//   },
//   "12931483": {
//     username: "Rachel",
//     globalRanking: 29831,
//   },
//   "2": {
//     username: "peppy",
//     globalRanking: 2903,
//   },
//   "3": {
//     username: "Dean Herbert",
//     globalRanking: 21,
//   },
//   "4452992": {
//     username: "Astra",
//     globalRanking: 2903,
//   },
//   "854439": {
//     username: "Hoang",
//     globalRanking: 2903,
//   },
//   "1200123": {
//     username: "Vivian",
//     globalRanking: 29038,
//   },
//   "1212138": {
//     username: "Kiana",
//     globalRanking: 831,
//   },
//   "9587896": {
//     username: "Herta",
//     globalRanking: 2109831,
//   },
//   "1121532": {
//     username: "a",
//     globalRanking: 299831,
//   },
//   "1071483": {
//     username: "Salt",
//     globalRanking: 29831,
//   },
//   "11149940": {
//     username: "Acid",
//     globalRanking: 2903,
//   },
//   "968942": {
//     username: "Belle",
//     globalRanking: 21,
//   },
// };

// // Tạo dữ liệu có avatar_url và profile_url
// const defaultPlayerData: playerData = {
//   "10635981": {
//     username: "- Nebby -",
//     globalRanking: 2903,
//     avatar_url: "https://a.ppy.sh/10635981",
//     profile_url: "https://osu.ppy.sh/users/10635981",
//   },
//   "12931959": {
//     username: "aaa",
//     globalRanking: 2903,
//     avatar_url: "https://a.ppy.sh/12931959",
//     profile_url: "https://osu.ppy.sh/users/12931959",
//   },
//   "12931932": {
//     username: "aab",
//     globalRanking: 29038,
//     avatar_url: "https://a.ppy.sh/12931932",
//     profile_url: "https://osu.ppy.sh/users/12931932",
//   },
//   "12931238": {
//     username: "baba",
//     globalRanking: 831,
//     avatar_url: "https://a.ppy.sh/12931238",
//     profile_url: "https://osu.ppy.sh/users/12931238",
//   },
//   "13489359": {
//     username: "Nick",
//     globalRanking: 2109831,
//     avatar_url: "https://a.ppy.sh/13489359",
//     profile_url: "https://osu.ppy.sh/users/13489359",
//   },
//   "12930293": {
//     username: "Ben",
//     globalRanking: 299831,
//     avatar_url: "https://a.ppy.sh/12930293",
//     profile_url: "https://osu.ppy.sh/users/12930293",
//   },
//   "12931483": {
//     username: "Rachel",
//     globalRanking: 29831,
//     avatar_url: "https://a.ppy.sh/12931483",
//     profile_url: "https://osu.ppy.sh/users/12931483",
//   },
//   "2": {
//     username: "peppy",
//     globalRanking: 2903,
//     avatar_url: "https://a.ppy.sh/2",
//     profile_url: "https://osu.ppy.sh/users/2",
//   },
//   "3": {
//     username: "Dean Herbert",
//     globalRanking: 21,
//     avatar_url: "https://a.ppy.sh/3",
//     profile_url: "https://osu.ppy.sh/users/3",
//   },

// };

// type ApiPlayer = {
//   id: number;
//   username: string;
//   avatar_url: string;
// };

// type ApiResponse = {
//   message: string;
//   player?: ApiPlayer;
//   players?: playerData; // nếu API trả về nhiều player
// };

// type PlayersComponentProps = {
//   newPlayer?: NewPlayer;
// };
// function convertApiPlayerToPlayer(apiPlayer: ApiPlayer): Player {
//   return {
//     id: apiPlayer.id.toString(),
//     username: apiPlayer.username,
//     globalRanking: 0, // API không có ranking, tạm đặt 0
//     avatar_url: apiPlayer.avatar_url,
//     profile_url: `https://osu.ppy.sh/users/${apiPlayer.id}`,
//   };
// }

// function PlayersComponent({ newPlayer }: PlayersComponentProps) {
//   const [playerSearch, setPlayerSearch] = useState("");
//   const [players, setPlayers] = useState<playerData>(defaultPlayerData);
//   const [filteredPlayerData, setFilteredPlayerData] = useState<playerData>(defaultPlayerData);

//   useEffect(() => {
//     async function fetchPlayers() {
//       try {
//         const res = await fetch("/api/players");
//         if (!res.ok) {
//           console.warn("Không tìm thấy API /api/players, dùng dữ liệu mặc định");
//           return;
//         }

//         const data: ApiResponse = await res.json();

//         if (data.players) {
//           // Nếu API trả về danh sách nhiều player
//           setPlayers(data.players);
//           setFilteredPlayerData(data.players);
//         } else if (data.player) {
//           // Nếu API trả về 1 player duy nhất (vd: player đã đăng ký)
//           const p = convertApiPlayerToPlayer(data.player);
//           setPlayers((prev) => ({
//             ...prev,
//             [p.id]: {
//               username: p.username,
//               globalRanking: p.globalRanking,
//               avatar_url: p.avatar_url ?? `https://a.ppy.sh/${p.id}`,
//               profile_url: p.profile_url ?? `https://osu.ppy.sh/users/${p.id}`,
//             },
//           }));
//           setFilteredPlayerData((prev) => ({
//             ...prev,
//             [p.id]: {
//               username: p.username,
//               globalRanking: p.globalRanking,
//               avatar_url: p.avatar_url ?? `https://a.ppy.sh/${p.id}`,
//               profile_url: p.profile_url ?? `https://osu.ppy.sh/users/${p.id}`,
//             },
//           }));
//         }
//       } catch (err) {
//         console.error("Lỗi khi fetch danh sách người chơi:", err);
//       }
//     }

//     fetchPlayers();
//   }, []);

//   // Thêm player mới từ prop newPlayer (nếu có)
//   useEffect(() => {
//     if (newPlayer) {
//       setPlayers((prevPlayers) => {
//         if (prevPlayers[newPlayer.id]) return prevPlayers; // không thêm nếu đã tồn tại
//         return {
//           ...prevPlayers,
//           [newPlayer.id]: {
//             username: newPlayer.username,
//             globalRanking: newPlayer.globalRanking,
//             avatar_url: newPlayer.avatar_url ?? `https://a.ppy.sh/${newPlayer.id}`,
//             profile_url: newPlayer.profile_url ?? `https://osu.ppy.sh/users/${newPlayer.id}`,
//           },
//         };
//       });
//     }
//   }, [newPlayer]);

//   // Lọc theo search
//   useEffect(() => {
//     const filteredData = Object.fromEntries(
//       Object.entries(players).filter(([_, player]) =>
//         player.username.toLowerCase().includes(playerSearch.toLowerCase())
//       )
//     );
//     setFilteredPlayerData(filteredData);
//   }, [playerSearch, players]);

//   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setPlayerSearch(event.target.value);
//   };

//   return (
//     <div
//       className={
//         "mappool-container flex flex-col items-center max-w-screen h-auto px-4 lg:px-8 " +
//         "mt-40 mb-20 pt-10 pb-10 md:mx-12 lg:mx-28 xl:mx-40 mx-4 self-center text-white bg-gray-900/50 rounded-3xl"
//       }
//     >
//       <div
//         className={
//           "mappool-header flex flex-col w-full lg:text-5xl md:text-4xl text-3xl font-black items-center justify-center"
//         }
//       >
//         <div className={"mappool-header-text w-full italic text-center"}> DANH SÁCH NGƯỜI CHƠI </div>
//         <div className={"mappool-search-form w-full text-center mt-3"}>
//           <input
//             type="text"
//             placeholder={"Search..."}
//             value={playerSearch}
//             onChange={handleSearchChange}
//             className={
//               "bg-gray-900/80 rounded-lg p-2 text-lg font-medium text-white placeholder:text-gray-400 border-3 border-[#353d60] rounded-[5px]"
//             }
//           />
//         </div>
//       </div>
//       <div className={"h-1 w-1/2 border-2 border-white rounded-2xl mt-10"}></div>
//       <PlayersGrid playerData={filteredPlayerData} />
//     </div>
//   );
// }

// export default PlayersComponent;
import React, { useEffect, useState } from "react";
import PlayersGrid from "./PlayersGrid";

export type Player = {
    id: string;
    username: string;
    globalRanking: number;
    avatar_url?: string;
    profile_url?: string;
};

export type playerData = Record<
    string,
    {
        username: string;
        globalRanking: number;
        avatar_url: string;
        profile_url: string;
    }
>;
interface Props {
    newPlayer?: Player | null;
}


const defaultPlayerData: playerData = {
    "10635981": {
        username: "- Nebby -",
        globalRanking: 2903,
        avatar_url: "https://a.ppy.sh/10635981",
        profile_url: "https://osu.ppy.sh/users/10635981",
    },
    "12931959": {
        username: "aaa",
        globalRanking: 2903,
        avatar_url: "https://a.ppy.sh/12931959",
        profile_url: "https://osu.ppy.sh/users/12931959",
    },
    "12931932": {
        username: "aab",
        globalRanking: 29038,
        avatar_url: "https://a.ppy.sh/12931932",
        profile_url: "https://osu.ppy.sh/users/12931932",
    },
    "12931238": {
        username: "baba",
        globalRanking: 831,
        avatar_url: "https://a.ppy.sh/12931238",
        profile_url: "https://osu.ppy.sh/users/12931238",
    },
    "13489359": {
        username: "Nick",
        globalRanking: 2109831,
        avatar_url: "https://a.ppy.sh/13489359",
        profile_url: "https://osu.ppy.sh/users/13489359",
    },
    "12930293": {
        username: "Ben",
        globalRanking: 299831,
        avatar_url: "https://a.ppy.sh/12930293",
        profile_url: "https://osu.ppy.sh/users/12930293",
    },
    "12931483": {
        username: "Rachel",
        globalRanking: 29831,
        avatar_url: "https://a.ppy.sh/12931483",
        profile_url: "https://osu.ppy.sh/users/12931483",
    },
    "2": {
        username: "peppy",
        globalRanking: 2903,
        avatar_url: "https://a.ppy.sh/2",
        profile_url: "https://osu.ppy.sh/users/2",
    },
    "3": {
        username: "Dean Herbert",
        globalRanking: 21,
        avatar_url: "https://a.ppy.sh/3",
        profile_url: "https://osu.ppy.sh/users/3",
    },
};
function PlayersComponent({ newPlayer }: Props) {
    const [playerSearch, setPlayerSearch] = useState("");
    const [players, setPlayers] = useState<playerData>(defaultPlayerData);
    const [filteredPlayerData, setFilteredPlayerData] = useState<playerData>(defaultPlayerData);

    // Nếu có newPlayer mới truyền vào, thêm vào players
    useEffect(() => {
        if (!newPlayer) return;
        setPlayers((prev) => {
            if (prev[newPlayer.id]) return prev; // đã có thì không thêm
            return {
                ...prev,
                [newPlayer.id]: {
                    username: newPlayer.username,
                    globalRanking: newPlayer.globalRanking,
                    avatar_url: newPlayer.avatar_url || `https://a.ppy.sh/${newPlayer.id}`,
                    profile_url: newPlayer.profile_url || `https://osu.ppy.sh/users/${newPlayer.id}`,
                },
            };
        });
    }, [newPlayer]);

    // Filter khi tìm kiếm
    useEffect(() => {
        const filtered = Object.fromEntries(
            Object.entries(players).filter(([_, p]) =>
                p.username.toLowerCase().includes(playerSearch.toLowerCase())
            )
        );
        setFilteredPlayerData(filtered);
    }, [playerSearch, players]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPlayerSearch(event.target.value);
    };

    // Lắng nghe event newPlayerRegistered từ localStorage (nếu bạn vẫn cần)
    useEffect(() => {
        const handleNewPlayer = () => {
            const newPlayerString = localStorage.getItem("newPlayer");
            if (!newPlayerString) return;

            try {
                const parsed: Player = JSON.parse(newPlayerString);
                const id = parsed.id?.toString();

                if (!id || !parsed.username) return;

                setPlayers((prev) => {
                    if (prev[id]) return prev;
                    return {
                        ...prev,
                        [id]: {
                            username: parsed.username,
                            globalRanking: parsed.globalRanking || 0,
                            avatar_url: parsed.avatar_url || `https://a.ppy.sh/${id}`,
                            profile_url: `https://osu.ppy.sh/users/${id}`,
                        },
                    };
                });
            } catch (err) {
                console.warn("❌ Dữ liệu newPlayer không hợp lệ:", err);
            }
        };

        window.addEventListener("newPlayerRegistered", handleNewPlayer);
        handleNewPlayer();

        return () => {
            window.removeEventListener("newPlayerRegistered", handleNewPlayer);
        };
    }, []);

    return (
        <div
            className={
                "mappool-container flex flex-col items-center max-w-screen h-auto px-4 lg:px-8 " +
                "mt-40 mb-20 pt-10 pb-10 md:mx-12 lg:mx-28 xl:mx-40 mx-4 self-center text-white bg-gray-900/50 rounded-3xl"
            }
        >
            <div className="mappool-header flex flex-col w-full lg:text-5xl md:text-4xl text-3xl font-black items-center justify-center">
                <div className="mappool-header-text w-full italic text-center">
                    DANH SÁCH NGƯỜI CHƠI
                </div>
                <div className="mappool-search-form w-full text-center mt-3">
                    <input
                        type="text"
                        placeholder={"Search..."}
                        value={playerSearch}
                        onChange={handleSearchChange}
                        className="bg-gray-900/80 rounded-lg p-2 text-lg font-medium text-white placeholder:text-gray-400 border-3 border-[#353d60] rounded-[5px]"
                    />
                </div>
            </div>
            <div className="h-1 w-1/2 border-2 border-white rounded-2xl mt-10"></div>
            <PlayersGrid playerData={filteredPlayerData} newPlayer={newPlayer} />
        </div>
    );
}

export default PlayersComponent;
