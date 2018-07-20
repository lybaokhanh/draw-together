import openSocket from 'socket.io-client';
import Rx from 'rxjs/Rx';

const port = parseInt(window.location.search.replace('?', ''), 10) || 8000;
const socket = openSocket(`http://localhost:${port}`);

function subscribeToDrawings(cb) {
    socket.on('drawing', cb);
    socket.emit('subscribeToDrawings');
}

function createDrawing(name) {
    socket.emit('createDrawing', { name });
}

function publishLine({ drawingId, line }) {
    socket.emit('publishLine', { drawingId, ...line });
}

/*
    * using Rxjs because instead of calling back on the callback function for each event, we will batch it up and callback on it with array of lines
*/
function subscribeToDrawingLines(drawingId, cb) {
    /*
        * return the observable that will send through an item everytime the event fires
        * first params: to subscribe to the event and make the RxJS observable the handler
    */
    const lineStream = Rx.Observable.fromEventPattern(
        handler => socket.on(`drawingLine:${drawingId}`, handler),
        handler => socket.off(`drawingLine:${drawingId}`, handler),
    );

    const bufferedTimeStream = lineStream.bufferTime(100)
        .map(lines => ({ lines }));

    const reconnectStream = Rx.Observable.fromEventPattern(
        handler => socket.on('connect', handler),
        handler => socket.off('connect', handler)
    );

    const maxStream = lineStream.map(l => new Date(l.timestamp).getTime())
        .scan((a, b) => Math.max(a, b), 0);

    reconnectStream.withLatestFrom(maxStream)
        .subscribe((joined) => {
            const lastReceivedTimestamp = joined[1];
            socket.emit('subscribeToDrawingLines', {
                drawingId,
                from: lastReceivedTimestamp,
            });
        });

    bufferedTimeStream.subscribe(linesEvent => cb(linesEvent));
    socket.emit('subscribeToDrawingLines', { drawingId });
}

function subscribeToconnectionEvent(cb) {
    socket.on('connect', () => cb({
        state: 'connected',
        port,
    }));
    socket.on('disconnect', () => cb({
        state: 'disconnected',
        port,
    }));
    socket.on('connect_error', () => cb({
        state: 'disconnected',
        port,
    }));
}

export {
    createDrawing,
    subscribeToDrawings,
    publishLine,
    subscribeToDrawingLines,
    subscribeToconnectionEvent,
};
