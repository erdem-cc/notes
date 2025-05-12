document.addEventListener('DOMContentLoaded', () => {
    drawGlobalPriorityChart();
    drawStackedPriorityChart();
    updateDashboardMetrics();
});

function updateDashboardMetrics() {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const missions = JSON.parse(localStorage.getItem("missions")) || [];

    const total = notes.length;
    const done = notes.filter(note => note.checked).length;
    const todo = total - done;

    $('#counter-missions').text(missions.length);
    $('#counter-todo').text(todo);
    $('#counter-done').text(done);
    $('#counter-total').text(total);


}

function drawGlobalPriorityChart() {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const counts = { rouge: 0, jaune: 0, vert: 0 };

    notes.forEach(note => {
        if (!note.checked) { // ne compte que les tâches non cochées
            counts[note.priority]++;
        }
    });

    const ctx = document.getElementById('globalPriorityChart').getContext('2d');

    if (window.globalPriorityChart && typeof window.globalPriorityChart.destroy === 'function') {
        window.globalPriorityChart.destroy();
    }

    window.globalPriorityChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['🔴 Urgence', '🟡 Moyenne', '🟢 Faible'],
            datasets: [{
                data: [counts.rouge, counts.jaune, counts.vert],
                backgroundColor: ['crimson', 'goldenrod', 'forestgreen'],
                borderColor: ['#fff', '#fff', '#fff'],
                borderWidth: 2
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Répartition des tâches (non terminées)'
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}


function drawStackedPriorityChart() {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];

    const priorities = ['rouge', 'jaune', 'vert'];
    const colors = {
        rouge: 'crimson',
        jaune: 'goldenrod',
        vert: 'forestgreen'
    };

    // Group notes by mission
    const grouped = {};
    notes.forEach(note => {
        if (!grouped[note.mission]) {
            grouped[note.mission] = { rouge: 0, jaune: 0, vert: 0 };
        }
        if (!note.checked) {
            grouped[note.mission][note.priority]++;
        }
    });

    const missions = Object.keys(grouped);

    const datasets = priorities.map(priority => ({
        label: priority === 'rouge' ? '🔴 Urgence' : priority === 'jaune' ? '🟡 Moyenne' : '🟢 Faible',
        data: missions.map(mission => grouped[mission][priority]),
        backgroundColor: colors[priority],
    }));

    const ctx = document.getElementById('stackedPriorityChart').getContext('2d');

    if (window.stackedChart && typeof window.stackedChart.destroy === 'function') {
        window.stackedChart.destroy();
    }

    window.stackedChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: missions,
            datasets: datasets
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Tâches par mission et par priorité'
                },
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false // ❌ enlève les lignes verticales
                    },
                    stacked: true
                },
                y: {
                    grid: {
                        display: false // ❌ enlève les lignes horizontales
                    },
                    stacked: true,
                    ticks: {
                        precision: 0 // pour éviter les virgules si inutiles
                    }
                }
            }
        }

    });
}