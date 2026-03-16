const ResultModule = {
    init() {
        this.populateDropdowns();
        this.renderResults();
        this.setupListeners();
    },

    populateDropdowns() {
        const students = Storage.get('students');
        const courses = Storage.get('courses');
        
        document.getElementById('resStudentSelect').innerHTML = 
            students.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
        
        document.getElementById('resCourseSelect').innerHTML = 
            courses.map(c => `<option value="${c.id}">${c.code} - ${c.name}</option>`).join('');
    },

    calculateGrade(marks) {
        if (marks >= 80) return { grade: 'A+', point: 4.0 };
        if (marks >= 70) return { grade: 'A',  point: 3.5 };
        if (marks >= 60) return { grade: 'B',  point: 3.0 };
        if (marks >= 50) return { grade: 'C',  point: 2.0 };
        return { grade: 'F', point: 0.0 };
    },

    renderResults() {
        const results = Storage.get('results') || [];
        const students = Storage.get('students');
        const courses = Storage.get('courses');
        const tbody = document.getElementById('resultTableBody');

        tbody.innerHTML = results.map(r => {
            const student = students.find(s => s.id === r.studentId);
            const course = courses.find(c => c.id === r.courseId);
            const evaluation = this.calculateGrade(r.marks);

            return `
                <tr>
                    <td>${student ? student.name : 'Unknown'}</td>
                    <td>${course ? course.code : 'N/A'}</td>
                    <td>${r.marks}</td>
                    <td><span class="grade-pill ${evaluation.grade}">${evaluation.grade}</span></td>
                    <td>${evaluation.point.toFixed(2)}</td>
                    <td>${evaluation.point > 0 ? '✅ Passed' : '❌ Failed'}</td>
                </tr>
            `;
        }).reverse().join('');
    },

    setupListeners() {
        document.getElementById('resultForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const results = Storage.get('results') || [];
            const newResult = {
                studentId: document.getElementById('resStudentSelect').value,
                courseId: document.getElementById('resCourseSelect').value,
                marks: parseInt(document.getElementById('resMarks').value),
                date: new Date().toISOString()
            };

            results.push(newResult);
            Storage.save('results', results);
            Storage.addLog(`Grade posted for Student ID: ${newResult.studentId}`);
            this.renderResults();
            UI.showToast("Result published successfully!");
            e.target.reset();
        });
    }
};