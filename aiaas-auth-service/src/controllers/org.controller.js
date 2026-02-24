const orgService = require('../services/org.service');

async function createOrg(req, res) {
    try {
        const orgData = req.body;
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

module.exports = {
    createOrg,
    getAllOrgsOfUser
};