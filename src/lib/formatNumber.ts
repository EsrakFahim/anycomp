export const formatNumber = (num: number | string): string => {
      const value = typeof num === "string" ? Number(num) : num;

      if (isNaN(value)) return "0";

      return new Intl.NumberFormat("en-US").format(value);
};