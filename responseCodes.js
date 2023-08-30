// Status codes for API reponse.

exports.responseCode = {
    //Successful.
    Ok: 200,
    Resource_Created: 201,

    //Client side errors.
    Bad_Request: 400,
    Unauthorized: 401,
    Forbidden: 403,
    Resource_Not_Found: 404,

    //Server side errors.
    Internal_Server_Error: 500,
}