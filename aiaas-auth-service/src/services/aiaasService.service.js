const redisClient = require('../infrastructure/redis');
// aiaasService will use aiaasService.repository.js to interact with the database and perform business logic related to AI as a Service.
const aiaasServiceRepository = require('../repositories/aiaasService.repository');

// get aiaas service by id
async function getAiaasServiceById(id) {
    const cached = await redisClient.get(`aiaasService:${id}`);
    if (cached) {
        return JSON.parse(cached);
    }
    const service = await aiaasServiceRepository.getAiaasServiceById(id);
    await redisClient.setex(`aiaasService:${id}`, 3600, JSON.stringify(service));
    return service;
}

// get all aiaas services
async function getAllAiaasServices() {
    const cached = await redisClient.get("aiaasServices");
    if (cached) {
        return JSON.parse(cached);
    }
    const services = await aiaasServiceRepository.getAllAiaasServices();
    await redisClient.setex("aiaasServices", 3600, JSON.stringify(services));
    return services;
}

module.exports = {
    getAiaasServiceById,
    getAllAiaasServices
};