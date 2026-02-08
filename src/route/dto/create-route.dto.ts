import { RouteStationItemDto } from './route-station.dto';

export class CreateRouteDto {
  name: string;
  routeStations: RouteStationItemDto[];
}
