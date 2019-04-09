// Adds an example admin user to the database.
// The users email is "admin@example.com"
// The password is "admin"

import Connect from "../db/connect";
import {UserModel} from "../db/user";
import {Role} from "../auth/role";

(async () => {
    await Connect();

    const user = new UserModel({
        firstName: "Admin",
        lastName: "Admin",
        email: "admin@example.com",
        phone: "00000000",
        role: Role.Admin
    });
    await user.setPassword("admin");
    await user.save();
})().catch(console.error);
