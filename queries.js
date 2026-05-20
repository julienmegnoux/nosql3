import { MongoClient } from "mongodb";
import fs from "fs";

const uri = "mongodb://localhost:27017";

async function run() {
    const client = new MongoClient(uri);

    try {
        await client.connect();

        const db = client.db("sample_mflix");
        const movies = db.collection("movies");
        const comments = db.collection("comments");

        if (!fs.existsSync("data")) {
            fs.mkdirSync("data");
        }

        // 1
        const result1 = await movies.find({
            genres: "Comedy",
            "tomatoes.viewer.rating": { $lt: 4.1 }
        }).toArray();

        fs.writeFileSync(
            "data/data1.json",
            JSON.stringify(result1, null, 2)
        );

        // 2
        const result2 = await movies.find({
            cast: "Faye Dunaway"
        }).toArray();

        fs.writeFileSync(
            "data/data2.json",
            JSON.stringify(result2, null, 2)
        );

        // 3
        const result3 = await movies.find({
            year: { $in: [1962, 2016] }
        }).toArray();

        fs.writeFileSync(
            "data/data3.json",
            JSON.stringify(result3, null, 2)
        );

        // 4
        const result4 = await movies.find({
            "awards.wins": { $gt: 0 }
        }).toArray();

        fs.writeFileSync(
            "data/data4.json",
            JSON.stringify(result4, null, 2)
        );

        // 5
        const result5 = await movies.find({
            genres: { $all: ["Western", "Comedy"] }
        }).toArray();

        fs.writeFileSync(
            "data/data5.json",
            JSON.stringify(result5, null, 2)
        );

        // 6
        const result6 = await comments.aggregate([
            {
                $group: {
                    _id: "$movie_id",
                    commentCount: { $sum: 1 }
                }
            },
            {
                $match: {
                    commentCount: { $gte: 5 }
                }
            }
        ]).toArray();

        fs.writeFileSync(
            "data/data6.json",
            JSON.stringify(result6, null, 2)
        );

        console.log("All data files created.");

    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

run();