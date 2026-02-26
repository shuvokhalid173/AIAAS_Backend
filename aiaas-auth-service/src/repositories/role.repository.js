const { randomUUID } = require('crypto');
const db = require('../infrastructure/mysql.db');

// create role
async function createRole(role) {
    const { name, description, orgId} = role;
    const id = randomUUID();
    const query = `INSERT INTO auth_roles (id, name, description, auth_orgs_id) VALUES (?, ?, ?, ?)`
    const [result] = await db.query(query, [id, name, description, orgId]);
    return result;
}

// update role
async function updateRole(role) {
    const { id, name, description, orgId} = role;
    const query = `UPDATE auth_roles SET name = ?, description = ?, auth_orgs_id = ? WHERE id = ?`
    const [result] = await db.query(query, [name, description, orgId, id]);
    return result;
}

// delete role
async function deleteRole(role) {
    const { id } = role;
    const query = `DELETE FROM auth_roles WHERE id = ?`
    const [result] = await db.query(query, [id]);
    return result;
}

// get role by id
async function getRoleById(role) {
    const { id } = role;
    const query = `SELECT * FROM auth_roles WHERE id = ?`
    const [result] = await db.query(query, [id]);
    return result;
}

// get role by name
async function getRoleByName(role) {
    const { name } = role;
    const query = `SELECT * FROM auth_roles WHERE name = ?`
    const [result] = await db.query(query, [name]);
    return result;
}

// get role by org id
async function getRoleByOrgId(role) {
    const { orgId } = role;
    const query = `SELECT * FROM auth_roles WHERE auth_orgs_id = ?`
    const [result] = await db.query(query, [orgId]);
    return result;
}

// get all roles
async function getAllRoles() {
    const query = `SELECT * FROM auth_roles`
    const [result] = await db.query(query);
    return result;
}

// assign permissions to a specific role
async function assignPermissionsToRole(role) {
    const { roleId, permissionIds } = role;
    const query = `INSERT INTO auth_roles_permissions (auth_roles_id, auth_permissions_id) VALUES (?, ?)`
    const [result] = await db.query(query, [roleId, permissionIds]);
    return result;
}

// remove permissions from a specific role
async function removePermissionsFromRole(role) {
    const { roleId, permissionIds } = role;
    const query = `DELETE FROM auth_roles_permissions WHERE auth_roles_id = ? AND auth_permissions_id = ?`
    const [result] = await db.query(query, [roleId, permissionIds]);
    return result;
}

// get permissions of a specific role
async function getPermissionsOfRole(role) {
    const { roleId } = role;
    const query = `SELECT auth_permissions.id, auth_permissions.aiaas_service_id, auth_permissions.name, auth_permissions.description FROM auth_roles_permissions JOIN auth_permissions ON auth_roles_permissions.auth_permissions_id = auth_permissions.id WHERE auth_roles_permissions.auth_roles_id = ?`;
    const [result] = await db.query(query, [roleId]);
    return result;
}

module.exports = {
    createRole,
    updateRole,
    deleteRole,
    getRoleById,
    getRoleByName,
    getRoleByOrgId,
    getAllRoles
}


