export const thisYear = new Date().getFullYear();
export const thisSeason = String(new Date().getMonth() > 5 ? thisYear : thisYear - 1);
