// abstract mysql logic for aiaas_services table
const db = require('../infrastructure/mysql.db');

async function getAiaasServiceById(id) {
    const [rows] = await db.query('SELECT * FROM aiaas_services WHERE id = ?', [id]);
    return rows[0];
}

// get all aiaas services
async function getAllAiaasServices() {
    const [rows] = await db.query('SELECT * FROM aiaas_services');
    return rows;
}

module.exports = {
    getAiaasServiceById,
    getAllAiaasServices
};