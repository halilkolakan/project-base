const passport = require("passport");
const { ExtractJwt, Strategy, Strategy } = require("passport-jwt");
const Users = require("../db/models/Users");
const UsersRoles = require("../db/models/UsersRoles");
const RolePrivileges = require("../db/models/RolePrivileges");

const config = require("../config");
const RolePrivileges = require("../db/models/RolePrivileges");

module.exports = function () {
  let Strategy = new Strategy(
    {
      secretOrKey: config.JWT.SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (payload, done) => {
      try {
        let user = await Users.findOne({ _id: payload.id });

        if (user) {
          let userRoles = await UsersRoles.find({ user_id: payload.id });

          let RolePrivileges = await RolePrivileges.find({
            role_id: { $in: userRoles.map((ur) => ur.role_id) },
          });

          done(null, {
            id: user._id,
            roles: RolePrivileges,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            exp: parseInt(Date.now() / 1000) * config.JWT.EXPIRE_TIME,
          });
        } else {
          done(new Error("User not found"), null);
        }
      } catch (err) {
        done(err, null);
      }
    }
  );

  passport.use(Strategy);

  return {
    initialize: function () {
      return passport.initialize();
    },
    authenticate: function () {
      return passport.authenticate("jwt", { session: false });
    },
  };
};
