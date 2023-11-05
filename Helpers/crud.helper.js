
const { clientModelName } = require("../Database/Models/client.model");
/**
 * Remove specified keys from the given data object or array, and transform it according to the specified children keys.
 * @param {array} keys - Array of keys to be removed from the data.
 * @param {object|array} data - Data object or array to be processed.
 * @param {array} children - Array of keys representing children keys for recursive processing.
 * @returns {object|array} - Transformed data object or array with specified keys removed.
 */
function removeKeys(keys, data, children = []) {
  if (data instanceof Array) {
    return data.map((item) => removeKeys(keys, item, children));
  }
  try {
    const { _id, ...rest } = data;
    const newData = { id: _id, ...rest };

    for (const key of keys) {
      delete newData[key];
    }

    for (const childKey of children) {
      if (childKey in newData) {
        newData[childKey] = removeKeys(keys, newData[childKey]);
      }
    }
    return newData;
  } catch (error) {
    console.log(error);
    return {};
  }
}

const logDB = (db, model) => console.log(`using DB: ${db} for ${model}`);

async function getNextSequenceValue(
  sequenceName = "client_seq",
  ModelName = "Sequence",
  DatabaseName = "default"
) {
  logDB(DatabaseName, ModelName);
  let Database = global.getConnection(DatabaseName);
  let Model = Database.models[ModelName];
  return new Promise(async (resolve, reject) => {
    try {
      const sequence = await Model.findOne({});
      let newSequence;
      if (sequence) {
        sequence[sequenceName] += 1;
        newSequence = sequence[sequenceName];
        sequence.save();
      } else {
        let dataSeq = new Model();
        dataSeq[sequenceName] = 1;
        newSequence = dataSeq[sequenceName];
        await dataSeq.save();
      }
      newSequence = String(newSequence).padStart(4, "0");
      console.log("new sequence", newSequence);
      resolve(`YMS-${newSequence}`);
    } catch (error) {
      reject(error);
    }
  });
}

