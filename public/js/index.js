const propertyHelpers = {
    getGoogleSheetsMappingProperty: function(field, sheetHeaders, droppedFields) {
        if (!sheetHeaders || !sheetHeaders.length) return '';
        let html = `<label>Map Sheet Columns to Form Fields:</label><br/>`;
        html += `<div style='display:flex;flex-direction:column;gap:6px;'>`;
        sheetHeaders.forEach(col => {
            html += `<div style='display:flex;align-items:center;gap:12px;'>
                <span style='display:inline-block;width:160px;font-weight:500;'>${col}</span>
                <select class='gsheet-map' data-col-name='${col}' style='width:180px;'>
                    <option value=''>-- None --</option>`;
            droppedFields.forEach(f => {
                if (f.type === 'button') return;
                html += `<option value='${f.id}'>${f.label}</option>`;
            });
            html += `</select></div>`;
        });
        html += `</div><button id='save-mapping-btn' style='margin-top:12px;background:#007bff;color:#fff;border:none;border-radius:3px;padding:4px 12px;cursor:pointer;'>Save Mapping</button>`;
        return html;
    },
    getGoogleSheetsProperty: function(field) {
        return `
            <label>Google Sheets Integration:</label><br/>
            <button id="google-auth-btn" style="background:#34a853; color:#fff; border:none; border-radius:3px; padding:4px 12px; margin-top:6px; cursor:pointer; font-size:14px;">Connect to Google Sheets</button>
            <div id="google-sheets-list" style="margin-top:8px;"></div>
        `;
    },
    getLabelProperty: function(field) {
        return `
            <label>Label:</label>
            <input type="text" id="prop-label" value="${field.label}" /><br/><br/>
        `;
    },
    getPlaceholderProperty: function(field) {
        return `
            <label>Placeholder:</label>
            <input type="text" id="prop-placeholder" value="${field.placeholder ? field.placeholder: field.label}" /><br/><br/>
        `;
    },
    getRequiredProperty: function(field) {
        return `
            <label>Required:</label>
            <input type="checkbox" id="prop-required" ${field.required ? "checked" : ""} /><br/><br/>
        `;
    },
    getAddItemButton: function(id) {
        // id: string for button id (e.g. 'add-list-item' or 'add-option')
        return `<button id="${id}" style="background:#3498db; color:#fff; border:none; border-radius:3px; padding:4px 12px; margin-top:6px; cursor:pointer; font-size:14px;">+ Add More</button>`;
    },
}
const UIHelper = {
    showDeleteCtrl: function() {
        $("#delete-field-btn").removeClass("hide");
    },
    hideDeleteCtrl: function() {
        $("#delete-field-btn").addClass("hide");
    },
    updateDropPlaceholder: function() {
        if ($("#job-form .form-field").length === 0) {
            $("#drop-placeholder").show();
        } else {
            $("#drop-placeholder").hide();
        }
    },
    emptyPropertyPanel: function() {
        $("#field-properties").empty().text("Select a field to edit");
    }
}


function sanitizeId(base) {
    return base.replace(/[^a-zA-Z0-9_]/g, "");
}

function generateUniqueId(base) {
    let suffix = 1;
    let newId = base;
    // Find the next available id (e.g., text1, text2, ...)
    while (droppedFields.some(f => f.id === newId)) {
        newId = base + suffix++;
    }
    return newId;
}

function renderAvailableFields() {
    $('#available-fields').empty();
    if (typeof fieldsGroup !== 'undefined') {
        fieldsGroup.forEach(groupObj => {
            $('#available-fields').append(`<div class="field-group-label">${groupObj.group}</div>`);
            groupObj.fields.forEach(type => {
                const f = fields.find(field => field.type === type || field.id === type);
                if (f) {
                    let label = f.label || f.text || (f.type.charAt(0).toUpperCase() + f.type.slice(1));
                    let iconHtml = f.icon ? `<i class="${f.icon}" style="margin-right:8px;"></i>` : "";
                    $('#available-fields').append(`<div class="field-item" data-id="${f.id || f.type}">${iconHtml}${label}</div>`);
                }
            });
        });
    } else {
        fields.forEach(f => {
            const key = f.id || f.type;
            let label = f.label || f.text || (f.type.charAt(0).toUpperCase() + f.type.slice(1));
            let iconHtml = f.icon ? `<i class="${f.icon}" style="margin-right:8px;"></i>` : "";
            $('#available-fields').append(`<div class="field-item" data-id="${key}">${iconHtml}${label}</div>`);
        });
    }
}

renderAvailableFields();
let previewMode = false;
let $lastActiveField = null;
// Track dropped fields separately to support duplicates
let droppedFields = [];

