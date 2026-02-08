export class CreateScheduleDto {
  trainId: string;
  routeId: string;
  departureTime: string;
  daysOfWeek?: number[];
}
