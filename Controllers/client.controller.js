const DB = require("../Helpers/crud.helper");
const Role = require("../Database/Models/role.model");
const { clientModelName } = require("../Database/Models/client.model");
const XLSX = require("xlsx");
const { limitationModelName } = require("../Database/Models/limitation.model");
const Response = require("../Helpers/response.helper");
const { IST } = require("../Helpers/dateTime.helper");
const { generateCustomError } = require("../Helpers/error.helper");
const { createClientDB } = require("../Helpers/dbSelection.helper");
const { sanitizeDatabaseName, ModifyName } = require("../Helpers/helper");
const permission = require("../permission.json");
const { permissionsModelName } = require("../Database/Models/permissions.model");

/**
 *
 * @param {express request instance} req
 * @param {express response instance} res
 * @param {to access next middleware} next
 * @returns { Response instance with lane data / error }
 */
async function create(req, res, next) {
  try {
    await DB.isUnique(
      "default",
      clientModelName,
      { client_user_name: req.body.client_user_name },
      "Client"
    );
    let data = await DB.create("default", clientModelName, {
      client_name: req.body.client_name,
      client_user_name: req.body.client_user_name,
      client_code: await DB.getNextSequenceValue('client_seq'),
      msme_no: req.body.msme_no,
      registration_no: req.body.registration_no,
      license_no: req.body.license_no,
      license_issue_date: req.body.license_issue_date,
      license_expiry_date: req.body.license_expiry_date,
      contact_person_poc: req.body.contact_person_poc,
      poc_mobile: req.body.poc_mobile,
      poc_other_phone: req.body.poc_other_phone,
      client_official_mail: req.body.client_official_mail,
      industry: req.body.industry,
      year_incorporated: req.body.year_incorporated,
      business_presence: req.body.business_presence,
      website: req.body.website,
      resgister_address: req.body.resgister_address,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      pincode: req.body.pincode,
      yard_limitation: req.body.yard_limitation,
      url: "/configration",
      isActive: true,
      created_at: IST(),
      updated_at: IST(),
    });
    try {
      //TODO: make client DB and store it
      let connection = await createClientDB(
        data.id,
        data.client_code,
        sanitizeDatabaseName(data.client_name)
      );

      let Model = connection.models[Role.roleModelName];
      const dataModel = new Model({
        role: "ADMIN",
        priority: 1,
        isActive: true,
        created_at: IST(),
        updated_at: IST(),
      });
      let savedData = await dataModel.save();

	  // Save yard limit
      let LimitationModel = connection.models[limitationModelName];
      const dataLimitationModel = new LimitationModel({
        type: "yard_limit",
        limit: req.body.yard_limitation,
        created_at: IST(),
        updated_at: IST(),
      });
      await dataLimitationModel.save();

	// Save user permissions
	  let count = 0;
	  const PermissionModel = connection.models[permissionsModelName];

	  Object.keys(permission).map((key) => {
		if (key != "super-admin-permissions")
		  Object.keys(permission[key]).map((k) => {
        count = count + 1;
        const dataPermissionModel = new PermissionModel({
          permission: count,
          title: permission[key][k],
          display_name: ModifyName(permission[key][k]),
          parent: key,
          parent_name: ModifyName(key),
          created_at: IST(),
          updated_at: IST(),
        });
        dataPermissionModel.save();
		  });
	  });
	  
	 
    } catch (error) {
      await DB.remove("default", clientModelName, { _id: data.id });
      await DB.remove("default", "ClientDatabase", {
        client_code: data.client_code,
      });
      console.log("unable to create client DB or client roles \n", error);
      return Response.error(res, {
        status: 500,
        data: {},
        message: "Unable to create client !",
      });
    }

    Response.success(res, {
      data: data,
      message: "Client created successfully",
    });
  } catch (error) {
    next(error);
  }
}

/**
 *
 * @param {express request instance} req
 * @param {express response instance} res
 * @param {to access next middleware} next
 * @returns { Response instance with user data / error }
 */
