const apiBase = import.meta.env.VITE_API_BASE_URL;

export const fetchRounds = async (signal: AbortSignal) => {

    try {
        const response = await fetch(`${apiBase}/round`, { signal });
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
        const response = await fetch(`${apiBase}/matches`, { signal });
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
        const response = await fetch(`${apiBase}/maps/all`, { signal });
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
        const response = await fetch(`${apiBase}/players/all`, { signal });
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

interface fetchRescheduleRequestArgs {
    signal: AbortSignal;
    matchId?: number;
    playerRequestId?: number;
    playerRespondId?: number;
    status?: string;
}

export const fetchRescheduleRequests = async ({signal, playerRequestId, playerRespondId, status, matchId}: fetchRescheduleRequestArgs) => {
    try {
        let query = '';
        if (matchId) {
            query += `?matchId=${matchId}`;
        }
        if (playerRequestId) {
            query += `${query ? '&' : '?'}playerRequestId=${playerRequestId}`;
        }
        if (playerRespondId) {
            query += `${query ? '&' : '?'}playerRespondId=${playerRespondId}`;
        }
        if (status) {
            query += `${query ? '&' : '?'}status=${status}`;
        }
        const response = await fetch(`${apiBase}/resch${query}`, {
            signal,
        });
        if (!response.ok) {
            throw new Error('Failed to fetch reschedule requests');
        }
        return await response.json();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
    } catch (error: Error) {
        if (error.name !== 'AbortError') {
            console.error('Error fetching reschedule requests:', error);
        }
        throw error;
    }
}

