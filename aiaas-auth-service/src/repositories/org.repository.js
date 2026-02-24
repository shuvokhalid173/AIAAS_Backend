const { randomUUID } = require('crypto');
const db = require('../infrastructure/mysql.db');

// need type definition for orgData. TS would be better for this. For now, we can just use JSDoc for type hinting.
// name, description, slug, website, logo_url, created_by 
/**
 * @typedef {Object} OrgData
 * @property {string} name - The name of the organization
 * @property {string} description - A brief description of the organization
 * @property {string} slug - A URL-friendly identifier for the organization
 * @property {string} website - The website URL of the organization
 * @property {string} logo_url - The URL of the organization's logo
 * @property {string} created_by - The user ID of the creator of the organization
 */

/**
 * Inserts a new organization into the database.
 * @param {OrgData} orgData - The data for the new organization
 * @returns {Promise<Object>} The result of the insert operation
 */

async function insertOrg(orgData) {
    const { name, description, slug, website, logo_url, created_by } = orgData;
    const connection = await db.getConnection();

    // check the user exists in auth_users table
    const [users] = await connection.query(
        'SELECT * FROM auth_users WHERE id = ? LIMIT 1',
        [created_by]
    );

    if (users.length === 0) {
        connection.release();
        throw new Error('User not found');
    }

    if (users[0].status !== 'active') {
        connection.release();
        throw new Error('User is not active');
    }

    await connection.beginTransaction();
    
    try {
        const orgId = randomUUID();

        // insert org data into auth_orgs table
        await connection.query(
            'INSERT INTO auth_orgs (id, name, description, slug, website, logo_url, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [orgId, name, description, slug, website, logo_url, created_by]
        );

        // insert into auth_orgs_users pivot table
        await connection.query(
            'INSERT INTO auth_orgs_users (org_id, user_id) VALUES (?, ?)',
            [orgId, created_by]
        );

        await connection.commit();

        return { id: orgId, ...orgData };
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
}

// list all orgs for a user
async function listOrgsForUser(userId) {
    try {
        const [rows] = await db.query(
            `
            SELECT o.id, o.name, o.description, o.slug, o.website, o.logo_url
            FROM auth_orgs o
            JOIN auth_orgs_users ou ON o.id = ou.org_id
            WHERE ou.user_id = ?    
            `,
            [userId]
        );
        return rows;
    } catch (err) {
        throw err;
    }
}

module.exports = {
  insertOrg,
  listOrgsForUser,
};