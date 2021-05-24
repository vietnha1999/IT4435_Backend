import serverConfig from "../../config/serverConfig";
import { EmployeeEntity } from "../../entity/employeeEntity";
import AbstractDTO from "../abstractDTO";

export default class AccountSignInDTO extends AbstractDTO {
  public token: string
  
  public id: string
  public firstName: string
  public lastName: string
  public birthday: Date
  public address: string
  public position: string
  public joinDate: Date
  public expireDate: Date
  public cccd: string
  public avatarUri: string
  public roleCode: number
  
  constructor(token: string, e: EmployeeEntity) {
    super()
    this.token = token;

    this.id = e.id;
    this.firstName = e.firstName;
    this.lastName = e.lastName;
    this.birthday = e.birthday;
    this.address = e.address;
    this.position = e.position;
    this.joinDate = e.joinDate;
    this.expireDate = e.expireDate;
    this.cccd = e.cccd;

    if (e.avatarUri.includes("https://i.postimg")) {

    }
    else {
      this.avatarUri = serverConfig?.urlPrefix + e.avatarUri;
    }
    this.roleCode = e.roleCode;
  }
}