// Helper to get formId from server-rendered context or URL
function getFormId() {
    if (window.formId) return window.formId;
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Restore dropped fields from server (if editing a form)
var formStatus = 1;
$(document).ready(function() {
    const formId = getFormId();
    if (formId) {
        // Fetch form data from server
        fetch(`/api/forms/${formId}`)
            .then(r => r.json())
            .then(form => {
                let parsed = [];
                let jobdesc = form.jobdesc;
                if (form && form.state_json) {
                    try { parsed = form.state_json; } catch (e) { parsed = []; }
                }
                droppedFields = Array.isArray(parsed) ? parsed : [];
                if(droppedFields.length) {
                    $('#job-form').empty();
                    droppedFields.forEach(field => {
                        $('#job-form').append(getFieldHtml(field));
                        // If field is editor, initialize Quill instance and set value
                        if(field.type === 'editor') {
                            setTimeout(function() {
                                var quill = new Quill(`#${field.id}`, {
                                    theme: 'snow',
                                    modules: {
                                        toolbar: [
                                            [{ header: [1, 2, false] }],
                                            ['bold', 'italic', 'underline'],
                                            ['link', 'blockquote', 'code-block', 'image'],
                                            [{ list: 'ordered' }, { list: 'bullet' }]
                                        ]
                                    }
                                });
                                window.quillEditors = window.quillEditors || {};
                                window.quillEditors[field.id] = quill;
                                if(field.value) {
                                    quill.root.innerHTML = field.value;
                                }
                            }, 0);
                        } else {
                            // For other input/select fields, set value if present
                            if(["text", "email", "number", "date", "textarea"].includes(field.type) && field.value !== undefined) {
                                setTimeout(function() {
                                    $(`#${field.id}`).val(field.value);
                                }, 0);
                            }
                            if(field.type === "select" && field.value !== undefined) {
                                setTimeout(function() {
                                    $(`#${field.id}`).val(field.value);
                                }, 0);
                            }
                            if(field.type === "list" && Array.isArray(field.value)) {
                                // Optionally update list items if needed
                                // ...could be implemented if list items are editable
                            }
                        }
                    });
                }
                // initilize richtext editor with jobdesc
                if(jobdesc) {
                    if ($('#jobdesc-editor').length) {
                        $('#jobdesc-editor').html(jobdesc);
                        window.jobdescQuill = new Quill('#jobdesc-editor', {
                        theme: 'snow',
                        modules: {
                                toolbar: [
                                [{ header: [1, 2, false] }],
                                ['bold', 'italic', 'underline'],
                                ['link', 'blockquote', 'code-block', 'image'],
                                [{ list: 'ordered' }, { list: 'bullet' }]
                                ]
                            }
                        });

                        window.jobdescQuill.on('text-change', function() {
                            var jobdesc = window.jobdescQuill.root.innerHTML;
                            // Replace with your form ID logic if needed
                            var formId = getFormId();
                            $.ajax({
                            url: '/api/forms/' + formId + '/jobdesc',
                            method: 'POST',
                            data: { jobdesc: jobdesc },
                            success: function(res) {
                                // Optionally show a small toast or indicator
                                Toastify({
                                text: "Job description saved!",
                                duration: 1200,
                                gravity: "top",
                                position: "right",
                                backgroundColor: "#28a745"
                                }).showToast();
                            }
                            });
                        });
                    }
                }

                setTimeout(function() {
                    $('.education-university').select2 && $('.education-university').select2({
                        width: '100%',
                        placeholder: 'Select University',
                        allowClear: true
                    });
                }, 0);
                makeJobFormSortable();
                UIHelper.updateDropPlaceholder();
                $(document).off('click.formfield').on('click.formfield', '.form-field', handleFormFieldClick);
            });
    } else {
        droppedFields = [];
        $('#job-form').empty();
        UIHelper.updateDropPlaceholder();
    }
});

// Templates button click
            $('#template-btn').on('click', function() {
                // Render template list as clickable items
                var html = '';
                if (formTemplates && formTemplates.length) {
                    formTemplates.forEach(function(tmpl) {
                        html += `<li class="template-item" data-id="${tmpl.id}" style="border:1px solid #e1e1e1; border-radius:6px; padding:14px; margin-bottom:12px; cursor:pointer;flex-basis: 28%;box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                            <div style="font-size:17px;font-weight:600;">${tmpl.name}</div>
                            <div style="font-size:13px;color:#666;margin-bottom:6px;margin-top: 8px;">${tmpl.description || ''}</div>
                        </li>`;
                    });
                } else {
                    html = '<li>No templates found.</li>';
                }
                $('#template-list').html(html);
                $('#templates-modal').modal({fadeDuration:200});
            });

            // Use template on list item click
            $(document).on('click', '.template-item', function() {
                var tmplId = $(this).data('id');
                var tmpl = (formTemplates || []).find(t => t.id === tmplId);
                if (tmpl) {
                    // Replace droppedFields and re-render form
                    let jobdesc = tmpl.jobdesc;
                    droppedFields = tmpl.fields.map((f, idx) => {
                        const field = Object.assign({}, f);
                        // Generate unique id: type + timestamp + idx
                        field.id = field.id || (field.type);
                        return field;
                    });
                    $('#job-form').empty();
                    if(jobdesc) {
                        if ($('#jobdesc-editor').length) {
                            if(window.jobdescQuill) {
                                jobdescQuill.clipboard.dangerouslyPasteHTML(jobdesc);
                                //window.jobdescQuill.root.innerHTML = jobdesc;
                            } else {
                                $('#jobdesc-editor').html(jobdesc);
                                window.jobdescQuill = new Quill('#jobdesc-editor', {
                                    theme: 'snow',
                                    modules: {
                                        toolbar: [
                                            [{ header: [1, 2, false] }],
                                            ['bold', 'italic', 'underline'],
                                            ['link', 'blockquote', 'code-block', 'image'],
                                            [{ list: 'ordered' }, { list: 'bullet' }]
                                        ]
                                    }
                                });
                                window.jobdescQuill.on('text-change', function() {
                                    var jobdesc = window.jobdescQuill.root.innerHTML;
                                    var formId = getFormId();
                                    $.ajax({
                                        url: '/api/forms/' + formId + '/jobdesc',
                                        method: 'POST',
                                        data: { jobdesc: jobdesc },
                                        success: function(res) {
                                            Toastify({
                                                text: "Saved",
                                                duration: 1200,
                                                gravity: "top",
                                                position: "right",
                                                backgroundColor: "#28a745"
                                            }).showToast();
                                        }
                                    });
                                });
                            }
                        }
                    }



                    droppedFields.forEach(field => {
                        $('#job-form').append(getFieldHtml(field));
                    });
                    // Re-initialize Quill editors if needed
                    setTimeout(function() {
                        if(window.quillEditors) { Object.values(window.quillEditors).forEach(q => q && q.root && (q.root.innerHTML = '')); }
                        droppedFields.forEach(function(field) {
                            if(field.type === 'editor') {
                            var quill = new Quill(`#${field.id}`, {
                                theme: 'snow',
                                modules: {
                                    toolbar: [
                                        [{ header: [1, 2, false] }],
                                        ['bold', 'italic', 'underline'],
                                        ['link', 'blockquote', 'code-block', 'image'],
                                        [{ list: 'ordered' }, { list: 'bullet' }]
                                    ]
                                }
                            });
                            if (field.value) {
                                quill.clipboard.dangerouslyPasteHTML(field.value);
                            }
                            window.quillEditors = window.quillEditors || {};
                            window.quillEditors[field.id] = quill;
                            }
                        });
                        saveFormBuilderState();
                    }, 0);
                    $.modal.close();
                    UIHelper.updateDropPlaceholder();
                }
            });

        // Use template button click
        $(document).on('click', '.use-template-btn', function() {
            var tmplId = $(this).data('id');
            var tmpl = (window.formTemplates || []).find(t => t.id === tmplId);
            if (tmpl) {
                // Replace droppedFields and re-render form
                window.droppedFields = tmpl.fields.map(f => Object.assign({}, f));
                $('#job-form').empty();
                droppedFields.forEach(field => {
                    $('#job-form').append(getFieldHtml(field));
                });
                // Re-initialize Quill editors if needed
                setTimeout(function() {
                    if(window.quillEditors) { Object.values(window.quillEditors).forEach(q => q && q.root && (q.root.innerHTML = '')); }
                    droppedFields.forEach(function(field) {
                        if(field.type === 'editor') {
                            var quill = new Quill(`#${field.id}`, {
                                theme: 'snow',
                                modules: {
                                    toolbar: [
                                        [{ header: [1, 2, false] }],
                                        ['bold', 'italic', 'underline'],
                                        ['link', 'blockquote', 'code-block', 'image'],
                                        [{ list: 'ordered' }, { list: 'bullet' }]
                                    ]
                                }
                            });
                            if (field.value) {
                                quill.clipboard.dangerouslyPasteHTML(field.value);
                            }
                            window.quillEditors = window.quillEditors || {};
                            window.quillEditors[field.id] = quill;
                        }
                    });
                    // Re-attach .form-field click event for editing
                    $(document).off('click.formfield').on('click.formfield', '.form-field', handleFormFieldClick);
                }, 0);
                $.modal.close();
                UIHelper.updateDropPlaceholder();
            }
        });
        // Settings icon click handler (show menu)
        $('#settings-icon').on('click', function(e) {
            e.stopPropagation();
            $('#settings-menu').toggle();
        });
        // Hide menu on click outside
        $(document).on('click', function(e) {
            if (!$(e.target).closest('#settings-menu, #settings-icon').length) {
                $('#settings-menu').hide();
            }
        });
        // All Links option
        $('#show-all-links').on('click', function() {
            var formId = window.formId || (new URLSearchParams(window.location.search).get('id'));
            if (!formId) return alert('No form selected.');
            window.open(`/forms/${formId}/all-links`, '_blank');
            $('#settings-menu').hide();
        });
        // Submissions option
        $('#show-submissions').on('click', function() {
            window.open('/submissions', '_blank');
            $('#settings-menu').hide();
        });
        // Use event delegation for share button to ensure handler works after dynamic DOM changes

        $(document).on('click', '#share-form-btn', function() {
            var formId = window.formId || (new URLSearchParams(window.location.search).get('id'));
            if (!formId) return alert('No form selected.');
            // Check form status from backend
            fetch(`/api/forms/${formId}/status`)
                .then(r => r.json())
                .then(form => {
                    if (form.status === 0) {
                        // Not changed, fetch existing share link
                        fetch(`/api/forms/${formId}/lastShared`)
                            .then(r => r.json())
                            .then(resp => {
                                if (resp.success && resp.shareUrl) {
                                    $(".existing-block-message").removeClass("hide");
                                    $(".generate-link").removeClass("hide");
                                    $(".name-block").removeClass("hide");
                                    $("#share-modal-link").val(resp.shareUrl);
                                    $("#share-modal-name").val(resp.shareName || "").prop('disabled', true);
                                    $("#share-modal").modal({fadeDuration:200});
                                    $("#save-share-btn").addClass("hide");
                                
                                } else {
                                    alert('No existing share link found.');
                                }
                            });
                    } else {
                        $(".existing-block-message").addClass("hide");
                        // Changed, prompt for name and allow to generate new link
                        $("#share-modal-link").val("");
                        $("#share-modal-name").val("");
                        $("#share-modal").modal({fadeDuration:200});
                    }
                });
        });

        // Step 2: On save, generate and show share link
        $(document).on('click', '#save-share-btn', function() {
            var name = $("#share-modal-name").val();
            var formId = window.formId || (new URLSearchParams(window.location.search).get('id'));
            if (!name) { alert('Please enter a name for this share.'); return; }
            fetch(`/api/forms/${formId}/share`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name })
            })
            .then(r => r.json())
            .then(resp => {
                if (resp.success && resp.shareUrl) {
                    $(".generate-link").removeClass("hide").siblings('.name-block').addClass("hide");
                    $("#share-modal-link").val(resp.shareUrl);
                    Toastify({ text: 'Share link generated!', backgroundColor: '#28a745', duration: 2000 }).showToast();
                } else {
                    alert('Failed to generate link.');
                }
            });
        });
        $("#regenerate-link-btn").on("click", function() {
            var formId = window.formId || (new URLSearchParams(window.location.search).get('id'));
            if (!formId) return alert('No form selected.');
            $(".existing-block-message").addClass("hide");
            $(".name-block").removeClass("hide");
            $(".generate-link").addClass("hide");
            $("#share-modal-link").val("");
            $("#share-modal-name").val("").prop('disabled', false);
            $("#save-share-btn").removeClass("hide");
        });

        $("#copy-link-icon").on("click", function() {
            var link = $("#share-modal-link").val();
            if (!link) return;
            var el = document.createElement('textarea');
            el.value = link;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            Toastify({ text: 'Link copied to clipboard!', backgroundColor: '#28a745', duration: 2000 }).showToast();
        });


