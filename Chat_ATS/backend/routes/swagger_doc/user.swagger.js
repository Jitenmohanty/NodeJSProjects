/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the user.
 *         nickname:
 *           type: string
 *           description: The nickname of the user (optional).
 *         email:
 *           type: string
 *           description: The email of the user (must be unique).
 *         phone:
 *           type: string
 *           description: The phone number of the user.
 *         password:
 *           type: string
 *           description: The password of the user (hashed).
 *         bio:
 *           type: string
 *           description: A brief biography of the user.
 *         gender:
 *           type: string
 *           enum: ["Male", "Female", "Other"]
 *           description: The gender of the user.
 *         profilePicture:
 *           type: string
 *           description: The URL or file path to the user's profile picture.
 *         online:
 *           type: boolean
 *           description: Whether the user is currently online or not.
 *         otp:
 *           type: string
 *           description: The OTP (One-Time Password) used for user verification.
 *         isVerified:
 *           type: boolean
 *           description: Whether the user's email or phone is verified.
 *         otpExpires:
 *           type: string
 *           format: date-time
 *           description: The expiration date and time of the OTP.
 *         blockedUsers:
 *           type: array
 *           items:
 *             type: string
 *           description: List of user IDs that are blocked by the current user.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the user was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the user was last updated.
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: Endpoint for creating a new user account with details like name, email, and password.
 *     operationId: createUser
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /users/{userId}:
 *   put:
 *     summary: Update user details
 *     description: Endpoint for updating user information such as name, bio, profile picture, etc.
 *     operationId: updateUser
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /users/{userId}/block:
 *   post:
 *     summary: Block a user
 *     description: Endpoint for blocking another user. This will add the blocked user to the `blockedUsers` list.
 *     operationId: blockUser
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user who is performing the block action.
 *         schema:
 *           type: string
 *       - in: query
 *         name: blockedUserId
 *         required: true
 *         description: The ID of the user to be blocked.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User blocked successfully.
 *       400:
 *         description: Invalid user ID.
 *       404:
 *         description: User or blocked user not found.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /users/{userId}/unblock:
 *   post:
 *     summary: Unblock a user
 *     description: Endpoint for unblocking a user, removing them from the blocked users list.
 *     operationId: unblockUser
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user who is performing the unblock action.
 *         schema:
 *           type: string
 *       - in: query
 *         name: blockedUserId
 *         required: true
 *         description: The ID of the user to be unblocked.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User unblocked successfully.
 *       404:
 *         description: User or blocked user not found.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /users/{userId}/verify-otp:
 *   post:
 *     summary: Verify OTP for user
 *     description: Endpoint for verifying OTP for user registration or login.
 *     operationId: verifyOTP
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user whose OTP is being verified.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *             properties:
 *               otp:
 *                 type: string
 *                 description: The OTP to verify.
 *     responses:
 *       200:
 *         description: OTP verified successfully.
 *       400:
 *         description: Invalid OTP.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */
