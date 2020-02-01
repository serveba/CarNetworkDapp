var Car = artifacts.require("./Car.sol");

module.exports = function (deployer) {  
  deployer.deploy(Car);
};
