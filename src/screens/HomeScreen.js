import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Alert,
} from "react-native";
import { api } from "../services/api";

export default function HomeScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

 
  const [modalVisible, setModalVisible] = useState(false);

 
  const [title, setTitle] = useState("");
  const [editandoId, setEditandoId] = useState(null);

 
  function loadItems() {
    setLoading(true);
    api
      .get("/items")
      .then((res) => {
        setItems(res.data);
      })
      .catch((err) => {
        console.log(err);
        Alert.alert(
          "Erro",
          "Falha ao carregar dados. Verifique se o servidor está rodando."
        );
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadItems();
  }, []);

 
  function openModal(item = null) {
    if (item) {
      setEditandoId(item.id);
      setTitle(item.title); 
    } else {
      setEditandoId(null);
      setTitle("");
    }
    setModalVisible(true);
  }

 
  async function handleSave() {
    if (!title.trim()) return;

    try {
      setModalVisible(false);
      setLoading(true);

      
      const dadosParaEnviar = {
        title: title,
        description: "Criado pelo App Mobile",
      };

      if (editandoId) {
        await api.put(`/items/${editandoId}`, dadosParaEnviar);
      } else {
        await api.post("/items", dadosParaEnviar);
      }

      await loadItems();
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível salvar.");
    } finally {
      setLoading(false);
    }
  }

 
  function handleDelete(id) {
    console.log("Tentando excluir o ID:", id);
    Alert.alert("Excluir", "Tem certeza?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sim",
        onPress: async () => {
          setLoading(true);
          try {
            await api.delete(`/items/${id}`);
            await loadItems();
          } catch (error) {
            Alert.alert("Erro", "Falha ao excluir");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  }


  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        {}
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSubtitle}>
          {item.description || "Sem descrição"}
        </Text>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          onPress={() => openModal(item)}
          style={[styles.actionBtn, styles.editBtn]}
        >
          <Text style={styles.btnText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={[styles.actionBtn, styles.deleteBtn]}
        >
          <Text style={styles.btnText}>X</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f2f2f2" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meus Itens</Text>
        <Text style={styles.headerSubtitle}>
          {items.length} registros encontrados
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#6200ee"
          style={{ marginTop: 50 }}
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => openModal(null)}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {editandoId ? "Editar Item" : "Novo Item"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Título do item..."
              value={title}
              onChangeText={setTitle}
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelModalBtn]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, styles.saveModalBtn]}
                onPress={handleSave}
              >
                <Text style={styles.saveText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2" },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: { fontSize: 28, fontWeight: "bold", color: "#333" },
  headerSubtitle: { fontSize: 14, color: "#888", marginTop: 4 },
  listContent: { padding: 16, paddingBottom: 100 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 3,
  },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: "600", color: "#333" },
  cardSubtitle: { fontSize: 12, color: "#999" },
  cardActions: { flexDirection: "row", gap: 8 },
  actionBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  editBtn: { backgroundColor: "#e3f2fd" },
  deleteBtn: { backgroundColor: "#ffebee" },
  btnText: { fontWeight: "bold", fontSize: 12, color: "#333" },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#6200ee",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  fabIcon: { fontSize: 32, color: "#fff", marginTop: -4 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 24,
    backgroundColor: "#fafafa",
  },
  modalButtons: { flexDirection: "row", justifyContent: "flex-end", gap: 12 },
  modalBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  cancelModalBtn: { backgroundColor: "#f5f5f5" },
  saveModalBtn: { backgroundColor: "#6200ee" },
  cancelText: { color: "#666", fontWeight: "600" },
  saveText: { color: "#fff", fontWeight: "600" },
});
