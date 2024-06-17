import axios from "axios";

const API_BASE_URL = "http://10.81.200.132:5000"; // Remplacez par l'URL de votre API Flask

export const signIn = async (identifiant, password, api_key) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/login`,
      {
        identifiant,
        password,
        api_key,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 202) {
      const token = response.data.Authorization;
      // Sauvegarder le token et rediriger l'utilisateur vers une autre page
      // Exemple : AsyncStorage.setItem('token', token);
      // navigation.navigate('Home');
      console.log("Login successful:", token);
    } else {
      console.log("Invalid response from server");
    }
  } catch (error) {
    console.log("Login failed. Please check your credentials and try again.");
    console.error("Login error:", error);
  }
};
