const authRoute = require("./auth.routes");
const roleRoute = require("./role.routes");
const inboundRoute = require("./inbound.routes");
const departmentRoute = require("./department.routes");
const permissionRoute = require("./permission.routes");
const clientRoutes = require("./client.routes");
const configurationRoutes = require("./configuration.routes");
const userRoutes = require("./user.routes");
const yardRoutes = require("./yard.routes");
const customerRoutes = require("./customer.routes");
const commmonRoutes = require("./common.routes");
const productRoutes = require("./product.routes");
const locationRoutes = require("./location.routes");
const categoryRoutes = require("./category.routes");
const customerProductRoutes = require("./customer.product.routes");
const userCustomerRoutes = require("./user.customer.routes");
const dispatchtypeRoutes = require("./dispatchtype.routes");
const dispatchcustomerRoutes = require("./dispatchcustomer.routes");
const preStagesRoutes = require("./pre-stages.routes");

const userLocationRoutes = require("./user.location.routes");
// const userRoutes = require("./user.routes");
// const commmonRoutes = require("./common.routes");
const app = require("../app");

//! always remove /api before pushing to server
function appRouter() {
  app.use("/v1/auth", authRoute);
  app.use("/v1/inbound", inboundRoute);
  app.use("/v1/roles", roleRoute);
  app.use("/v1/departments", departmentRoute);
  app.use("/v1/permissions", permissionRoute);
  app.use("/v1/client", clientRoutes);
  app.use("/v1/configuration", configurationRoutes);
  app.use("/v1/users", userRoutes);
  app.use("/v1/product", productRoutes);
  app.use("/v1/yard", yardRoutes);
  app.use("/v1/category", categoryRoutes);
  app.use("/v1/customer", customerRoutes);
  app.use("/v1/location", locationRoutes);
  app.use("/v1/customer/product", customerProductRoutes);
  app.use("/v1/user/customer", userCustomerRoutes);
  app.use("/v1/dispatch", dispatchtypeRoutes);
  app.use("/v1/dispatch/customer", dispatchcustomerRoutes);
  app.use("/v1/user/location", userLocationRoutes);
  app.use("/v1/pre-stages", preStagesRoutes);

  app.use("/v1", commmonRoutes);
  // app.use("/v1/users", userRoutes);
  // app.use("/v1", commmonRoutes);
}
module.exports = appRouter;
