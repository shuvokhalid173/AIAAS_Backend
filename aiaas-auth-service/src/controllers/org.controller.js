const orgService = require('../services/org.service');

async function createOrg(req, res) {
    try {
        const orgData = {...req.body, created_by: req.auth.userId};
        const org = await orgService.createOrg(orgData);
        res.status(201).json(org);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

async function getAllOrgsOfUser(req, res) {
    try {
        const userId = req.params.userId;
        const orgs = await orgService.getAllOrgsOfUser(userId);
        res.status(200).json(orgs);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

async function switchOrg(req, res) {
    try {
        const { orgId } = req.body;
        const userId = req.auth.userId;
        const sessionId = req.auth.sessionId;   
        const credential_version = req.auth.credential_version;
        const ip = req.ip;
        const userAgent = req.headers['user-agent'];
        const tokens = await orgService.switchOrg(userId, orgId, sessionId, credential_version, ip, userAgent);
        res.status(200).json({ message: 'Token refreshed successfully', token: tokens });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

module.exports = {
    createOrg,
    getAllOrgsOfUser,
    switchOrg
};