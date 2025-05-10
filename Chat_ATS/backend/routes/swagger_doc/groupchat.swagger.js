/**
 * @swagger
 * components:
 *   schemas:
 *     GroupMessage:
 *       type: object
 *       required:
 *         - group
 *         - sender
 *       properties:
 *         group:
 *           type: string
 *           description: The ID of the group the message belongs to.
 *         sender:
 *           type: string
 *           description: The ID of the user sending the message.
 *         text:
 *           type: string
 *           description: The text content of the group message.
 *         fileUrl:
 *           type: string
 *           description: URL of the file attached to the group message.
 *         fileName:
 *           type: string
 *           description: Name of the attached file.
 *         fileType:
 *           type: string
 *           description: MIME type of the attached file.
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the group message was sent.
 *         readBy:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 description: The ID of the user who read the message.
 *               readAt:
 *                 type: string
 *                 format: date-time
 *                 description: Timestamp of when the user read the message.
 */

/**
 * @swagger
 * /group-messages:
 *   post:
 *     summary: Send a message to a group
 *     description: Endpoint for sending a new message to a group.
 *     operationId: sendGroupMessage
 *     tags:
 *       - GroupMessages
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - group
 *               - sender
 *               - text
 *             properties:
 *               group:
 *                 type: string
 *               sender:
 *                 type: string
 *               text:
 *                 type: string
 *               fileUrl:
 *                 type: string
 *               fileName:
 *                 type: string
 *               fileType:
 *                 type: string
 *     responses:
 *       201:
 *         description: Group message sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GroupMessage'
 *       400:
 *         description: Invalid input.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /group-messages/{messageId}/read:
 *   put:
 *     summary: Mark group message as read
 *     description: Endpoint to mark a group message as read by a user.
 *     operationId: markGroupMessageAsRead
 *     tags:
 *       - GroupMessages
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         description: The ID of the group message to mark as read.
 *         schema:
 *           type: string
 *       - in: body
 *         name: userId
 *         required: true
 *         description: The ID of the user who is marking the message as read.
 *         schema:
 *           type: object
 *           properties:
 *             userId:
 *               type: string
 *     responses:
 *       200:
 *         description: Group message marked as read.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GroupMessage'
 *       404:
 *         description: Group message not found.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /group-messages/{messageId}/clear:
 *   delete:
 *     summary: Clear group message
 *     description: Endpoint to clear (delete) a group message by a user.
 *     operationId: clearGroupMessage
 *     tags:
 *       - GroupMessages
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         description: The ID of the group message to clear.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Group message cleared successfully.
 *       404:
 *         description: Group message not found.
 *       500:
 *         description: Server error.
 */
