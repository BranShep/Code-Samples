import React, { Component } from 'react';
import {
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    NetInfo
} from 'react-native';

import { Agenda } from 'react-native-calendars';
import { Icon } from 'react-native-elements';

import Appointment from './Appointment.js';

import moment from 'moment';
import axios from 'axios';

const {height, width} = Dimensions.get('window');

class Schedule extends Component {
    constructor() {
        super();
        this.state = {
            items: {},
            serverError: false,
            isConnected: null,
            curTime: null,
            curDay: null,
            curMonth: null,
            month: '',
            year: '2018',
            curDayOfMonth: null,
            curTime: null,
            curDate: null,
            days: [],
            modalVisible: false,
            appointment: {
                name: 'No Appointment', 
                time: 'No Time',
                address1: 'No Address',
                address2: null,
                city: 'No City',
                state: 'No State',
                zip: 'No zip',
                phone: 'No phone'
            },
            showMonth: true
        }
    }

    componentWillMount() {
        var self = this;

        NetInfo.isConnected.addEventListener(
          'connectionChange',
          this._handleConnectivityChange
        );

        NetInfo.isConnected.fetch().then(
            (isConnected) => { this.setState({isConnected}); }
        );

        var d = new Date();
        var weekday = new Array(7);
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";

        var month = new Array(12);
        month[0] = "January";
        month[1] = "February";
        month[2] = "March";
        month[3] = "April";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "August";
        month[8] = "September";
        month[9] = "October";
        month[10] = "November";
        month[11] = "December";

        const currentDate = moment(new Date().toISOString().split('T')[0], 'YYYY/MM/DD');
        const currentMonth = currentDate.format('M');
        const currentYear = currentDate.format('YYYY');

        this.setState({
          curTime: new Date().toLocaleTimeString(),
          curDay: weekday[d.getDay()],
          curMonth: month[d.getMonth()],
          curDayOfMonth: d.getDate(),
          curDate: new Date().toISOString().split('T')[0],
          year: currentYear
        })

        this.getMonth(currentMonth, currentYear);
      }

      componentDidMount() {
        this.fetchCalendar();
      }

      componentWillUnmount() {
        NetInfo.isConnected.removeEventListener(
            'connectionChange',
            this._handleConnectivityChange
        );
      }
    
      _handleConnectivityChange = (isConnected) => {
        this.setState({
          isConnected,
        });
      };

      fetchCalendar() {
        console.log('FETCH CALENDAR PRESSED!');

        var self = this;

        axios.post('http://52.40.69.119:3000/api/appointments/getByUserId', {
          userId: 1
        })
        .then(function (response) {
          console.log('CALENDAR', response.data.data['2018-02-19']);

          self.setState({
            items: response.data.data,
            serverError: false
          })
        })
        .catch(function (error) {
          console.log('THE RESPONSE HAS FAILED!!!!');

          self.setState({
            serverError: true
          })
        });
      }

      setModalVisible(item) {
        if (typeof item === 'undefined') {
          this.setState({modalVisible: !this.state.modalVisible})
        } else {
          const start = moment(item.starttimestamp).format("h:mm A");
          const end = moment(item.endtimestamp).format("h:mm A");
          const times = start + ' - ' + end;

          this.setState({appointment: item, times: times, modalVisible: !this.state.modalVisible});
        } 
      }
    
      loadItems(day) {
        console.log(day);
        setTimeout(() => {
          for (let i = -15; i < 85; i++) {
            const time = day.timestamp + i * 24 * 60 * 60 * 1000;
            const strTime = this.timeToString(time);
            if (!this.state.items[strTime]) {
              this.state.items[strTime] = [];
              const numItems = Math.floor(Math.random() * 5);
              for (let j = 0; j < numItems; j++) {
                this.state.items[strTime].push();
              }
            }
          }

          const newItems = {};
          Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
          this.setState({
            items: newItems
          });
        }, 1000);
      }
    
      renderItem(item) {
        const start = moment(item.starttimestamp).format("h:mm A");
        const end = moment(item.endtimestamp).format("h:mm A");
        const times = start + ' - ' + end;
        
        return (
          <TouchableOpacity onPress={() => this.setModalVisible(item)}>
            <View style={[styles.item, {flexDirection: 'column'}]}>
                <Text>{item.title}</Text>
                <Text>{times}</Text>
            </View>
          </TouchableOpacity>
        );
      }
    
