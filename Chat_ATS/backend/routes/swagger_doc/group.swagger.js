/**
 * @swagger
 * components:
 *   schemas:
 *     Group:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - creator
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the group.
 *         description:
 *           type: string
 *           description: A brief description of the group.
 *         creator:
 *           type: string
 *           description: The ID of the user who created the group.
 *         members:
 *           type: array
 *           items:
 *             type: string
 *           description: A list of user IDs who are members of the group.
 *         admins:
 *           type: array
 *           items:
 *             type: string
 *           description: A list of user IDs who are admins of the group.
 *         bio:
 *           type: string
 *           description: A bio or additional information about the group.
 *         password:
 *           type: string
 *           description: The password for the group (hashed).
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the group was created.
 */

/**
 * @swagger
 * /groups:
 *   post:
 *     summary: Create a new group
 *     description: Endpoint for creating a new group with a password.
 *     operationId: createGroup
 *     tags:
 *       - Groups
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Group'
 *     responses:
 *       201:
 *         description: Group created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Group'
 *       400:
 *         description: Invalid input.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /groups/{groupId}:
 *   put:
 *     summary: Update a group
 *     description: Endpoint for updating group details such as name, description, and password.
 *     operationId: updateGroup
 *     tags:
 *       - Groups
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         description: The ID of the group to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Group'
 *     responses:
 *       200:
 *         description: Group updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Group'
 *       404:
 *         description: Group not found.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /groups/{groupId}:
 *   delete:
 *     summary: Delete a group
 *     description: Endpoint for deleting a group by its ID.
 *     operationId: deleteGroup
 *     tags:
 *       - Groups
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         description: The ID of the group to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Group deleted successfully.
 *       404:
 *         description: Group not found.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /groups/{groupId}/verify-password:
 *   post:
 *     summary: Verify group password
 *     description: Endpoint to verify the password of the group.
 *     operationId: verifyGroupPassword
 *     tags:
 *       - Groups
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         description: The ID of the group to verify the password for.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 description: The password to verify for the group.
 *     responses:
 *       200:
 *         description: Password verified successfully.
 *       400:
 *         description: Incorrect password.
 *       404:
 *         description: Group not found.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /groups/{groupId}/add-member:
 *   post:
 *     summary: Add a new member to the group
 *     description: Endpoint for adding a member to the group.
 *     operationId: addMemberToGroup
 *     tags:
 *       - Groups
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         description: The ID of the group to add a member to.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user to add to the group.
 *     responses:
 *       200:
 *         description: Member added successfully.
 *       404:
 *         description: Group or user not found.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /groups/{groupId}/remove-member:
 *   post:
 *     summary: Remove a member from the group
 *     description: Endpoint for removing a member from the group.
 *     operationId: removeMemberFromGroup
 *     tags:
 *       - Groups
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         description: The ID of the group to remove a member from.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user to remove from the group.
 *     responses:
 *       200:
 *         description: Member removed successfully.
 *       404:
 *         description: Group or user not found.
 *       500:
 *         description: Server error.
 */
