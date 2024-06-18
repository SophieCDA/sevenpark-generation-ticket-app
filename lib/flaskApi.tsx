import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert } from "react-native";

const API_BASE_URL = "http://10.81.200.9:5000";

interface SignInResponse {
  Authorization: string;
  nom_utilisateur: string;
  id_utilisateur: number;
  is_admin: boolean;
}

export const signIn = async (
  identifiant: string,
  password: string,
  api_key: string
): Promise<SignInResponse> => {
  try {
    const response = await axios.post<SignInResponse>(`${API_BASE_URL}/login`, {
      identifiant,
      password,
      api_key,
    });
    if (response.status === 202) {
      const {
        Authorization: token,
        nom_utilisateur,
        id_utilisateur,
        is_admin,
      } = response.data;
      console.log(response.data);
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("nom_utilisateur", nom_utilisateur);
      await AsyncStorage.setItem(
        "id_utilisateur",
        JSON.stringify(id_utilisateur)
      );
      await AsyncStorage.setItem("is_admin", JSON.stringify(is_admin));
      return response.data;
    } else {
      throw new Error("Invalid response from server");
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const signOut = async (): Promise<void> => {
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("nom_utilisateur");
  await AsyncStorage.removeItem("id_utilisateur");
};

export const getCurrentUser = async (): Promise<any> => {
  const token = await AsyncStorage.getItem("token");
  if (!token) return null;
  const nomUtilisateur = await AsyncStorage.getItem("nom_utilisateur");
  const idUtilisateur = await AsyncStorage.getItem("id_utilisateur");
  return { token, nomUtilisateur, idUtilisateur };
};

export const getUserInfo = async (): Promise<any> => {
  try {
    const idUtilisateur = await AsyncStorage.getItem("id_utilisateur");
    if (!idUtilisateur) throw new Error("User ID not found");

    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Token not found");

    const response = await axios.get(`${API_BASE_URL}/utilisateurs`, {
      params: { id_utilisateur: idUtilisateur },
      headers: {
        Authorization: `${token}`,
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to fetch user info");
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getAllUsers = async (): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Token not found");

    const response = await axios.get(`${API_BASE_URL}/utilisateurs`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to fetch user info");
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const addUser = async (
  nom_utilisateur: string,
  identifiant: string,
  password: string,
  api_key: string,
  is_admin: boolean,
  as_date_validity: boolean,
  date_fin_validite?: string
): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Token not found");

    const data = {
      nom_utilisateur,
      identifiant,
      password,
      api_key,
      is_admin,
      as_date_validity,
      ...(as_date_validity && { date_fin_validite }), // Add date_fin_validite only if as_date_validity is true
    };

    const response = await axios.post(`${API_BASE_URL}/utilisateurs`, data, {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 201) {
      Alert.alert("Utilisateur créé");
    } else {
      throw new Error("Invalid response from server");
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const deleteUser = async (id_utilisateur: number): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Token not found");

    await axios.delete(`${API_BASE_URL}/utilisateurs`, {
      params: {
        id_utilisateur: id_utilisateur,
      },
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updatePassword = async (password: string): Promise<any> => {
  try {
    const idUtilisateur = await AsyncStorage.getItem("id_utilisateur");
    if (!idUtilisateur) throw new Error("User ID not found");

    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Token not found");

    const response = await axios.patch(
      `${API_BASE_URL}/utilisateurs`,
      { password },
      {
        params: { id_utilisateur: idUtilisateur },
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      Alert.alert("Mot de passe modifié avec succès");
    } else {
      throw new Error("Failed to update password");
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

interface UpdateUserParams {
  id_utilisateur: number;
  nom_utilisateur: string;
  as_date_validity: boolean;
  date_fin_validite: string;
  api_key: string;
  identifiant: string;
  password: string;
  is_admin: boolean;
}

export const updateUser = async (userData: UpdateUserParams): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Token not found");

    const response = await axios.patch(
      `${API_BASE_URL}/utilisateurs`,
      userData,
      {
        params: {
          id_utilisateur: userData.id_utilisateur,
        },
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to update user");
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};
