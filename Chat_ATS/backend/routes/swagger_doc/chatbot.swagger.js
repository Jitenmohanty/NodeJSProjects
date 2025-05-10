/**
 * @swagger
 * components:
 *   schemas:
 *     BotMessage:
 *       type: object
 *       required:
 *         - userId
 *         - userMessage
 *         - botResponse
 *       properties:
 *         userId:
 *           type: string
 *           description: The user ID who sent the message.
 *         userMessage:
 *           type: string
 *           description: The message sent by the user to the bot.
 *         botResponse:
 *           type: string
 *           description: The response provided by the bot (Gemini AI).
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the message was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the message was last updated.
 */

/**
 * @swagger
 * /bot/messages:
 *   post:
 *     summary: Send a message to the bot
 *     description: Endpoint to send a message from a user to the bot and receive a response from Gemini AI.
 *     operationId: sendMessageToBot
 *     tags:
 *       - Bot
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - userMessage
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The user ID of the sender.
 *               userMessage:
 *                 type: string
 *                 description: The message sent by the user to the bot.
 *     responses:
 *       200:
 *         description: Bot response received successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BotMessage'
 *       400:
 *         description: Invalid input data.
 *       500:
 *         description: Server error.
 */
