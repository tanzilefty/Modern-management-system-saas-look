const SIMS_STORAGE_KEY = 'SIMS_DATABASE';

const Storage = {
    // Initialize DB with seed data if empty
    init() {
        if (!localStorage.getItem(SIMS_STORAGE_KEY)) {
            const seedData = {
                students: [
                    { id: '101', name: 'John Doe', email: 'john@example.com', dept: 'CS', gpa: 3.8, attendance: 92 },
                    { id: '102', name: 'Jane Smith', email: 'jane@example.com', dept: 'Math', gpa: 3.9, attendance: 98 }
                ],
                teachers: [],
                courses: [
                    { id: 'C1', name: 'Intro to Programming', code: 'CS101', teacher: 'Dr. Brown' }
                ],
                attendance: [],
                results: [],
                logs: [{ time: new Date().toISOString(), msg: 'System Initialized' }]
            };
            localStorage.setItem(SIMS_STORAGE_KEY, JSON.stringify(seedData));
        }
    },

    get(key) {
        const data = JSON.parse(localStorage.getItem(SIMS_STORAGE_KEY));
        return key ? data[key] : data;
    },

    save(key, newData) {
        const data = this.get();
        data[key] = newData;
        localStorage.setItem(SIMS_STORAGE_KEY, JSON.stringify(data));
    },

    addLog(msg) {
        const data = this.get();
        data.logs.unshift({ time: new Date().toISOString(), msg });
        localStorage.setItem(SIMS_STORAGE_KEY, JSON.stringify(data));
    }
};

Storage.init();