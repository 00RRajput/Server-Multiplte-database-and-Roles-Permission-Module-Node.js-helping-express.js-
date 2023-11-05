const { MongoClient } = require("mongodb");
const client = new MongoClient(`mongodb://127.0.0.1:27017`);
const fs = require('fs/promises');
const path = require('path')

async function getCities() {

    try {
        
        const database = client.db('freight');
        const cities = database.collection('states');

        let docCount = 1;
        let fileCount = 1;
        let docArr = [];

        let cursor = cities.find({});
        cursor.stream().on("data", function (data) {
            //get streamed documents one by one
            const currentDoc = data;
            currentDoc.location = {
                type: 'Point',
                coordinates: [data.longitude, data.latitude]
            };

            docArr.push(currentDoc);
            fileCount++;
            if (docArr.length > 1000) {
                fs.writeFile(`${path.join(process.cwd(), `/data_chunk/cities_chunk_${fileCount}.json`)}`, JSON.stringify([...docArr]));
                docArr = [];
            }
        }).on("error", function (error) {
            console.error("STREAM ERROR::", error.stack);
        }).on("end", function () {
            console.info("Streaming docs finished");
            
            fs.writeFile(`${path.join(process.cwd(), `/data_chunk/cities_chunk_${fileCount}.json`)}`, JSON.stringify([...docArr]));

            client.close(); //new MongoClient(url, { useNewUrlParser: true });
        });
    } catch (error) {
        console.log(error);
        console.log('error getting cities !');
    }
}

client.connect((error) => {
    if (error) console.log(error);
    else getCities();
})