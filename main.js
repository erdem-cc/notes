const ul = $('.todo-list');
const select = $('#mission');
const missionbtn = $('#missionbtn');

$('#cancel-add').on('click', function () {
    $('#add').addClass('hidden');
    $('.mission-list-content').removeClass('hidden');
});


$('#show-missions').on('click', function () {
    $('#missionPopup').removeClass('hidden');
    $('.mission-list-content').removeClass('hidden');
    $('#add').addClass('hidden');
});

$('#closePopup').on('click', function () {
    $('#missionPopup').addClass('hidden');
});

$('#missionPopup').on('click', function (e) {
    if ($(e.target).is('#missionPopup')) {
        $('#missionPopup').addClass('hidden');
    }
});

$('#add-mission').on('click', function (e) {
    $('.mission-list-content').addClass('hidden');
    $('#add').removeClass('hidden');
});

$('#filter-mission, #filter-priority, #filter-status').on('change', function () {
    restoreNotes();
});

$('#filter-late').on('change', function () {
    restoreNotes();
});

$('#clear-filters').on('click', function () {
    $('#filter-status').val('all');
    $('#filter-priority').val('all');
    $('#filter-mission').val('all');
    $('#filter-late').prop('checked', false);
    restoreNotes();
});
$('#toggleFiltersBtn').on('click', function () {
    const filters = $('.filters');
    const btn = $(this);
    const isVisible = filters.is(':visible');

    filters.slideToggle(200);

    if (isVisible) {
        btn.html(`
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-bar-down" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M1 3.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5M8 6a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 .708-.708L7.5 12.293V6.5A.5.5 0 0 1 8 6"/>
            </svg>
        `);
    } else {
        btn.html(`
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-bar-up" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 10a.5.5 0 0 0 .5-.5V3.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 3.707V9.5a.5.5 0 0 0 .5.5m-7 2.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5"/>
            </svg>
        `);
    }
});




restoreMissions();
updateFilterMissionOptions();
restoreNotes();

function newMission(mission) {
    let missions = JSON.parse(localStorage.getItem('missions')) || [];
    if (!missions.includes(mission)) {
        missions.push(mission);
        localStorage.setItem('missions', JSON.stringify(missions));
    }
}

function restoreMissions() {
    select.empty();
    $('.mission-list').empty();

    const missions = JSON.parse(localStorage.getItem('missions')) || [];

    missions.forEach((mission, index) => {
        const option = `<option value="${mission}">${mission}</option>`;
        select.append(option);

        const li = `
            <li>
            <div class="mission-item">
                <p>${mission}</p>
                <p><svg class="delete-mission-btn" data-index="${index}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                </svg></p>
            </div>
            </li>
        `;
        $('.mission-list').append(li);
    });

    $('.delete-mission-btn').on('click', function () {
        const index = $(this).data('index');
        deleteMission(index);
    });
}

function deleteMission(indexToDelete) {
    let missions = JSON.parse(localStorage.getItem('missions')) || [];
    let notes = JSON.parse(localStorage.getItem('notes')) || [];

    const deletedMission = missions[indexToDelete];

    const confirmDelete = confirm(
        `⚠️ Cela va supprimer la mission "${deletedMission}" ET toutes les notes associées.\nVoulez-vous continuer ?`
    );

    if (!confirmDelete) return;

    missions.splice(indexToDelete, 1);
    localStorage.setItem('missions', JSON.stringify(missions));

    const updatedNotes = notes.filter(note => note.mission !== deletedMission);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));

    restoreMissions();
    restoreNotes();
}



function newNote(mission, todo, priority, deadline = null) {
    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes.push({
        mission,
        todo,
        priority,
        deadline,
        checked: false,
        createdAt: new Date().toISOString(),
        completedAt: null
    });
    localStorage.setItem("notes", JSON.stringify(notes));
}

function updateFilterMissionOptions() {
    const missions = JSON.parse(localStorage.getItem("missions")) || [];
    const filterSelect = $('#filter-mission');
    filterSelect.empty();
    filterSelect.append(`<option value="all">Toutes</option>`);
    missions.forEach(mission => {
        filterSelect.append(`<option value="${mission}">${mission}</option>`);
    });
}


