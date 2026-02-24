const { randomUUID } = require('crypto');
const db = require('../infrastructure/mysql.db');

async function seedPermissions() {
    const conn = await db.getConnection();

    const aiaasServices = [
        {
            id: randomUUID(),
            name: 'chatbot',
            description: 'AIAAS Chatbot Service. Provides AI-powered conversational capabilities for applications. Supports natural language understanding, context management, and multi-turn conversations to enhance user interactions.',
        }
    ]

    // seed aiaas_services
    for (const service of aiaasServices) {
        await conn.query(
            'INSERT INTO aiaas_services (id, name, description) VALUES (?, ?, ?)',
            [service.id, service.name, service.description]
        );
    }
    console.log('AIAAS services seeded successfully.');

    // Org-level permissions (aiaas_service_id = NULL)
    const orgPermissions = [
        'org:info:view',
        'org:info:update',

        'org:user:add',
        'org:user:remove',
        'org:user:update',
        'org:user:list',
        'org:user:assign-role',
        
        'org:role:create',
        'org:role:delete',
        'org:role:update',
        
        'org:settings:update'
    ];

    for (const perm of orgPermissions) {
        await conn.query(
            `
            INSERT INTO auth_permissions (id, name, description, aiaas_service_id)
            VALUES (?, ?, ?, NULL)
            ON DUPLICATE KEY UPDATE name = name
            `,
            [
                randomUUID(),
                perm,
                `${perm} permission`
            ]
        );
    }

    console.log('Org-level permissions seeded');

    // Fetch all services dynamically
    const [services] = await conn.query(
        `SELECT id, name FROM aiaas_services`
    );

    // 3️⃣ Define default permission template for services
    const servicePermissionTemplates = [
        'create',
        'update',
        'delete',
        'view',
        'manage',
        'feed-data',
    ];

    for (const service of services) {
        const serviceKey = service.name.toLowerCase().replace(/\s+/g, '_');

        for (const action of servicePermissionTemplates) {
        const permissionName = `${serviceKey}:${action}`;

        await conn.query(
            `
            INSERT INTO auth_permissions (id, name, description, aiaas_service_id)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE name = name
            `,
            [
            randomUUID(),
            permissionName,
            `${action} ${service.name}`,
            service.id
            ]
        );
        }

        console.log(`✅ Permissions seeded for service: ${service.name}`);
    }

    console.log('🎯 Permission seeding completed successfully');
}

seedPermissions()
    .then(() => {
        console.log('All permissions seeded successfully');
        process.exit(0);
    })
    .catch((err) => {
        console.error('Error seeding permissions:', err);
        process.exit(1);
    });