 -- This file is used to create the database structure for the jobboard application. 

-- Each field description
field_library {
    id INT PRIMARY KEY,
    name VARCHAR(255),         -- e.g. "Location"
    type VARCHAR(50),          -- string, number, date, enum, etc.
    is_required BOOLEAN,
    options JSON,              -- for dropdown/multiselect
    created_at DATETIME,
    updated_at DATETIME
}

-- Template created for a job posting

template {
    id INT PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    created_at DATETIME,
    updated_at DATETIME
}

-- To store mapping of fields to template, one template can have multiple fields

template_field_map {
    id INT PRIMARY KEY,
    template_id INT,           -- FK → template.id
    field_id INT,              -- FK → field_library.id
    order_index INT,           -- field order in UI
    is_required_override BOOLEAN, -- allows per-template override
    created_at DATETIME,
    updated_at DATETIME
}

-- To store job postings

job {
    id INT PRIMARY KEY,
    company_id INT,
    template_id INT,           -- FK → template.id
    title VARCHAR(255),
    description TEXT,
    location VARCHAR(255),
    type VARCHAR(50),
    category VARCHAR(50),
    salary DECIMAL,
    status VARCHAR(50),
    created_at DATETIME,
    updated_at DATETIME
}

-- To manage candidate flow

application {
    id INT PRIMARY KEY,
    job_id INT,                -- FK → job.id
    candidate_id INT,
    status VARCHAR(50),
    created_at DATETIME
}

-- To store responses to questions asked in the application

application_response {
    id INT PRIMARY KEY,
    application_id INT,        -- FK → application.id
    field_id INT,              -- FK → field_library.id
    response_value TEXT
}
