/**
 * @swagger
 * tags:
 *   name: FileUpload
 *   description: File upload operations
 */

/**
 * @swagger
 * /api/file/file:
 *   post:
 *     summary: Upload a file
 *     tags: [FileUpload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: File uploaded successfully
 *                 fileUrl:
 *                   type: string
 *                   example: http://localhost:3000/uploads/sampleFile.png
 *                 fileName:
 *                   type: string
 *                   example: sampleFile.png
 *                 fileType:
 *                   type: string
 *                   example: image/png
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: File upload failed
 *       401:
 *         description: Unauthorized
 */
