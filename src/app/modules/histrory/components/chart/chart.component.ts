import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import Chart from 'chart.js';
import { ChartServiceService } from '../../services/chart-service/chart-service.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.sass']
})
export class ChartComponent implements AfterViewInit {
  @ViewChild('chartCanvas') canvasRef: ElementRef;
  chart: Chart;

  constructor(private chartService: ChartServiceService) { }

  ngAfterViewInit() {
    this.chart = new Chart(this.canvasRef.nativeElement.getContext('2d'), {
      type: 'line',
      options: {
        hover: true,
        elements: {
          line: {
              tension: 0
          }
        },
        responsive: true,
        scales: {
          xAxes: [
            {
              type: "time",
              distribution: "linear",
              time: {
                unit: "day",
              }
            }
          ],
        }
      },
      data: []
    });
    this.chartService.$data.subscribe(dataSet => {
      this.chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
      });
      this.chart.data.datasets = dataSet;
     
      this.chart.update();
    })
  }
}
