const userRoutes = (app, fs) => {

    // variables
    const dataPath = './fakeBackend/userData.json';

    // refactored helper methods
    const readFile = (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
        fs.readFile(filePath, encoding, (err, data) => {
            if (err) {
                throw err;
            }

            callback(returnJson ? JSON.parse(data) : data);
        });
    };

    const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {
        fs.writeFile(filePath, fileData, encoding, (err) => {
            if (err) {
                throw err;
            }

            callback();
        });
    };

    // READ
    app.get('/users', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            res.send(JSON.parse(data));
        });
    });

    // GET SPECIFIC USER
    app.get('/users/:id', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            const userId = req.params["id"];
            const user = JSON.parse(data).find(user => user.id == userId);

            console.log(user);
            res.send(user);
        });
    });

    // CREATE
    app.post('/users', (req, res) => {

        readFile(data => {
                const newUserId = data[data.length-1].id + 1;
                // add the new user
                data.push({id: newUserId, ...req.body});

                writeFile(JSON.stringify(data, null, 2), () => {
                    res.status(200).send('new user added');
                });
            },
            true);
    });

    // UPDATE
    app.put('/users/:id', (req, res) => {

        readFile(data => {

                // add the new user
                const userId = req.params["id"];
                const updatedIndex = data.findIndex(user => user.id === parseInt(userId));
                console.log(userId, updatedIndex);
                data[updatedIndex] = {id: data[updatedIndex].id, ...req.body};
                console.log(data[updatedIndex].id, req.body.id);
                writeFile(JSON.stringify(data, null, 2), () => {
                    res.status(200).send(`users id:${userId} updated`);
                });
            },
            true);
    });

    // DELETE
    app.delete('/users/:id', (req, res) => {

        readFile(data => {

                // add the new user
                const userId = req.params["id"];
                const newData = data.filter(user => user.id != userId)

                writeFile(JSON.stringify(newData, null, 2), () => {
                    res.status(200).send(`users id:${userId} removed`);
                });
            },
             true);
    });
};

module.exports = userRoutes;