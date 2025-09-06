const semanticTypeMap = {
    name: 'text',
    total_experience: 'number',
    relevant_experience: 'number',
    current_city: 'text',
    email: 'email',
    phone: 'text',
    highest_qualification: 'select',
    skills: 'text',
    experience: 'textarea',
    cover_letter: 'textarea',
    linkedin: 'url',
    portfolio: 'url',
    job_title: 'text',
    company_name: 'text',
    location: 'text',
    job_type: 'select',
    experience_level: 'select',
    resume: 'file',
    other_files: 'file',
    salary_range: 'text',
    description: 'textarea',
    responsibilities: 'textarea',
    requirements: 'textarea',
    benefits: 'textarea',
    application_deadline: 'date',
    apply_link: 'url',
    button: 'button',
    education: 'education',
    container: 'container'
};

const education = function(field) {
    // Render repeatable education blocks
    let blocks = field.values && field.values.length ? field.values : [{}];
    // Use dynamic university options if present
    let universityOptions = field.universityOptions && Array.isArray(field.universityOptions)
        ? field.universityOptions.map(u => `<option value="${u.replace(/"/g, '')}"${blocks[0] && blocks[0].university === u ? ' selected' : ''}>${u}</option>`).join('')
        : `
            <option value="harvard">Harvard University</option>
            <option value="stanford">Stanford University</option>
            <option value="mit">MIT</option>
            <option value="oxford">University of Oxford</option>
            <option value="cambridge">University of Cambridge</option>
            <option value="other">Other</option>
        `;
    let blockHtml = blocks.map((block, idx) => {
        return `
            <div class="education-block" data-idx="${idx}" style="border:1px solid #e1e1e1; border-radius:6px; padding:16px; margin-bottom:14px; background:#f9f9fc;">
                <label>Education Name</label>
                <input type="text" name="education_name_${idx}" value="${block.education_name || ''}" class="education-name" style="margin-bottom:8px; width:100%" />
                <label>Degree</label>
                <select name="degree_${idx}" class="education-degree" style="margin-bottom:8px; width:100%">
                    <option value="">Select Degree</option>
                    <option value="bachelor"${block.degree==='bachelor'?' selected':''}>Bachelor's</option>
                    <option value="master"${block.degree==='master'?' selected':''}>Master's</option>
                    <option value="phd"${block.degree==='phd'?' selected':''}>PhD</option>
                    <option value="other"${block.degree==='other'?' selected':''}>Other</option>
                </select>
                <label>Percentage</label>
                <input type="text" name="percentage_${idx}" value="${block.percentage || ''}" class="education-percentage" style="margin-bottom:8px; width:100%" />
                <label>University Name</label>
                <select name="university_${idx}" class="education-university" style="margin-bottom:8px; width:100%">
                    <option value="">Select University</option>
                    ${universityOptions}
                </select>
                ${blocks.length > 1 ? `<button type="button" class="remove-education-block" data-idx="${idx}" style="background:#e74c3c; color:#fff; border:none; border-radius:3px; padding:4px 10px; margin-top:4px; float:right;">Remove</button>` : ''}
            </div>
        `;
    }).join('');
    return `
        <div class="education-repeat-blocks">${blockHtml}</div>
        <button type="button" class="add-education-block" style="background:#3498db; color:#fff; border:none; border-radius:3px; padding:6px 18px; margin-bottom:10px;">+ Add More</button>
    `;
};

