export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
  isExpired: boolean;
}

export const getCountdown = (targetDate: string): CountdownResult => {
  const now = new Date().getTime();
  const target = new Date(targetDate).getTime();
  const total = target - now;

  if (total <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      total: 0,
      isExpired: true,
    };
  }

  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((total % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, total, isExpired: false };
};

export const formatCountdown = (date: string): string => {
  const { days, hours, isExpired } = getCountdown(date);
  if (isExpired) return "Released";
  if (days > 30) return `${Math.ceil(days / 30)} months away`;
  if (days > 0) return `${days}d ${hours}h away`;
  return `${hours}h away`;
};
