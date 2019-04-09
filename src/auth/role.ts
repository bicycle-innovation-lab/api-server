export enum Role {
    User = "user",
    Manager = "manager",
    Admin = "admin",
}

export const allRoles = Object.values(Role);

export enum AuthLevel {
    NotSignedIn = -1,
    User = 0,
    Manager = 1,
    Admin = 2,
}

export const roleLevels = {
    [Role.User]: AuthLevel.User,
    [Role.Manager]: AuthLevel.Manager,
    [Role.Admin]: AuthLevel.Admin,
};

export function getRoleLevel(role?: Role) {
    return role ? roleLevels[role] : AuthLevel.NotSignedIn;
}
