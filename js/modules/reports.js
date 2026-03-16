const ReportModule = {
    init() {
        this.drawGradeChart();
        this.drawAttendanceTrend();
        this.renderLogs();
    },

    drawGradeChart() {
        const canvas = document.getElementById('gradeDistributionChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const results = Storage.get('results') || [];
        
        // Data Processing
        const counts = { 'A': 0, 'B': 0, 'C': 0, 'F': 0 };
        results.forEach(r => {
            if (r.marks >= 70) counts['A']++;
            else if (r.marks >= 60) counts['B']++;
            else if (r.marks >= 50) counts['C']++;
            else counts['F']++;
        });

        const data = Object.values(counts);
        const colors = ['#6366f1', '#818cf8', '#a5b4fc', '#fb7185'];
        const labels = Object.keys(counts);

        // Simple Bar Chart Drawing
        const maxVal = Math.max(...data, 1);
        const barWidth = 50;
        const spacing = 30;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        data.forEach((val, i) => {
            const barHeight = (val / maxVal) * (canvas.height - 50);
            const x = 50 + (i * (barWidth + spacing));
            const y = canvas.height - barHeight - 30;

            // Draw Bar
            ctx.fillStyle = colors[i];
            ctx.roundRect ? ctx.fillRoundRect(x, y, barWidth, barHeight, 5) : ctx.fillRect(x, y, barWidth, barHeight);
            ctx.fillRect(x, y, barWidth, barHeight);

            // Draw Label
            ctx.fillStyle = '#64748b';
            ctx.font = '12px Inter';
            ctx.fillText(labels[i], x + 15, canvas.height - 10);
            ctx.fillText(val, x + 18, y - 10);
        });
    },

    drawAttendanceTrend() {
        const canvas = document.getElementById('attendanceTrendChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        const trendData = [85, 92, 88, 95, 89, 94, 91]; // Mock data for last 7 days
        const margin = 40;
        const width = canvas.width - (margin * 2);
        const height = canvas.height - (margin * 2);
        const stepX = width / (trendData.length - 1);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw Line
        ctx.beginPath();
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 4;
        ctx.lineJoin = 'round';

        trendData.forEach((point, i) => {
            const x = margin + (i * stepX);
            const y = (canvas.height - margin) - (point / 100 * height);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Draw area under line
        ctx.lineTo(margin + width, canvas.height - margin);
        ctx.lineTo(margin, canvas.height - margin);
        ctx.fillStyle = 'rgba(99, 102, 241, 0.1)';
        ctx.fill();
    },

    renderLogs() {
        const logs = Storage.get('logs') || [];
        const container = document.getElementById('systemLogs');
        if (!container) return;

        container.innerHTML = logs.slice(0, 10).map(log => `
            <div class="log-item">
                <span class="log-time">${new Date(log.time).toLocaleTimeString()}</span>
                <span class="log-msg">${log.msg}</span>
            </div>
        `).join('');
    },

    exportCSV() {
        const students = Storage.get('students');
        let csvContent = "data:text/csv;charset=utf-8,ID,Name,Email,Dept,GPA\n";
        
        students.forEach(s => {
            csvContent += `${s.id},${s.name},${s.email},${s.dept},${s.gpa}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "SIMS_Students_Report.csv");
        document.body.appendChild(link);
        link.click();
        UI.showToast("CSV Export Started");
    }
};