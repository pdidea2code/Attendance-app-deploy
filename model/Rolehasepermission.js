const mongoose = require("mongoose");

const RolehasepermissionSchema = new mongoose.Schema(
  {
    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "role",
    },
    permission_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "permission",
    },

    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("rolehasepermission", RolehasepermissionSchema);
