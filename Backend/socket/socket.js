const { Server } = require('socket.io');

const userModel = require('../models/user.model');
const captainModel = require('../models/captain.model');
const rideModel = require('../models/ride.model');

let io;

/*
 * Socket Flow (jaisa maanga tha):
 * Captain/User connect -> 'join' emit karta hai apni id + type ke saath
 * -> hum uski latest socketId DB me save kar dete hain.
 *
 * IMPORTANT: socketId permanent nahi hoti — refresh / internet reconnect /
 * dubara login par nayi socket.id milti hai. Isliye client ko HAR baar
 * connect hone par 'join' emit karna chahiye, taaki DB me socketId hamesha
 * latest rahe.
 *
 * Captain "Go Online" ke baad watchPosition() se milne wali har location
 * 'update-location-captain' event se yahan aati hai aur seedha
 * captain.model.location me overwrite ho jaati hai — koi history store
 * nahi hoti, sirf current point.
 */
function initializeSocket(server) {
    // BUG FIX: `socketIO` was never defined/imported — only `{ Server }` was
    // imported above. Must instantiate with `new Server(...)`.
    io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        socket.on('join', async ({ userId, userType }) => {
            try {
                if (!userId || !userType) return;

                if (userType === 'user') {
                    await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
                } else if (userType === 'captain') {
                    await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
                }
                console.log(`[socket debug] ${userType} ${userId} joined with socketId=${socket.id}`);
            } catch (err) {
                console.error('Socket join error:', err.message);
            }
        });

        // Captain -> continuous live location while online
        socket.on('update-location-captain', async ({ userId, location }) => {
            try {
                if (!userId || !location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
                    return;
                }
                await captainModel.findByIdAndUpdate(userId, { location });

                // Agar is captain ki koi ride abhi 'accepted' (pickup ki taraf jaa raha)
                // ya 'ongoing' (destination ki taraf jaa raha) hai, to us ride ke
                // passenger ko bhi live location bhejo — isi se rider ke map par
                // captain->pickup phir pickup->destination route/remaining-distance
                // live update hota hai.
                const activeRide = await rideModel
                    .findOne({ captain: userId, status: { $in: ['accepted', 'ongoing'] } })
                    .populate('user', 'socketId');

                if (activeRide?.user?.socketId) {
                    io.to(activeRide.user.socketId).emit('captain-location', {
                        rideId: activeRide._id,
                        location,
                    });
                }
            } catch (err) {
                console.error('Socket location update error:', err.message);
            }
        });

        socket.on('disconnect', async () => {
            console.log(`Socket disconnected: ${socket.id}`);
            // BUG FIX: previously only an explicit "Go Offline" click set
            // status='inactive'. If a captain just closes the tab, loses
            // internet, or the app crashes, their status stayed 'active'
            // forever with a stale location — so they kept showing up as
            // "online nearby" even though they were long gone. Now, whoever
            // still holds this exact socketId gets flipped offline too.
            try {
                await captainModel.updateOne({ socketId: socket.id }, { status: 'inactive' });
            } catch (err) {
                console.error('Socket disconnect cleanup error:', err.message);
            }
        });
    });

    return io;
}

/* Used by ride.controller.js to push events (new-ride, ride-accepted, etc.)
   to a specific connected client by their saved socketId. */
function sendMessageToSocketId(socketId, messageObject) {
    if (!io) {
        console.log('Socket.io not initialized.');
        return;
    }
    io.to(socketId).emit(messageObject.event, messageObject.data);
}

module.exports = { initializeSocket, sendMessageToSocketId };