import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

type ResultadoIA = {
  clase: string;
  confianza: number;
};

export async function detectarResiduo(base64Image: string): Promise<ResultadoIA> {
  try {
    const net = await NetInfo.fetch();

    if (!net.isConnected) {
      const cached = await AsyncStorage.getItem("ultima_prediccion");
      if (cached) return JSON.parse(cached);
      else throw new Error("No hay conexión ni predicciones guardadas.");
    }

    const res = await fetch("http://TU_IP_LOCAL:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: base64Image }),
    });

    const data = await res.json();
    await AsyncStorage.setItem("ultima_prediccion", JSON.stringify(data));
    return data;
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error de red o backend:", err.message);
    } else {
      console.error("Error desconocido:", err);
    }
    return { clase: "desconocido", confianza: 0 };
  }
}
