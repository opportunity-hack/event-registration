import { HubConnectionBuilder } from '@aspnet/signalr';

export async function getSignalRConnection(state, url) {
    if (state.connection === null || !state.isConnected) {
        try {
            var connection = new HubConnectionBuilder()
                .withUrl(url)
                .build();
            await connection.start();
            console.log('Connected to SignalR!');
            connection.onclose(() => {
                alert('Connection with SignalR has closed.');
            });
            return connection;
        }
        catch (error) {
            console.error(error);
            setTimeout(() => getSignalRConnection(state, url), 5000);
        }
    }
    return state.connection;
};

export function storeSignalRConnection(connection) {
    return dispath => {
        dispath({
            type: 'STORE_CONNECTION',
            payload: connection
        });
    }
}