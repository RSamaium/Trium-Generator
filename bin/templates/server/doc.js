/**
 * @api {get} {{api_path}} Get the list of entity data
 * @apiName Get Article
 * @apiGroup {{title}}
 * @apiVersion 0.1.0
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "firstname": "John",
 *       "lastname": "Doe"
 *     }
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */
/**
 * @api {get} {{api_path}}/:id Request User information
 * @apiName Get Article
 * @apiGroup Article
 * @apiVersion 0.1.0
 *
 * @apiParam {Number} id unique ID.
 *
 *   {{#doc obj}}
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "firstname": "John",
 *       "lastname": "Doe"
 *     }
 *
 * @apiError NotFound The id of the entity was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *       {
 *            "name": "Error",
 *            "message":"Not Found"
 *       }
 */