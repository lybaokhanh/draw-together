const io = require('socket.io')();
const r = require('rethinkdb');

// opens up a RethinkDB connection
r.connect({
    host: 'localhost',
    port: 28015,
    db: 'drawing_together',
}).then((connection) => {
    io.on('connection', (client) => {
        client.on('subscribeToTimer', (interval) => {
            console.log('client is subscribing to timer with interval', interval);

            // new query to RethinkDB by calling the table method
            r.table('timers')
                .changes()
                .run(connection)
                .then((cursor) => {
                    cursor.each((err, timerRow) => {
                        client.emit('timer', timerRow.new_val.timestamp);
                    })
                });
        });
    });
})

const port = 8000;
io.listen(port);
console.log('listening on port', port);
