const StudentModule = {
    init() {
        this.renderTable();
        this.setupEventListeners();
    },

    renderTable(data = null) {
        const students = data || Storage.get('students');
        const tbody = document.getElementById('studentTableBody');
        if (!tbody) return;

        tbody.innerHTML = students.map(s => `
            <tr>
                <td>#${s.id}</td>
                <td>
                    <div class="user-info">
                        <div class="avatar-sm">${s.name.charAt(0)}</div>
                        <span>${s.name}</span>
                    </div>
                </td>
                <td>${s.email}</td>
                <td><span class="badge-dept">${s.dept}</span></td>
                <td><strong>${s.gpa}</strong></td>
                <td>
                    <button class="btn-edit" onclick="StudentModule.editStudent('${s.id}')">Edit</button>
                    <button class="btn-delete" onclick="StudentModule.deleteStudent('${s.id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    },

    setupEventListeners() {
        const form = document.getElementById('studentForm');
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveStudent();
        });
    },

    openModal(id = null) {
        document.getElementById('studentModal').style.display = 'flex';
        if (!id) {
            document.getElementById('studentForm').reset();
            document.getElementById('modalTitle').innerText = 'Add New Student';
            document.getElementById('studentId').value = '';
        }
    },

    closeModal() {
        document.getElementById('studentModal').style.display = 'none';
    },

    saveStudent() {
        const id = document.getElementById('studentId').value || Date.now().toString();
        const newStudent = {
            id,
            name: document.getElementById('sName').value,
            email: document.getElementById('sEmail').value,
            dept: document.getElementById('sDept').value,
            gpa: parseFloat(document.getElementById('sGPA').value),
            attendance: 100 // Default for new
        };

        let students = Storage.get('students');
        const index = students.findIndex(s => s.id === id);

        if (index > -1) {
            students[index] = newStudent;
            Storage.addLog(`Updated student: ${newStudent.name}`);
        } else {
            students.push(newStudent);
            Storage.addLog(`Added new student: ${newStudent.name}`);
        }

        Storage.save('students', students);
        this.renderTable();
        this.closeModal();
        UI.showToast("Student data saved!");
    },

    deleteStudent(id) {
        if (confirm('Are you sure you want to delete this student?')) {
            const students = Storage.get('students').filter(s => s.id !== id);
            Storage.save('students', students);
            Storage.addLog(`Deleted student ID: ${id}`);
            this.renderTable();
            UI.showToast("Student deleted", "danger");
        }
    },

    filter() {
        const query = document.getElementById('studentSearch').value.toLowerCase();
        const dept = document.getElementById('filterDept').value;
        const students = Storage.get('students');

        const filtered = students.filter(s => {
            const matchesQuery = s.name.toLowerCase().includes(query) || s.id.includes(query);
            const matchesDept = dept === "" || s.dept === dept;
            return matchesQuery && matchesDept;
        });

        this.renderTable(filtered);
    }
};