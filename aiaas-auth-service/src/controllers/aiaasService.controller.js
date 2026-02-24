// aiaasService controller will use aiaasService.service.js to handle incoming requests and send responses related to AI as a Service.
const aiaasService = require('../services/aiaasService.service');

// get aiaas service by id
async function getAiaasServiceById(req, res) {
    try {
        const id = req.params.id;
        const service = await aiaasService.getAiaasServiceById(id);
        if (service) {
            res.status(200).json(service);
        } else {
            res.status(404).json({ message: 'AI as a Service not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

// get all aiaas services
async function getAllAiaasServices(req, res) {
    try {
        const services = await aiaasService.getAllAiaasServices();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

module.exports = {
    getAiaasServiceById,
    getAllAiaasServices
};