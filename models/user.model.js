// third packajes
const bcrypt = require("bcryptjs");
const mongodb = require('mongodb');

// own packages
const db = require("../data/database");

class User {
  constructor(email, password, fullname, street, postal, city) {
    this.email = email;
    this.password = password;
    this.name = fullname;
    this.address = {
      street: street,
      postalCode: postal,
      city: city,
    };
  }

  // finding user by id and this will get us some raw user data not an instance of the class
  static findById(userId) {
    const uid = new mongodb.ObjectId(userId);

    return db.getDb().collection('users').findOne({ _id: uid }, { projection: { password: 0 } });
  }

  getUserWithSameEmail() {
    return db.getDb().collection('users').findOne({ email: this.email });
  }

  async existsUserEmail() {
    const existingUser = await this.getUserWithSameEmail();
    if (existingUser) {
      return true; 
    }
    return false;
  }

  hasMatchingPasswords(hashedPassword) {
    return bcrypt.compare(this.password, hashedPassword);
  }

  async signup() {

    const hashedPassword = await bcrypt.hash(this.password, 12);

    await db.getDb().collection("users").insertOne({
      email: this.email,
      password: hashedPassword,
      name: this.name,
      address: this.address,
    });
  }
}

module.exports = User;