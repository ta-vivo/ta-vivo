import dayjs from 'dayjs';
import timezonePlugin from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezonePlugin)

const getUserTimezone = () => {
  return dayjs.tz.guess()
}

const getTimestampInHumanFormat = (timestamp, timezone) => {
  return `${dayjs(timestamp).tz(timezone).format("MM/DD/YYYY")} at ${dayjs(timestamp).tz(timezone).format("HH:mm:ss")}`;
}

export { getUserTimezone, getTimestampInHumanFormat }
