// submission_table.js
// Fetch submission data and render with jspreadsheet

$(document).ready(function() {
    // Modal logic for candidate view
    function renderCandidateSidebar(candidate) {
        if (!candidate) return;
        let initials = candidate.name ? candidate.name.split(' ').map(s=>s[0]).join('').toUpperCase().slice(0,2) : 'A';
        let eduHtml = '';
        if (Array.isArray(candidate.education)) {
            eduHtml = candidate.education.map(edu => `
                <div class="candidate-edu-block" style="background:#f7f8fa;border-radius:8px;padding:12px 16px;margin-bottom:10px;box-shadow:0 1px 4px #0001;">
                    <b style='color:#6c63ff;'>${edu.education_name || ''}</b> <span style='color:#888;'>(${edu.degree || ''})</span><br>
                    <span class='candidate-label'>University:</span> <span class='candidate-value'>${edu.university || ''}</span><br>
                    <span class='candidate-label'>Percentage:</span> <span class='candidate-value'>${edu.percentage || ''}</span>
                </div>
            `).join('');
        }
        let skillsHtml = '';
        if (Array.isArray(candidate.skills)) {
            skillsHtml = candidate.skills.map(skill => `<span style="display:inline-block;background:#e8eaf6;color:#3949ab;font-size:13px;padding:4px 12px;border-radius:16px;margin:3px 6px 3px 0;">${skill}</span>`).join('');
        }
        let expHtml = '';
        if (Array.isArray(candidate.experience)) {
            expHtml = candidate.experience.map(exp => `
                <div style="margin-bottom:10px;padding:10px 0;border-bottom:1px solid #f0f0f0;">
                    <b style='color:#43aa8b;'>${exp.role || ''}</b> <span style='color:#888;'>at</span> <span class='candidate-label'>${exp.company || ''}</span> <span style='color:#888;'>(${exp.years || ''} yrs)</span>
                </div>
            `).join('');
        }
        let basicHtml = '';
        if (candidate.phone) basicHtml += `<li style="margin-bottom:6px;"><span class=\"candidate-label\">Phone:</span> <span class=\"candidate-value\">${candidate.phone}</span></li>`;
        if (candidate.location) basicHtml += `<li style="margin-bottom:6px;"><span class=\"candidate-label\">Location:</span> <span class=\"candidate-value\">${candidate.location}</span></li>`;
        const html = `
        <div class="candidate-sidebar-container" style="width:100%;height:100%;overflow-y:auto;background:#fff;">
            <div class="candidate-header" style="display:flex;align-items:center;gap:18px;padding:20px;border-bottom:1px solid #f0f0f0;">
                <div class="candidate-avatar" id="candidate-avatar" style="width:70px;height:70px;border-radius:50%;background:linear-gradient(135deg,#6c63ff,#43aa8b);color:#fff;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:700;box-shadow:0 2px 8px #0002;">${initials}</div>
                <div class="candidate-info">
                    <h2 id="candidate-name" style="margin:0 0 6px 0;font-size:26px;font-weight:600;">${candidate.name || ''}</h2>
                    <div class="email" id="candidate-email" style="color:#555;font-size:15px;">${candidate.email || ''}</div>
                </div>
                <button id="candidate-sidebar-close" style="margin-left:auto;background:none;border:none;font-size:22px;color:#888;cursor:pointer;">&times;</button>
            </div>
            <div class="candidate-section" id="candidate-basic" style="padding:18px 28px 0 28px;">
                <h3 style="font-size:18px;margin-bottom:10px;color:#6c63ff;">Basic Information</h3>
                <ul id="candidate-basic-list" style="padding-left:18px;">${basicHtml}</ul>
            </div>
            <div class="candidate-section" id="candidate-education" style="padding:18px 28px 0 28px;">
                <h3 style="font-size:18px;margin-bottom:10px;color:#6c63ff;">Education</h3>
                <div id="candidate-education-list">${eduHtml}</div>
            </div>
            <div class="candidate-section" id="candidate-skills" style="padding:18px 28px 0 28px;">
                <h3 style="font-size:18px;margin-bottom:10px;color:#6c63ff;">Skills</h3>
                <div id="candidate-skills-list">${skillsHtml}</div>
            </div>
            <div class="candidate-section" id="candidate-experience" style="padding:18px 28px 0 28px;">
                <h3 style="font-size:18px;margin-bottom:10px;color:#6c63ff;">Experience</h3>
                <div id="candidate-experience-list">${expHtml}</div>
            </div>
        </div>`;
        $('#candidate-sidebar-body').html(html);
        $('#candidate-sidebar').addClass('open');
    }

    // Close sidebar
    $(document).on('click', '#candidate-sidebar-close', function() {
        $('#candidate-sidebar').removeClass('open');
    });
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
    let splitPath = window.location.pathname.split("/");
    const formId = Number(splitPath[splitPath.length - 1]);
    if (formId) {
        refreshSubmissions();
    }

    // Helper to refresh table and Kanban
    function refreshSubmissions() {
        fetchStageMap(function() {
            fetch(`/api/form/submissions/${formId}`)
                .then(res => res.json())
                .then(data => {
                    data = data.response.data;
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
        const jsonColDef = {
            type: {
                // Required: how to render the cell
                render: function(cell, value) {
                try {
                    cell.innerText = JSON.stringify(JSON.parse(value));
                } catch (e) {
                    cell.innerText = value || '{}';
                }
                },
                // Optional: how to edit the cell
                editor: function(cell, value, callback) {
                    let textarea = document.createElement('textarea');
                    textarea.value = value || '{}';
                    textarea.style.width = '100%';
                    textarea.style.height = '120px';

                    // Replace cell content with editor
                    cell.innerHTML = '';
                    cell.appendChild(textarea);
                    textarea.focus();

            
                    const options = {onEvent: function(node, event) {
                        if (node.value !== undefined) {
                            console.log(event.type + ' event ' +
                            'on value ' + JSON.stringify(node.value) + ' ' +
                            'at path ' + JSON.stringify(node.path)
                            )
                        } else {
                            console.log(event.type + ' event ' +
                            'on field ' + JSON.stringify(node.field) + ' ' +
                            'at path ' + JSON.stringify(node.path)
                            )
                        }
                    }}
                    const editor = new JSONEditor(textarea, options)
                    editor.set(JSON.parse(value));
                    


                    textarea.onblur = function() {
                        let newValue = textarea.value;
                        try {
                        JSON.parse(newValue); // validate JSON
                        callback(newValue);   // update cell value
                        } catch (e) {
                        callback(value);      // fallback to old value
                        }
                    };
                }
            }
        }
        const rows = [];
        let columns = [];
        let colTypes = {};

        if (data.length > 0) {
            let allCols = [];
           
            data.forEach(sub => {
                allCols = [...allCols,...Object.keys(sub.data)];
            });
            columns = [...new Set(allCols)].map(key => ({ title: key, width: 120 }));
            //columns = Object.keys(data[0].data).map(key => ({ title: key, width: 120 }));
            columns.push({ title: 'shared_profile', width: 160 });
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
                    if( col.title === 'shared_profile') {
                        val = sub.spn || '';
                    }

                    /* all supported types in jspreadsheet
                    "text",
                    "numeric",
                    "dropdown",
                    "autocomplete",
                    "checkbox",
                    "radio",
                    "calendar",
                    "image",
                    "color",
                    "html",
                    "percent",
                    "currency",
                    "hidden",
                    "file",
                    "url",
                    "password"
                */
                    // if(!colTypes[col.title]) {
                    //     let valType = Object.prototype.toString.call(val);
                    //     if(valType === '[object Date]') {
                    //         colTypes[col.title] = 'calendar';
                    //     }
                    //     else if(valType === '[object Array]' && val.length > 0 && typeof val[0] === 'string') {
                    //         colTypes[col.title] = 'dropdown';
                    //     }
                    //     else if(valType === '[object Array]' && val.length > 0 && typeof val[0] === 'object') {
                    //         colTypes[col.title] = 'json';
                    //     }
                    //     else if(valType === '[object Number]') {
                    //         colTypes[col.title] = 'numeric';
                    //     }
                    //     else if(valType === '[object String]') {
                    //         colTypes[col.title] = 'text';
                    //         if (val.startsWith('http') && val.includes('/uploaded_files/')) {
                    //             colTypes[col.title] = 'url';
                    //         }
                    //     }
                    //     else if(valType === '[object Boolean]') {
                    //         colTypes[col.title] = 'checkbox';
                    //     }
                    // }

                    // render array of object as json column
                    // use any json viewer plugin to show it in better format

                    if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'object') {
                        val = JSON.stringify(val);
                    }
                    if (Array.isArray(val)) {
                        val = val.map(v => renderFileUrl(v)).join('<br>');
                    } else {
                        val = renderFileUrl(val);
                        colTypes[col.title] = "html";
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
            const htmlColumns = columns.map((col) => {
                let jsonCol = (colTypes[col.title] === 'json') ? jsonColDef : {};
                Object.assign({}, col, jsonCol);
                return Object.assign({}, col, { type: colTypes[col.title] || 'html' });
            });
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
    // function renderKanbanBoard(submissions, targetSelector = '#submission-kanban') {
    //     // Kanban UI improvements
    //     const stageColors = {
    //         'Backlog': '#e0e0e0',
    //         'To Do': '#e57373',
    //         'In Progress': '#42a5f5',
    //         'Complete': '#66bb6a',
    //         'Screening': '#f9c74f',
    //         'Interview': '#90be6d',
    //         'Offer': '#43aa8b',
    //         'Hired': '#577590',
    //         'Rejected': '#f94144'
    //     };
    //     // Count tasks per stage
    //     const stageCounts = {};
    //     kanbanStages.forEach(stage => stageCounts[stage] = 0);
    //     submissions.forEach(sub => {
    //         let stage = sub.status || kanbanStages[0];
    //         if (stageCounts[stage] !== undefined) stageCounts[stage]++;
    //     });
    //     let html = '<div id="kanban-board">';
    //     kanbanStages.forEach(stage => {
    //         const color = stageColors[stage] || '#e0e0e0';
    //         html += `<div class="kanban-stage" data-stage="${stage}">
    //             <div class="kanban-board-header kanban-stage" style="">
    //                 <span style="font-weight:600;font-size:16px;letter-spacing:0.5px;">${stage} <span style='font-weight:400;font-size:13px;'>(${stageCounts[stage]})</span></span>
    //             </div>
    //             <div class="kanban-list" id="kanban-list-${stage}" style="flex:1;min-height:80px;padding:12px 8px 0 8px;"></div>
    //             <button class="kanban-add-task-btn" data-stage="${stage}" style="margin:10px 8px 12px 8px;padding:6px 0;background:none;border:none;color:#4caf50;font-weight:500;cursor:pointer;font-size:14px;">+ Add Task</button>
    //         </div>`;
    //     });
    //     html += '</div>';
    //     $(targetSelector).html(html);
    //     // Place candidates in their stages
    //     submissions.forEach(sub => {
    //         let stage = sub.status || kanbanStages[0];
    //         // Avatar (use initials or fallback icon)
    //         let avatar = '';
    //         if (sub.avatar_url) {
    //             avatar = `<img src="${sub.avatar_url}" alt="avatar" style="width:28px;height:28px;border-radius:50%;object-fit:cover;margin-right:8px;">`;
    //         } else {
    //             let initials = (sub.name || 'C').split(' ').map(s=>s[0]).join('').toUpperCase().slice(0,2);
    //             avatar = `<div style="width:28px;height:28px;border-radius:50%;background:#bdbdbd;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:15px;margin-right:8px;">${initials}</div>`;
    //         }
    //         // Labels (e.g., TASK LIST)
    //         let labels = '';
    //         if (sub.labels && Array.isArray(sub.labels)) {
    //             labels = sub.labels.map(l => `<span style='background:#eee;color:#888;font-size:11px;padding:2px 8px;border-radius:8px;margin-right:4px;'>${l}</span>`).join('');
    //         } else {
    //             labels = `<span style='background:#eee;color:#888;font-size:11px;padding:2px 8px;border-radius:8px;margin-right:4px;'>TASK LIST</span>`;
    //         }
    //         // Due date (if present)
    //         let due = sub.due_date ? `<span style='background:#fff3cd;color:#856404;font-size:11px;padding:2px 8px;border-radius:8px;margin-left:6px;'>${sub.due_date}</span>` : '';
    //         // Card HTML
    //         let card = `<div class="kanban-card" data-id="${sub.id}" draggable="true" style="background:#fff;border:1px solid #e1e1e1;border-radius:6px;padding:12px 10px 10px 10px;margin-bottom:10px;cursor:move;box-shadow:0 1px 4px #0001;display:flex;flex-direction:column;position:relative;">
    //             <div style="display:flex;align-items:center;margin-bottom:6px;">
    //                 ${avatar}
    //                 <div><b style='font-size:15px;'>${sub.name || 'Task'}</b>${due}</div>
    //                 <button class='kanban-view-profile-btn' title='View Profile' style='margin-left:auto;background:none;border:none;cursor:pointer;padding:2px 6px;'><span class='material-icons' style='font-size:20px;color:#6c63ff;'>person_search</span></button>
    //             </div>
    //             <div style="margin-bottom:4px;">${labels}</div>
    //             <div style="font-size:13px;color:#555;">${sub.email || ''}</div>
    //         </div>`;
    //         $(`#kanban-list-${stage}`, targetSelector).append(card);
    //     });
    //     // Add click handler to Kanban cards for candidate view
    //     // View profile icon click (does not trigger drag)
    //     $(targetSelector).on('click', '.kanban-view-profile-btn', function(e) {
    //         e.stopPropagation();
    //         var candidateId = $(this).closest('.kanban-card').data('id');
    //         if(candidateId) {
    //             window.open('/candidate/' + candidateId, '_blank');
    //         }
    //     });
    //     // Card click (fallback: open profile)
    //     $(targetSelector).on('click', '.kanban-card', function(e) {
    //         // Prevent drag event from triggering click or double open if icon was clicked
    //         if (e.originalEvent && e.originalEvent.type === 'dragstart') return;
    //         if ($(e.target).closest('.kanban-view-profile-btn').length) return;
    //         var candidateId = $(this).data('id');
    //         if(candidateId) {
    //             window.open('/candidate/' + candidateId, '_blank');
    //         }
    //     });
    //     // Drag and drop logic
    //     $(".kanban-card", targetSelector).on('dragstart', function(e) {
    //         e.originalEvent.dataTransfer.setData('id', $(this).data('id'));
    //     });
    //     $(".kanban-list", targetSelector).on('dragover', function(e) {
    //         e.preventDefault();
    //     });
    //     $(".kanban-list", targetSelector).on('drop', function(e) {
    //         e.preventDefault();
    //         var id = e.originalEvent.dataTransfer.getData('id');
    //         var $card = $(`.kanban-card[data-id='${id}']`, targetSelector);
    //         $(this).append($card);
    //         // Update status in backend
    //         var newStage = $(this).closest('.kanban-stage').data('stage');
    //         $.ajax({
    //             url: '/api/submissions/' + id + '/status',
    //             type: 'PUT',
    //             data: JSON.stringify({ status: newStage }),
    //             contentType: 'application/json',
    //             success: function(resp) {
    //                 // Optionally show a toast or update UI
    //             }
    //         });
    //     });
    //     // Add Task button (placeholder, implement modal or inline add as needed)
    //     $(".kanban-add-task-btn").on('click', function() {
    //         alert('Add Task functionality coming soon!');
    //     });
    // }
    
    // window.renderKanbanBoard = renderKanbanBoard;
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
        // Count candidates per stage
        const stageCounts = {};
        boardKeys.forEach(key => stageCounts[key] = 0);
        submissions.forEach(sub => {
            let boardKey = sub.stage ? sub.stage.charAt(0).toUpperCase() + sub.stage.slice(1).toLowerCase() : 'Screening';
            if (!boardKeys.includes(boardKey)) boardKey = 'Screening';
            stageCounts[boardKey]++;
        });
        const stageIcons = {
            Screening: 'fa-search',
            Interview: 'fa-comments',
            Offer: 'fa-handshake',
            Hired: 'fa-user-check',
            Rejected: 'fa-user-xmark'
        };
        const boards = boardKeys.map(key => ({
            id: key,
            title: `<div><span class='fa-solid ${stageIcons[key] || 'fa-user'}' style='font-size:17px;margin-right:7px;vertical-align:middle;'></span>${key} <span style='color:#888;font-size:13px;font-weight:400;'>(${stageCounts[key]})</span></div>`,
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
                    `<div style='border:1px solid #e1e1e1;border-radius:8px;padding:14px 16px 12px 16px;background:#fff;box-shadow:0 1px 4px #0001;position:relative;'>`
                    + `<div style='display:flex;align-items:center;justify-content:space-between;'>`
                        + `<div style='display:flex;align-items:center;'>`
                            + (() => {
                                if (sub.data.avatar_url) {
                                    return `<img src='${sub.data.avatar_url}' alt='avatar' style='width:32px;height:32px;border-radius:50%;object-fit:cover;margin-right:10px;'>`;
                                } else {
                                    let initials = (sub.data[nameCol] || 'C').split(' ').map(s=>s[0]).join('').toUpperCase().slice(0,2);
                                    return `<div style=\"width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#6c63ff,#43aa8b);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:15px;margin-right:10px;\">${initials}</div>`;
                                }
                            })()
                            + `<div>`
                                + `<div style='font-weight:600;font-size:15px;color:#222;'>${sub.data[nameCol] || 'Candidate'}</div>`
                                + `<div style='font-size:13px;color:#555;'>${sub.data.email || ''}</div>`
                            + `</div>`
                        + `</div>`
                        
                    + `</div>`
                    + `<div style='margin-top:8px;font-size:13px;color:#444;'><span style='font-weight:500;'>Role:</span> ${sub.data.role || ''}</div>`
                    + `<div style='margin-top:2px;font-size:13px;color:#444;'><span style='font-weight:500;'>Exp:</span> ${sub.data.experience_year || ''} yrs` 
                        + (sub.data.skills ? `  <span style='font-weight:500;margin-left:12px;'>Skills:</span> ${Array.isArray(sub.data.skills) ? sub.data.skills.join(', ') : sub.data.skills}` : '')
                    + `</div>`
                    + `<div style='margin-top:2px;font-size:13px;color:#444;'><span style='font-weight:500;'>Notice:</span> ${sub.data.notice_period || ''}`
                        + (sub.data.location ? `  <span style='font-weight:500;margin-left:12px;'>Location:</span> ${sub.data.location}` : '')
                    + `</div>`
                    + `<div style='margin-top:2px;font-size:13px;color:#888;'><span style='font-weight:500;'>Source:</span> ${sub.data.source || ''}`
                        + (sub.data.last_update ? `  <span style='font-weight:500;margin-left:12px;'>Last Update:</span> ${sub.data.last_update}` : '')
                    + `</div>`
                    + `<div class="actions" style="margin-top: 10px"><button class="view-candidate" title='View Profile' data-candidate-id='${sub.id}' style='border:1px solid #3498db;background:transparent;color:#3498db;font-size:13px;padding:3px 14px;border-radius:16px;cursor:pointer;transition:background 0.2s;margin-left:0;'>View</button></div>`
                    + `</div>`
            };
            const board = boards.find(b => b.id === boardKey);
            if(board) board.item.push(card);
        });
        if (!hasCandidates) {
            kanbanContent.innerHTML = '<div style="text-align:center;padding:48px 0;font-size:20px;color:#888;">No candidates</div>';
            return;
        }

        let msEnterTimeout = null;
        // Add click handler for view icon (delegated, only once)
        $('#jkanban-board-content').off('click', '.view-candidate').on('click', '.view-candidate', function(e) {
            e.stopPropagation();
            let self = this;
            msEnterTimeout = null;
            var candidateId = $(self).data('candidate-id');
            if(candidateId) {
                // Show sidebar and fetch candidate data
                $('#candidate-sidebar-body').html('<div style="text-align:center;color:#888;">Loading...</div>');
                $('#candidate-sidebar').addClass('open');
                $.get('/api/candidate/' + candidateId, function(resp) {
                    if (resp && resp.candidate) {
                        renderCandidateSidebar(resp.candidate);
                    } else {
                        $('#candidate-sidebar-body').html('<div style="color:#c00;text-align:center;">Candidate not found.</div>');
                    }
                }).fail(function() {
                    $('#candidate-sidebar-body').html('<div style="color:#c00;text-align:center;">Error loading candidate.</div>');
                });
            }
        });
        // $('#jkanban-board-content').off('mouseleave', '.view-candidate').on('mouseleave', '.view-candidate', function(e) {
        //     e.stopPropagation();
        //     if(!msEnterTimeout && !$('#candidate-modal').hasClass("hide"))
        //         $('#candidate-modal').addClass("hide");
        // });

        var kanban = new jKanban({
            element: '#jkanban-board-content',
            boards,
            gutter: '24px',
            itemClick: function(el, event) {
                // Only trigger if not clicking the view icon
                if (event && $(event.target).hasClass('fa-user')) {
                    // Handled by icon click above
                    return;
                }
                // Fallback: open candidate profile
                var candidateId = $(el).find('.fa-user').data('candidate-id');
                if(candidateId) {
                    window.open('/candidate/' + candidateId, '_blank');
                }
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

// Sidebar container for candidate details (append to body if not present)
if ($('#candidate-sidebar').length === 0) {
    $('body').append(`
        <div id="candidate-sidebar" style="position:fixed;top:0;left:0;height:100vh;z-index:1200;background:#fff;box-shadow:2px 0 16px #0002;max-width:600px;width:480px;transform:translateX(-100%);transition:transform 0.3s cubic-bezier(.4,0,.2,1);display:flex;flex-direction:column;">
            <div id="candidate-sidebar-body" style="flex:1;overflow-y:auto;"></div>
        </div>
    `);
}

// Sidebar open/close CSS
const sidebarStyle = document.createElement('style');
sidebarStyle.innerHTML = `
#candidate-sidebar { pointer-events:none; }
#candidate-sidebar.open { transform:translateX(0); pointer-events:auto; }
@media (max-width: 700px) {
  #candidate-sidebar { max-width:100vw;width:100vw; }
}
`;
document.head.appendChild(sidebarStyle);
