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

async function isUserMemberOfOrg(userId, orgId) {
    try {
        // check user is a member of that organization
        const [users] = await db.query(
            'SELECT * FROM auth_orgs_users WHERE user_id = ? AND org_id = ? LIMIT 1',
            [userId, orgId]
        );

        if (users.length === 0) {
            throw new Error('User is not a member of that organization');
        }

        return true;
    } catch (err) {
        throw err;
    }
}

async function initializeRolesAndPermissionsForNewlyCreatedOrg(orgId, createdBy) {
    // I'll perform db operation here now. Later I'll use a separate repository file for this for db abstraction  
    const connection = await db.getConnection();

    // fetch all permissions (provided by aiaas platform) which are not specific to any aiaas_service
    const [permissions] = await connection.query(
        'SELECT id, name FROM auth_permissions WHERE aiaas_service_id IS NULL'
    );

    await connection.beginTransaction();

    try {
        // fist step: create role Org_Owner into auth_roles table
        const roleId = randomUUID();
        await connection.query(
            'INSERT INTO auth_roles (id, name, description, auth_orgs_id) VALUES (?, ?, ?, ?)',
            [roleId, 'Owner', 'Owner of the organization', orgId]
        );
        
        // second step: assign this role to the creator of the organization
        const userRoleId = randomUUID();
        await connection.query(
            'INSERT INTO auth_user_roles (id, auth_user_id, auth_role_id, auth_org_id ) VALUES (?, ?, ?, ?)',
            [userRoleId, createdBy, roleId, orgId]
        );

        // third step: assign the permissions (fetched previously) to the newly created role
        for (const permission of permissions) {
            const rolePermissionId = randomUUID();
            await connection.query(
                'INSERT INTO auth_roles_permissions (id, auth_roles_id, auth_permissions_id, auth_orgs_id) VALUES (?, ?, ?, ?)',
                [rolePermissionId, roleId, permission.id, orgId]
            );
        }
        
        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

module.exports = {
  insertOrg,
  listOrgsForUser,
  isUserMemberOfOrg,
  initializeRolesAndPermissionsForNewlyCreatedOrg,
};