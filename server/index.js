const io = require('socket.io')();
const r = require('rethinkdb');

function createDrawings({ connection, name }) {
    return r.table('drawings')
        .insert({
            name,
            timestamp: new Date(),
        })
        .run(connection)
        .then(() => console.log('created a drawing with ' + name));
}

function subscribeToDrawings({ client, connection }) {
    r.table('drawings')
        .changes({ include_initial: true }) // when execute query call back to us for each row that is already present that matches your query
        .run(connection)
        .then((cursor) => {
            cursor.each((err, drawingRow) => client.emit('drawing',
                drawingRow.new_val
            ))
        });
}

function handleLinePublish({ connection, line }) {
    console.log('saving line to the db');
    r.table('lines')
        .insert(Object.assign(line, { timestamp: new Date() }))
        .run(connection);
}

/*
    * row: check the specific field  
    * eq: equal with value    
*/
function subscribeToDrawingLines({ client, connection, drawingId }) {
    return r.table('lines')
        .filter(r.row('drawingId').eq(drawingId))
        .changes({ include_initial: true })
        .run(connection)
        .then((cursor) => {
            cursor.each((err, lineRow) => client.emit(
                `drawingLine:${drawingId}`,
                lineRow.new_val
            ))
        })
}

// opens up a RethinkDB connection
r.connect({
    host: 'localhost',
    port: 28015,
    db: 'drawing_together',
}).then((connection) => {
    io.on('connection', (client) => {
        client.on('createDrawing', ({ name }) => {
            createDrawings({ connection, name });
        });

        client.on('subscribeToDrawings', () => subscribeToDrawings({
            client,
            connection
        }));

        client.on('publishLine', (line) => handleLinePublish({
            connection,
            line
        }));

        client.on('subscribeToDrawingLines', (drawingId) => subscribeToDrawingLines({
            client,
            connection,
            drawingId
        }));
    });
})

const port = parseInt(process.argv[2], 10) || 8000;
io.listen(port);
console.log('listening on port', port);
