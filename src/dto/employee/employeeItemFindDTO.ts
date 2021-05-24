import serverConfig from "../../config/serverConfig";
import { EmployeeEntity } from "../../entity/employeeEntity";

export default class EmployeeItemFindDTO{
  public id: string
  public firstName: string
  public lastName: string
  public address: string
  public position: string
  public avatarUri: string
  public isActive: boolean
  public cccd: string

  constructor(e: EmployeeEntity) {
    this.id = e.id;
    this.firstName = e.firstName;
    this.lastName = e.lastName;
    this.address = e.address;
    this.position = e.position;
    
    if (e.avatarUri.includes("https://i.postimg")) {

    }
    else {
      this.avatarUri = serverConfig?.urlPrefix + e.avatarUri;
    }

    this.isActive = e.isActive;
    this.cccd = e.cccd;
  }
}