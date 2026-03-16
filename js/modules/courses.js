const CourseModule = {
    init() {
        this.renderCourses();
        this.setupListeners();
    },

    renderCourses() {
        const courses = Storage.get('courses');
        const grid = document.getElementById('courseGrid');
        if (!grid) return;

        grid.innerHTML = courses.map(c => `
            <div class="card course-card">
                <div class="course-badge">${c.code}</div>
                <h3>${c.name}</h3>
                <p class="teacher-name">👨‍🏫 ${c.teacher}</p>
                <div class="course-footer">
                    <span>${c.credits || 3} Credits</span>
                    <div class="action-dots" onclick="CourseModule.deleteCourse('${c.id}')">🗑️</div>
                </div>
            </div>
        `).join('');
    },

    setupListeners() {
        document.getElementById('courseForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCourse();
        });
    },

    openModal() {
        document.getElementById('courseModal').style.display = 'flex';
    },

    closeModal() {
        document.getElementById('courseModal').style.display = 'none';
    },

    saveCourse() {
        const courses = Storage.get('courses');
        const newCourse = {
            id: Date.now().toString(),
            name: document.getElementById('cName').value,
            code: document.getElementById('cCode').value,
            credits: document.getElementById('cCredits').value,
            teacher: document.getElementById('cTeacher').value
        };

        courses.push(newCourse);
        Storage.save('courses', courses);
        Storage.addLog(`New course created: ${newCourse.code}`);
        
        this.renderCourses();
        this.closeModal();
        UI.showToast("Course published!");
    },

    deleteCourse(id) {
        if(confirm("Archive this course?")) {
            const courses = Storage.get('courses').filter(c => c.id !== id);
            Storage.save('courses', courses);
            this.renderCourses();
            UI.showToast("Course removed", "danger");
        }
    }
};