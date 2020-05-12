const spicedPg = require("spiced-pg");
var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/socialnetwork"
);
// Register a new user.
module.exports.addNewUser = (first, last, email, password) => {
    return db.query(
        `INSERT INTO users (first, last, email, password) 
        VALUES ($1, $2, $3, $4) RETURNING id;`,
        [first, last, email, password]
    );
};
// Verify a user is already registered.
module.exports.verify = (email) => {
    return db.query(`SELECT * FROM users WHERE email = $1;`, [email]);
};

// Add reset password code.
module.exports.addResetCode = (email, code) => {
    return db.query(
        `INSERT INTO reset_codes(email, code) 
        VALUES ($1, $2);`,
        [email, code]
    );
};

// Get the most recent reset code associated with the given address.
module.exports.verifyResetCode = (email) => {
    return db.query(
        `SELECT * FROM reset_codes 
        WHERE (CURRENT_TIMESTAMP - timestamp < INTERVAL '10 minutes') 
        AND (email = $1) ORDER BY id DESC LIMIT 1;`,
        [email]
    );
};

// Update password upon verification of the reset code.
module.exports.updatePassword = (email, password) => {
    return db.query(
        `
    UPDATE users 
    SET password = $2 
    WHERE email = $1;`,
        [email, password]
    );
};

// Update password upon verification of the reset code.
module.exports.getUserInfo = (id) => {
    return db.query(
        `
    SELECT * 
    FROM users 
    WHERE id = $1;`,
        [id]
    );
};

module.exports.addUserPhoto = (id, image_url) => {
    return db.query(
        `
    UPDATE users 
    SET image_url = $2 
    WHERE id = $1;`,
        [id, image_url]
    );
};

module.exports.addUserBio = (id, bioText) => {
    return db.query(
        `
    UPDATE users 
    SET bio = $2 
    WHERE id = $1
    RETURNING bio, id;`,
        [id, bioText]
    );
};

module.exports.getAllUserIds = () => {
    return db.query(
        `SELECT id 
        FROM users;
    `
    );
};

module.exports.getRecentUsers = () => {
    return db.query(
        `SELECT * FROM users 
        ORDER BY id DESC 
        LIMIT 3;
    `
    );
};

module.exports.getMatchingUsers = (val) => {
    return db.query(
        `SELECT * FROM users 
        WHERE first 
        ILIKE $1;`,
        [val + "%"]
    );
};
module.exports.getFriendStatus = (receiver_id, sender_id) => {
    return db.query(
        `SELECT * FROM friendships 
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1);`,
        [receiver_id, sender_id]
    );
};

module.exports.sendFriendRequest = (receiver_id, sender_id) => {
    return db.query(
        `INSERT INTO friendships (receiver_id, sender_id) 
        VALUES ($1, $2) RETURNING *;`,
        [receiver_id, sender_id]
    );
};

module.exports.acceptFriend = (receiver_id, sender_id) => {
    return db.query(
        `UPDATE friendships SET accepted = TRUE 
        WHERE (receiver_id = $1 AND sender_id = $2) 
        OR (receiver_id = $2 AND sender_id = $1);`,
        [receiver_id, sender_id]
    );
};

module.exports.unfriend = (receiver_id, sender_id) => {
    return db.query(
        `DELETE FROM friendships WHERE 
        (receiver_id = $1 AND sender_id = $2) 
        OR (receiver_id = $2 AND sender_id = $1);`,
        [receiver_id, sender_id]
    );
};