      renderEmptyDate() {
        return (
          <View style={styles.emptyDate}><Text>No Schedule</Text></View>
        );
      }
    
      rowHasChanged(r1, r2) {
        return r1.name !== r2.name;
      }
    
      timeToString(time) {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
      }

      getMonth(dateMonth, year) {
        const month = dateMonth- 1;
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December',
        ];

        this.props.navigation.setParams({ setModalVisible: this.setModalVisible.bind(this), year: year, month: monthNames[month] });
      }

      showMonth(bool) {
          this.setState({
            showMonth: !this.state.showMonth,
            month: null,
            year: null
          })

          this.props.navigation.setParams({ year: null, month: null });
      }

      renderMonth() {
        if (this.state.showMonth) {
          return (
            <View style={{backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
                <Text style={{fontSize: 18, color: '#2687DA'}}>{this.state.month} {this.state.year}</Text>
            </View>
          ) 
        } else {
          return null;
        }
      }
      

    render() {
      if (this.state.isConnected) {
        if(this.state.serverError === true){
          return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Icon
                name="alert-circle-outline"
                type="material-community"
                size={25}
                color='grey'
              />
              <Text style={{color: 'grey', marginVertical: 20}}>Something went wrong</Text>
              <TouchableOpacity onPress={() => this.fetchCalendar()}>
                <View style={{flexDirection: 'column'}}>
                  <Text style={{color: '#F6891D', marginBottom: 10}}>Try again</Text>
                  <Icon
                    name="refresh"
                    type="material-community"
                    size={25}
                    color='#F6891D'
                  />
                </View>
              </TouchableOpacity>
            </View>
          )
        } else {
          return (
            <View style={{flex: 2, backgroundColor: 'white'}}>
              <View style={{flex: 1, backgroundColor: 'white'}}>
                  <Agenda
                    items={this.state.items}
                    loadItemsForMonth={this.loadItems.bind(this)}
                    onCalendarToggled={(calendarOpened) => {this.showMonth()}}
                    onDayPress={(date) => { this.getMonth(date.month, date.year); }}
                    onDayChange={(date) => { this.getMonth(date.month, date.year); }}
                    selected={this.props.curDate}
                    minDate={'2018-01-01'}
                    maxDate={'2030-12-31'}
                    pastScrollRange={50}
                    futureScrollRange={50}
                    renderItem={this.renderItem.bind(this)}
                    renderEmptyDate={this.renderEmptyDate.bind(this)}
                    rowHasChanged={this.rowHasChanged.bind(this)}
                    markedDates={{
                      '2018-02-28': {marked: true},
                      '2018-10-18': {disabled: true}
                    }}
                    theme={{
                      agendaTodayColor: '#F6891D'
                    }}
                    style={{}}
                  />
                  
                  <View style={{width: width, height: 70, justifyContent: 'center', alignItems: 'flex-end', position: 'absolute', bottom: 0, paddingRight: 10}}>
                    <Icon
                      raised
                      reverse
                      name="ios-add"
                      type="ionicon"
                      size={25}
                      color='#2687DA'
                      onPress={() => this.props.navigation.navigate('ScheduleAppointment')}
                    />
                  </View>

                  <Appointment 
                    setModalVisible={this.setModalVisible.bind(this)} 
                    modalVisible={this.state.modalVisible}
                    appointment={this.state.appointment}
                    times={this.state.times}
                    navigation={this.props.navigation}
                  />
              </View>
            </View>
          );
        }
      } else {
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: 'grey'}}>No Internet Connection</Text>
          </View>
        )
      }
    }
}

const styles = {
    barStyle: {
        backgroundColor: 'orange',
        height: 70,
        width: width
    },
    calendarStyle: {
        flex: 1
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
      },
      welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
      },
      instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
      },
      item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17
      },
      emptyDate: {
        height: 15,
        flex:1,
        paddingTop: 30
      },
      statStyle: {
          height: 345,
          width: 345,
          marginBottom: 10,
          backgroundColor: 'white',
      }
}

export default Schedule;