async function getDataCountSequence(DatabaseName, ModelName, prefix="" ) {
  logDB(DatabaseName, ModelName);
  let Database = global.getConnection(DatabaseName);
  let Model = Database.models[ModelName];
  return new Promise(async (resolve, reject) => {
    try {
      let count = 0;
      // count = await Model.countDocuments({});
      let lastRow = await Model.findOne({}).sort({ _id: -1 });
      let client = await readOne("default", clientModelName, { client_code: DatabaseName});
     
      if (!prefix) prefix = client.client_name.substring(0, 3).toUpperCase();
      // count = lastRow.appointment_no.replace(`${prefix}-`, '')
      if (lastRow) count = lastRow.appointment_no.split('-');
      
      count = String(parseInt(count[1])+1).padStart(7, "0");
      
      resolve(`${prefix}-${count}`);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * @description finds if the provided query data is unique
 * @param model {object} - mongoose user model
 * @param email {string} - email provided by user
 * @returns {object}- error object/true
 */
async function isUnique(DatabaseName = "default", Model, data, type = "Data") {
  logDB(DatabaseName, Model);
  let Database = global.getConnection(DatabaseName);
  return new Promise(async (resolve, reject) => {
    try {
      Model = Database.models[Model];
      const count = await Model.count(data);
      if (count > 0) {
        let error = new Error(`${type} already exists`);
        error.name = "NON_UNIQUE";
        error.resCode = 400;
        reject(error);
      }
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}

async function getCount(DatabaseName = "default", Model, query = {}) {
  logDB(DatabaseName, Model);
  let Database = global.getConnection(DatabaseName);
  return new Promise(async (resolve, reject) => {
    try {
      Model = Database.models[Model];
      const count = await Model.count(query);
      resolve(count);
    } catch (error) {
      reject(error);
    }
  });
}
/**
 * @description creates a document based on model and data
 * @param model { Model } - mongoose model
 * @param data {object} - data object that to be created
 * @returns {object} - data array or error
 */
async function create(DatabaseName = "default", Model, data) {
  logDB(DatabaseName, Model);
  let Database = global.getConnection(DatabaseName);
  //   console.log(Model);
  return new Promise(async (resolve, reject) => {
    try {
      Model = Database.models[Model];
      //   console.log("model", Model);
      const dataModel = new Model(data);
      let savedData = await dataModel.save();
      savedData = removeKeys(["_id", "__v"], savedData.toObject());
      resolve(savedData);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * @description reads data based on query and model
 * @param Model mongoose model
 * @param query object: data query eg: { email: user@email.com}
 * @param pagination optional: object: { skip: 20, limit: 20 }
 * @param exclude optional: object: { password: 0, __v: 0 }
 * @returns  object: { data: array of objects || error: object }
 */

async function read(
  DatabaseName,
  Model,
  query,
  pagination = {},
  exclude = {},
  sort = { _id: -1 }
) {
  logDB(DatabaseName, Model);
  let Database = global.getConnection(DatabaseName);
  return new Promise(async (resolve, reject) => {
    try {
      console.log(Database.models);
      Model = Database.models[Model];
      //   console.log("model", Model);
      let data = await Model.find(query, exclude)
        .limit(pagination?.limit || 200)
        .skip(pagination?.skip || 0)
        .sort(sort)
        .lean();
      data = removeKeys(["_id", "__v"], data);
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * @description reads data based on query and model
 * @param Model mongoose model
 * @param query object: data query eg: { email: user@email.com}
 * @param exclude optional: object: { password: 0, __v: 0 }
 * @param sort optional: object: { createAt: -1 }
 * @returns  object: { data: array of objects || error: object }
 */
async function readOne(DatabaseName = "default", Model, query, exclude = {}) {
  logDB(DatabaseName, Model);
  let Database = global.getConnection(DatabaseName);
  return new Promise(async (resolve, reject) => {
    try {
      Model = Database.models[Model];
      let data = await Model.findOne(query, exclude).lean();
      // if (!(Object.keys(data)).length) resolve({});
      data = removeKeys(["_id", "__v"], data);
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * @description updates data based on query and model
 * @param Model mongoose model
 * @param data object: {query: { field_to_match: value }, data: { field_to_update: value, ... }}
 * @returns  object: { boolean || error: object }
 */
async function update(DatabaseName = "default", Model, data) {
  logDB(DatabaseName, Model);
  let Database = global.getConnection(DatabaseName);
  return new Promise(async (resolve, reject) => {
    try {
      Model = Database.models[Model];
      //   console.log("inupdate", data);
      await Model.findByIdAndUpdate(data.query._id, data.data);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}

async function updateMany(DatabaseName = "default", Model, data) {
  logDB(DatabaseName, Model);
  let Database = global.getConnection(DatabaseName);
  return new Promise(async (resolve, reject) => {
    try {
      Model = Database.models[Model];
      await Model.updateMany(data.query, data.data);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * @description deletes data based on query and model
 * @param Model mongoose model
 * @param data object: { field_to_match: value }
 * @returns  object: { boolean || error: object }
 */
async function remove(DatabaseName = "default", Model, data) {
  console.log(data);
  logDB(DatabaseName, Model);
  let Database = global.getConnection(DatabaseName);
  return new Promise(async (resolve, reject) => {
    try {
      Model = Database.models[Model];
      await Model.deleteOne(data);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}

async function removeMany(DatabaseName = "default", Model, data) {
  logDB(DatabaseName, Model);
  let Database = global.getConnection(DatabaseName);
  logDB(DatabaseName, Model);
  return new Promise(async (resolve, reject) => {
    try {
      Model = Database.models[Model];
      await Model.deleteMany(data);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}

async function aggregation(DatabaseName = "default", Model, pipeline) {
  logDB(DatabaseName, Model);
  let Database = global.getConnection(DatabaseName);
  return new Promise(async (resolve, reject) => {
    try {
      Model = Database.models[Model];
      //   console.log("model", Model);
      let data = await Model.aggregate(pipeline);
      let newPipe = pipeline.map(item => {
        return item['$lookup']?.as;
      })
      // return;
      // let removeChildren = query?.popString ? query.popString.split(" ") : [];
      data = removeKeys(["_id", "__v"], data, newPipe);
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * @description reads data based on query and model with population
 * @param Model mongoose model
 * @param query object: data query eg: {queryString: { email: user@email.com }, popString: key, queryExclude: { key: 0 || 1 }, popExclude: { key: 1 || 0} }
 * @param pagination optional: object: { skip: 20, limit: 20 }
 * @returns  object: { data: array of objects || error: object }
 */

async function population(
  DatabaseName = "default",
  Model,
  query,
  pagination = {},
  sort = { _id: -1 }
) {
  logDB(DatabaseName, Model);
  let Database = global.getConnection(DatabaseName);
  return new Promise(async (resolve, reject) => {
    try {
      Model = Database.models[Model];
      let data = await Model.find(query.queryString, query?.queryExclude || {})
        .populate(query.popString, query?.popExclude || {})
        .populate(query.nestedPop || "")
        .limit(pagination?.limit || 40)
        .skip(pagination?.skip || 0)
        .sort(sort)
        .lean();

      let removeChildren = query?.popString ? query.popString.split(" ") : [];
      data = removeKeys(["_id", "__v"], data, removeChildren);
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
}

async function findDetails(DatabaseName = "default", Model, query) {
  logDB(DatabaseName, Model);
  let Database = global.getConnection(DatabaseName);
  return new Promise(async (resolve, reject) => {
    try {
      Model = Database.models[Model];
      const data = await Model.find(
        query?.queryString,
        query?.queryExclude || {}
      );
      resolve(data);
    } catch (error) {
      const newErr = new Error("Unable to get details");
      newErr.error = error;
      newErr.code = 401;
      reject(newErr);
    }
  });
}

module.exports = {
  isUnique,
  getCount,
  read,
  readOne,
  create,
  update,
  updateMany,
  remove,
  removeMany,
  aggregation,
  population,
  findDetails,
  getNextSequenceValue,
  getDataCountSequence,
};
