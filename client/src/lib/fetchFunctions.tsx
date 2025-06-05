import {useToast} from "../context/ToastContext.tsx";

const HandleError = () => {
    const {showError} = useToast()
    showError('Error fetching data. Please check your internet connection and try again.');
}

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
            HandleError();
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
            HandleError();
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
            HandleError();
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
            HandleError();
        }
        throw error;
    }
}

interface fetchRescheduleRequestArgs {
    signal: AbortSignal;
    matchId?: number;
    playerRequestId?: number;
    playerResponseId?: number;
    status?: string;
}

export const fetchRescheduleRequests = async ({signal, playerRequestId, playerResponseId, status, matchId}: fetchRescheduleRequestArgs) => {
    try {
        let query = '';
        if (matchId) {
            query += `?matchId=${matchId}`;
        }
        if (playerRequestId) {
            query += `${query ? '&' : '?'}playerRequestId=${playerRequestId}`;
        }
        if (playerResponseId) {
            query += `${query ? '&' : '?'}playerResponseId=${playerResponseId}`;
        }
        if (status) {
            query += `${query ? '&' : '?'}status=${status}`;
        }
        const response = await fetch(`http://localhost:3001/api/resch${query}`, {
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
            HandleError();
        }
        throw error;
    }
}