$("#preview-toggle").on("click", function() {
    previewMode = !previewMode;
    if (previewMode) {
        // Hide left and right panels using visibility  
        $(".container").addClass("preview-enabled");  
        $lastActiveField = $(".form-field.active");
        if($lastActiveField.length) {
            $lastActiveField.removeClass('active');
        }
        // Disable sortable in preview mode
        if ($("#job-form").data('ui-sortable')) {
            $("#job-form").sortable('disable');
        }
        $(this).text("Edit");
        // Disable all Quill editors and hide toolbar
        if(window.quillEditors) {
            Object.values(window.quillEditors).forEach(q => {
                if(q) {
                    q.enable(false);
                    var toolbar = q.getModule('toolbar');
                    if(toolbar && toolbar.container) {
                        toolbar.container.style.display = 'none';
                    }
                }
            });
        }
    } else {
        if($lastActiveField.length) {
            $lastActiveField.addClass('active');
        }
        // Show left and right panels using visibility
        $(".container").removeClass("preview-enabled");  
        // Restore borders and selection highlight
        // Re-enable sortable when exiting preview
        if ($("#job-form").data('ui-sortable')) {
            $("#job-form").sortable('enable');
        }
        $(this).text("Preview");
        // Enable all Quill editors and show toolbar
        if(window.quillEditors) {
            Object.values(window.quillEditors).forEach(q => {
                if(q) {
                    q.enable(true);
                    var toolbar = q.getModule('toolbar');
                    if(toolbar && toolbar.container) {
                        toolbar.container.style.display = '';
                    }
                }
            });
        }
    }
});

