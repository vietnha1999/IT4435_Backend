import serverConfig from "../../config/serverConfig";
import { ProductEntity } from "../../entity/productEntity";

export default class ProductItemFindDTO{

  public id: string
  public name: string
  public price: number
  public description: string
  public previewUri: string
  public isActive: boolean

  constructor(e: ProductEntity) {
    this.id = e.id;
    this.name = e.name;
    this.price = e.price;
    this.description = e.description;
    if (e.previewUri.includes("https://i.postimg")) {

    }
    else {
      this.previewUri = serverConfig?.urlPrefix + e.previewUri;
    }
    this.isActive = e.isActive;
  }
}