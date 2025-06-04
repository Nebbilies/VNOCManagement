
export const fetchRounds = async (signal: AbortSignal) => {

    try {
        const response = await fetch('http://localhost:3001/api/round', { signal });
        if (!response.ok) {
            throw new Error('Failed to fetch round');
        }
        return await response.json();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
    } catch (error: Error) {
        if (error.name !== 'AbortError') {
            console.error('Error fetching round:', error);
        }
        throw error;
    }
}

export const fetchMatches = async (signal: AbortSignal) => {
    try {
        const response = await fetch('http://localhost:3001/api/matches', { signal });
        if (!response.ok) {
            throw new Error('Failed to fetch matches');
        }
        return await response.json();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
    } catch (error: Error) {
        if (error.name !== 'AbortError') {
            console.error('Error fetching round:', error);
        }
        throw error;
    }
}

export const fetchMappool = async (signal: AbortSignal) => {
    try {
        const response = await fetch('http://localhost:3001/api/maps/all', { signal });
        if (!response.ok) {
            throw new Error('Failed to fetch mappool');
        }
        return await response.json();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
    } catch (error: Error) {
        if (error.name !== 'AbortError') {
            console.error('Error fetching mappool:', error);
        }
        throw error;
    }
}

export const fetchPlayers = async (signal: AbortSignal) => {
    try {
        const response = await fetch('http://localhost:3001/api/players/all', { signal });
        if (!response.ok) {
            throw new Error('Failed to fetch players');
        }
        return await response.json();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
    } catch (error: Error) {
        if (error.name !== 'AbortError') {
            console.error('Error fetching players:', error);
        }
        throw error;
    }
}