// Make fields draggable
$(".field-item").draggable({
    helper: "clone",
    revert: "invalid"
});

$('#field-search-box').on('input', function() {
    const query = $(this).val().toLowerCase();
    $('#available-fields').empty();
    if (typeof fieldsGroup !== 'undefined') {
        fieldsGroup.forEach(groupObj => {
            let groupHasMatch = false;
            groupObj.fields.forEach(type => {
                const f = fields.find(field => field.type === type || field.id === type);
                if (f && f.label.toLowerCase().includes(query)) groupHasMatch = true;
            });
            if (groupHasMatch) {
                $('#available-fields').append(`<div class='field-group-label' style='font-weight:600; margin:16px 0 8px 0; font-size:15px; color:#444;'>${groupObj.group}</div>`);
                groupObj.fields.forEach(type => {
                    const f = fields.find(field => field.type === type || field.id === type);
                    if (f && f.label.toLowerCase().includes(query)) {
                        let iconHtml = f.icon ? `<i class='${f.icon}' style='margin-right:8px;'></i>` : "";
                        $('#available-fields').append(`<div class='field-item' data-id='${f.id || f.type}'>${iconHtml}${f.label}</div>`);
                    }
                });
            }
        });
    } else {
        fields.forEach(f => {
            if (f.label.toLowerCase().includes(query)) {
                const key = f.id || f.type;
                let iconHtml = f.icon ? `<i class='${f.icon}' style='margin-right:8px;'></i>` : "";
                $('#available-fields').append(`<div class='field-item' data-id='${key}'>${iconHtml}${f.label}</div>`);
            }
        });
    }
});



// Education block add/remove events
$(document).on('click', '.add-education-block', function() {
    const $formField = $(this).closest('.form-field');
    const fieldId = $formField.data('id');
    let field = droppedFields.find(f => f.id === fieldId);
    if (!field.values) field.values = [{}];
    field.values.push({});
    $formField.replaceWith(getFieldHtml(field));
    // Re-initialize Select2 on all university dropdowns
    setTimeout(function() {
        $('.education-university').select2({
            width: '100%',
            placeholder: 'Select University',
            allowClear: true
        });
    }, 0);
});

$(document).on('click', '.remove-education-block', function() {
    const $formField = $(this).closest('.form-field');
    const fieldId = $formField.data('id');
    let field = droppedFields.find(f => f.id === fieldId);
    const idx = parseInt($(this).data('idx'));
    if (field.values && field.values.length > 1) {
        field.values.splice(idx, 1);
                        localStorage.setItem('droppedFields', JSON.stringify(droppedFields));
        $formField.replaceWith(getFieldHtml(field));
    }
});

// Only allow one instance of input fields; allow multiples for non-input elements
$("#job-form").droppable({
    accept: ".field-item",
    drop: function(event, ui) {
        // If drop target is inside a container-dropzone, skip main form add
        if ($(event.target).closest('.container-dropzone').length) return;
        const fieldId = ui.helper.data("id");
        // Find by id if present, otherwise by type
        const origField = fields.find(f => (f.id || f.type) === fieldId);
        if (!origField) return;
        // Use inputType to control single/multiple drops
        if (
            origField.inputType === "input" &&
            droppedFields.some(f => f.type === origField.type)
        ) {
            Toastify({
                text: origField.type + " already added",
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "bottom",
                position: "right",
                stopOnFocus: true,
                backgroundColor: "linear-gradient(to right, #b00000ff, #c93dadff)",
            }).showToast();
            return;
        }
        // Clone the field object to allow duplicates for noninput types
        let field = JSON.parse(JSON.stringify(origField));
        // Generate a unique id based on label and a counter
        let baseLabel = sanitizeId((field.type || "field"));
        let newId = generateUniqueId(baseLabel);
        field.id = newId;
        // If education field, fetch university data and set options
        if (field.type === 'education') {
            $.ajax({
                url: 'data/university.csv',
                dataType: 'text',
                success: function(csv) {
                    var lines = csv.split(/\r?\n/).slice(1);
                    var universities = Array.from(new Set(
                        lines.map(function(line) {
                            var cols = line.split(',');
                            return cols[1] ? cols[1].replace(/^"|"$/g, '').trim() : null;
                        }).filter(Boolean)
                    ));
                    field.universityOptions = universities;
                    droppedFields.push(field);
                    localStorage.setItem('droppedFields', JSON.stringify(droppedFields));
                    
                    var $newField = $(getFieldHtml(field)).css({display: 'none'});
                    $("#job-form").append($newField);
                    $newField.fadeIn(250, function() {
                        $newField.addClass('form-field-animate');
                        setTimeout(function() { $newField.removeClass('form-field-animate'); }, 600);
                    });
                    $newField.find('.education-university').select2({
                        width: '100%',
                        placeholder: 'Select University',
                        allowClear: true
                    });
                    makeJobFormSortable();
                    UIHelper.updateDropPlaceholder();
                },
                error: function(xhr, status, err) {
                    console.error('[ERROR] Failed to load university.csv:', status, err);
                }
            });
            return;
        }
        droppedFields.push(field);
        localStorage.setItem('droppedFields', JSON.stringify(droppedFields));
        saveFormBuilderState();
        const $newField = $(getFieldHtml(field)).css({display: 'none'});
        $("#job-form").append($newField);
        $newField.fadeIn(250, function() {
            $newField.addClass('form-field-animate');
            setTimeout(() => $newField.removeClass('form-field-animate'), 600);
        });
        makeJobFormSortable();
        UIHelper.updateDropPlaceholder();
    }
});

