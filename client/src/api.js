import openSocket from 'socket.io-client';
import Rx from 'rxjs/Rx';

const socket = openSocket('http://localhost:8000');

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

    bufferedTimeStream.subscribe(linesEvent => cb(linesEvent));
    socket.emit('subscribeToDrawingLines', drawingId);
}

export {
    createDrawing,
    subscribeToDrawings,
    publishLine,
    subscribeToDrawingLines,
};
