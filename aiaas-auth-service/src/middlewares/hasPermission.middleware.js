const redisClient = require("../infrastructure/redis");
const mysqlDb = require("../infrastructure/mysql.db");

function hasPermission(permissionName) {
  return async function (req, res, next) {
    try {
        const { userId, orgId } = req.auth;

        const cached = await redisClient.get(`userPermissions:${userId}:${orgId}:${permissionName}`);
        if (cached) {
            if (cached === 'allow') {
                return next();
            } else {
                return res.status(403).json({
                    error: "FORBIDDEN",
                    message: "Permission denied"
                });
            }
        }

        const [rows] = await mysqlDb.query(
            `
            SELECT 1
            FROM auth_user_roles ur
            JOIN auth_roles_permissions rp
                ON ur.auth_role_id = rp.auth_roles_id
            JOIN auth_permissions p
                ON rp.permission_id = p.id
            WHERE ur.user_id = ?
            AND ur.org_id = ?
            AND p.name = ?
            LIMIT 1
            `,
            [userId, orgId, permissionName]
        );

        // Cache the permission check result for 5 minutes
        await redisClient.setex(`userPermissions:${userId}:${orgId}:${permissionName}`, 300, rows.length > 0 ? 'allow' : 'deny');

        if (rows.length === 0) {
            return res.status(403).json({
            error: "FORBIDDEN",
            message: "Permission denied"
            });
        }

        next();
    } catch (err) {
        console.error("Permission check failed:", err);
        return res.status(500).json({
            error: "INTERNAL_SERVER_ERROR"
        });
    }
  };
}

module.exports = hasPermission;