// Helper to get formId from server-rendered context or URL
function getFormId() {
    if (window.formId) return window.formId;
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Save droppedFields to backend for a specific form
function saveFormBuilderState() {
    // Before saving, update droppedFields with current editor and input values
    if (window.quillEditors) {
        Object.entries(window.quillEditors).forEach(([id, quill]) => {
            let field = droppedFields.find(f => f.id === id);
            if (field && quill) {
                field.value = quill.root.innerHTML;
            }
        });
    }
    // Update other input field values
    droppedFields.forEach(field => {
        if (["text", "email", "number", "date", "textarea"].includes(field.type)) {
            let val = $("#" + field.id).val();
            if (val !== undefined) field.value = val;
        }
        // For select fields
        if (field.type === "select") {
            let val = $("#" + field.id).val();
            if (val !== undefined) field.value = val;
        }
        // For list fields, store selected values if applicable
        if (field.type === "list") {
            let items = [];
            $(".form-field[data-id='" + field.id + "'] li").each(function() {
                items.push($(this).text());
            });
            field.value = items;
        }
    });
    const formId = getFormId();
    if (!formId) return;
    fetch(`/api/forms/${formId}/data`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: droppedFields })
    });
}

function makeJobFormSortable() {
    const $form = $("#job-form");
    if ($form.data('ui-sortable')) $form.sortable('destroy');
    $form.sortable({
        items: "> .form-field",
        tolerance: "pointer",
        placeholder: "sortable-placeholder",
        update: function() { UIHelper.updateDropPlaceholder(); },
        start: function() {
            $form.css('cursor', 'move');
        },
        stop: function() {
            $form.css('cursor', 'default');
            // Re-initialize Select2 after sorting
            $form.find('.education-university').select2({
                width: '100%',
                placeholder: 'Select University',
                allowClear: true
            });
            // Update droppedFields order to match DOM
            const newOrder = [];
            $form.find('.form-field').each(function() {
                const id = $(this).data('id');
                const field = droppedFields.find(f => f.id === id);
                if (field) newOrder.push(field);
            });
            droppedFields = newOrder;
            // Save builder state to backend
            saveFormBuilderState();
        }
    });
    // Set cursor to move when sortable is enabled, default when disabled
    if ($form.sortable('option', 'disabled')) {
        $form.css('cursor', 'default');
    } else {
        $form.css('cursor', 'move');
    }
}

// property items helpers fuctions

const RenderHelpers = {
    renderListOrOptionsHtml: function(options, isSelect) {
        let html = '<div id="prop-list-items-list" style="display:flex; flex-direction:column;">';
        html += options.map((item, idx) => {
            if (isSelect) {
                // Two-row style for select options
                return `
                    <div class="option-row" data-idx="${idx}" style="display:flex; flex-direction:column; gap:4px; margin-bottom:6px; cursor:move; background:#f8f9fa; border:1px solid #e1e1e1; border-radius:5px; padding:7px 8px;">
                        <div style="display:flex; align-items:center; gap:8px;">
                            <span class="option-drag-handle" style="cursor:move; font-size:18px; margin-right:4px;">&#9776;</span>
                            <label style="font-size:12px; color:#555; min-width:40px;">Label</label>
                            <input type="text" class="opt-label live-change" data-prop-name="label" value="${item.label}" placeholder="Label" style="padding:2px 6px; border-radius:3px; border:1px solid #ccc;" />
                            <button class="remove-option" title="Remove option">&#x2715;</button>
                        </div>
                        <div style="display:flex; align-items:center; gap:8px;">
                            <label style="font-size:12px; color:#555; min-width:40px;">Value</label>
                            <input type="text" class="opt-value live-change" data-prop-name="value" value="${item.value}" placeholder="Value" style="padding:2px 6px; border-radius:3px; border:1px solid #ccc;" />
                        </div>
                    </div>
                `;
            } else {
                // Single-row style for list items, but use .option-row
                return `
                    <div class="option-row" data-idx="${idx}" style="display:flex; align-items:center; gap:8px; margin-bottom:6px; cursor:move; background:#f8f9fa; border:1px solid #e1e1e1; border-radius:5px; padding:7px 8px;">
                        <span class="option-drag-handle" style="cursor:move; font-size:18px; margin-right:4px;">&#9776;</span>
                        <input type="text" class="list-item-text live-change" data-prop-name="" value="${item}" placeholder="Item" style="padding:2px 6px; border-radius:3px; border:1px solid #ccc;" />
                        <button class="remove-list-item" title="Remove item">&#x2715;</button>
                    </div>
                `;
            }
        }).join("");
        html += '</div>';
        return html;
    }
}

function updateFieldOptions(fieldId,field) {
    if (field.type === "select") {
        const $select = $("#" + fieldId);
        $select.html(field.options.map(o => `<option value='${o.value}'>${o.label}</option>`).join(""));
    }
}
function updateListField(fieldId, field) {
    const tag = field.listType === 'ol' ? 'ol' : 'ul';
    $(`.form-field[data-id='${fieldId}'] ul, .form-field[data-id='${fieldId}'] ol`).replaceWith(`<${tag} id='${fieldId}'>${(field.options || []).map(item => `<li>${item}</li>`).join('')}</${tag}>`);
}

function renderListOrOptions(fieldId, field) {
    const isSelect = field.type === "select";
    // Always use options for both select and list
    const options = field.options || [];
    $("#prop-list-items").html(RenderHelpers.renderListOrOptionsHtml(options, isSelect));
    var $list = $("#prop-list-items-list");
    if ($list.data('ui-sortable')) {
        $list.sortable('destroy');
    }
    makeItemsSortable(fieldId, field, $list);
}

function makeItemsSortable(fieldId, field, $list) {
    const isSelect = field.type === "select";
    $list.sortable({
        handle: ".option-drag-handle",
        update: function(event, ui) {
            const newOrder = [];
            $list.find(".option-row").each(function() {
                const idx = $(this).data('idx');
                newOrder.push(field.options[idx]);
            });
            field.options = newOrder;
            if (isSelect) {
                updateFieldOptions(fieldId, field);
            } else {
                updateListField(fieldId, field);
            }
            renderListOrOptions(fieldId, field);
        }
    });
}

