const Joi = require("joi");
const libphonenumber = require("google-libphonenumber");

const phoneValidation = (value, countryCode) => {
  if (!value) return true;

  const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
  try {
    const phoneNumber = phoneUtil.parseAndKeepRawInput(value, countryCode);
    const isValid = phoneUtil.isValidNumber(phoneNumber);

    if (!isValid) {
      return false;
    }
  } catch (error) {
    console.log("error", error);
    return false;
  }

  return true;
};

const vendorSchema = Joi.object({
  entity_name: Joi.string()
    .min(3)
    .max(100)
    // .regex(/^[A-Za-z]+$/)
    .required()
    .label("Entity Name")
    .messages({
      "string.min": "Entity name must be at least 3 characters",
      "string.max": "Entity name cannot exceed 100 characters",
      //   'string.pattern.base': 'Entity name must only contain letters',
      "any.required": "Entity name is required!",
    }),
  primary_contact_name: Joi.string()
    .regex(/^[A-Za-z\s]+$/)
    .min(3)
    .max(30)
    .required()
    .label("Primary Contact Name")
    .messages({
      "string.pattern.base": "Contact name must only contain letters",
      "string.min": "Contact name must be at least 3 characters",
      "string.max": "Contact name cannot exceed 30 characters",
      "any.required": "Contact name is required",
    }),
  secondary_contact_name: Joi.string()
    .regex(/^[A-Za-z\s]+$/)
    .min(3)
    .max(30)
    .optional()
    .allow("", null)
    .label("Secondary Contact Name")
    .messages({
      "string.pattern.base": "Contact name must only contain letters",
      "string.min": "Contact name must be at least 3 characters",
      "string.max": "Contact name cannot exceed 30 characters",
    }),
  primary_phone: Joi.string()
    // .custom(, 'Custom phone validation')
    .regex(/^[0-9]+$/)
    .required()
    .messages({
      "string.pattern.base": "Primary phone must contain only numbers",
      "any.invalid": "Invalid primary phone number",
      "any.required": "Primary phone is required",
    })
    .custom((value, helper) => {
      // const country = helper.root.country;
      console.log("helper ", value);
      const iso = helper.prefs.context.iso; // Access iso value from the frontend
      // console.log('mainhelper',helper.prefs.context.iso);
      if (!phoneValidation(value, iso)) {
        return helper.error("any.invalid");
      }
      return value;
    }),
  primary_email: Joi.string()
    .max(63)
    .email({ tlds: { allow: false } })
    .required()
    .label("Primary Email")
    .messages({
      "string.max": "Must be a valid email",
      "string.email": "Primary email is required",
      "any.required": "Primary email is required",
    }),
  secondary_phone: Joi.string()
    .regex(/^[0-9]+$/)
    .optional()
    .allow("", null)
    .messages({
      "any.invalid": "Invalid secondary phone number",
      "any.required": "Secondary phone is required",
      "string.pattern.base": "Secondary phone must contain only numbers",
    })
    .custom((value, helper) => {
      // const country = helper.root.country;
      console.log("helper ", value);
      const iso = helper.prefs.context.iso; // Access iso value from the frontend
      console.log(iso);
      if (!phoneValidation(value, iso)) {
        return helper.error("any.invalid");
      }
      return value;
    }),
  currency: Joi.string().required(),
  secondary_email: Joi.string()
    .max(63)
    .email({ tlds: { allow: false } })
    .label("Secondary Email")
    .optional()
    .allow("", null),

  password: Joi.string().min(6).max(20).required().label("Password").messages({
    "string.min": "Password must be at least 6 characters",
    "string.max": "Password cannot exceed 20 characters",
    "any.required": "Password is required",
  }),
  confirmpassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .label("Confirm Password")
    .messages({
      "any.only": "Passwords do not match",
      "any.required": "Passwords do not match",
    }),
  is_gst_available: Joi.string().valid("yes", "no"),
  gst_no: Joi.string().when("is_gst_available", {
    is: "yes",
    then: Joi.string()
      .required()
      .regex(/^([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1})$/i)
      .max(15)
      .label("GST No.")
      .messages({
        "string.pattern.base": "Invalid GST No.",
        "string.max": "GST No. must not exceed 15 characters",
        "any.required": "GST No. is required",
      }),
    otherwise: Joi.optional().allow("", null),
  }),
  gst_certificate: Joi.string().optional().allow("", null),
  country: Joi.string().required(),
  state: Joi.string().optional().allow("", null),
  city: Joi.string().optional().allow("", null),
  billing_pin_code: Joi.string()
    .label("Billing PIN Code")
    .when("country", {
      is: Joi.valid("101", 101),
      then: Joi.string()
        .regex(/^\d{6}$/)
        .length(6)
        .required()
        .messages({
          "string.length": "Pin code must have 6 characters",
          "any.required": "Pin code is required",
        }),
      otherwise: Joi.optional().allow("", null),
    }),
  vehicle_type: Joi.array()
    .items(
      Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
    )
    .required()
    .label("Vehicle")
    .messages({
      "any.required": "Vehicle Type is required",
      "string.pattern.base": "Invalid Vehicle Type",
    }),
  lane: Joi.array()
    .items(
      Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
    )
    .required()
    .label("Vehicle")
    .messages({
      "any.required": "Lane Type is required",
      "string.pattern.base": "Invalid Lane Type",
    }),
  swift_code: Joi.string()
    .label("Swift Code")
    .regex(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/i)
    .max(11)
    .optional()
    .allow("", null)
    .messages({
      "string.pattern.base": "Invalid Swift Code",
      "string.max": "Swift Code cannot exceed 11 characters",
    }),
  correspondence_same_as_billing_address: Joi.string().max(255),
  correspondence_address: Joi.string()
    .regex(/^[a-zA-Z0-9\s]+$/)
    .max(255)
    .required()
    .label("Correspondence Address")
    .messages({
      "string.pattern.base":
        "Correspondence Address must only contain alphanumeric values",
      "string.max": "Correspondence address cannot exceed 255 characters",
      "any.required": "Correspondence address is required",
    }),
  correspondence_pin_code: Joi.string()
    .label("Billing PIN Code")
    .when("country", {
      is: Joi.valid("101", 101),
      then: Joi.string()
        .regex(/^\d{6}$/)
        .length(6)
        .required()
        .messages({
          "string.length": "Pin code must have 6 characters",
          "any.required": "Pin code is required",
        }),
      otherwise: Joi.optional().allow("", null),
    }),
  billing_address: Joi.string()
    .regex(/^[a-zA-Z0-9\s]+$/)
    .max(255)
    .required()
    .label("Billing Address")
    .messages({
      "string.pattern.base":
        "Billing Address must only contain alphanumeric values",
      "string.max": "Billing address cannot exceed 255 characters",
      "any.required": "Billing address is required",
    }),
  org_type: Joi.number()
    .min(1)
    .max(5)
    .label("Organization Type")
    .required()
    .messages({
      "number.min": "Organization type is required",
      "number.max": "Organization type is required",
      "any.required": "Organization type is required",
    }),
  pan: Joi.string().optional().allow("", null),
  pan_card_no: Joi.string().when("country", {
    is: [101, "101"],
    then: Joi.string()
      .regex(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/)
      .length(10)
      .required()
      .messages({
        "string.pattern.base": "Invalid Pan Number",
        "string.length": "Pan number must have 10 characters",
        "any.required": "Pan card number is required",
      }),
    otherwise: Joi.string().allow("", null).optional(),
  }),
  pan_name: Joi.string().when("country", {
    is: [101, "101"],
    then: Joi.string()
      .min(3)
      .max(30)
      .label("Name as per PAN")
      .required()
      .messages({
        "string.min": "Name must be at least 3 characters",
        "string.max": "Name cannot exceed 30 characters",
      }),
    otherwise: Joi.string().allow("", null).optional(),
  }),
  msme_registration: Joi.string().valid("yes", "no"),
  msme_no: Joi.string()
    .label("MSME No.")
    .when("msme_registration", {
      is: "yes",
      then: Joi.string()
        .regex(/^[A-Z]{2}\d{2}[A-Z]\d{7}$/i)
        .length(12)
        .required()
        .messages({
          "string.pattern.base": "Invalid MSME Number",
          "string.length": "MSME number must have 18 characters",
          "any.required": "MSME is required",
        }),
      otherwise: Joi.optional().allow("", null),
    }),
  msme_certificate: Joi.string().optional().allow("", null),
  cin_no: Joi.string().when("org_type", {
    is: Joi.number().valid(1, 2).required(),
    then: Joi.when("country", {
      is: Joi.number().valid(101, "101").required(),
      then: Joi.string()
        .regex(/^([L|U|C|F]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6})$/)
        .length(21)
        .required()
        .messages({
          "string.pattern.base": "Invalid CIN Number",
          "string.length": "CIN number must have 21 characters",
          "any.required": "CIN is required",
        }),
      otherwise: Joi.string().allow("", null).optional(),
    }),
    otherwise: Joi.string().allow("", null).optional(),
  }),
  bank_name: Joi.string()
    .regex(/^[A-Za-z\s]+$/)
    .label("Bank Name")
    .required()
    .min(3)
    .max(60)
    .messages({
      "string.pattern.base": "Bank name must only contain letters",
      "string.min": "Bank name must be at least 3 characters",
      "string.max": "Bank name cannot exceed 60 characters",
      "any.required": "Bank name is required",
    }),
  branch_name: Joi.string()
    .label("Branch Name")
    .when("bank_name", {
      is: (value) => value && value.length,
      then: Joi.string()
        .regex(/^[A-Za-z\s]+$/)
        .max(60)
        .required()
        .messages({
          "string.pattern.base": "Branch name must only contain letters",
          "string.max": "Branch name cannot exceed 60 characters",
          "any.required": "Branch name is required",
        }),
    }),
  branch_address: Joi.string()
    .regex(/^[a-zA-Z0-9\s]+$/)
    .label("Branch Address")
    .when("bank_name", {
      is: (value) => value && value.length,
      then: Joi.string().max(200).required().messages({
        "string.pattern.base":
          "Branch Address must only contain alphanumeric values",
        "string.max": "Branch address cannot exceed 200 characters",
        "any.required": "Branch address is required",
      }),
    }),
  account_holder: Joi.string()
    .label("Account Holder Name")
    .when("bank_name", {
      is: (value) => value && value.length,
      then: Joi.string()
        .regex(/^[A-Za-z\s]+$/)
        .max(60)
        .required()
        .messages({
          "string.max": "Account holder name cannot exceed 60 characters",
          "any.required": "Account holder name is required",
        }),
    }),
  account_type: Joi.string()
    .label("Account Type")
    .when("bank_name", {
      is: (value) => value && value.length,
      then: Joi.string().valid("current", "savings").required().messages({
        "any.only": "Invalid account type",
        "any.required": "Account type is required",
      }),
    }),
  account_number: Joi.string()
    .label("Account Number")
    .when("bank_name", {
      is: (value) => value && value.length,
      then: Joi.string().regex(/^\d+$/).min(11).max(16).required().messages({
        "string.pattern.base":
          "Account number must be a valid positive integer",
        "string.min": "Account number must be at least 9 characters",
        "string.max": "Account number cannot exceed 18 characters",
        "any.required": "Account number is required",
      }),
    }),
  ifsc_code: Joi.string().when("country", {
    is: 101,
    then: Joi.string()
      .regex(/^[A-Za-z]{4}\d{7}$/)
      .length(11)
      .required()
      .messages({
        "string.pattern.base": "Invalid IFSC Code",
        "string.length": "IFSC Code must have 11 characters",
        "any.required": "IFSC Code is required",
      }),
    otherwise: Joi.string().allow("", null).optional(),
  }),
  other_org_type: Joi.string().when("org_type", {
    is: [5, '5'],
    then: Joi.string().required().messages({
      "any.required": "Must Specify the organization type",
    }),
    otherwise: Joi.string().optional().allow("", null),
  }),
  aggregate_annual_turnover: Joi.string().required(),
  declaration_confirmation: Joi.boolean().required(),
  contact_person: Joi.string().required(),
  incorporation_certificate: Joi.string().optional().allow("", null),
  primary_phone_code: Joi.string().required(),
  sec_phone_code: Joi.string().required(),
  iso: Joi.string().optional().allow("", null),
  state_name:Joi.string().optional().allow("", null),
  city_name:Joi.string().optional().allow("", null),
});

module.exports = vendorSchema;
