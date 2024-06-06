const oracledb = require("oracledb");

async function initialize() {
  try {
    await oracledb.createPool({
      user: "c##Info11",
      password: "Sapi12345",
      connectString: "217.73.170.84:44678/Orcl",
    });
    console.log("Successfully connected to the database!");

    
  } catch (err) {
    console.error("Error occurred during initialization:", err);
    throw err;
  }
}

async function close() {
  try {
    await oracledb.getPool().close(0);
    console.log("Connection pool closed");
  } catch (err) {
    console.error("Error closing connection pool:", err);
    throw err;
  }
}

async function findMany(sql) {
  try {
    
    const connection = await oracledb.getConnection();

   
    console.log(sql);
    const result = await connection.execute(sql);
    console.log(result);
   
    await connection.close();

    
    const jsonData = result.rows.map((row) => {
      const obj = {};
      result.metaData.forEach((meta, index) => {
        obj[meta.name.toLowerCase()] = row[index];
      });
      return obj;
    });
    
    
    return jsonData;
  } catch (err) {
    console.error("Error executing query:", err);
    throw err;
  }
}

async function findOne(sql) {
  try {
    
    const connection = await oracledb.getConnection();


    console.log(sql);
    const result = await connection.execute(sql);


    await connection.close();

   
    if (result.rows.length === 0) 
      return null; 

   
    const row = result.rows[0];
    const jsonData = {};
    result.metaData.forEach((meta, index) => {
      jsonData[meta.name.toLowerCase()] = row[index];
    });
    console.log(result);

    return jsonData;
  } catch (err) {
    console.error("Error executing query:", err);
    throw err;
  }
}


async function execute(sql, params = []) {
  try {
    
    const connection = await oracledb.getConnection();

   
    console.log(sql, params);
    const result = await connection.execute(sql, params, { autoCommit: true });
    console.log(result);
    await connection.close();

    return result.rowsAffected;
  } catch (err) {
    console.error('Error executing query:', err);
    throw err;
  }
}

module.exports = {
  initialize,
  close,
  findMany,
  findOne,
  execute
};
