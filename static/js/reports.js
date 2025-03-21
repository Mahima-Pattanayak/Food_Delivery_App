let recentReports = [];
    
        function showPage(pageId) {
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
    
            const selectedPage = document.getElementById(pageId);
            selectedPage.classList.add('active');
    
            const cardsContainer = document.querySelector('.cards');
            const recentReportsContainer = document.getElementById('recent-reports-list');
    
            if (pageId === 'create-report') {
                cardsContainer.style.display = 'grid';
                recentReportsContainer.style.display = 'none';
            } else if (pageId === 'recent-report') {
                cardsContainer.style.display = 'none';
                recentReportsContainer.style.display = 'block';
            }
        }
    
        function generateReport(graphType) {
            const dateRange = document.getElementById('date-range').value;
            const month = document.getElementById('month').value;
            if (!dateRange && !month) {
                alert('Please select a date first!');
                return;
            }
            const reportDate = dateRange || (month ? month : '');
            const report = {
                type: graphType,
                dateRange: reportDate,
                timestamp: new Date().toLocaleString(),
                content: `Report Type: ${graphType}\nDate Range: ${reportDate}\nGenerated On: ${new Date().toLocaleString()}`
            };
            recentReports.push(report);
            updateRecentReports();
            alert(`${graphType} report generated!`);
    
            downloadReport(report);
        }
    
        function downloadReport(report) {
            const fileName = `${report.type}_Report_${report.dateRange}.txt`;
            const blob = new Blob([report.content], { type: 'text/plain' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
        }
    
        function viewReport(type) {
            const report = recentReports.find(r => r.type === type);
            if (report) {
                alert(`Viewing Report:\n\n${report.content}`);
            } else {
                alert('Report not found!');
            }
        }
    
        function updateRecentReports() {
            const list = document.getElementById('recent-reports-list');
            list.innerHTML = '';
            recentReports.forEach(report => {
                const item = document.createElement('div');
                item.className = 'report-item';
                item.innerHTML = `
                    <span>${report.type} - ${report.dateRange} (${report.timestamp})</span>
                    <div>
                        <button onclick="downloadReport(recentReports.find(r => r.type === '${report.type}'))">Download</button>
                        <button onclick="viewReport('${report.type}')">View</button>
                    </div>
                `;
                list.appendChild(item);
            });
        }
    
        function navigateOtherPage() {
            window.location.href = 'other-page.html';
        }