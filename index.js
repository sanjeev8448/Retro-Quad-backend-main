const app = require('express')();
const { MongoClient } = require('mongodb');
const cors = require('cors');
app.use(cors());
app.use(require("express").json());


const client = new MongoClient("mongodb+srv://pratham:ptnsamnvd1@cluster0.pstblii.mongodb.net/?retryWrites=true&w=majority")
async function run(body = {}) {
    try {
        await client.connect();
        console.log("connected");
        const database = client.db('games');
        const collection = database.collection('users');

        if (body.type === "register") {
            const result = await collection.findOne({ email: body.data.email });
            if (result) {
                return "email already registered";
            } else {
                const newUser = { ...body.data, games: { snake: [], sudoku: [], pacman: [], pong: [] } };
                await collection.insertOne(newUser);
                return ["successful", newUser];
            }
        } else if (body.type === "login") {
            const user = await collection.findOne({ email: body.data.email });
            if (!user) {
                return "no user found with this email address";
            } else {
                if (user.password == body.data.password) {
                    return ["successful", user]
                } else {
                    return "Invalid Password";
                }
            }
        } else if (body.type === "update") {
            const updated = await collection.updateOne({ email: body.data.email }, { $set: { games: body.data.games } });
            console.log(updated.matchedCount, updated.modifiedCount, updated.upsertedCount);
            return "updated";
        } else if (body.type === "fetch") {
            const data = await collection.findOne({ email: body.data.email });
            return data;
        }
    } catch (err) {
        console.log(err.stack);

    } finally {
        await client.close();
        console.log("disconnected")
    }
}

app.post("/register", (req, res) => {
    console.log("register request")
    run(req.body).then((data) => {
        console.log(data)
        res.send(JSON.stringify(data));
    });
});

app.post("/login", (req, res) => {
    console.log("login request")
    run(req.body).then((data) => {
        console.log(data)
        res.send(JSON.stringify(data));
    });
});

app.post("/update", (req, res) => {
    console.log("update request")
    run(req.body).then((data) => {
        console.log(data)
        res.send(JSON.stringify(data));
    });
});

app.post("/fetch", (req, res) => {
    console.log("fetch request")
    run(req.body).then((data) => {
        console.log(data)
        res.send(JSON.stringify(data));
    });
});

app.listen(3001, () => {
    console.log('Listening on port 3001');
});


