import dayjs from 'dayjs';
import timezonePlugin from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezonePlugin)
dayjs.extend(duration)
dayjs.extend(relativeTime)

const getUserTimezone = () => {
  return dayjs.tz.guess()
}

const getTimestampInHumanFormat = (timestamp, timezone) => {
  return `${dayjs(timestamp).tz(timezone).format("MM/DD/YYYY")} at ${dayjs(timestamp).tz(timezone).format("HH:mm:ss")}`;
}

const getDuration = (count) => {

  if (count <= 60) {
    return dayjs.duration(count, "seconds").humanize();
  } else if (count > 60 && count < 3600) {
    return dayjs.duration(Math.floor(count / 60), "minutes").humanize();
  }
}

const getTimeAgo = (timestamp) => {
  if (!timestamp) return null;
  return dayjs(timestamp).fromNow();
}

export { getUserTimezone, getTimestampInHumanFormat, getDuration, getTimeAgo }
