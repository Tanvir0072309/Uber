const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectToDb = require('./db/db.js');
const userRoutes = require('./routes/user.routes.js');
const captainRoutes = require('./routes/captain.routes.js');
const rideRoutes = require('./routes/ride.routes.js');

connectToDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Hello weorld !!');
});

app.use('/users', userRoutes);
app.use('/captains', captainRoutes);
// BUG FIX: ride.routes.js existed but was never mounted, so every
// /rides/... request was hitting the 404 fallback (or, worse, the error
// handler below, since nothing before it ever called next()).
app.use('/rides', rideRoutes);

// Error handler MUST come after all routes — Express only reaches this
// once next(err) is called from something registered before it.
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err.message);
    console.error(err.stack);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
});

module.exports = app;