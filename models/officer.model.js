module.exports = (sequelize, Sequelize) => {
  const Officer = sequelize.define("officer", {
    badgeNumber: {
      type: Sequelize.INTEGER
    },
    name: {
      type: Sequelize.STRING
    },
    signedIn: {
      type: Sequelize.STRING
    }
  });

  return Officer;
};
