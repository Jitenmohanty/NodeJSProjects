/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - sender
 *         - receiver
 *       properties:
 *         sender:
 *           type: string
 *           description: User ID of the sender.
 *         receiver:
 *           type: string
 *           description: User ID of the receiver.
 *         text:
 *           type: string
 *           description: The text content of the message.
 *         fileUrl:
 *           type: string
 *           description: URL of the file attached to the message.
 *         fileName:
 *           type: string
 *           description: Name of the file.
 *         fileType:
 *           type: string
 *           description: MIME type of the attached file.
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the message was sent.
 *         status:
 *           type: string
 *           enum: [sent, delivered, read]
 *           default: sent
 *           description: The status of the message.
 *         readAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the message was read (if status is 'read').
 *         clearedBy:
 *           type: array
 *           items:
 *             type: string
 *           description: List of User IDs who cleared the message.
 */

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Send a message
 *     description: Endpoint for sending a new message between two users.
 *     operationId: sendMessage
 *     tags:
 *       - Messages
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sender
 *               - receiver
 *               - text
 *             properties:
 *               sender:
 *                 type: string
 *               receiver:
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
 *         description: Message sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       400:
 *         description: Invalid input.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /messages/{messageId}/read:
 *   put:
 *     summary: Mark message as read
 *     description: Endpoint to mark a message as read.
 *     operationId: markMessageAsRead
 *     tags:
 *       - Messages
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         description: The ID of the message to mark as read.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message marked as read.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       404:
 *         description: Message not found.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /messages/{messageId}/clear:
 *   delete:
 *     summary: Clear message
 *     description: Endpoint to clear (delete) a message by a user.
 *     operationId: clearMessage
 *     tags:
 *       - Messages
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         description: The ID of the message to clear.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message cleared successfully.
 *       404:
 *         description: Message not found.
 *       500:
 *         description: Server error.
 */
