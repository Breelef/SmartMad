import { Router } from "express";
import {createUser, findAllUsers, findUserByEmail, findUserById, updateUser} from "../service/userService.js";
import {deleteUserPermanent, deleteUserQuick, softDeleteUser} from "../service/authService.js";

const router = Router();

router.post("/API/users", async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const user = createUser(email, password, name);
        res.status(200).json({ status: 'success', data: user });

    }catch (error) {
        console.error("Error processing the request:", error);
        res.status(500).json({ error: "Failed to generate response" });
    }
});

router.get("/API/users", async (req, res) => {
      try {
        const users = await findAllUsers();
        res.status(200).json({ status: 'success', data: users });
      } catch (error) {
        console.error("Error processing the request:", error);
        res.status(500).json({ error: "Failed to fetch users" });
      }
});

router.get('/API/users/id/:id', async (req, res) => {
     try {
        const { id } = req.params;
        const user = await findUserById(id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json({ status: 'success', data: user });
      } catch (error) {
        console.error("Error processing the request:", error);
        res.status(500).json({ error: "Failed to fetch user" });
      }
});

router.get('/API/users/email', async (req, res) => {
     try {
        const { email } = req.query;
        const user = await findUserByEmail(email);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json({ status: 'success', data: user });
      } catch (error) {
        console.error("Error processing the request:", error);
        res.status(500).json({ error: "Failed to fetch user" });
      }
});

router.post('/API/users/:id', async (req, res) => {
       try {
        const { id } = req.params;
        const { name, email, password } = req.body;
        const user = await updateUser(id, name, email, password);
        res.status(200).json({ status: 'success', data: user });
      } catch (error) {
        console.error("Error processing the request:", error);
        res.status(500).json({ error: "Failed to update user" });
      }
});

router.put("/API/users/softDelete", softDeleteUser);
router.delete("/API/users/delete", deleteUserPermanent);
router.get("/API/users/deleteQuick", deleteUserQuick);


export default router;