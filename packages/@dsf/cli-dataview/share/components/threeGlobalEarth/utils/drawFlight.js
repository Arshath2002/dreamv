/*
 * @Editor: zhanghang
 * @Description:
 * @Date: 2024-08-26 13:44:48
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-08-27 11:09:08
 */
import { lon2xyz } from "./tools.js";
import { flightyArc } from "./arc.js";

export const drawFlight = (options, config) => {
  const { data } = options;

  const radius = config.radius;

  const flightLine = [];

  data.forEach((it) => {
    const district = it.district;
    const start = district[0];
    const end = district[1];
    const startPoint = lon2xyz(radius, start[0], start[1]);
    const endPoint = lon2xyz(radius, end[0], end[1]);
    const flight = flightyArc(radius, startPoint, endPoint, options);
    
    flightLine.push(flight);
  });

  return { flightLine };
};