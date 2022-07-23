import dayjs from 'dayjs';
import timezonePlugin from 'dayjs/plugin/timezone';

dayjs.extend(timezonePlugin)

const getUserTimezone = () => {
  return dayjs.tz.guess()
}

export { getUserTimezone }
