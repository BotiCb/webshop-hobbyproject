const db = require("../OracleDatabase/connectdb");
const userQuery = require("../OracleDatabase/UserSqlQueries");
const uuidv4 = require("uuid").v4;
const bcrypt = require("bcryptjs");
const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(password);
  async function comparePasswords(plainPassword, hashedPassword) {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
}

  try {
    if (req.session.userId) {
      res.status(402).json({ message: "Already logged in" });
      return;
    }

    const user = await db.findOne(userQuery.getUserByemail(email));
    console.log(user);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if ( await comparePasswords(password, user.password)) {
      const sessionId = uuidv4();
      req.session.userId = sessionId;
      res.cookie('sessionId', sessionId, {
        httpOnly: true,
        secure: false, // Set to true if using HTTPS
        sameSite: true // Use 'None' and secure: true if cross-site
      });
      await db.execute(userQuery.insertSession(sessionId, user.id));
      console.log(req.session);
      res.status(200).json({ message: "Login successful" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

  
};

const getOrders = async (req, res) => {
  try {
    const session_id = req.session.userId;
    if (!session_id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const user = await db.findOne(userQuery.getUserBySessionId(session_id));
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const orders = await db.findMany(userQuery.getOrdersByUserId(user.user_id));
    if (!orders) {
      throw new Error("Query did not return any data");
    }
    if (orders.length === 0) {
      res.status(404).json({ message: "No orders found" });
    } else {
      res.json(orders);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const logout = async (req, res) => {
  const session_id = req.session.userId;
  if (!session_id) {
    res.status(401).json({ message: "Already logged out" });
    return;
  }

  try {
    await db.execute(userQuery.deleteSession(session_id));
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging out" });
      } else {
        return res.status(200).json({ message: "Logout successful" });
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const navbar = async (req, res) => {
  try {
    const session_id = req.session.userId;
    if (!session_id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const user = await db.findOne(userQuery.getUserBySessionId(session_id));
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const navbar = await db.findOne(
      userQuery.getNavBarsByUserId(user.user_id)
    );
    if (!navbar) {
      throw new Error("Query did not return any data");
    }
    if (navbar.length === 0) {
      res.status(404).json({ message: "Navbar not found" });
    } else {
      res.json(navbar);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getShoppingCart = async (req, res) => {
  try {
    const session_id = req.session.userId;
    if (!session_id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const user = await db.findOne(userQuery.getUserBySessionId(session_id));
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const navbar = await db.findMany(
      userQuery.getShoppingCartByUserId(user.user_id)
    );
    if (!navbar) {
      throw new Error("Query did not return any data");
    }
    if (navbar.length === 0) {
      res.status(404).json({ message: "No items in Shoppingcart" });
    } else {
      res.json(navbar);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getFavorites = async (req, res) => {
  try {
    const session_id = req.session.userId;;
    if (!session_id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const user = await db.findOne(userQuery.getUserBySessionId(session_id));
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const navbar = await db.findMany(
      userQuery.getFavoritesByUserId(user.user_id)
    );
    if (!navbar) {
      throw new Error("Query did not return any data");
    }
    if (navbar.length === 0) {
      res.status(404).json({ message: "No items in Favorites" });
    } else {
      res.json(navbar);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const order = async (req, res) => {
  const { delivery_loc_id, delivery_address } = req.body;
  console.log(delivery_loc_id);
  console.log(delivery_address);
  try {
    if (
      delivery_loc_id === undefined ||
      delivery_address === undefined ||
      delivery_loc_id === null ||
      delivery_address === null ||
      isNaN(delivery_loc_id) ||
      delivery_address === ""
    ) {
      res.status(400).json({ message: "Invalid inputs" });
      return;
    }
    const session_id = req.session.userId;
    if (!session_id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const user = await db.findOne(userQuery.getUserBySessionId(session_id));
    console.log(user);
    if (!user || user == undefined) {
      res.status(404).json({ message: "User not found" });
      return;
    }

     
    await db.execute(
      userQuery.processOrder(user.user_id, delivery_loc_id, delivery_address)
    );


    res.status(200).json({ message: "Order successful" });
  } catch (err) {
    if (err.code === "ORA-20001") {
      res.status(410).json({ message: "Not enough itmes in stock" });
    } else {
      console.log("Error processing order:", err);
      res.status(500).json({ message: err.message });
    }
  }
};



const addItemToFavorites = async (req, res) => {
  try {
    const session_id = req.session.userId;;
    if (!session_id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const user = await db.findOne(userQuery.getUserBySessionId(session_id));
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const {product_id}  = req.body
    if(!product_id) throw new Error("Invalid product id");
    await db.execute(userQuery.addProductToFavorites(user.user_id, product_id));
    res.status(200).json({ message: "toggle favorite success" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




const updateShoppingCart = async (req, res) => {
  try {
    const session_id = req.session.userId;
    if (!session_id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const user = await db.findOne(userQuery.getUserBySessionId(session_id));
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const  {product_id, product_size, status}  = req.body;
    if(!product_id) throw new Error("Invalid product id");
    await db.execute(userQuery.updateShoppingCart(user.user_id, product_id, product_size, status));
    res.status(200).json({ message: "Item succesfully updated in shoppingcart" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const register = async (req, res) => {
  async function hashPassword(password) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}
  

  try {
    const newUser = req.body;
    if (req.session.userId) {
      res.status(402).json({ message: "Already logged in" });
      return;
    }

    const user = await db.findOne(userQuery.getUserByemail(newUser.email));
    
    if (user) {
      res.status(402).json({ message: "User already exists" });
      return;
    }
      console.log(newUser);
      
        newUser.password = await hashPassword(newUser.password);
      
      
      
      console.log(newUser);
      await db.execute(userQuery.insertUser(newUser));
      const freshUser = await db.findOne(userQuery.getUserByemail(newUser.email));

      const sessionId = uuidv4();
      req.session.userId = sessionId; 
      await db.execute(userQuery.insertSession(sessionId, freshUser.id));
      res.status(200).json({ message: "Registration successful" });
     
      
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const changePassword = async (req, res) => {
  const { password, newPassword } = req.body;
  console.log(password);
  console.log(req.session.userId);

  async function comparePasswords(plainPassword, hashedPassword) {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
}

async function hashPassword(password) {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}


  try {
    if (!req.session.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const session_id = req.session.userId;
    const userid = await db.findOne(userQuery.getUserBySessionId(session_id));
    const user = await db.findOne(userQuery.getUserById(userid.user_id));
    console.log(user);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (await comparePasswords(password, user.password)) {
      const hashedNewPassword = await hashPassword(newPassword);
      await db.execute(userQuery.updatePassword(user.id, hashedNewPassword));
      res.status(200).json({ message: "Password change successful" });
    } else {
      res.status(401).json({ message: "Incorrect password" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};










module.exports = {
  login,
  logout,
  getOrders,
  navbar,
  getShoppingCart,
  getFavorites,
  order,
  addItemToFavorites,
  updateShoppingCart,
  register,
  changePassword

  
};
