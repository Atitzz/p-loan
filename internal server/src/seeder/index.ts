import { Permissions } from "../apps/Permission/entities";
import { Roles } from "../apps/Roles/entities";
import { Users } from "../apps/Users/entities";
import { orm } from "../data-source";
import * as bcrypt from "bcrypt";
export const seeder = async () => {
  const __roles = await orm(Roles).count();
  const __permissions = await orm(Permissions).count();
  const __users = await orm(Users).count();
  if (!__roles) await orm(Roles).save({ key: "admin", name: "admin" });
  if (!__permissions)
  {
    await orm(Permissions).save([
      {
        key: "superadmin",
        name: "Super Admin",
        approve: true,
        reject: true,
        show: true,
        list: true,
        store: true,
        update: true,
        remove: true,
      },{
      key: "admin",
      name: "Admin",
      approve: true,
      reject: true,
      show: true,
      list: true,
      store: true,
      update: true,
      remove: true,
    },{
      key: "users",
      name: "Users",
      approve: true,
      reject: true,
      show: true,
      list: true,
      store: true,
      update: true,
      remove: true,
    }]);
  }


  if (!__users) {
    
    const __existPermission = await orm(Permissions).findOne({
      where: { key: "admin" },
    });
    if (!__existPermission) return console.error("Permission not found");

    const __existRoles = await orm(Roles).find({
      
      });
      if (!__existRoles) return console.error("Roles not found");

    await orm(Users).save({
      firstname: "admin",
      lastname: "admin",
      citizen_id: "1111111111111",
      mobile: "0000",
      phone: "admin",
      address: "admin",
      username: "admin",
      password: bcrypt.hashSync("#44admin", 8),
      accesstoken: "",
      permissions: __existPermission,
      roles: __existRoles,
    });
  }
};