/* 
    @fielHelper object contains functions to generate HTML for each field type.
    Each function takes a field object as input and returns the HTML for that field.
    The function can use the following variables:
        - field.id: the ID of the field
        - field.label: the label of the field
        - field.type: the type of the field
        - field.required: whether the field is required or not
        - field.options: an array of options for select fields
        - field.listType: the type of list (ul or ol)
        - field.items: an array of items for list fields
        - field.text: the text for terms fields
*/
const fieldHelper = {
    education: education,
    button: function(field) {
        // Render a styled button (default label: Submit)
        return `<button id="${field.id}" class="form-btn" type="button" style="padding:10px 28px; background:#007bff; color:#fff; border:none; border-radius:5px; font-size:16px; font-weight:500; cursor:pointer; transition:background 0.2s;">${field.text || 'Submit'}</button>`;
    },
    spacing: function(field) {
        // Render a vertical space (default 24px, can be customized later)
        return `<div id="${field.id}" class="spacing-field" style="height:24px;"></div>`;
    },
    terms: function(field) {
        return `<label style="display:flex; align-items:center;"><input type="checkbox" id="${field.id}" name="${field.id}" style="width:auto; margin-right:8px;" />${field.text || 'I agree to the terms and conditions.'}</label>`;
    },
    text: function(field, requiredAttr, requiredMark) {
        return `<label for="${field.id}">${field.label}${requiredMark || ""}</label><input type="text" id="${field.id}" name="${field.id}" placeholder="${field.label}" value="${field.value || ''}" ${requiredAttr} />`;
    },
    number: function(field, requiredAttr, requiredMark) {
        return `<label for="${field.id}">${field.label}${requiredMark || ""}</label><input type="number" id="${field.id}" name="${field.id}" placeholder="${field.label}" value="${field.value || ''}" ${requiredAttr} />`;
    },
    email: function(field, requiredAttr, requiredMark) {
        return `<label for="${field.id}">${field.label}${requiredMark || ""}</label><input type="email" id="${field.id}" name="${field.id}" placeholder="${field.label}" value="${field.value || ''}" ${requiredAttr} />`;
    },
    phone: function(field, requiredAttr, requiredMark) {
        return `<label for="${field.id}">${field.label}${requiredMark || ""}</label><input type="tel" id="${field.id}" name="${field.id}" placeholder="${field.label}" value="${field.value || ''}" ${requiredAttr} />`;
    },
    url: function(field, requiredAttr, requiredMark) {
        return `<label for="${field.id}">${field.label}${requiredMark || ""}</label><input type="url" id="${field.id}" name="${field.id}" placeholder="${field.label}" value="${field.value || ''}" ${requiredAttr} />`;
    },
    date: function(field, requiredAttr, requiredMark) {
        return `<label for="${field.id}">${field.label}${requiredMark || ""}</label><input type="date" id="${field.id}" name="${field.id}" placeholder="${field.label}" value="${field.value || ''}" ${requiredAttr} />`;
    },
    textarea: function(field, requiredAttr, requiredMark) {
        return `<label for="${field.id}">${field.label}${requiredMark || ""}</label><textarea id="${field.id}" name="${field.id}" placeholder="${field.label}" rows="3" ${requiredAttr}>${field.value || ''}</textarea>`;
    },
    select: function(field, requiredAttr, requiredMark) {
        return `<label for="${field.id}">${field.label}${requiredMark || ""}</label><select id="${field.id}" name="${field.id}" ${requiredAttr}>${field.options.map(o => `<option value="${o.value}"${field.value === o.value ? ' selected' : ''}>${o.label}</option>`).join("")}</select>`;
    },
    file: function(field, requiredAttr, requiredMark) {
        return `<label for="${field.id}">${field.label}${requiredMark || ""}</label><input type="file" id="${field.id}" name="${field.id}${field.multiple ? '[]' : ''}"${field.accept ? ` accept=\"${field.accept}\"` : ''}${field.multiple ? ' multiple' : ''} ${requiredAttr}/>`;
    },
    paragraph: function(field) {
        return `<p id="${field.id}">${field.text || 'Paragraph text'}</p>`;
    },
    h1: function(field) {
        return `<h1 id="${field.id}">${field.text || 'Heading 1'}</h1>`;
    },
    h2: function(field) {
        return `<h2 id="${field.id}">${field.text || 'Heading 2'}</h2>`;
    },
    list: function(field) {
        const tag = field.listType === 'ol' ? 'ol' : 'ul';
        return `<${tag} id="${field.id}">${(field.options || []).map(item => `<li>${item}</li>`).join('')}</${tag}>`;
    }
        ,
        editor: function(field) {
            // If field.readOnly is true, render as Quill bubble theme, read-only, no toolbar
            if (field.readOnly) {
                return `<label for="${field.id}">${field.label || 'Job Description'}</label><div id="${field.id}" class="quill-editor-container" style="border:none;min-height:120px;background:#fff;padding:0 0 12px 0;border-radius:0;margin-bottom:12px;"></div>`;
            }
            // Default: render Quill container for editing
            return `<label for="${field.id}">${field.label || 'Job Description'}</label><div id="${field.id}" class="quill-editor-container" style="border:1px solid #b3c6e0; min-height:180px; background:#fff; padding:12px; border-radius:6px; margin-bottom:12px;"></div>`;
        },
    container: function(field) {
        // Render a container field that can hold other fields
        let childrenHtml = '';
        if (Array.isArray(field.children) && field.children.length) {
            childrenHtml = field.children.map(child => {
                // Ensure child is wrapped with .form-field and data-id
                return formFieldWrapper(child, getFieldHtml(child));
            }).join('');
        } else {
            childrenHtml = '<div class="container-empty">Drop fields here</div>';
        }
        return `<div class="container-field-inner" style="border:2px dashed #aaa; padding:16px; min-height:50px; background:#f9f9f9; height:auto;">
            <label style="font-weight:600;">${field.label || 'Container'}</label>
            <div class="container-dropzone" id="container-dropzone-${field.id}" style="min-height:50px; height:auto;">${childrenHtml}</div>
        </div>`;
    },
    spacer: function(field) {
        // Render a vertical spacer (default 32px, can be customized later)
        return `<div id="${field.id}" class="spacer-field" style="height:32px;"></div>`;
    }
};
function formFieldWrapper(field, innerHtml) {
    return `<div class="form-field" data-id="${field.id}">
        ${innerHtml}
    </div>`;
}

