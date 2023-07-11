import axios from "axios";
import { getAccessToken } from "../services/user.service";
import { useEffect, useState } from "react";

//call the api to get the list of online games
export const getOnlineGames = async () => {
    const token = await getAccessToken();
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const { data } = await axios.get("http://localhost:8000/api/games", config);
    return data;
}

//create a component for online users to create a game room and join a game room
export function GameRoom() {
    //get the list of online games
    const [games, setGames] = useState([]);
    useEffect(() => {
        const getGames = async () => {
            const games = await getOnlineGames();
            setGames(games);
        }
        getGames();
    }
        , []);
    
    //create a game room
    const createGame = async () => {
        const token = await getAccessToken();
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const { data } = await axios.post("http://localhost:8000/api/games", {}, config);
        console.log(data);
    }

    //join a game room
    const joinGame = async (gameId: string) => {
        const token = await getAccessToken();
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const { data } = await axios.post(`http://localhost:8000/api/games/${gameId}/join`, {}, config);
        console.log(data);
    }

    return (
        <div>
            <button onClick={createGame}>Create Game</button>
            <div>
                {games.map((game: any) => {
                    return (
                        <div key={game.id}>
                            <h1>{game.id}</h1>
                            <button onClick={() => joinGame(game.id)}>Join Game</button>
                        </div>
                    )
                })}
            </div>
        </div>
    )   
}

//create a component for offline users to play the game
export function GamePlay() {
    return (
        <div>
            <h1>GamePlay</h1>
        </div>
    )
}

//create a component to switch between online and offline mode
export function Game() {
    const [online, setOnline] = useState(true);
    if (online === false) {
        //offline mode
        return (
            <GamePlay />
        )
    } else {
        return (
            //online mode
            <GameRoom />
        )
    }
}

//create a component to wrap the Game component
export const GamePage: React.FC = () => {
    return (
        <div>
            <Game />
        </div>
    )
}

export default GamePage;

// Path: src\pages\Game.tsx
// Compare this snippet from src\pages\Game.tsx:
// "use client";