const read = async (req, res, next) => {
  try {
    let query = {};
    let sort = { _id: -1 };
    let pagination = {};

    //? request filters
    if (req.query?.id) query._id = req.query?.id;

    if (req.query?.country_id) query.country = req.query?.country_id;

    if (req.query.sort && req.query.orderBy)
      sort = { [req.query.orderBy]: req.query?.sort === "asc" ? 1 : -1 };

    if (!req.query?.all) query.isActive = true;

    //? pagination
    if (req?.query?.offset) pagination.limit = parseInt(req?.query?.offset, 10);

    if (req?.query?.page)
      pagination.skip =
        parseInt(req?.query?.page, 10) * parseInt(req?.query?.offset, 10) || 0;

    const data = await DB.read(
      "default",
      clientModelName,
      query,
      pagination,
      {
        created_at: 0,
        updated_at: 0,
        __v: 0,
      },
      sort
    );
    // const limitationData = await DB.read()
    Response.success(res, {
      data: { data },
      message: "data sent !",
    });
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param {express request instance} req
 * @param {express response instance} res
 * @param {to access next middleware} next
 * @returns { Response instance with sucess / error }
 */
const update = async (req, res, next) => {
  try {
    if (!req.params.id)
      generateCustomError("Invalid data !", "BAD_REQUEST", 400, "clientError");

    let data = {};
    if (req.body.client_name) data.client_name = req.body.client_name;
    if (req.body?.client_user_name)
      data.client_user_name = req.body.client_user_name;
    if (req.body?.client_code) data.client_code = req.body.client_code;
    if (req.body?.msme_no) data.msme_no = req.body.msme_no;
    if (req.body?.registration_no)
      data.registration_no = req.body.registration_no;
    if (req.body?.license_no) data.license_no = req.body.license_no;
    if (req.body?.license_issue_date)
      data.license_issue_date = req.body.license_issue_date;
    if (req.body?.license_expiry_date)
      data.license_expiry_date = req.body.license_expiry_date;
    if (req.body?.contact_person_poc)
      data.contact_person_poc = req.body.contact_person_poc;
    if (req.body?.poc_mobile) data.poc_mobile = req.body.poc_mobile;
    if (req.body?.poc_other_phone)
      data.poc_other_phone = req.body.poc_other_phone;
    if (req.body?.client_official_mail)
      data.client_official_mail = req.body.client_official_mail;
    if (req.body?.industry) data.industry = req.body.industry;
    if (req.body?.year_incorporated)
      data.year_incorporated = req.body.year_incorporated;
    if (req.body?.business_presence)
      data.business_presence = req.body.business_presence;
    if (req.body?.website) data.website = req.body.website;
    if (req.body?.resgister_address)
      data.resgister_address = req.body.resgister_address;
    if (req.body?.city) data.city = req.body.city;
    if (req.body?.state) data.state = req.body.state;
    if (req.body?.country) data.country = req.body.country;
    if (req.body?.pincode) data.pincode = req.body.pincode;
    if (req.body?.yard_limitation) {
      data.yard_limitation = req.body.yard_limitation;

      // await DB.updateMany(Limitation, { query: { type: 'yard_limit' }}, { limit: req.body.yard_limitation, updated_at: IST() });
      await Limitation.updateMany(
        { query: { type: "yard_limit" } },
        { limit: req.body.yard_limitation, updated_at: IST() }
      );
    }
    if ("isActive" in req.body) data.isActive = req.body.isActive;

    data.updated_at = IST();

    await DB.update("default", clientModelName, {
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

/**
 *
 * @param {express request instance} req
 * @param {express response instance} res
 * @param {to access next middleware} next
 * @returns { Response instance with sucess / error }
 */
const getClient = async (req, res, next) => {
  try {
    let client = await DB.readOne("default", clientModelName, {
      _id: req.params.id,
    });
    return Response.success(res, {
      data: { ...client },
    });
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param {express request instance} req
 * @param {express response instance} res
 * @param {to access next middleware} next
 * @returns { Response instance with sucess / error }
 */
const remove = async (req, res, next) => {
  // try {
  // 	if (!req.params.id)
  // 		generateCustomError("Invalid data !", "BAD_REQUEST", 400, "clientError");
  // 	await DB.remove(Lane, { _id: req.params.id, is_deleted: true });
  // 	return Response.success(res, {
  // 		data: [],
  // 		message: "role removed !",
  // 	});
  // } catch (error) {
  // 	next(error);
  // }
};

async function ExcelDownload(req, res) {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet([
    ["from", "to", "from_location", "to_location"],
    ["", "", "[Enter Lang,Enter Lat]", "[Enter Lang,Enter Lat]"],
  ]);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  res.setHeader("Content-Disposition", "attachment; filename=yourfile.xlsx");
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.send(buffer);
}
module.exports = {
  create,
  read,
  update,
  getClient,
  remove,
  ExcelDownload,
};
