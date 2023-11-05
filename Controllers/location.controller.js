const Response = require("../Helpers/response.helper");

const DB = require("../Helpers/crud.helper");

const { customerModel } = require("../Database/Models/customer.model");
const { countryModelName } = require("../Database/Models/country.model");
const { stateSchemaModelName } = require("../Database/Models/state.model");
const { citySchemaModelName } = require("../Database/Models/city.model");
const { locationSchemaName } = require("../Database/Models/location.model");
const { clientModelName } = require("../Database/Models/client.model");
const { createClientDB } = require("../Helpers/dbSelection.helper");
const { sanitizeDatabaseName, ModifyName } = require("../Helpers/helper");

const { IST } = require("../Helpers/dateTime.helper");
const { default: mongoose } = require("mongoose");

async function getCountry(req, res, next) {
  try {
    let query = {};
    if (req?.query?.name)
      query = { name: { $regex: req?.query?.name, $options: "i" } };
    if (req?.query?.id) query.id = req?.query?.id;
    if (req?.query?.country_id) query.country_id = req?.query?.country_id;
    const country = await DB.read("default", countryModelName, query, {
      limit: 300,
    });
    if (!country instanceof Array) country = [{ ...country }];
    Response.success(res, {
      data: {
        country: country,
      },
    });
  } catch (error) {
    next(error);
  }
}
async function getState(req, res, next) {
  try {
    let query = {};
    if (req.query.state_id) query = { state_id: req.query.state_id };
    if (req.query.country_id) query = { country_id: req.query.country_id };
    if (req.query.id) query = { _id: req.query.id };

    const state = await DB.read("default", stateSchemaModelName, query, {
      limit: 150,
    });
    Response.success(res, {
      data: {
        state,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getCity(req, res, next) {
  try {
    let query = {};
    if (req.query.state_id) query = { state_id: parseInt(req.query.state_id) };
    if (req.query.city_id) query = { city_id: parseInt(req.query.city_id) };
    if (req.query.country_id)
      query = { country_id: parseInt(req.query.country_id) };
    if (req.query.id) query = { _id: req.query.id };

		const city = await DB.read('default',citySchemaModelName, query, { limit: 400 });
		Response.success(res, {
			data: {
				city: city,
			},
		});
	} catch (error) {
		next(error);
	}
}
async function createLocation(req, res, next) {
  try {
    const data = {
      location_name: req.body.location_name,
      address: req.body.address,
      client: req.body.client,
      // client_name: req.body.client_name,
      country: req.body.country,
      country_name: req.body.country_name,
      state: req.body.state,
      state_name: req.body.state_name,
      city: req.body.city,
      city_name: req.body.city_name,
      pin: req.body.pin,
      phone: req.body.phone,
      email: req.body.email,
      isActive: true,
      created_at: IST(),
      updated_at: IST(),
    };
    let query = {};
    query.client = req.body.client;
    const client = await DB.read("default", clientModelName, query);
    console.log(client);
    const loc = await DB.create("default", locationSchemaName, data);
    // await DB.create(req.auth.client_db, locationSchemaName, data);
    await DB.create(client[0].client_code, locationSchemaName, data);
    Response.success(res, {
      data: {
        location: loc,
      },
    });
  } catch (error) {
    next(error);
  }
}
const readLocations = async (req, res, next) => {
  try {
    let query = {};
    if (req.query.client) query.client = req.query.client;
    const data = await DB.read("default", locationSchemaName, query);

    return Response.success(res, {
      data: { data },
      count: data.length,
    });
  } catch (error) {
    next(error);
  }
};
const readLocationsForClient = async (req, res, next) => {
  try {
    console.log(req.auth)
    const data = await DB.read(req.auth.client_db, locationSchemaName, { isActive: true });

    return Response.success(res, {
      data: { data },
      count: data.length,
    });
  } catch (error) {
    next(error);
  }
};
const updateLocation = async (req, res, next) => {
  try {
    let data = {};
    if (req.body.location_name) data.location_name = req.body.location_name;
    if (req.body.address) data.address = req.body.address;
    if (req.body.country_name) data.country_name = req.body.country_name;
    if (req.body.country) data.country = req.body.country;
    if (req.body.state_name) data.state_name = req.body.state_name;
    if (req.body.state) data.state = req.body.state;
    if (req.body.city_name) data.city_name = req.body.city_name;
    if (req.body.city) data.city = req.body.city;
    if (req.body.pin) data.pin = req.body.pin;
    if (req.body.phone) data.phone = req.body.phone;
    if (req.body.email) data.email = req.body.email;
    if (req.body.client) data.client = req.body.client;
    if (req.body.client_name) data.client_name = req.body.client_name;
    if ("isActive" in req.body) data.isActive = req.body.isActive;
    await DB.update("default", locationSchemaName, {
      query: { _id: req.params.id },
      data,
    });
    return Response.success(res, {
      data: { updated: true },
      message: "Client updated !",
    });
  } catch (error) {
    next(error);
  }
};

const getLocationByCustomer = async (req, res, next) => {
  console.log(req.params.id, req.auth)
  try {
    let pipe = [
       {
        $match: { _id: mongoose.Types.ObjectId(req.params.id) }
       },
       {
        $lookup: {
          from: "locations",
          localField: "location",
          foreignField: "_id",
          as: "locations",
        }
       }
    ];
    
    let locations = await DB.aggregation(req.auth.client_db, customerModel, pipe);

    locations = locations.length && locations[0]?.locations;
    
    return Response.success(res, {
      data: { locations },
      count: locations.length,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCountry,
  getState,
  getCity,
  createLocation,
  readLocations,
  readLocationsForClient,
  updateLocation,
  getLocationByCustomer,
};