function restoreNotes() {
    ul.empty();
    let notes = JSON.parse(localStorage.getItem("notes")) || [];

    const grouped = {};

    const missionFilter = $('#filter-mission').val();
    const priorityFilter = $('#filter-priority').val();
    const statusFilter = $('#filter-status').val();
    const filterLateOnly = $('#filter-late').is(':checked');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filteredNotes = [];
    notes.forEach((note, index) => {
        const isLate = !note.checked && note.deadline && new Date(note.deadline) < today;

        const matchStatus =
            statusFilter === 'all' ||
            (statusFilter === 'todo' && !note.checked) ||
            (statusFilter === 'done' && note.checked);

        const matchPriority = priorityFilter === 'all' || note.priority === priorityFilter;
        const matchMission = missionFilter === 'all' || note.mission === missionFilter;
        const matchLate = !filterLateOnly || isLate;

        const keep = matchStatus && matchPriority && matchMission && matchLate;

        if (keep) {
            if (!grouped[note.mission]) grouped[note.mission] = [];
            grouped[note.mission].push({ ...note, index });
            filteredNotes.push(note);
        }
    });




    for (const mission in grouped) {
        const notesForMission = grouped[mission];

        notesForMission.sort((a, b) => {
            const priorities = { rouge: 1, jaune: 2, vert: 3 };
            const aVal = a.checked ? 4 : priorities[a.priority];
            const bVal = b.checked ? 4 : priorities[b.priority];
            return aVal - bVal;
        });

        let html = `<li>
                        <h2>${mission}</h2>`;

        notesForMission.forEach(note => {
            const checkedClass = note.checked ? 'checked' : '';
            let deadlinePassed = false;
            if (note.deadline && !note.checked) {
                const today = new Date();
                const deadlineDate = new Date(note.deadline);
                deadlinePassed = deadlineDate < today.setHours(0, 0, 0, 0);
            }

            html += `
            <div class="note-item ${note.priority} ${note.checked ? 'checked' : ''} ${deadlinePassed ? 'late' : ''}">
            <input type="checkbox" class="check-note" data-index="${note.index}" ${note.checked ? 'checked' : ''}>
            <p>${note.todo}</p>
            <div class="note-actions">
             <button class="info-btn">ℹ️</button>
                             <p>
                    <svg class="delete-btn" data-index="${note.index}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                    </svg>
                </p>
            </div>
             <div class="note-info hidden">
             <p>Créée le : ${new Date(note.createdAt).toLocaleDateString()}</p>
            ${note.completedAt ? `<p>Terminée le : ${new Date(note.completedAt).toLocaleDateString()}</p>` : ''}
            ${note.deadline ? `<p>Deadline : ${new Date(note.deadline).toLocaleDateString()}</p>` : ''}
        </div>

                </div>`;
        });


        html += `</li>`;
        ul.append(html);
    }

    $('.info-btn').on('click', function () {
        $(this).closest('.note-item').find('.note-info').toggleClass('hidden');
    });

    $('.delete-btn').on('click', function () {
        const index = $(this).data('index');
        deleteNote(index);
    });

    $('.check-note').on('change', function () {
        const index = $(this).data('index');
        let notes = JSON.parse(localStorage.getItem("notes")) || [];

        const isChecked = !notes[index].checked;
        notes[index].checked = isChecked;
        notes[index].completedAt = isChecked ? new Date().toISOString() : null;

        localStorage.setItem("notes", JSON.stringify(notes));
        restoreNotes();
    });


}


function toggleNoteDone(index) {
    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    if (notes[index]) {
        notes[index].done = !notes[index].done;
        localStorage.setItem("notes", JSON.stringify(notes));
        restoreNotes();
    }
}



function deleteNote(indexToDelete) {
    let notes = JSON.parse(localStorage.getItem("notes")) || [];

    notes.splice(indexToDelete, 1);

    localStorage.setItem("notes", JSON.stringify(notes));

    restoreNotes();
}

$('#form').on('submit', function (e) {
    e.preventDefault();
    const note = $('#note').val();
    const mission = $('#mission').val();
    const priority = $('#priority').val();
    const deadline = $('#deadline').val() || null;
    if (note.trim() !== '') {
        newNote(mission, note, priority, deadline);
        restoreNotes();
        $('#note').val('');
        $('#deadline').val('');
    }
});

$('#add').on('submit', function (e) {
    e.preventDefault();
    const mission = $('#new-mission').val();
    const form = $('#add')
    if (mission.trim() !== '') {
        newMission(mission);
        restoreMissions();
        $('#new-mission').val('');
        form.addClass('hidden');
        $('#missionPopup').addClass('hidden');
    }
});





