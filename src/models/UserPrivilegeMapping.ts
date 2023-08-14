import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userPrivilegeMappingSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    privileges: {
        type: [String]
    }
}, { 
    timestamps: true,
    versionKey: false
})

const UserPrivilegeMapping = mongoose.model("UserPrivilegeMapping", userPrivilegeMappingSchema, "user_privilege_mapping");

export default UserPrivilegeMapping;
