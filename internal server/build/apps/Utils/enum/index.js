"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cron_status = exports.priority_ticket = exports.ticket_status = exports.process_status = exports.type_option = exports.loan_status = exports.is_featured = exports.status = exports.Roles_User = exports.Allow = void 0;
var Allow;
(function (Allow) {
    Allow[Allow["Off"] = 0] = "Off";
    Allow[Allow["On"] = 1] = "On";
})(Allow = exports.Allow || (exports.Allow = {}));
var Roles_User;
(function (Roles_User) {
    Roles_User["Admin"] = "admin";
    Roles_User["User"] = "user";
})(Roles_User = exports.Roles_User || (exports.Roles_User = {}));
var status;
(function (status) {
    status["Enable"] = "Enable";
    status["Disable"] = "Disable";
})(status = exports.status || (exports.status = {}));
var is_featured;
(function (is_featured) {
    is_featured["Featured"] = "Featured";
    is_featured["Non_Featured"] = "Non-Featured";
})(is_featured = exports.is_featured || (exports.is_featured = {}));
var loan_status;
(function (loan_status) {
    loan_status["Pending"] = "Pending";
    loan_status["Running"] = "Running";
    loan_status["Rejected"] = "Rejected";
    loan_status["Paid"] = "Paid";
    loan_status["Bad"] = "Bad";
})(loan_status = exports.loan_status || (exports.loan_status = {}));
// application form
var type_option;
(function (type_option) {
    type_option["required"] = "required";
    type_option["options"] = "options";
})(type_option = exports.type_option || (exports.type_option = {}));
var process_status;
(function (process_status) {
    process_status["Success"] = "Success";
    process_status["Pending"] = "Pending";
    process_status["Rejected"] = "Rejected";
    process_status["Initiated"] = "Initiated";
})(process_status = exports.process_status || (exports.process_status = {}));
var ticket_status;
(function (ticket_status) {
    ticket_status["Open"] = "Open";
    ticket_status["Answered"] = "Answered";
    ticket_status["Replied"] = "Replied";
    ticket_status["Closed"] = "Closed";
})(ticket_status = exports.ticket_status || (exports.ticket_status = {}));
var priority_ticket;
(function (priority_ticket) {
    priority_ticket["Low"] = "Low";
    priority_ticket["Medium"] = "Medium";
    priority_ticket["High"] = "High";
})(priority_ticket = exports.priority_ticket || (exports.priority_ticket = {}));
var cron_status;
(function (cron_status) {
    cron_status["Running"] = "Running";
    cron_status["Pause"] = "Pause";
})(cron_status = exports.cron_status || (exports.cron_status = {}));
