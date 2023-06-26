import React, { useEffect, useState } from "react";
import { TextInput, StyleSheet,Modal,Text, View, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";

interface Patient {
  id: number;
  firstName: string;
  surname: string;
  middleName: string;
  dateOfBirth: Date;
  homeAddress: string;
  dateOfRegistration: Date;
  matriculationNumber: string;
}

const App = (): JSX.Element => {
        const [list, setList] = useState<Patient[]>([]);
        const [loading, setLoading] = useState(true);
        const [modalPatient, setModalPatient] = useState(false)

        const [firstName, setFirstName] = useState('');
        const [surname, setSurname] = useState('');
        const [middleName, setMiddleName] = useState('');
        //const [dateOfBirth, setDateOfBirth] = useState('');
        const [homeAddress, setHomeAddress] = useState('');
        //const [dateOfRegistration, setDateOfRegistration] = useState('');
        const [matriculationNumber, setMatriculationNumber] = useState('');
        
        const [id, setId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  //READ
  const fetchData = () => {
    //patients
    fetch("http://192.168.56.1:3001/patients", {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((res: Patient[]) => {
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


  //DELETE
  const handleRemove = (item: { id: number }) => {
    fetch(`http://192.168.56.1:3001/patients/${item.id}`, {
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


  //CREATE
  const handleCreate = () => {
       setModalPatient(true)
  };
  
  //MODAL
  const handleCloseModal = () => {
       setModalPatient(false)
  }


  //CREATE THAT CREATES
  const handleCreateModal = () => {
    const data = {
      id,
      firstName,
      surname,
      middleName,
      homeAddress,
      matriculationNumber,
    };
  
    if (id == null) {
      // CREATE request
      fetch("http://192.168.56.1:3001/patients", {
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
          setModalPatient(false);
          clearForm();
  
          setFirstName("");
          setSurname("");
          setMiddleName("");
          setHomeAddress("");
          setMatriculationNumber("");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      // UPDATE request
      fetch(`http://192.168.56.1:3001/patients/${id}`, {
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
          setModalPatient(false);
          clearForm();
  
          setId(null);
          setFirstName("");
          setSurname("");
          setMiddleName("");
          setHomeAddress("");
          setMatriculationNumber("");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  

  //CLEAR FORM
  const clearForm = () => {
        setFirstName("");
        setSurname("");
        setMiddleName("");
        //setDateOfBirth("");
        setHomeAddress("");
        //setDateOfRegistration("");
        setMatriculationNumber("");
        setId(null)
  }


  //UPDATE
  const handleUpdate = (item: { id: any; firstName?: any; surname?: any; middleName?: any; homeAddress?: any; matriculationNumber?: any; }) => {
           


            setId(item.id);
            setFirstName(item.firstName);
            setSurname(item.surname);
            setMiddleName(item.middleName);
            //setDateOfBirth("");
            setHomeAddress(item.homeAddress);
            //setDateOfRegistration("");
            setMatriculationNumber(item.matriculationNumber);
            setModalPatient(true)
  }

  return (
    <SafeAreaView>
      <Text style={styles.txtMain}
      >Patient List</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <ScrollView>
          {list.map((item) => (
        
        //form stuff
            <View>
          

            <Modal visible = {modalPatient}>
              <SafeAreaView>
                   <View style={[styles.rowBetween,{paddingHorizontal:10} ]}>
                    <Text>NEW PATIENT</Text>
                    <TouchableOpacity onPress={handleCloseModal}>
                    <Text style={styles.txtClose}>CLOSE</Text>
                   </TouchableOpacity>
                   </View>
                {/* form stuff */}
                  <View style = {{paddingHorizontal:10, marginTop:20}}>
                    
                    <Text>First Name</Text>
                  <TextInput style={styles.txtInput}
                  placeholder = {"Enter your first name"}
                  value={firstName}
                  onChangeText = {(text)=>{
                    setFirstName(text)
                  }}                  
                  />
             

                  <Text>Surname</Text>
                  <TextInput style={styles.txtInput}
                  placeholder = {"Enter your surname"}
                  value={surname}
                  onChangeText = {(text)=>{
                    setSurname(text)
                  }} />

                  <Text>MiddleName</Text>
                  <TextInput style={styles.txtInput}
                  placeholder = {"Enter your middlename"}
                  value={middleName}
                  onChangeText = {(text)=>{
                    setMiddleName(text)
                  }} />

                  
                  <Text>Home Address</Text>
                  <TextInput style={styles.txtInput}
                  placeholder = {"Enter your home address"}
                  value={homeAddress}
                  onChangeText = {(text)=>{
                    setHomeAddress(text)
                  }} />

                 

                  <Text>Matriculation Number</Text>
                  <TextInput style={styles.txtInput}
                  placeholder = {"Enter your mat no."}
                  value={matriculationNumber}
                  onChangeText = {(text)=>{
                    setMatriculationNumber(text)
                  }} />
                  
                  {/*SAVE button */}
                  <TouchableOpacity onPress={handleCreateModal} style= {styles.btnContainer}>
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
                 <Text style={styles.txtNormal}>{item.firstName}</Text>
                 <Text>{item.surname}</Text>
                 <Text>{item.middleName}</Text>
                 <Text>{item.dateOfBirth}</Text>
                 <Text>{item.homeAddress}</Text>
                 <Text>{item.dateOfRegistration}</Text>
                 <Text>{item.matriculationNumber}</Text>
              </View>
            
              <View>

              <TouchableOpacity onPress={() => handleRemove({ id: item.id })}>
              <Text style={styles.txtDelete}>Delete</Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => handleUpdate({ id: item.id })}>
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

export default App;

const styles = StyleSheet.create({
  txtMain: {
    fontSize: 50,
    fontWeight: "bold",
    padding: 0,
    backgroundColor: "pink",
    flexGrow: 1,

  },
  item:{
    

  },
  txtNormal:{
    fontSize: 24,
    fontWeight: "bold",
  },
  txtDelete:{
    color : "red",
  },
  txtEdit:{
    color : "blue",
  },
  txtCreate:{
    color : "green",
  },
  txtClose:{
    color : "orange",
    fontSize: 24,
    fontWeight: "bold",
  },
  txtInput:{
    padding:10,
    borderWidth:1,
    borderColor:"black",
    marginBottom: 1,
  },
  rowBetween:{
     flexDirection : "row",
     justifyContent :"space-between",
     paddingVertical : 10,
    borderBottomWidth : 1,
    borderBottomColor : "pink"
  },
   btnContainer:{
    borderWidth:1,
    borderColor:"gray",
    padding:10,
    backgroundColor:"black",
    textAlign:'center',
    justifyContent:'center',
    alignItems:'center',
   }
});