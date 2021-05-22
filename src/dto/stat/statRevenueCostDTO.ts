import AbstractDTO from "../abstractDTO";

export default class StatRevenueCostDTO extends AbstractDTO {
  private revenue: number
  private cost: number

  constructor(revenue: number, cost: number) {
    super();

    this.revenue = Number(revenue);
    this.cost = Number(cost);
  }
}