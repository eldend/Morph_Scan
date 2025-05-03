import React, { useState } from "react";
import { View, Text, Button, Image, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("image", {
      uri: image,
      type: "image/jpeg",
      name: "gecko.jpg",
    });

    const res = await fetch("http://YOUR_SERVER_IP:3001/analyze", {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>크레스티드게코 모프 판별</Text>
      <Button title="사진 선택하기" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {image && <Button title="분석 시작" onPress={analyzeImage} />}
      {result && (
        <View style={styles.resultBox}>
          <Text>정확도: {result.accuracy}</Text>
          <Text>모프: {result.morph}</Text>
          <Text>특징: {result.features}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 50,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 300,
    marginVertical: 20,
  },
  resultBox: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
});
