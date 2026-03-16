const AttendanceModule = {
    init() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('attnDate').value = today;
        this.populateCourses();
        this.loadStudents();
    },

    populateCourses() {
        const courses = Storage.get('courses');
        const select = document.getElementById('attnCourseSelect');
        if (!select) return;
        select.innerHTML = courses.map(c => `<option value="${c.id}">${c.code} - ${c.name}</option>`).join('');
    },

    loadStudents() {
        const students = Storage.get('students');
        const tbody = document.getElementById('attendanceTableBody');
        if (!tbody) return;

        // Reset counters
        document.getElementById('countTotal').innerText = students.length;
        document.getElementById('countPresent').innerText = students.length; // Default all present
        document.getElementById('countAbsent').innerText = 0;

        tbody.innerHTML = students.map(s => `
            <tr data-student-id="${s.id}">
                <td>
                    <div class="user-info">
                        <div class="avatar-sm">${s.name.charAt(0)}</div>
                        <div>
                            <div style="font-weight: 600;">${s.name}</div>
                            <div style="font-size: 0.75rem; color: var(--text-muted);">ID: ${s.id}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="status-badge present" id="status-${s.id}">Present</span>
                </td>
                <td style="text-align: right;">
                    <div class="toggle-group">
                        <button class="btn-toggle active" onclick="AttendanceModule.setStatus('${s.id}', 'present', this)">P</button>
                        <button class="btn-toggle" onclick="AttendanceModule.setStatus('${s.id}', 'absent', this)">A</button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    setStatus(studentId, status, btn) {
        const badge = document.getElementById(`status-${studentId}`);
        badge.innerText = status.charAt(0).toUpperCase() + status.slice(1);
        badge.className = `status-badge ${status}`;

        // UI Toggle logic
        const parent = btn.parentElement;
        parent.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        this.updateCounters();
    },

    updateCounters() {
        const presents = document.querySelectorAll('.status-badge.present').length;
        const absents = document.querySelectorAll('.status-badge.absent').length;
        document.getElementById('countPresent').innerText = presents;
        document.getElementById('countAbsent').innerText = absents;
    },

    saveBatch() {
        const date = document.getElementById('attnDate').value;
        const courseId = document.getElementById('attnCourseSelect').value;
        const records = [];

        document.querySelectorAll('#attendanceTableBody tr').forEach(row => {
            records.push({
                studentId: row.getAttribute('data-student-id'),
                status: row.querySelector('.status-badge').innerText.toLowerCase()
            });
        });

        const attendanceData = Storage.get('attendance');
        attendanceData.push({
            id: Date.now(),
            date,
            courseId,
            records
        });

        Storage.save('attendance', attendanceData);
        Storage.addLog(`Attendance saved for ${date}`);
        UI.showToast("Attendance synchronized!");
    }
};