function initNewItemEvents() {
    var field = selectedField;
    // Google Sheets mapping for submit button
    if (field.type === "button") {
        // Always show mapping UI if sheet is selected
        const sheetId = localStorage.getItem("googleSheetId");
        if (sheetId) {
            // Prevent duplicate fetches
            if (window._gsheetMappingFetchInProgress) return;
            window._gsheetMappingFetchInProgress = true;
            $("#gsheet-mapping-loader").remove();
            $("#google-sheets-list .gsheet-map, #google-sheets-list #save-mapping-btn, #google-sheets-list label:contains('Map Form Fields')").parent().remove();
            $("#google-sheets-list").append('<div id="gsheet-mapping-loader" style="margin:12px 0;text-align:center;"><span class="loader" style="display:inline-block;width:28px;height:28px;border:4px solid #eee;border-top:4px solid #007bff;border-radius:50%;animation:spin 1s linear infinite;"></span> Loading mapping...</div>');
            fetch(`/auth/sheet-headers?sheetId=${sheetId}`)
                .then(r => r.json())
                .then(headers => {
                    window._gsheetMappingFetchInProgress = false;
                    // Remove loader and any previous mapping UI
                    $("#gsheet-mapping-loader").remove();
                    $("#google-sheets-list .gsheet-map, #google-sheets-list #save-mapping-btn, #google-sheets-list label:contains('Map Form Fields')").parent().remove();
                    const mappingHtml = propertyHelpers.getGoogleSheetsMappingProperty(field, headers, droppedFields);
                    $("#google-sheets-list").append(mappingHtml);
                    // Restore mapping from localStorage if exists
                    const savedMap = JSON.parse(localStorage.getItem('gsheetFieldMap') || '{}');
                    Object.entries(savedMap).forEach(([col, fid]) => {
                        $(`.gsheet-map[data-col-name='${col}']`).val(fid);
                    });
                    // Save mapping
                    $("#save-mapping-btn").off().on("click", function() {
                        const map = {};
                        $(".gsheet-map").each(function() {
                            map[$(this).data('col-name')] = $(this).val();
                        });
                        localStorage.setItem('gsheetFieldMap', JSON.stringify(map));
                        alert('Mapping saved!');
                    });
                })
                .catch(() => { window._gsheetMappingFetchInProgress = false; });
        }
    }
// Loader spinner CSS
const style = document.createElement('style');
style.innerHTML = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
document.head.appendChild(style);
    // Google Sheets integration events for submit button
    if (field.type === "button") {
        // Use event delegation for dynamically rendered #google-auth-btn
        $(document).off("click.googleauth").on("click.googleauth", "#google-auth-btn", function(e) {
            e.preventDefault();
            // Open Google OAuth in popup
            const popup = window.open("/auth/google", "googleAuthPopup", "width=500,height=600");
            // Listen for auth success
            window.addEventListener("message", function handler(event) {
                if (event.data === "google-auth-success") {
                    window.removeEventListener("message", handler);
                    // Fetch sheets
                    fetch("/auth/sheets").then(r => r.json()).then(sheets => {
                        let html = "<label>Available Sheets:</label><br/><select id='google-sheet-select' style='width:100%;margin-top:4px;'>";
                        html += "<option value=''>Select a sheet</option>";
                        sheets.forEach(s => {
                            html += `<option value='${s.id}'>${s.name}</option>`;
                        });
                        html += "</select><br><button id='save-sheet-btn' style='margin-top:8px;background:#007bff;color:#fff;border:none;border-radius:3px;padding:4px 12px;cursor:pointer;'>Save</button>";
                        html += "<button id='fetch-columns-btn' style='margin-top:8px;margin-left:8px;background:#28a745;color:#fff;border:none;border-radius:3px;padding:4px 12px;cursor:pointer;'>Fetch Columns</button>";
                        $("#google-sheets-list").html(html);
                        // Save button event
                        $("#save-sheet-btn").off().on("click", function() {
                            const sheetId = $("#google-sheet-select").val();
                            const sheetName = $("#google-sheet-select option:selected").text();
                            if (sheetId) {
                                localStorage.setItem("googleSheetId", sheetId);
                                localStorage.setItem("googleSheetName", sheetName);
                                alert("Google Sheet selection saved!");
                            } else {
                                alert("Please select a sheet.");
                            }
                        });
                        // Fetch columns button event
                        $("#fetch-columns-btn").off().on("click", function() {
                            const sheetId = $("#google-sheet-select").val();
                            if (!sheetId) {
                                alert("Please select a sheet first.");
                                return;
                            }
                            // Remove only mapping UI before fetching new columns
                            $("#google-sheets-list .gsheet-map, #google-sheets-list #save-mapping-btn, #google-sheets-list label:contains('Map Form Fields')").parent().remove();
                            fetch(`/auth/sheet-headers?sheetId=${sheetId}`)
                                .then(r => r.json())
                                .then(headers => {
                                    const mappingHtml = propertyHelpers.getGoogleSheetsMappingProperty(field, headers, droppedFields);
                                    $("#google-sheets-list").append(mappingHtml);
                                    // Restore mapping from localStorage if exists
                                    const savedMap = JSON.parse(localStorage.getItem('gsheetFieldMap') || '{}');
                                    Object.entries(savedMap).forEach(([col, fid]) => {
                                        $(`.gsheet-map[data-col-name='${col}']`).val(fid);
                                    });
                                    // Save mapping
                                    $("#save-mapping-btn").off().on("click", function() {
                                        const map = {};
                                        $(".gsheet-map").each(function() {
                                            map[$(this).data('col-name')] = $(this).val();
                                        });
                                        localStorage.setItem('gsheetFieldMap', JSON.stringify(map));
                                        alert('Mapping saved!');
                                    });
                                });
                        });
                    });
                }
            });
        });
    }
    
    var fieldId= selectedField.id;
    const $propPanel = $('#field-properties');
    // Render options if applicable
    if (field.type === "select" || field.type === "list") {
        // Add item/option
        $("#add-list-item").off().on("click", function(e) {
            e.preventDefault();
            if (field.type === "select") {
                field.options.push({ label: "New Option", value: "new_value" });
            } else {
                field.options = field.options || [];
                field.options.push("New item");
            }
            renderListOrOptions(fieldId, field);
            if (field.type === "select") updateFieldOptions(fieldId, field);
            else updateListField(fieldId, field);
        });
        // Remove item/option
        $(document).off("click.removeitem").on("click.removeitem", ".remove-option, .remove-list-item", function(e) {
            e.preventDefault();
            const idx = $(this).closest('.option-row').data('idx');
            field.options.splice(idx, 1);
            renderListOrOptions(fieldId, field);
            if (field.type === "select") updateFieldOptions(fieldId, field);
            else updateListField(fieldId, field);
        });
        // Use a single class and event listener for all live changes
        
        $propPanel.off("input.livechange").on("input.livechange", ".live-change", function() {
            const $input = $(this);
            const propName = $input.data('prop-name');
            var $optionRow = $input.closest('.option-row');
            if($optionRow.length > 0) {
                var idx = $optionRow.data('idx');
                if (field.type === 'select') {
                    if (propName) {
                        field.options[idx][propName] = $input.val();
                    } else {
                        field.options[idx] = $input.val();
                    }
                    updateFieldOptions(fieldId, field);
                } else if (field.type === 'list') {
                    // For list, options is a string array
                    if (!propName) {
                        field.options[idx] = $input.val();
                        updateListField(fieldId, field);
                    }
                }
            }
        });
        // Change list type
        if (field.type === "list") {
            $("#prop-list-type").on("change", function() {
                field.listType = $(this).val();
                updateListField(fieldId, field);
            });
        }
    }

    // Update field on change
    if (["paragraph", "h1", "h2", "terms"].includes(field.type)) {
        $("#prop-text").on("input", function() {
            field.text = $(this).val();
            if (field.type === 'terms') {
                $(`.form-field[data-id='${fieldId}'] label`).contents().filter(function() { return this.nodeType === 3; }).last().replaceWith(field.text);
            } else {
                $(`.form-field[data-id='${fieldId}'] ${field.type === 'paragraph' ? 'p' : field.type}`).text(field.text);
            }
        });
    } else {
        $("#prop-label").on("input", function() {
            field.label = $(this).val();
            let requiredMark = field.required ? ' <span style="color:red">*</span>' : '';
            $(`.form-field[data-id='${fieldId}'] label`).html(field.label + requiredMark);
            // Do not update placeholder when label changes
        });

        $("#prop-placeholder").on("input", function() {
            $(`#${fieldId}`).attr("placeholder", $(this).val());
        });

        $("#prop-required").on("change", function() {
            field.required = $(this).is(":checked");
            let requiredMark = field.required ? ' <span style="color:red">*</span>' : '';
            $(`.form-field[data-id='${fieldId}'] label`).html(field.label + requiredMark);
            $(`#${fieldId}`).prop("required", field.required);
        });
    }
}


