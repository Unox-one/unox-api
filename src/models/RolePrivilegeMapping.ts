import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const rolePrivilegeMappingSchema = new Schema({
    role: {
        type: String,
        required: true
    },
    privileges: {
        type: [String]
    }
}, { 
    timestamps: true,
    versionKey: false
})

const RolePrivilegeMapping = mongoose.model("RolePrivilegeMapping", rolePrivilegeMappingSchema, "role_privilege_mapping");

export default RolePrivilegeMapping;
