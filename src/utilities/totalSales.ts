// Define types for transaction and the response
interface Transaction {
    price: number;
    voucher_codes: string; // Assuming voucher codes are represented as an array of strings
  }

  
  // Function to calculate total sales
  function calculateTotalSales(response: Transaction[]): number {
    let totalSales = 0;
    response.forEach((transaction: Transaction) => {
      const { price, voucher_codes } = transaction;
      const numberOfVoucherCodes = JSON.parse(voucher_codes).length; // Count the number of voucher codes

      totalSales += price * numberOfVoucherCodes;
    });
    return totalSales;
    
  }

  export default calculateTotalSales;