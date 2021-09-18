import { Injectable } from '@angular/core';
declare var google;

@Injectable({
  providedIn: 'root'
})
export class GmapService {

  constructor() {

  }

  async calculateDistance(origin = {}, destination = [], travelMode = 'DRIVING') {

    const getDistanceMatrix = (service, parameters) => new Promise((resolve, reject) => {
        service.getDistanceMatrix(parameters, (response, status) => {
          if (status != google.maps.DistanceMatrixStatus.OK) {
            console.log('Galyon: Distance Matrix Service: '+status);
            reject(response);
          } else {
            const matrix = {
              origin: "",
              destinations: [],
              distances: []
            };
            matrix.origin = response.originAddresses[0];
            response.destinationAddresses.forEach(destination => {
              matrix.destinations.push(destination);
            });
            response.rows.forEach(row => {
              matrix.distances.push(row.elements);
            });
            resolve(matrix);
          }
        });
    });

    const matrixService = new google.maps.DistanceMatrixService();
    const distancesList = await getDistanceMatrix(matrixService, {
        origins: [origin], //Only 1
        destinations: destination,
        travelMode: travelMode,
        unitSystem: google.maps.UnitSystem.METRIC,
    });

    return distancesList;
  }
}
