export class Utils {
  static convertPrice(price: number) {
    return price / 100;
  }

  static formatPrice(price: number): string {
    try {
      return (price / 100).toFixed(2) + " zł";
    } catch (e) {
      console.error(e);
      return "error";
    }
  }
}
