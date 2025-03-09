import api from "./api";

// create user
export const createUser = async (userData: object) => {
  try {
    const response = await api.post("/user", userData);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// get user info
export const getUserProfile = async (userId: string) => {
  try {
    const response = await api.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

// get user by Email
export const getUserByEmail = async (email: string) => {
  try {
    const response = await api.get(`/user/email/${email}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw error;
  }
};

// update user info
export const updateUserProfile = async (userId: string, userData: object) => {
  try {
    const response = await api.put(`/user/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

//delete user info
export const deleteUser = async (userId: string) => {
  try {
    const response = await api.delete(`/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
