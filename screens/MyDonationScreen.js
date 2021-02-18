import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';

export default class MyDonationScreen extends Component{
    
    static navigationOptions={Header:null}
  constructor(){
    super()
    this.state = {
      allDonations : [],
      userId: firebase.auth().currentUser.email
    }
  this.requestRef= null
  }

  getAllDonations =()=>{
    this.requestRef = db.collection("all_donations").where("donor_id", '==', this.state.userId)
    .onSnapshot((snapshot)=>{
      var allDonations = snapshot.docs.map(document => document.data());
      this.setState({
        allDonations : allDonations
      });
    })
  }

  componentDidMount(){
    this.getAllDonations()
  }

  componentWillUnmount(){
    this.requestRef();
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ( {item, i} ) =>{
    return (
      <ListItem
        key={i}
        title={item.book_name}
        subtitle={"requested by: "+ item.requested_by+ "\n status: "+ item.request_status }
        titleStyle={{ color: 'black', fontWeight: 'bold' }}
        rightElement={
            <TouchableOpacity style={styles.button}
            
            >
              <Text style={{color:'#ffff'}}>Send Book</Text>
            </TouchableOpacity>
          }
        bottomDivider
      />
    )
  }

  render(){
    return(
      <View style={{flex:1}}>
        <MyHeader title="My Donations" navigation ={this.props.navigation}/>
        <View style={{flex:1}}>
          {
            this.state.allDonations.length === 0
            ?(
              <View style={styles.subContainer}>
                <Text style={{ fontSize: 20}}>List Of Donated Books</Text>
              </View>
            )
            :(
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.allDonations}
                renderItem={this.renderItem}
              />
            )
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  subContainer:{
    flex:1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center'
  },
  button:{
    width:100,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     }
  }
})
