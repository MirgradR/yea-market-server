import * as dayjs from 'dayjs';

export function generateExpiryDate(amount: number, unit: dayjs.ManipulateType) {
  return dayjs().add(amount, unit).toDate();
}
