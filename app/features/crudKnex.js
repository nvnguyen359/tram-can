const path = require("path");
require("dotenv").config();
const lib = require("./../shares/lib");
const { initTable } = require("./createTable");
class CRUDKNEX {
  knex;
  constructor(table = null) {
    this.table = table;
    const localDatabase =
      process.env.EVN_NODE != "production"
        ? path.join(__dirname, process.env.SQLITE_FILENAME)
        : path.join(process.env.localDatabase+'\\Local Storage', process.env.SQLITE_FILENAME);
    this.knex = require("knex")({
      client: "sqlite",
      connection: {
        filename:`${localDatabase}.db`,
      },
      useNullAsDefault: true,
    });
  }
  async initTable() {
    return await initTable(this.knex);
  }
  set setTable(table) {
    this.table = table;
  }
  get getTable() {
    return this.table;
  }
  async create(data) {
    if (!Array.isArray(data)) {
      data = [data];
    }
    if (data.lenght < 1) return { result: [] };
    let data1 = Array.from(data).map((x) => {
      if (!x.createdAt) x.createdAt = new Date().toISOString();
      if (!x.updatedAt) x.updatedAt = new Date().toISOString();
      return x;
    });
    try {
      const result = await this.knex(this.table).insert(data1).returning("*");
      return result;
    } catch (error) {
      console.log(error);
      return { error };
    }
  }
  async update(data) {
    const id = data?.id;
    data.updatedAt = new Date().toISOString();
    try {
      const result = await this.knex(this.table)
        .where({ id })
        .update(data)
        .returning("*");
      return result;
    } catch (error) {
      return { error };
    }
  }
  async upsert(data) {
    let id = null;
    if (Array.isArray(data)) {
      id = Array.from(data)[0];
    } else {
      id = data.id;
    }
    return id ? await this.update(data) : await this.create(data);
  }
  async destroy(id) {
    const result = await this.knex(this.table)
      .del()
      .where({ id })
      .returning("*");
    // console.log("id ", id, this.table, result);
    return result;
  }
  async bulkDelete(ids) {
    return new Promise(async (res, rej) => {
      const result = await this.knex(this.table)
        .del()
        .whereIn("id", ids)
        .returning("*");
      res(result);
    });
  }
  async findAll(obj = null) {
    const {
      query = "",
      column,
      limit = 100,
      offset = 0,
      startDay,
      endDay,
      name = "",
    } = obj;
    return new Promise(async (res, rej) => {
      const orderBy = "id";
      const wherename = name
        ? await this.knex(this.table)
            
            .columns(column)
            .select()
            .whereLike('name',`%${name}%`)
            .limit(limit)
            .offset(offset)
            .orderBy(orderBy, "desc")
        : await this.knex(this.table)
            .columns(column)
            .select()
            .limit(limit)
            .offset(offset)
            .orderBy(orderBy, "desc");
            console.log(this.table,'name',name,wherename.length)
      let qr = !startDay
        ? wherename
        : await this.knex(this.table)
            .whereBetween("createdAt", [
              new Date(startDay).toISOString(),
              new Date(endDay).toISOString(),
            ])
            .columns(column)
            .select()
            .limit(limit)
            .offset(offset)
            .orderBy(orderBy, "desc");
      const result =
        query == ""
          ? qr
          : !offset
          ? await this.knex.raw(
              query +
                ` limit ${limit} offset ${offset} ORDER BY ${orderBy} DESC`
            )
          : await knex.raw(query);
          //console.log(wherename)
      this.knex(this.table)
        .count("id as CNT")
        .then((total) => {
          res({ items: result, count: total[0].CNT });
        });
    });
  }
  async findId(id) {
    return await this.knex(this.table).where({ id }).first();
  }
  async filterWithObj(obj) {
    return await this.knex(this.table).where(obj);
  }
  async findOne(obj) {
    return await this.knex(this.table).where(obj).first();
  }
  async filterQuery(query) {
    const result = await this.knex.raw(query);
    //console.log(result)
    return result;
  }
}
// (async()=>{
//   let crud = new CRUDKNEX('Đơn Hàng');
//   await crud.getAll()
// })()
module.exports = { CRUDKNEX };
