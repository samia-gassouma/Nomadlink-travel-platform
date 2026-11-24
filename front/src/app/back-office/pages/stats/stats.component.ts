import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ReservationService } from 'src/app/front-office/services/reservation_flight/reservation.service';
import { Reservation } from 'src/app/front-office/models/reservation.model';
import { CommonModule } from '@angular/common';
import { Chart, registerables, ChartType } from 'chart.js';
import { FormsModule } from '@angular/forms';

Chart.register(...registerables);

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent implements OnInit, AfterViewInit, OnDestroy {
  // Données et états
  reservations: (Reservation & { vol?: any; event?: any })[] = [];
  filteredReservations: (Reservation & { vol?: any; event?: any })[] = [];
  flightStats: { [key: string]: number } = {};
  eventStats: { [key: string]: number } = {};
  destinationStats: { [key: string]: number } = {};
  compagnieStats: { [key: string]: number } = {};
  topCompagnies: [string, number][] = [];
  topDestinations: [string, number][] = [];
  topVols: [string, number][] = [];
  totalFlightReservations: number = 0;
  totalEventReservations: number = 0;
  topDestination: string = 'Aucune donnée';
  totalPassengers: number = 0;
  totalFlights: number = 0;
  isLoading: boolean = true;
  selectedPeriod: string = 'week';
  private charts: Chart[] = [];

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.setupChartContainers();
  }

  ngOnDestroy(): void {
    this.destroyAllCharts();
  }

  private loadData(): void {
    this.isLoading = true;
    
    this.reservationService.getAllwithname().subscribe({
      next: (data) => {
        this.reservations = data;
        this.filterStats(); // Applique le filtre initial
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.isLoading = false;
      },
    });
  }

  filterStats(): void {
    // Filtrage côté client
    const now = new Date();
    this.filteredReservations = this.reservations.filter(res => {
      const resDate = new Date(res.dateReservation); // Adaptez selon votre modèle
      
      switch(this.selectedPeriod) {
        case 'day':
          return resDate.toDateString() === now.toDateString();
        case 'week':
          const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
          const lastDayOfWeek = new Date(firstDayOfWeek);
          lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
          return resDate >= firstDayOfWeek && resDate <= lastDayOfWeek;
        case 'month':
          return resDate.getMonth() === now.getMonth() && 
                 resDate.getFullYear() === now.getFullYear();
        case 'year':
          return resDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });

    this.generateStats();
    setTimeout(() => this.createCharts(), 0);
  }

  refreshStats(): void {
    this.loadData();
  }

  private setupChartContainers(): void {
    const chartIds = ['flightChart', 'eventChart', 'destinationChart', 'compagnieChart'];
    chartIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.style.height = '250px';
        element.style.width = '100%';
      }
    });
  }

  generateStats(): void {
    this.resetStats();

    this.filteredReservations.forEach(res => {
      if (!res) return;

      if (res.vol) this.processFlightStats(res.vol);
      if (res.event?.title) this.processEventStats(res.event);
    });

    this.calculateTotals();
    this.calculateTopItems();
  }

  private resetStats(): void {
    this.flightStats = {};
    this.eventStats = {};
    this.destinationStats = {};
    this.compagnieStats = {};
    this.totalPassengers = 0;
    this.totalFlights = 0;
    this.totalFlightReservations = 0;
    this.totalEventReservations = 0;
  }

  private processFlightStats(vol: any): void {
    if (vol?.numeroVol) this.flightStats[vol.numeroVol] = (this.flightStats[vol.numeroVol] || 0) + 1;
    if (vol?.aeroportArrivee) this.destinationStats[vol.aeroportArrivee] = (this.destinationStats[vol.aeroportArrivee] || 0) + 1;
    if (vol?.compagnie) this.compagnieStats[vol.compagnie] = (this.compagnieStats[vol.compagnie] || 0) + 1;
    if (vol?.passengerCount) this.totalPassengers += vol.passengerCount;
    this.totalFlights++;
  }

  private processEventStats(event: any): void {
    const eventName = event.title;
    this.eventStats[eventName] = (this.eventStats[eventName] || 0) + 1;
  }

  private calculateTotals(): void {
    this.totalFlightReservations = this.filteredReservations.filter(res => res?.vol).length;
    this.totalEventReservations = this.filteredReservations.filter(res => res?.event).length;

    if (Object.keys(this.destinationStats).length > 0) {
      this.topDestination = Object.keys(this.destinationStats).reduce((a, b) =>
        this.destinationStats[a] > this.destinationStats[b] ? a : b
      );
    }
  }

  private calculateTopItems(): void {
    this.topCompagnies = this.getTopItems(this.compagnieStats);
    this.topDestinations = this.getTopItems(this.destinationStats);
    this.topVols = this.getTopItems(this.flightStats);
  }

  private getTopItems(stats: { [key: string]: number }): [string, number][] {
    return Object.entries(stats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }

  getTopEventName(): string {
    if (!this.eventStats || Object.keys(this.eventStats).length === 0) {
      return 'Aucun événement';
    }
    
    const events = Object.entries(this.eventStats);
    const topEvent = events.reduce((prev, current) => 
      (prev[1] > current[1]) ? prev : current
    );
    
    return topEvent[0];
  }

  createCharts(): void {
    this.destroyAllCharts();

    this.createChart('flightChart', 'bar', this.flightStats, 'Réservations par Vol', '#FF6347');
    this.createChart('eventChart', 'pie', this.eventStats, 'Réservations par Événement', [
      '#FF6347', '#4682B4', '#32CD32', '#FFD700', '#8A2BE2'
    ]);
    this.createChart('destinationChart', 'doughnut', this.destinationStats, 'Arrivées par Destination', [
      '#FF6347', '#4682B4', '#32CD32', '#FFD700', '#8A2BE2'
    ]);
    this.createChart('compagnieChart', 'bar', this.compagnieStats, 'Vols par Compagnie', '#4682B4');
  }

  private createChart(
    chartId: string,
    type: ChartType,
    stats: { [key: string]: number },
    label: string,
    backgroundColor: string | string[]
  ): void {
    if (!stats || Object.keys(stats).length === 0) return;

    const canvas = document.getElementById(chartId) as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type,
      data: {
        labels: Object.keys(stats),
        datasets: [{
          label,
          data: Object.values(stats),
          backgroundColor,
          borderColor: '#fff',
          borderWidth: 1,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
              stepSize: 1,
            },
          },
        },
      },
    });

    this.charts.push(chart);
  }

  private destroyAllCharts(): void {
    this.charts.forEach(chart => chart.destroy());
    this.charts = [];
  }

  exportData(): void {
    const data = {
      dateExport: new Date().toISOString(),
      period: this.selectedPeriod,
      reservations: this.filteredReservations,
      stats: {
        flights: this.flightStats,
        events: this.eventStats,
        destinations: this.destinationStats,
        companies: this.compagnieStats
      },
      totals: {
        flights: this.totalFlights,
        passengers: this.totalPassengers,
        flightReservations: this.totalFlightReservations,
        eventReservations: this.totalEventReservations
      },
      tops: {
        topEvent: this.getTopEventName(),
        topDestination: this.topDestination,
        topCompanies: this.topCompagnies,
        topDestinations: this.topDestinations
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stats_${new Date().toISOString().split('T')[0]}_${this.selectedPeriod}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}