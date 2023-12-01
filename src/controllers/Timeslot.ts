import { DateRange, generateTimeSlots, provideDateAdapter, TimeInterval, TimeRange } from '@gund/time-slots';
import { dateFnsAdapter } from '@gund/time-slots/date-adapter/date-fns';
provideDateAdapter(dateFnsAdapter);

interface Timeslot {
  date: Date;
  timeRange: TimeRange;
}

const slots = generateTimeSlots(DateRange.fromDates(new Date(2023, 11, 1), new Date(2023, 11, 31)), TimeRange.fromTimeStrings('10:00', '22:00'), TimeInterval.minutes(60));

// Convert TimeRange objects to Timeslot objects
const timeSlots: Timeslot[] = slots.map((timeRange: TimeRange) => ({
  date: new Date(timeRange.from),
  timeRange: timeRange,
}));

export function getTimeSlotsByDate(req, res) {
  const filteredSlots = timeSlots.filter((slot) => {
    const slotDate = new Date(slot.date);
    const requestDate = new Date(req.params.date);

    return (
      slotDate.getDay() >= 1 &&
      slotDate.getDay() <= 5 &&
      slotDate.getFullYear() === requestDate.getFullYear() &&
      slotDate.getMonth() === requestDate.getMonth() &&
      slotDate.getDate() === requestDate.getDate()
    );
  });

  const formattedSlots = filteredSlots.map((slot) => ({
    date: slot.date.toISOString().split('T')[0],
    timeRange: {
      from: slot.timeRange.from.toISOString().split('T')[1].substring(0, 5),
      to: slot.timeRange.to.toISOString().split('T')[1].substring(0, 5),
    },
  }));

  res.send(formattedSlots);
}

export const deleteTimeSlot = (req, res) => {
  const { date, timeRange } = req.params;

  // Check if the date and timeRange are provided in the URL parameters
  if (!date || !timeRange) {
    return res.status(400).send({ error: 'Date and timeRange are required in the URL parameters' });
  }

  const timeRangeParts = timeRange.split('-');
  const startTime = timeRangeParts[0];
  const endTime = timeRangeParts[1];

  // Format date to match array format
  const formattedDate = new Date(date).toISOString().split('T')[0];

  // Find the index of the time slot to delete
  const indexToDelete = timeSlots.findIndex((slot) => {
    const slotDate = new Date(slot.date).toISOString().split('T')[0];

    const slotStartTime = slot.timeRange.from.toISOString().split('T')[1].substring(0, 5);
    const slotEndTime = slot.timeRange.to.toISOString().split('T')[1].substring(0, 5);

    return slotDate === formattedDate && slotStartTime === startTime && slotEndTime === endTime;
  });

  // Check if the time slot was found
  if (indexToDelete !== -1) {
    // Remove the time slot from the array
    timeSlots.splice(indexToDelete, 1);
    res.send('Deleted');
  } else {
    res.status(404).send({ error: 'Time slot not found' });
  }
};
