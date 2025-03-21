// performance_metrics.js

class PerformanceMetrics {
  constructor() {
      this.charts = {
          line: null,
          bar: null,
          pie: null
      };
      this.thresholds = null;
      this.selectedAgent = null;
      this.initialize();
  }

  async initialize() {
      // Initialize date inputs with current date
      this.setDefaultDates();
      
      // Initialize event listeners
      this.initializeEventListeners();
      
      // Load initial data
      await this.loadDeliveryAgents();
      await this.updateCharts();
  }

  setDefaultDates() {
      const today = new Date();
      document.getElementById('weekSelect').value = this.formatDate(today);
      document.getElementById('monthSelect').value = this.formatYearMonth(today);
  }

  initializeEventListeners() {
      document.getElementById('agentSelect').addEventListener('change', () => this.updateCharts());
      document.getElementById('weekSelect').addEventListener('change', () => this.updateCharts());
      document.getElementById('monthSelect').addEventListener('change', () => this.updateCharts());
  }

  async loadDeliveryAgents() {
      try {
          const response = await fetch('/api/delivery_agents');
          const agents = await response.json();
          this.populateAgentSelect(agents);
      } catch (error) {
          console.error('Error loading delivery agents:', error);
          this.showError('Failed to load delivery agents');
      }
  }

  populateAgentSelect(agents) {
      const select = document.getElementById('agentSelect');
      select.innerHTML = '<option value="">All Agents</option>';
      agents.forEach(agent => {
          const option = document.createElement('option');
          option.value = agent.id;
          option.textContent = agent.name;
          select.appendChild(option);
      });
  }

  async updateCharts() {
      try {
          const params = new URLSearchParams({
              agent_id: document.getElementById('agentSelect').value,
              week: document.getElementById('weekSelect').value,
              month: document.getElementById('monthSelect').value
          });

          const response = await fetch(`/api/performance_data?${params}`);
          const data = await response.json();
          
          // Store thresholds for later use
          this.thresholds = data.thresholds;
          
          // Update all charts
          this.updateLineChart(data.overall_performance);
          this.updateBarChart(data.monthly_performance);
          this.updatePieChart(data.weekly_performance);
          
          // Update performance summary if available
          if (data.summary) {
              this.updatePerformanceSummary(data.summary);
          }

      } catch (error) {
          console.error('Error updating charts:', error);
          this.showError('Failed to update performance data');
      }
  }

  updateLineChart(data) {
      const ctx = document.getElementById('lineChart').getContext('2d');
      
      if (this.charts.line) {
          this.charts.line.destroy();
      }

      this.charts.line = new Chart(ctx, {
          type: 'line',
          data: {
              labels: data.months,
              datasets: [{
                  label: 'Average Performance',
                  data: data.performance,
                  borderColor: '#4CAF50',
                  backgroundColor: 'rgba(76, 175, 80, 0.1)',
                  borderWidth: 2,
                  fill: true,
                  tension: 0.4
              }, {
                  label: 'Total Deliveries',
                  data: data.deliveries,
                  borderColor: '#2196F3',
                  borderDash: [5, 5],
                  borderWidth: 2,
                  fill: false,
                  yAxisID: 'deliveries'
              }]
          },
          options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                  title: {
                      display: true,
                      text: 'Performance Trend Over Time'
                  },
                  tooltip: {
                      mode: 'index',
                      intersect: false
                  }
              },
              scales: {
                  y: {
                      beginAtZero: true,
                      max: 100,
                      title: {
                          display: true,
                          text: 'Performance Score (%)'
                      }
                  },
                  deliveries: {
                      position: 'right',
                      beginAtZero: true,
                      title: {
                          display: true,
                          text: 'Number of Deliveries'
                      },
                      grid: {
                          drawOnChartArea: false
                      }
                  }
              }
          }
      });
  }

  updateBarChart(data) {
      const ctx = document.getElementById('barChart').getContext('2d');
      
      if (this.charts.bar) {
          this.charts.bar.destroy();
      }

      if (!data || !data.dates) return;

      this.charts.bar = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: data.dates,
              datasets: [{
                  label: 'Daily Performance',
                  data: data.scores,
                  backgroundColor: data.scores.map(score => 
                      score >= 90 ? '#4CAF50' :
                      score >= 70 ? '#FFA726' : '#EF5350'
                  ),
                  yAxisID: 'performance'
              }, {
                  label: 'Deliveries',
                  data: data.deliveries,
                  type: 'line',
                  borderColor: '#2196F3',
                  borderWidth: 2,
                  fill: false,
                  yAxisID: 'deliveries'
              }]
          },
          options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                  title: {
                      display: true,
                      text: 'Daily Performance Breakdown'
                  }
              },
              scales: {
                  performance: {
                      beginAtZero: true,
                      max: 100,
                      title: {
                          display: true,
                          text: 'Performance Score (%)'
                      }
                  },
                  deliveries: {
                      position: 'right',
                      beginAtZero: true,
                      title: {
                          display: true,
                          text: 'Number of Deliveries'
                      },
                      grid: {
                          drawOnChartArea: false
                      }
                  }
              }
          }
      });
  }

  updatePieChart(data) {
      const ctx = document.getElementById('pieChart').getContext('2d');
      
      if (this.charts.pie) {
          this.charts.pie.destroy();
      }

      if (!data || !data.categories) return;

      this.charts.pie = new Chart(ctx, {
          type: 'pie',
          data: {
              labels: data.categories,
              datasets: [{
                  data: data.counts,
                  backgroundColor: ['#4CAF50', '#FFA726', '#EF5350'],
                  borderWidth: 1
              }]
          },
          options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                  title: {
                      display: true,
                      text: 'Delivery Time Distribution'
                  },
                  legend: {
                      position: 'right'
                  },
                  tooltip: {
                      callbacks: {
                          label: (context) => {
                              const total = context.dataset.data.reduce((a, b) => a + b, 0);
                              const percentage = Math.round((context.raw / total) * 100);
                              return `${context.label}: ${context.raw} (${percentage}%)`;
                          }
                      }
                  }
              }
          }
      });

      // Update average delivery time if available
      if (data.avg_delivery_time) {
          const avgTimeElement = document.getElementById('avgDeliveryTime');
          if (avgTimeElement) {
              avgTimeElement.textContent = `Average Delivery Time: ${data.avg_delivery_time} minutes`;
          }
      }
  }

  updatePerformanceSummary(summary) {
      const summaryElement = document.getElementById('performanceSummary');
      if (summaryElement) {
          summaryElement.innerHTML = `
              <div class="summary-card">
                  <h4>Performance Summary</h4>
                  <p>On-Time Deliveries: ${summary.onTime}%</p>
                  <p>Average Delivery Time: ${summary.avgTime} minutes</p>
                  <p>Total Deliveries: ${summary.totalDeliveries}</p>
              </div>
          `;
      }
  }

  showError(message) {
      // Create or update error message display
      const errorDiv = document.getElementById('errorMessage') || document.createElement('div');
      errorDiv.id = 'errorMessage';
      errorDiv.className = 'error-message';
      errorDiv.textContent = message;
      
      const container = document.querySelector('.main-content');
      if (container) {
          container.insertBefore(errorDiv, container.firstChild);
          
          // Remove error message after 5 seconds
          setTimeout(() => {
              errorDiv.remove();
          }, 5000);
      }
  }

  // Utility functions
  formatDate(date) {
      return date.toISOString().split('T')[0];
  }

  formatYearMonth(date) {
      return date.toISOString().slice(0, 7);
  }
}

// Initialize the performance metrics when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.performanceMetrics = new PerformanceMetrics();
});