class WebSockets {

    connection(client) {
        let users = [];

        const addUser = (userId, socketId) => {
            !users.some((user) => user.userId === userId) &&
                users.push({ userId, socketId });
        };

        const removeUser = (socketId) => {
            users = users.filter((user) => user.socketId !== socketId);
        };

        const getUser = (userId) => {
            return users.find((user) => user.userId === userId);
        };

        //when ceonnect
        console.log("a user connected.");

        //take userId and socketId from user
        client.on("addUser", (userId) => {
            addUser(userId, client.id);
            console.log("client.id: ", client.id)
            client.emit("getUsers", users);
        });

        //send and get message
        client.on("sendMessage", ({ senderId, receiverId, text }) => {
            const user = getUser(receiverId);
            console.log("user.socketId: ", user.socketId)
            client.to(user.socketId).emit("getMessage", {
                senderId,
                text,
            });
        });

        //when disconnect
        client.on("disconnect", () => {
            console.log("a user disconnected!");
            removeUser(client.id);
            client.emit("getUsers", users);
        });

        // event fired when the chat room is disconnected
        // client.on("disconnect", () => {
        //   this.users = this.users.filter((user) => user.socketId !== client.id);
        // });
        // // add identity of user mapped to the socket id
        // client.on("identity", (userId) => {
        //   this.users.push({
        //     socketId: client.id,
        //     userId: userId,
        //   });
        // });
        // // subscribe person to chat & other user as well
        // client.on("subscribe", (room, otherUserId = "") => {
        //   this.subscribeOtherUser(room, otherUserId);
        //   client.join(room);
        // });
        // // mute a chat room
        // client.on("unsubscribe", (room) => {
        //   client.leave(room);
        // });
    }

    // subscribeOtherUser(room, otherUserId) {
    //     const userSockets = this.users.filter(
    //         (user) => user.userId === otherUserId
    //     );
    //     userSockets.map((userInfo) => {
    //         const socketConn = global.io.sockets.connected(userInfo.socketId);
    //         if (socketConn) {
    //             socketConn.join(room);
    //         }
    //     });
    // }
}

export default new WebSockets();