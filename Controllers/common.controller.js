const Response = require('../Helpers/response.helper');

// // ? countries
// const country = async (req, res) => {
//     try {
//         const id = parseInt(req?.query?.id, 10);
//         const name = req?.query?.name;

//         const match = {};

//         if (id) match.id = { $eq: id };
//         if (name) match.name = new RegExp(`${name}`, "gi");

//         const pipeline = [
//             {
//                 $match: match,
//             },
//             {
//                 $project: {
//                     _id: 1,
//                     id: 1,
//                     name: 1,
//                     iso2: 1,
//                     emoji: 1,
//                     emojiU: 1,
//                 },
//             },
//         ];
//         const countries = await aggregation(Country, pipeline);
//         return response.success(res, { data: countries?.data });
//     } catch (error) {
//         logger.error(error);
//         return response.error(res);
//     }
// };

// // ? states
// const state = async (req, res) => {
//     try {
//         const limit = 40;
//         const id = parseInt(req?.query?.id, 10);
//         const countryId = parseInt(req?.query?.countryId, 10);
//         const countryName = req?.query?.countryName;
//         const name = req?.query?.name;
//         const page = parseInt(req?.query?.page, 10) || 0;

//         const match = {};

//         if (id) match.id = { $eq: id };
//         if (name) match.name = new RegExp(`^${name}`, "gi");
//         if (countryId) match.country_id = { $eq: countryId };
//         if (countryName) match.country_name = { $eq: countryName };

//         const pipeline = [
//             {
//                 $match: match,
//             },
//             {
//                 $skip: limit * page,
//             },
//             {
//                 $limit: limit,
//             },
//             {
//                 $project: {
//                     _id: 1,
//                     id: 1,
//                     name: 1,
//                     country_id: 1,
//                     country_name: 1,
//                 },
//             },
//         ];

//         const states = await aggregation(State, pipeline);
//         return response.success(res, { data: states?.data });
//     } catch (error) {
//         logger.error(error);
//         return response.error(res);
//     }
// };

// // ? cities
// const city = async (req, res) => {
//     try {
//         const limit = 40;
//         const id = parseInt(req?.query?.id, 10);
//         const stateId = parseInt(req?.query?.stateId, 10);
//         const countryId = parseInt(req?.query?.countryId, 10);
//         const stateName = req?.query?.stateName;
//         const countryName = req?.query?.countryName;
//         const name = req?.query?.name;
//         const page = parseInt(req?.query?.page, 10) || 0;

//         const match = {};

//         if (id) match.id = { $eq: id };
//         if (name) match.name = new RegExp(`^${name}`, "gi");
//         if (countryId) match.country_id = { $eq: countryId };
//         if (stateId) match.country_id = { $eq: stateId };
//         if (countryName) match.country_name = { $eq: countryName };
//         if (stateName) match.country_name = { $eq: stateName };

//         const pipeline = [
//             {
//                 $match: match,
//             },
//             {
//                 $skip: limit * page,
//             },
//             {
//                 $limit: limit,
//             },
//             {
//                 $project: {
//                     _id: 1,
//                     id: 1,
//                     name: 1,
//                     state_id: 1,
//                     state_name: 1,
//                     country_id: 1,
//                     country_name: 1,
//                 },
//             },
//         ];
//         const cities = await aggregation(City, pipeline);
//         return response.success(res, { data: cities.data });
//     } catch (error) {
//         logger.error(error);
//         return response.error(res);
//     }
// };


const fileUpload = async (req, res, next) => {
    try {
        if (req?.fileValidationError) return Response.badRequest(res, { status: 406, message: "File type not allowed" });
        // if (!req.files.length) return response.badRequest(res);

        return Response.success(res, { data:{ url: req?.file.location }, message: "Image uploaded" });
    } catch (error) {
        next(error)
    }
};

module.exports = {
    fileUpload
}