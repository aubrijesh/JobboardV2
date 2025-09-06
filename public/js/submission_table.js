// submission_table.js
// Fetch submission data and render with jspreadsheet

$(document).ready(function() {
    // Stage ID mapping for Kanban
    let stageIdMap = {};
    let stageNameMap = {};
    function fetchStageMap(callback) {
        $.get('/api/stages', function(data) {
            stageIdMap = {};
            stageNameMap = {};
            data.forEach(row => {
                // Normalize stage names for mapping
                let key = row.stage;
                stageIdMap[key] = row.id;
                // Also support 'is' prefix (e.g. isInterview)
                if (key.startsWith('is')) {
                    stageIdMap[key.replace(/^is/, '')] = row.id;
                }
                stageNameMap[row.id] = row.stage;
            });
            if (callback) callback();
        });
    }
    // share_id search params
    const share_id = new URLSearchParams(window.location.search).get('share_id');
    if (share_id) {
        refreshSubmissions();
    }

    // Helper to refresh table and Kanban
    function refreshSubmissions() {
        fetchStageMap(function() {
            fetch(`/api/submissions?share_id=${share_id}`)
                .then(res => res.json())
                .then(data => {
                    window.submissionsArray = data;
                    // Refresh table
                    renderTable(data);
                    // Refresh Kanban if visible
                    if ($('#submission-kanban-sidebar').is(':visible')) {
                        renderJKanbanBoard(data);
                    }
                });
        });
    }

    // Table rendering logic
    function renderTable(data) {
        // Clear previous table to avoid header distortion
        const tableContainer = document.getElementById('jspreadsheet');
        if (tableContainer) {
            tableContainer.innerHTML = '';
        }
        if (!Array.isArray(data)) return;
        const stageColors = {
            Screening: '#f9c74f',
            Interview: '#90be6d',
            Offer: '#43aa8b',
            Hired: '#577590',
            Rejected: '#f94144'
        };
        const rows = [];
        let columns = [];
        if (data.length > 0) {
            columns = Object.keys(data[0].data).map(key => ({ title: key, width: 120 }));
            columns.push({ title: 'Stage', width: 100 });
            data.forEach(sub => {
                const row = columns.map(col => {
                    if (col.title === 'Stage') {
                        let stage = sub.stage || '';
                        stage = stage.charAt(0).toUpperCase() + stage.slice(1).toLowerCase();
                        const color = stageColors[stage] || '#ccc';
                        return `<span style='display:inline-block;background:${color};color:#fff;border-radius:12px;padding:2px 12px;font-size:13px;font-weight:600;'>${stage}</span>`;
                    }
                    let val = sub.data[col.title] || '';
                    if (Array.isArray(val)) {
                        val = val.map(v => renderFileUrl(v)).join('<br>');
                    } else {
                        val = renderFileUrl(val);
                    }
                    return val;
                });
                rows.push(row);
            });
            function renderFileUrl(val) {
                if (typeof val === 'string' && val.startsWith('http') && val.includes('/uploaded_files/')) {
                    const parts = val.split('/');
                    const filename = parts[parts.length - 1];
                    return `<a href="${val}" target="_blank" style="color:#007bff;text-decoration:underline;"><span class="material-icons" style="font-size:16px;vertical-align:middle;">attach_file</span> ${filename}</a>`;
                }
                return val;
            }
        }
        const spreadsheetFn = window.jspreadsheet || window.jSpreadsheet;
        if (typeof spreadsheetFn === 'function') {
            const htmlColumns = columns.map(col => Object.assign({}, col, { type: 'html' }));
            spreadsheetFn(document.getElementById('jspreadsheet'), {
                toolbar: true,
                worksheets: [ {
                    data: rows,
                    columns: htmlColumns
                }],
                parseFormulas: true,
                search: true,
                filters: true
            });
        } else {
            console.error('jspreadsheet/jSpreadsheet not found');
        }
    }

    // Kanban board for candidate status
    const kanbanStages = ["Screening", "Interview", "Offer", "Hired", "Rejected"];
    function renderKanbanBoard(submissions, targetSelector = '#submission-kanban') {
        let html = '<div id="kanban-board" style="display:flex;gap:24px;margin:32px 0;">';
        kanbanStages.forEach(stage => {
            html += `<div class="kanban-stage" data-stage="${stage}" style="flex:1;background:#f8f9fa;border-radius:8px;padding:12px;min-height:180px;">
                <div style="font-weight:600;font-size:16px;margin-bottom:8px;">${stage}</div>
                <div class="kanban-list" id="kanban-list-${stage}"></div>
            </div>`;
        });
        html += '</div>';
        $(targetSelector).html(html);
        // Place candidates in their stages
        submissions.forEach(sub => {
            let stage = sub.status || kanbanStages[0];
            let card = `<div class="kanban-card" data-id="${sub.id}" draggable="true" style="background:#fff;border:1px solid #e1e1e1;border-radius:6px;padding:10px 12px;margin-bottom:8px;cursor:move;">
                <div><b>${sub.name || 'Candidate'}</b></div>
                <div style="font-size:13px;color:#555;">${sub.email || ''}</div>
            </div>`;
            $(`#kanban-list-${stage}`, targetSelector).append(card);
        });
        // Drag and drop logic
        $(".kanban-card", targetSelector).on('dragstart', function(e) {
            e.originalEvent.dataTransfer.setData('id', $(this).data('id'));
        });
        $(".kanban-list", targetSelector).on('dragover', function(e) {
            e.preventDefault();
        });
        $(".kanban-list", targetSelector).on('drop', function(e) {
            e.preventDefault();
            var id = e.originalEvent.dataTransfer.getData('id');
            var $card = $(`.kanban-card[data-id='${id}']`, targetSelector);
            $(this).append($card);
            // Update status in backend
            var newStage = $(this).closest('.kanban-stage').data('stage');
            $.ajax({
                url: '/api/submissions/' + id + '/status',
                type: 'PUT',
                data: JSON.stringify({ status: newStage }),
                contentType: 'application/json',
                success: function(resp) {
                    // Optionally show a toast or update UI
                }
            });
        });
    }
    window.renderKanbanBoard = renderKanbanBoard;
    // Usage: renderKanbanBoard(submissionsArray);

    // Add Kanban button to header

    $(document).on('click', '#show-kanban-btn', function() {
        $('#submission-kanban-sidebar').show();
        // Hide table if needed
        $('#submission-table').hide();
        // Render Kanban board in sidebar
        if(window.submissionsArray) {
        $('#jkanban-board-content').html('');
        renderJKanbanBoard(window.submissionsArray);
        } else {
        $.get('/api/submissions', function(data) {
            window.submissionsArray = data;
            $('#jkanban-board-content').html('');
            renderJKanbanBoard(data);
        });
        }
    });
    // Optionally add a back button to return to table
    $(document).on('click', '#kanban-back-btn', function() {
        $('#submission-kanban').hide();
        $('#submission-table').show();
    });


    // jKanban board implementation
    function getCurrentUserId() {
      // Replace with your actual user ID logic
      return window.currentUserId || 0;
    }
    $(document).on('click', '#kanban-close-btn', function() {
        $('#submission-kanban-sidebar').hide();
        $('#submission-table').show();
    });
    function getRandomColor() {
        const colors = [
            '#f9c74f', '#90be6d', '#43aa8b', '#577590', '#f94144', '#f3722c', '#277da1', '#4d908e', '#b5838d', '#ffb4a2'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    function renderJKanbanBoard(submissions) {
        // Custom board styles
        const boardStyles = {
            Screening: { color: '#f9c74f' },
            Interview: { color: '#90be6d' },
            Offer: { color: '#43aa8b' },
            Hired: { color: '#577590' },
            Rejected: { color: '#f94144' }
        };
        // Clear Kanban board container to prevent duplicates
        const kanbanContent = document.getElementById('jkanban-board-content');
        kanbanContent.innerHTML = '';
        kanbanContent.style.display = 'flex';
        kanbanContent.style.gap = '24px';
        // Map stages to jKanban boards using stageIdMap
        const boardKeys = Object.keys(boardStyles);
        const boards = boardKeys.map(key => ({
            id: key,
            title: `<div style="background:${boardStyles[key].color};padding:12px;border-radius:0px;color:#fff;text-align:center;font-weight:600;">${key}</div>`,
            class: 'kanban-stage',
            item: []
        }));
        let hasCandidates = false;
        var nameCol = "name";
        var experienceCol = "experience_year";
        var educationCol = "education";
        if(submissions.length > 0){
            var data = submissions[0].data;
            Object.keys(data).forEach(key => {
                if(key.toLowerCase().includes('name')) nameCol = key;
                if(key.toLowerCase().includes('experience')) experienceCol = key;
                if(key.toLowerCase().includes('education')) educationCol = key;
            });
        }
        submissions.forEach(sub => {
            hasCandidates = true;
            let boardKey = sub.stage ? sub.stage.charAt(0).toUpperCase() + sub.stage.slice(1).toLowerCase() : 'Screening';
            if (!boards.find(b => b.id === boardKey)) boardKey = 'Screening';
            const color = boardStyles[boardKey]?.color || '#eee';
            // Experience year badge
            let experienceBadge = '';
            if (sub.data[experienceCol]) {
                experienceBadge = `<span style='display:inline-block;background:#3498db;color:#fff;border-radius:12px;padding:2px 8px;font-size:12px;margin: 0 5px;
    font-weight: bold;'>${sub.data[experienceCol]}</span>`;
            }
            // Education dots
            let educationDots = '';
            if (Array.isArray(sub.data[educationCol])) {
                educationDots = sub.data[educationCol].map((edu, idx) => {
                    let label = edu.university || edu.education_name || 'Edu';
                    return `<span title='${label}' style='display:inline-block;width:14px;height:14px;background:#90be6d;border-radius:50%;margin: 0 5px;
    font-weight: bold;vertical-align:middle;'></span>`;
                }).join('');
            }
            const card = {
                id: 'card-' + sub.id,
                title:
                    `<div style='background:#fff;border-radius:6px;padding:10px 12px;margin-bottom:8px;cursor:pointer;'>`
                    + `<b>${sub.data[nameCol] || 'Candidate'}</b>`
                    + experienceBadge
                    + `<div style='font-size:13px;color:#555;'>${sub.data.email || ''}</div>`
                    + (educationDots ? `<div style='margin-top:6px;'>${educationDots}</div>` : '')
                    + `</div>`
            };
            const board = boards.find(b => b.id === boardKey);
            if(board) board.item.push(card);
        });
        if (!hasCandidates) {
            kanbanContent.innerHTML = '<div style="text-align:center;padding:48px 0;font-size:20px;color:#888;">No candidates</div>';
            return;
        }
        var kanban = new jKanban({
            element: '#jkanban-board-content',
            boards,
            gutter: '24px',
            itemClick: function(el) {
                // Custom logic for item click
                alert('Clicked candidate: ' + el.textContent);
            },
            dragEl: function(el, source) {
                // Allow drag from any board (customize if needed)
                return true;
            },
            dropEl: function(el, target, source, siblings) {
                // Restrict drop to allowed boards
                const allowedTargets = boardKeys;
                const toKey = target.parentElement.getAttribute('data-id');
                if (!allowedTargets.includes(toKey)) return false;
                var cardId = el.getAttribute('data-eid') || el.id.replace('card-', '');
                if(cardId.startsWith('card-')) cardId = cardId.replace('card-', '');
                var fromKey = source.parentElement.getAttribute('data-id');
                var userId = getCurrentUserId();
                var fromStageId = stageIdMap[fromKey];
                var toStageId = stageIdMap[toKey];
                // Update backend
                $.ajax({
                    url: '/api/submissions/' + cardId + '/status',
                    type: 'PUT',
                    data: JSON.stringify({
                        from_stage: fromStageId,
                        to_stage: toStageId,
                        user_id: userId
                    }),
                    contentType: 'application/json',
                    success: function(resp) {
                        // Refresh table and Kanban after move
                        refreshSubmissions();
                    }
                });
            }
        });
    }
    window.renderJKanbanBoard = renderJKanbanBoard;
    // Usage: renderJKanbanBoard(submissionsArray);
});
