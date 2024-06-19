class ApiResponse {
    constructor(status, data, message = "Everything went well") {
        this.status = status;
        this.data = data;
        this.message = message;
        this.success = "Success";
    }
}
module.exports = ApiResponse;