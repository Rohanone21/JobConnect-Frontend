const io = require("socket.io")(5000, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const users = {};   // userId -> socketId
const admins = {};  // adminId -> socketId

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  socket.on("register-user", (userId) => {
    users[userId] = socket.id;
  });

  socket.on("register-admin", (adminId) => {
    admins[adminId] = socket.id;
  });

  // Admin calls user
  socket.on("admin-call-user", ({ adminId, userId, offer }) => {
    const userSocket = users[userId];
    if (userSocket) {
      io.to(userSocket).emit("incoming-call", {
        adminId,
        offer
      });
    }
  });

  // User answers admin
  socket.on("user-answer-call", ({ adminId, answer }) => {
    const adminSocket = admins[adminId];
    if (adminSocket) {
      io.to(adminSocket).emit("call-answered", { answer });
    }
  });

  // ICE candidates
  socket.on("ice-candidate", ({ targetId, candidate }) => {
    const targetSocket =
      users[targetId] || admins[targetId];

    if (targetSocket) {
      io.to(targetSocket).emit("ice-candidate", { candidate });
    }
  });

  socket.on("disconnect", () => {
    Object.keys(users).forEach(k => users[k] === socket.id && delete users[k]);
    Object.keys(admins).forEach(k => admins[k] === socket.id && delete admins[k]);
  });
});
