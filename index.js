const express = require("express");
const http = require('http');
const app = express()
const server = http.createServer(app);
const io = require('socket.io')(8800, {
    cors: {
        origin: "https://rentify-70183.web.app"
    }
})


let activeUsers = []
io.on("connection", (socket) => {
    // add new user
    socket.on('new-user-add', (newUserId) => {
        if (!activeUsers.some((user) => user.Id === newUserId)) {
            activeUsers.push({
                userId: newUserId,
                socketId: socket.id
            })
        }
        // console.log("connect users", activeUsers);
        io.emit("get-users", activeUsers)
    })

    socket.on("send-message", (data) => {
        const { receiverId } = data;
        const user = activeUsers.find((user) => user.userId === receiverId)
        console.log("sending receiverId :", receiverId)
        console.log("data", data)
        if (user) {
            io.emit("receive-message", data);
        }
    })

    socket.on("disconnect", () => {
        activeUsers = activeUsers.filter((user) => user.socketId !== socket.id)
        // console.log("user disconnect", activeUsers);
        io.emit("get-users", activeUsers)
    })
})

// app.get("/", (req, res) => {
//     res.send("Socket server is running");
// });


// const express = require("express");
// const app = express();
// const cors = require("cors");
// require("dotenv").config();
// const port = process.env.PORT || 8800;
// const io = require('socket.io')({
//     cors: {
//         origin: "http://localhost:5173"
//     }
// })

// // comment update
// // middlewares
// app.use(cors());
// app.use(express.json());


// async function run() {
//     try {
//         //coded by Sojib

//         let activeUsers = []
//         io.on("connection", (socket) => {
//             // add new user
//             socket.on('new-user-add', (newUserId) => {
//                 if (!activeUsers.some((user) => user.Id === newUserId)) {
//                     activeUsers.push({
//                         userId: newUserId,
//                         socketId: socket.id
//                     })
//                 }
//                 // console.log("connect users", activeUsers);
//                 io.emit("get-users", activeUsers)
//             })

//             socket.on("send-message", (data) => {
//                 const { receiverId } = data;
//                 const user = activeUsers.find((user) => user.userId === receiverId)
//                 console.log("sending receiverId :", receiverId)
//                 console.log("data", data)
//                 if (user) {
//                     io.emit("receive-message", data);
//                 }
//             })

//             socket.on("disconnect", () => {
//                 activeUsers = activeUsers.filter((user) => user.socketId !== socket.id)
//                 // console.log("user disconnect", activeUsers);
//                 io.emit("get-users", activeUsers)
//             })
//         })


//         // Connect the client to the server	(optional starting in v4.7)
//         // await client.connect();
//         // Send a ping to confirm a successful connection
//         // await client.db("admin").command({ ping: 1 });
//         // console.log(
//         //     "Pinged your deployment. You successfully connected to MongoDB!"
//         // );
//     } finally {
//         //   // Ensures that the client will close when you finish/error
//         //   await client.close();
//     }
// }

// run().catch(console.dir);

// app.get("/", (req, res) => {
//     res.send("Socket.io server is running file(index.js) v-0.1");
// });

// app.listen(port, () => {
//     console.log(`Socket.io server server is running on port ${port} file(index.js) v-0.1`);
// })