export enum Allow {
    Off = 0,
    On = 1
}

export enum Roles_User {
    Admin = "admin",
    User = "user"
}

export enum status {
    Enable = "Enable",
    Disable = "Disable"
}

export enum is_featured {
    Featured = "Featured",
    Non_Featured = "Non-Featured"
}

export enum loan_status {
    Pending = "Pending",
    Running = "Running",
    Rejected = "Rejected",
    Paid = "Paid",
    Bad = 'Bad'
}

// application form
export enum type_option {
    required = "required",
    options = "options"
}

export enum process_status {
    Success = "Success",
    Pending = "Pending",
    Rejected = "Rejected",
    Initiated = "Initiated"
}


export enum ticket_status {
    Open = "Open",
    Answered = "Answered",
    Replied = "Replied",
    Closed = "Closed"
}

export enum priority_ticket {
    Low = "Low",
    Medium = "Medium",
    High = "High",
}

export enum cron_status {
    Running = "Running",
    Pause = "Pause"
}