makeJobFormSortable();
UIHelper.updateDropPlaceholder();

var selectedField = null;
// Modular handler for field click

// Modular handler for field click
function handleFormFieldClick(e) {
    e.stopPropagation();
    UIHelper.updateDropPlaceholder();
    $(".form-field").removeClass("active");
    $(this).addClass("active");

    const fieldId = $(this).data("id");
    // Look for the field in droppedFields first, fallback to fields for legacy
    let field = droppedFields.find(f => f.id === fieldId) || fields.find(f => f.id === fieldId);
    // If not found, search container children
    if (!field) {
        for (const container of droppedFields.filter(f => f.type === 'container')) {
            field = (container.children || []).find(f => f.id === fieldId);
            if (field) break;
        }
    }
    if (!field) return;
    selectedField = field;
    // Show properties form
    let propHtml = "";
    // Only render the panel if a field is selected
        if (field) {
            $("#delete-field-btn").attr("data-delete-id", fieldId);
            if (["paragraph", "h1", "h2", "terms"].includes(field.type)) {
                propHtml += `<label>Text:</label><textarea id="prop-text" rows="2" style="width:95%">${field.text || ''}</textarea><br/><br/>`;
            } else if (field.type === "button") {
                // Show label for button as text property
                propHtml += `<label>Label:</label><input type="text" id="prop-text" value="${field.text || ''}" /><br/><br/>`;
                // Submission destination dropdown in properties
                propHtml += `<label for=\"prop-submit-destination\" style=\"font-weight:500;\">Submit data to:</label>
                    <select id=\"prop-submit-destination\" style=\"margin-left:8px;\">
                        <option value=\"internal\"${field.submitDestination === 'internal' || !field.submitDestination ? ' selected' : ''}>Internal (Database)</option>
                        <option value=\"google\"${field.submitDestination === 'google' ? ' selected' : ''}>Google Sheet</option>
                    </select><br/><br/>`;
                // Google Sheets integration UI (only show if destination is google)
                if (field.submitDestination === 'google') {
                    const sheetId = localStorage.getItem('googleSheetId');
                    if (!sheetId) {
                        propHtml += `<div style='background:#f8f9fa;padding:12px 10px;border-radius:5px;margin-bottom:10px;color:#333;'>Currently saving to <b>local database</b>.<br>Connect a Google Sheet to enable Google Sheets submission.</div>`;
                    }
                    propHtml += propertyHelpers.getGoogleSheetsProperty(field);
                }
                // Correct delete button for button field
            } else {
            // Always show label for all other fields
            propHtml += `${propertyHelpers.getLabelProperty(field)}`;
            if (field.type === "list") {
                propHtml += `<label>List Type:</label> <select id="prop-list-type"><option value="ul" ${field.listType === 'ul' ? 'selected' : ''}>Bulleted</option><option value="ol" ${field.listType === 'ol' ? 'selected' : ''}>Numbered</option></select><br/><br/>`;
                propHtml += `<label>Options:</label><div id="prop-list-items"></div>${propertyHelpers.getAddItemButton('add-list-item')}<br/><br/>`;
            } else if (field.type === "select") {
                propHtml += `<label>Options:</label><div id="prop-list-items"></div>${propertyHelpers.getAddItemButton('add-list-item')}<br/><br/>`;
            } else {
                propHtml += `${propertyHelpers.getPlaceholderProperty(field)}
                ${propertyHelpers.getRequiredProperty(field)}`;
            }
        }
        // If select/radio, show options editor (legacy, keep for radio if needed)
        if (field.type === "select" || field.type === "radio") {
            // No need to add another button, already handled above
        }
        $("#field-properties").html(propHtml);
         // Google Sheets integration events for submit button
        // if (field.type === "button") {
        //     $("#google-auth-btn").off().on("click", function(e) {
        //         e.preventDefault();
        //         // Open Google OAuth in popup
        //         const popup = window.open("/auth/google", "googleAuthPopup", "width=500,height=600");
        //         // Listen for auth success
        //         window.addEventListener("message", function handler(event) {
        //             if (event.data === "google-auth-success") {
        //                 window.removeEventListener("message", handler);
        //                 // Fetch sheets
        //                 fetch("/auth/sheets").then r => r.json()).then(sheets => {
        //                     let html = "<label>Available Sheets:</label><br/><select id='google-sheet-select' style='width:100%;margin-top:4px;'>";
        //                     html += "<option value=''>Select a sheet</option>";
        //                     sheets.forEach(s => {
        //                         html += `<option value='${s.id}'>${s.name}</option>`;
        //                     });
        //                     html += "</select>";
        //                     $("#google-sheets-list").html(html);
        //                 });
        //             }
        //         });
        //     });
        // }
        UIHelper.showDeleteCtrl();
    } else {
        // No field selected, clear the panel
        UIHelper.emptyPropertyPanel();
        UIHelper.hideDeleteCtrl();
    }

    if (field.type === "select" || field.type === "list") {
        renderListOrOptions(fieldId, field);
    }
    initNewItemEvents();
    // Live update for button label
    if (field.type === "button") {
        $("#prop-text").off("input").on("input", function() {
            field.text = $(this).val();
            $(`.form-field[data-id='${fieldId}'] button`).text(field.text);
        });
        // Submission destination change
        $("#prop-submit-destination").off("change").on("change", function() {
            field.submitDestination = $(this).val();
            // Re-render properties panel to show/hide Google Sheets section
            handleFormFieldClick.call($(`.form-field[data-id='${fieldId}']`)[0]);
        });
        // Save Google Sheet URL/ID to field object
        $("#prop-gsheet-url").off("input").on("input", function() {
            field.gsheetUrl = $(this).val();
        });
    }
}

