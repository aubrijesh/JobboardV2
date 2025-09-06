$(document).ready(function() {
    function loadForms() {
        $.get('/api/forms', function(forms) {
            let html = '';
            forms.forEach((f,index) => {
                html += `<tr>
                    <td>${index + 1}</td>
                    <td><span contenteditable="false" class="form-name-input" data-id="${f.id}" style="width:90%" >${f.name || ''}</span></td>
                    <td>
                        <button class="rename-form-btn" data-id="${f.id}">
                        <i class="fa-solid fa-pencil"></i>
                            Rename
                        </button>
                        <button class="save-form-btn hide" data-id="${f.id}">Save</button>
                        <button class="edit-form-btn" data-id="${f.id}">Open</button>
                        <button class="delete-form-btn" data-id="${f.id}">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>`;
            });
            $('#forms-list').html(html);
        });
    }
    loadForms();

    $('#add-form-btn').on('click', function() {
        $.post('/api/forms', {}, function() {
            loadForms();
        });
    });

    $(document).on('click', '.rename-form-btn', function() {
        const id = $(this).data('id');
        $(`.form-name-input[data-id='${id}']`).attr('contenteditable', 'true').focus();
        $(this).addClass('hide');
        $(`.save-form-btn[data-id='${id}']`).removeClass('hide');
    });

    $(document).on('click', '.save-form-btn', function() {
        const id = $(this).data('id');
        const name = $(`.form-name-input[data-id='${id}']`).text().trim();
        $.ajax({
            url: `/api/forms/${id}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({ name }),
            success: function() { 
                $(`.form-name-input[data-id='${id}']`).attr('contenteditable', 'false');
                $(`.rename-form-btn[data-id='${id}']`).removeClass('hide');
                $(`.save-form-btn[data-id='${id}']`).addClass('hide');
                loadForms();
                Toastify({
                    text: "Form name saved",
                    duration: 3000,
                    newWindow: true,
                    close: true,
                    gravity: "bottom",
                    position: "right",
                    stopOnFocus: true,
                    backgroundColor: "linear-gradient(to right, #b00000ff, #c93dadff)",
                }).showToast();
            }
        });
    });

    $(document).on('click', '.edit-form-btn', function() {
        const id = $(this).data('id');
        // open it in new tab
        window.open(`/edit-form?id=${id}`, '_blank');
    });

    $(document).off('click', '.delete-form-btn').on('click', '.delete-form-btn', function(e) {
        e.preventDefault();
        var formId = $(this).data('id');
        if(confirm('Are you sure you want to delete this form?')) {
            $.ajax({
                url: '/api/forms/' + formId,
                type: 'DELETE',
                success: function(resp) {
                    if(resp.success) {
                        $('[data-id="' + formId + '"]').parents("tr").remove();
                    } else {
                        alert('Delete failed: ' + (resp.error || 'Unknown error'));
                    }
                },
                error: function() {
                    alert('Delete failed.');
                }
            });
        }
    });
});