function getFieldHtml(field) {
    // For list fields, ensure options is used
    if (field.type === 'list') {
        field.options = field.options || [];
    }
    let requiredAttr = field.required ? 'required' : '';
    let requiredMark = field.required ? ' <span style="color:red">*</span>' : '';
    let innerHtml = '';
    // Use mapped type for rendering if available
    const renderType = semanticTypeMap[field.type] || field.type;
    // Always render button field
    if (field.type === 'button' && fieldHelper.button) {
        innerHtml = fieldHelper.button(field);
    } else if (field.repeatable && fieldHelper[renderType]) {
        if (!field.values) field.values = [{}];
        innerHtml = fieldHelper[renderType](field);
    } else if (fieldHelper[renderType]) {
        if (["text", "url", "date", "textarea", "select", "file"].includes(renderType)) {
            innerHtml = fieldHelper[renderType](field, requiredAttr, requiredMark);
        } else {
            innerHtml = fieldHelper[renderType](field);
        }
    } else {
        innerHtml = 'Unsupported field type';
    }
    return formFieldWrapper(field, innerHtml);
}

// Skills field rendering logic
document.addEventListener('DOMContentLoaded', function() {
    const skillsFields = document.querySelectorAll('.skills-input');
    skillsFields.forEach(field => {
        field.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ',') {
                event.preventDefault();
                const value = this.value.trim();
                if (value) {
                    const container = document.createElement('div');
                    container.className = 'skill-tag';
                    container.textContent = value;
                    const removeBtn = document.createElement('span');
                    removeBtn.className = 'remove-skill';
                    removeBtn.textContent = 'x';
                    removeBtn.onclick = function() {
                        this.parentElement.remove();
                    };
                    container.appendChild(removeBtn);
                    this.parentElement.insertBefore(container, this);
                    this.value = '';
                }
            }
        });
    });
});