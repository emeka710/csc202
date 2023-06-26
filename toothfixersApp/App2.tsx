import React, { useEffect, useState } from "react";
import {
  TextInput,
  StyleSheet,
  Modal,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";

interface ClinicalRecord {
  id: number;
  clinicDate: Date;
  natureOfAilment: string;
  medicinePrescribed: string;
  procedureUndertaken: string;
  dateOfNextAppointment: Date;
}

const App2 = (): JSX.Element => {
  const [list, setList] = useState<ClinicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalClinicalRecord, setModalClinicalRecord] = useState(false);

  const [natureOfAilment, setnatureOfAilment] = useState("");
  const [medicinePrescribed, setmedicinePrescribed] = useState("");
  const [procedureUndertaken, setprocedureUndertaken] = useState("");
  const [id, setId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  // READ
  const fetchData = () => {
    fetch("http://192.168.56.1:3001/clinic-records", {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((res: ClinicalRecord[]) => {
        console.log(res);
        if (res && Array.isArray(res)) {
          setList(res);
        }
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((err) => {
        console.log(err);
        setLoading(false); // Set loading to false in case of an error
      });
  };

  // DELETE
  const handleRemove = (item: { id: number }) => {
    fetch(`http://192.168.56.1:3001/clinic-records/${item.id}`, {
      method: "DELETE",
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res);
        fetchData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // CREATE
  const handleCreate = () => {
    setModalClinicalRecord(true);
  };

  // MODAL
  const handleCloseModal = () => {
    setModalClinicalRecord(false);
  };

  // CREATE THAT CREATES
  const handleCreateModal = () => {
    const data = {
      id,
      natureOfAilment,
      medicinePrescribed,
      procedureUndertaken,
    };

    if (id == null) {
      // CREATE request
      fetch("http://192.168.56.1:3001/clinic-records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Error: " + res.status);
          }
          return res.json();
        })
        .then((res) => {
          console.log(res);
          fetchData();
          setModalClinicalRecord(false);
          clearForm();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      // UPDATE request
      fetch(`http://192.168.56.1:3001/clinic-records/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Error: " + res.status);
          }
          return res.json();
        })
        .then((res) => {
          console.log(res);
          fetchData();
          setModalClinicalRecord(false);
          clearForm();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  // CLEAR FORM
  const clearForm = () => {
    setnatureOfAilment("");
    setmedicinePrescribed("");
    setprocedureUndertaken("");
    setId(null);
  };

  // UPDATE
  const handleUpdate = (item: {
    id: any;
    natureOfAilment?: any;
    medicinePrescribed?: any;
    procedureUndertaken?: any;
  }) => {
    setId(item.id);
    setnatureOfAilment(item.natureOfAilment);
    setmedicinePrescribed(item.medicinePrescribed);
    setprocedureUndertaken(item.procedureUndertaken);
    setModalClinicalRecord(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.txtMain}>Clinical Records</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <ScrollView>
          {list.map((item) => (
            // Form stuff
            <View>
              <Modal visible={modalClinicalRecord}>
                <SafeAreaView>
                  <View style={[styles.rowBetween, { paddingHorizontal: 10 }]}>
                    <Text>NEW CLINICAL RECORD</Text>
                    <TouchableOpacity onPress={handleCloseModal}>
                      <Text style={styles.txtClose}>CLOSE</Text>
                    </TouchableOpacity>
                  </View>
                  {/* Form stuff */}
                  <View style={{ paddingHorizontal: 10, marginTop: 20 }}>
                    <Text>Nature of Ailment</Text>
                    <TextInput
                      style={styles.txtInput}
                      placeholder={"Enter Nature of Ailment"}
                      value={natureOfAilment}
                      onChangeText={(text) => {
                        setnatureOfAilment(text);
                      }}
                    />

                    <Text>Medicine Prescribed</Text>
                    <TextInput
                      style={styles.txtInput}
                      placeholder={"Enter Medicine Prescribed"}
                      value={medicinePrescribed}
                      onChangeText={(text) => {
                        setmedicinePrescribed(text);
                      }}
                    />

                    <Text>Procedure Undertaken</Text>
                    <TextInput
                      style={styles.txtInput}
                      placeholder={"Enter Procedure Undertaken"}
                      value={procedureUndertaken}
                      onChangeText={(text) => {
                        setprocedureUndertaken(text);
                      }}
                    />

                    {/* SAVE button */}
                    <TouchableOpacity
                      onPress={handleCreateModal}
                      style={styles.btnContainer}
                    >
                      <Text style={styles.txtClose}>SAVE</Text>
                    </TouchableOpacity>
                  </View>
                </SafeAreaView>
              </Modal>

              <View style={styles.rowBetween}>
                <TouchableOpacity onPress={() => handleCreate()}>
                  <Text style={styles.txtCreate}>CREATE</Text>
                </TouchableOpacity>

                <View style={styles.item} key={item.id}>
                  <Text style={styles.txtNormal}>{item.natureOfAilment}</Text>
                  <Text>{item.medicinePrescribed}</Text>
                  <Text>{item.procedureUndertaken}</Text>
                </View>

                <View>
                  <TouchableOpacity
                    onPress={() => handleRemove({ id: item.id })}
                  >
                    <Text style={styles.txtDelete}>Delete</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleUpdate({ id: item.id })}
                  >
                    <Text style={styles.txtEdit}>Update</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  txtMain: {
    fontSize: 50,
    fontWeight: "bold",
    padding: 0,
    backgroundColor: "#FFC0CB",
    flexGrow: 1,
    textAlign: "center",
  },
  item: {},
  txtNormal: {
    fontSize: 24,
    fontWeight: "bold",
  },
  txtDelete: {
    color: "red",
  },
  txtEdit: {
    color: "blue",
  },
  txtCreate: {
    color: "green",
  },
  txtClose: {
    color: "orange",
    fontSize: 24,
    fontWeight: "bold",
  },
  txtInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 1,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FFC0CB",
  },
  btnContainer: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    backgroundColor: "black",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
});
export default App2;
