const http = require("https");
const Mongoose = require("mongoose");
const {default: Connect} = require("../dist/db/connect");
const {Role} = require("../dist/auth/role");
const Chance = require("chance");
const chance = new Chance();
const {UserModel} = require("../dist/db/user");
const {CategoryModel} = require("../dist/db/category");
const {BikeModel} = require("../dist/db/bike");
const {Image, ImageVariantType} = require("../dist/db/image");

(async () => {
    await Connect();

    const password = "pass";
    const users = [
        {
            amount: 2,
            role: Role.Admin
        },
        {
            amount: 10,
            role: Role.Manager
        },
        {
            amount: 50,
            role: Role.User
        }
    ];

    const emails = [];

    for (const config of users) {
        for (let i = 0; i < config.amount; i++) {
            let email;
            do {
                email = chance.email({domain: "example.com"});
            } while (emails.includes(email));
            emails.push(email);

            const opts = {
                firstName: chance.first(),
                lastName: chance.last(),
                email: email,
                phone: chance.phone(),
                role: config.role
            };
            const user = new UserModel(opts);
            await user.setPassword(password);
            await user.save();
        }
    }

    const categories = require("./categories");
    const namedCategories = {};

    for (const category of categories) {
        const cat = new CategoryModel(category);
        await cat.save();
        category.id = cat._id;
        namedCategories[cat.slug] = cat._id;
    }

    const bikes = require("./bikes");

    for (const bike of bikes) {
        bike.images = [];
        for (const image of bike.imageUrls) {
            console.log("Downloading image", image);
            const file = await downloadImage(image);
            console.log("Uploading...");
            const img = await Image.createImage("image.png", bike.title, "Image", file, [
                ImageVariantType.Original,
                ImageVariantType.Large,
                ImageVariantType.Small
            ]);
            await img.save();
            console.log("Done!");
            bike.images.push(img._id);
        }
        bike.categories = bike.category.map(it => namedCategories[it]);

        const b = new BikeModel(bike);
        await b.save();
    }

    await Mongoose.disconnect();
})()
    .catch(console.error);

async function downloadImage(url) {
    return new Promise((resolve) => {
        http.get(url, resolve);
    })
}
