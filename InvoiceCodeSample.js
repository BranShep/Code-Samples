import React, { Component } from 'react';

import {
    View,
    Text,
    Modal,
    StyleSheet,
    Button,
    Image,
    ScrollView,
    Dimensions,
    WebView,
    ActivityIndicator, 
    TouchableOpacity
} from 'react-native';

import { Icon, List, ListItem } from 'react-native-elements';

import moment from 'moment';
import Dash from 'react-native-dash';

import DropDown from './DropDown.js';

const {height, width} = Dimensions.get('window');

class Invoice extends Component {
    constructor(props) {
        super(props);
        this.state={
            sent: true,
            viewed: false,
            modalVisible: false
        }
    }

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            title: 'Invoice',
            headerStyle: {
            backgroundColor: 'white',
            },
            headerTitleStyle: {
            fontWeight: 'bold',
            },
            tabBarVisible: false,
            headerRight: (
                <Icon
                    onPress={() => params.setModalVisible()}
                    name="dots-horizontal"
                    color="#333"
                    type="material-community"
                    containerStyle={{paddingRight: 15}}
                    underlayColor="transparent"
                />
            ),
        }
    };

    componentWillMount() {
        this.props.navigation.setParams({ setModalVisible: this.setModalVisible.bind(this) });
    }

    numberWithCommas = (x) => {
        return x.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    setModalVisible() {
        this.setState({modalVisible: !this.state.modalVisible});
    }

    renderDue(customer) {
        if (customer.balanceDue === 0) {
            return null;
        } else if (customer.balanceDue > 0) {
            if (new Date(customer.dueDate) < new Date()) {
                var end = moment();
                var start = moment(customer.dueDate);
                var daysTilDue = end.diff(start, "days");

                return (
                    <Text style={{color: 'red', fontSize: 18, fontWeight: 'bold'}}>{daysTilDue} DAYS PAST DUE</Text>
                )
            } else {
                var start = moment();
                var end = moment(customer.dueDate);
                var daysTilDue = end.diff(start, "days");

                return (
                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>DUE IN {daysTilDue} DAYS</Text>
                )
            }
        }
    }

    renderCircle(status) {
        if (status) {
            return (
                <Icon name="check-circle" type="material-community" color="#F6891D" containerStyle={{height: 25, width: 30, marginBottom: 10 }} size={30} />
            )
        } else {
            return (
                <View style={{borderRadius: 25/2, height: 25, width: 25, borderWidth: 1, borderColor: '#F6891D', marginBottom: 10 }}>
                </View>
            )
        }
    }

    renderStatus(customer, renderCircle) {
        return (
            <View style={{flexDirection: 'row', width: '100%', paddingHorizontal: 50, justifyContent: 'space-between', alignItems: 'center', marginTop: 20}}>
                <View style={{flexDirection: 'column', alignItems: 'center'}}>
                    <View style={{flexDirection: 'column', alignItems: 'center'}}>
                        {renderCircle(this.state.sent)}
                        <Text>Sent</Text>
                    </View>
                </View>
                <Dash dashColor={'#F6891D'} style={{flex: 1, height:1, marginBottom: 25, marginLeft: 10}}/>
                <View style={{flexDirection: 'column', alignItems: 'center'}}>
                    <View style={{flexDirection: 'column', alignItems: 'center'}}>
                        {renderCircle(this.state.viewed)}
                        <Text>Viewed</Text>
                    </View>
                </View>
                <Dash dashColor={'#F6891D'} style={{flex: 1, height:1, marginBottom: 25, marginRight: 10}}/>
                <View style={{flexDirection: 'column', alignItems: 'center'}}>
                    <View style={{flexDirection: 'column', alignItems: 'center'}}>
                        {renderCircle(customer.paid)}
                        <Text>Paid</Text>
                    </View>
                </View>
            </View>
        )
    }

    render() {
        const customer = this.props.navigation.state.params.customer;
        const navigation = this.props.navigation;

        return (
            <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
                <View style={{height: 250, width: '100%', backgroundColor: '#EDEDED', padding: 15, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 20, marginBottom: 20}}>{customer.customerName}</Text>
                    <Text style={{fontSize: 40, color: '#F6891D', marginBottom: 15}}>${this.numberWithCommas(customer.balanceDue)}</Text>
                    {this.renderDue(customer)}
                    {this.renderStatus(customer, this.renderCircle)}
                </View>
                <TouchableOpacity onPress={() => console.log('hey')}>
                    <View style={{height: 50, width: '100%', backgroundColor: '#545454', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: 'white', fontSize: 18, marginRight: 20}}>Send Invoice</Text>
                        <Icon
                            name="send"
                            type="material-community"
                            color="white"
                            containerStyle={{paddingBottom: 0, marginTop: 5}}
                        />
                    </View>
                </TouchableOpacity>
                <View style={{flex: 1, paddingLeft: 15}}>
                    <TouchableOpacity onPress={() => navigation.navigate('Payment', {id: customer.invoiceNumber})}>
                        <View style={{height: 60, width: '100%', borderBottomWidth: 1, borderColor: "#ddd", flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 15}}>
                            <Text style={{color: '#F6891D'}}>PAYMENT</Text>
                            <Icon
                                name="plus-circle-outline"
                                type="material-community"
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Job', {job: customer, isInvoice: true})}>
                        <View style={{height: 60, width: '100%', borderBottomWidth: 1, borderColor: "#ddd", flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 15}}>
                            <Text style={{color: '#F6891D'}}>JOB ID</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={{marginRight: 10}}>#{customer.jobId}</Text>
                                <Icon 
                                    name="chevron-right"
                                    type="material-community"
                                    color="#F6891D"
                                />
                            </View>
                        </View>
                    </TouchableOpacity>

                    <View style={{paddingBottom: 15, width: '100%', borderBottomWidth: 1, borderColor: "#ddd", flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', paddingRight: 15, paddingTop: 15}}>
                        <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>
                            <Text style={{color: '#F6891D'}}>INVOICE</Text>
                            <Text>#{customer.invoiceNumber}</Text>
                        </View>
                        <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View style={{flexDirection: 'row'}}><Text style={{color: '#9B9B9B'}}>Due: </Text><Text>{customer.dueDate}</Text></View>
                            <Text style={{color: '#9B9B9B'}}>{customer.invoiceDate}</Text>
                        </View>
                        <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View style={{flexDirection: 'row'}}><Text style={{color: '#9B9B9B'}}>Terms: </Text><Text>{customer.paymentTermsCode}</Text></View>
                            <Text></Text>
                        </View>

                        <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginBottom: 15, paddingBottom: 10, borderBottomWidth: 1, borderColor: '#ddd'}}>
                            <View style={{flexDirection: 'row'}}><Text style={{color: '#F6891D'}}>1 ITEM </Text></View>
                            <Text></Text>
                        </View>

                        <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>
                            <Text style={{fontSize: 18}}>GAF Timberline 2 8/12</Text>
                            <Text style={{fontSize: 18 }}>{this.numberWithCommas(customer.total)}</Text>
                        </View>
                    </View>

                    <View style={{width: '100%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 20, paddingRight: 15}}>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{fontSize: 20, marginRight: 10, fontWeight: 'bold'}}>Total</Text>
                                <View style={{width: 150, marginLeft: 10, alignItems: 'flex-end'}}>
                                    <Text style={{fontSize: 20, fontWeight: 'bold'}}>${this.numberWithCommas(customer.total)}</Text>
                                </View>
                            </View>
                    </View>
                    <View style={{width: '100%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 10, paddingRight: 15}}>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{fontSize: 20, marginRight: 10}}>Balance Due</Text>
                                <View style={{width: 150, marginLeft: 10, alignItems: 'flex-end'}}>
                                    <Text style={{fontSize: 20}}>${this.numberWithCommas(customer.balanceDue)}</Text>
                                </View>
                            </View>
                    </View>

                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Signature')}>
                        <View style={{flexDirection: 'column', width: 150, marginTop: 50}}>
                            <Text style={{marginBottom: 10}}>X Get Signature</Text>
                            <Dash dashColor={'#F6891D'} style={{flex: 1, height:1, marginBottom: 25, marginRight: 10}}/>
                        </View>
                    </TouchableOpacity>

                    <DropDown
                        list={[
                            {label: 'Edit', iconName: 'pencil', iconType: 'material-community', iconColor: '#F6891D'},
                            {label: 'Preview', iconName: 'file-find', iconType: 'material-community', iconColor: '#F6891D'},
                            {label: 'Email', iconName: 'email-outline', iconType: 'material-community', iconColor: '#F6891D'},
                            {label: 'Download', iconName: 'download', iconType: 'material-community', iconColor: '#F6891D'},
                            {label: 'Print', iconName: 'printer', iconType: 'material-community', iconColor: '#F6891D'},
                            {label: 'Delete', iconName: 'delete', iconType: 'material-community', iconColor: 'red'},
                        ]}
                        setModalVisible={this.setModalVisible.bind(this)}
                        modalVisible={this.state.modalVisible}
                    />
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    modalContainer: {
      backgroundColor: 'white',
      padding: 15
    },
    innerContainer: {
      width: '100%',
      justifyContent: 'flex-start',
    },
    pdf: {
        flex:1,
        width:Dimensions.get('window').width,
    }
});

export default Invoice;