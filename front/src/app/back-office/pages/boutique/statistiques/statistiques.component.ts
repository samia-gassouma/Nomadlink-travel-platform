import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LayoutsModule } from 'src/app/back-office/layouts/layouts.module';
import { StatistiquesService } from 'src/app/front-office/services/boutique/statistique/statistiques.service';
import { ChartConfiguration, ChartData, ChartOptions } from 'chart.js';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgChartsModule } from 'ng2-charts';
import { ChartsModule } from '../../charts/charts.module';


@Component({
  selector: 'app-statistiques',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    LayoutsModule,
    ReactiveFormsModule,
    NgChartsModule,
    ChartsModule
  ],
  templateUrl: './statistiques.component.html',
  styleUrls: ['./statistiques.component.scss'],
})
export class StatistiquesComponent implements OnInit {
  isSidebarHidden = false;
  stats: any;

  // ✅ Données graphiques correctement typées
  commandesChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Commandes',
        borderColor: '#42A5F5',
        backgroundColor: 'rgba(66, 165, 245, 0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  produitsChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Quantité vendue',
        backgroundColor: '#66BB6A'
      }
    ]
  };

  livraisonsChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#4CAF50', '#FFA726', '#EF5350', '#AB47BC']
      }
    ]
  };

  // ✅ Options de chart communs
  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      }
    }
  };

  constructor(private statsService: StatistiquesService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  toggleSidebar(): void {
    this.isSidebarHidden = !this.isSidebarHidden;
  }

  loadStats(): void {
    this.statsService.getAllStats().subscribe({
      next: data => {
        this.stats = data;
        this.initCharts();
      },
      error: err => console.error('Erreur chargement stats :', err)
    });
  }

  initCharts(): void {
    const commandes = this.stats.commandes?.parMois ?? [];
    const livraisons = this.stats.livraisons ?? {
      enCours: 0,
      terminees: 0,
      annulees: 0,
      retard: 0
    };
    const topVentes = this.stats.produits?.topVentes ?? [];

    // 📊 Commandes par mois (line chart)
    this.commandesChartData = {
      labels: commandes.map((c: any) => c.mois),
      datasets: [
        {
          data: commandes.map((c: any) => c.total),
          label: 'Commandes',
          borderColor: '#42A5F5',
          backgroundColor: 'rgba(66, 165, 245, 0.2)',
          fill: true,
          tension: 0.4
        }
      ]
    };

    // 📈 Top produits vendus (bar chart)
    this.produitsChartData = {
      labels: topVentes.map((p: any) => p.nom),
      datasets: [
        {
          data: topVentes.map((p: any) => p.quantite),
          label: 'Quantité vendue',
          backgroundColor: '#66BB6A'
        }
      ]
    };

    // 🥧 Répartition des livraisons (pie)
    this.livraisonsChartData = {
      labels: ['Livrées', 'En cours', 'Annulées', 'Retardées'],
      datasets: [
        {
          data: [
            livraisons.terminees,
            livraisons.enCours,
            livraisons.annulees,
            livraisons.retard
          ],
          backgroundColor: ['#4CAF50', '#FFA726', '#EF5350', '#AB47BC']
        }
      ]
    };
  }
  }