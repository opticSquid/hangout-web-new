import { formatDistanceToNow } from "date-fns";

export const GetTimeDifferenceFromUTC = (utcTimestamp: string): string => {
  const utcDate = new Date(utcTimestamp);
  return formatDistanceToNow(utcDate, {
    addSuffix: true,
    includeSeconds: true,
  });
};

export const FormatDate = (date: Date): string => {
  // Options for the full weekday, full month, day, and year
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  // Options for the hour and minute (with AM/PM)
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true, // Use 12-hour format with AM/PM
  };

  // Format the date part
  const formattedDate = new Intl.DateTimeFormat("en-US", dateOptions).format(
    date
  );

  // Format the time part
  const formattedTime = new Intl.DateTimeFormat("en-US", timeOptions).format(
    date
  );

  // Combine them
  return `${formattedDate} at ${formattedTime}`;
};
