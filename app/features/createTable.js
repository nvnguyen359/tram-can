const e = require("express");
const { delay } = require("./../shares/lib");
const createUsers = async (knex) => {
  try {
    const tbl = "user";
    const hasTable = await knex.schema.hasTable(tbl);
    if (hasTable) {
      //  console.log(tbl, "already exist!");
      return tbl;
    }
    await knex.schema.createTable(tbl, (table) => {
      table.increments("id", {
        primaryKey: true,
        notNullable: true,
      });
      table.string("userName", 250).notNullable();
      table.string("password", 250).notNullable();
      table.string("level", 250).notNullable();
      table.string("status", 250);
      table.string("active");
      table.string("companyId");
      exoend(table);
    });
    // console.log(tbl, "successfully created");
    return tbl;
  } catch (error) {
    console.error(error.message);
  }
};

const createWeighStation = async (knex) => {
  try {
    const tbl = "weighStation";
    const hasTable = await knex.schema.hasTable(tbl);
    if (hasTable) {
      // console.log(tbl, "already exist!");
      return tbl;
    }
    await knex.schema.createTable(tbl, (table) => {
      table.increments("id", {
        primaryKey: true,
        notNullable: true,
      });
      table.string("carNumber", 250).notNullable();
      table.string("customerName", 250).notNullable();
      table.integer("weight1").notNullable();
      table.integer("weight2").notNullable();
      table.integer("cargoVolume");
      table.double("impurities");
      table.string("customerId");
      table.string("type", 250);
      table.text("note");
     
      table.string("userId");
      exoend(table);
    });
    // console.log(tbl, "successfully created");
    return tbl;
  } catch (error) {
    console.error(error.message);
  }
};
const createCustomer = async (knex) => {
  try {
    const tbl = "customer";
    const hasTable = await knex.schema.hasTable(tbl);
    if (hasTable) {
      // console.log(tbl, "already exist!");
      return tbl;
    }
    await knex.schema.createTable(tbl, (table) => {
      table.increments("id", {
        primaryKey: true,
        notNullable: true,
      });
      table.string("name", 250);
      table.string("phone");
      table.string("address");
      table.string("email");
      table.string("userId");
      exoend(table);
    });
    // console.log(tbl, "successfully created");
    return tbl;
  } catch (error) {
    console.error(error.message);
  }
};
const createCompany = async (knex) => {
  try {
    const tbl = "company";
    const hasTable = await knex.schema.hasTable(tbl);
    if (hasTable) {
      //console.log(tbl, "already exist!");
      return tbl;
    }
    await knex.schema.createTable(tbl, (table) => {
      table.increments("id", {
        primaryKey: true,
        notNullable: true,
      });
      table.string("name", 250);
      table.string("address");
      table.string("phone");
      table.string("fax");
      table.string("userId");
      exoend(table);
    });
    //console.log(tbl, "successfully created");
    return tbl;
  } catch (error) {
    console.error(error.message);
  }
};

const exoend = (table) => {
  table.datetime("createdAt").notNullable();
  table.datetime("updatedAt");
};
const setting = async (knex) => {
  try {
    const tbl = "setting";
    const hasTable = await knex.schema.hasTable(tbl);
    if (hasTable) {
      //console.log(tbl, "already exist!");
      return tbl;
    }
    await knex.schema.createTable(tbl, (table) => {
      table.increments("id", {
        primaryKey: true,
        notNullable: true,
      });
      table.string("name");
      table.string("jsonData");
      exoend(table);
    });

    // console.log(tbl, "successfully created");
    return tbl;
  } catch (error) {
    console.error(error.message);
  }
};
const initTable = async (knex) => {
  return new Promise(async (res, rej) => {
    let tables = [];
    // await createUsersTable(knex);
    let tb = await createUsers(knex);
    tables.push(tb);
    tb = await createWeighStation(knex);
    tables.push(tb);
    tb = await createCustomer(knex);
    tables.push(tb);
    tb = await createCompany(knex);
    tables.push(tb);
    tb = await setting(knex);
    tables.push(tb);
    res(tables);
    await afterTabletramCan(knex);
  });
};
const afterTabletramCan = async (knex) => {
  let column = "isActive";
  let exists = await knex.schema.hasColumn("weighStation", column);
  if (!exists) {
    await knex.schema.table("weighStation", async (table1) => {
      table1.boolean(column);
    });
  }
  column = "ieGoods";
  exists = await knex.schema.hasColumn("weighStation", column);
  if (!exists) {
    await knex.schema.table("weighStation", async (table1) => {
      table1.string(column);
    });
  }
  column = "impuritiesKg";
  exists = await knex.schema.hasColumn("weighStation", column);
  if (!exists) {
    await knex.schema.table("weighStation", async (table1) => {
      table1.string(column);
    });
  }
  column = "price";
  exists = await knex.schema.hasColumn("weighStation", column);
  if (!exists) {
    await knex.schema.table("weighStation", async (table1) => {
      table1.string(column);
    });
  }
  column = "productName";
  exists = await knex.schema.hasColumn("weighStation", column);
  if (!exists) {
    await knex.schema.table("weighStation", async (table1) => {
      table1.string(column);
    });
  }
  column = "time1";
  exists = await knex.schema.hasColumn("weighStation", column);
  if (!exists) {
    await knex.schema.table("weighStation", async (table1) => {
      table1.string(column);
    });
  }
  column = "time2";
  exists = await knex.schema.hasColumn("weighStation", column);
  if (!exists) {
    await knex.schema.table("weighStation", async (table1) => { 
      table1.string(column);
    });
  }
  column = "unit";
  exists = await knex.schema.hasColumn("weighStation", column);
  if (!exists) {
    await knex.schema.table("weighStation", async (table1) => {
      table1.string(column);
    });
  }
};
module.exports = { initTable };