// Register the modular handler
$(document).on("click", ".form-field", handleFormFieldClick);

// Delete dropped field handler (now supports container children)
$(document).on("click", ".delete-field-btn", function(e) {
    e.stopPropagation();
    const fieldId = $(this).attr('data-delete-id') || $(this).closest('.form-field').data('id');
    let $field = $(".form-field.active");
    let found = false;
    // Try to remove from top-level droppedFields
    if ($field.length > 0) {
        let idx = droppedFields.findIndex(f => f.id === fieldId);
        if (idx !== -1) {
            droppedFields.splice(idx, 1);
            found = true;
        } else {
            // Try to remove from container children
            for (const container of droppedFields.filter(f => f.type === 'container')) {
                if (container.children) {
                    let cidx = container.children.findIndex(f => f.id === fieldId);
                    if (cidx !== -1) {
                        container.children.splice(cidx, 1);
                        found = true;
                        break;
                    }
                }
            }
        }
        $field.fadeOut(200, function() {
            $field.remove();
            UIHelper.updateDropPlaceholder();
            if ($(".form-field").length === 0) {
                UIHelper.emptyPropertyPanel();
                UIHelper.hideDeleteCtrl();
            } else {
                $(".form-field").first().trigger("click");
            }
        });
    } else {
        UIHelper.emptyPropertyPanel();
        UIHelper.hideDeleteCtrl();
    }
    if (found) saveFormBuilderState();
});


// Make container dropzone droppable for fields
$(document).on('mouseenter', '.container-dropzone', function() {
    const $dropzone = $(this);
    if (!$dropzone.data('ui-droppable')) {
        $dropzone.droppable({
            accept: '.field-item, .form-field',
            drop: function(event, ui) {
                const fieldId = ui.helper.data('id') || ui.helper.closest('.form-field').data('id');
                let origField = fields.find(f => (f.id || f.type) === fieldId) || droppedFields.find(f => f.id === fieldId);
                if (!origField) return;
                // Find parent container field
                let parentId = $dropzone.attr('id').replace('container-dropzone-', '');
                let parentField = droppedFields.find(f => f.id === parentId);
                if (parentField && parentField.type === 'container') {
                    // Check for duplicate input fields in this container
                    if (origField.inputType === 'input' && parentField.children && parentField.children.some(f => f.type === origField.type)) {
                        Toastify({
                            text: origField.type + " already added in this container",
                            duration: 3000,
                            newWindow: true,
                            close: true,
                            gravity: "bottom",
                            position: "right",
                            stopOnFocus: true,
                            backgroundColor: "linear-gradient(to right, #b00000ff, #c93dadff)",
                        }).showToast();
                        return;
                    }
                    // Clone field for nesting
                    let field = JSON.parse(JSON.stringify(origField));
                    let baseLabel = sanitizeId((field.type || "field"));
                    let newId = generateUniqueId(baseLabel);
                    field.id = newId;
                    parentField.children = parentField.children || [];
                    parentField.children.push(field);
                    // Render nested field inside container
                    $dropzone.append(getFieldHtml(field));
                    saveFormBuilderState();
                }
                // Prevent adding to main form
                event.stopPropagation();
            }
        });
    }
});

  function setActiveTabBorder() {
    $('.form-tab').css('border-bottom', 'none');
    $('.form-tab.active').css('border-bottom', '3px solid #6c63ff');
  }
  $('#tab-overview').on('click', function() {
    $('.form-tab').removeClass('active');
    $(this).addClass('active');
    $('.tab-content').hide();
    $('#tab-content-overview').show();
    setActiveTabBorder();
  });
  $('#apply-btn,#tab-application').on('click', function() {
    $('.form-tab').removeClass('active');
    $("#tab-application").addClass('active');
    $('.tab-content').hide();
    $('#tab-content-application').show();
    setActiveTabBorder();
  });


  setActiveTabBorder();

  // Quill initialization for job description editor
  

  // Auto-save on change


