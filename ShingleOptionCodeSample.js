import React, { Component } from 'react';
import {
    View,
    Text,
    ImageBackground,
    Dimensions,
    LayoutAnimation, 
    Platform, 
    UIManager, 
    TouchableOpacity,
    TouchableWithoutFeedback,
    ScrollView
} from 'react-native';

const {height, width} = Dimensions.get('window');

import { Icon, Button, Card } from 'react-native-elements';

class ShingleOption extends Component {
    constructor(props) {
        super(props);

        this.state = {
            layoutHeight: 0,
            expanded: false
        }
    }

    openColors() {
        LayoutAnimation.configureNext( LayoutAnimation.Presets.easeInEaseOut );
    
        this.setState({ layoutHeight: 300, expanded: true });
    }

    closeColors() {
        LayoutAnimation.configureNext( LayoutAnimation.Presets.easeInEaseOut );

        this.setState({ layoutHeight: 0, expanded: false });
    }

    renderViewAllColors() {
        if (this.state.expanded) {
            return null;
        } else {
            return (
                <TouchableOpacity onPress={() => this.openColors()} style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 70, backgroundColor: 'rgba(0,0,0,.4)'}}>
                    <View style={{flex: 1, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Text style={{color: 'white', fontSize: 18, fontWeight: '600'}}>VIEW ALL COLORS</Text>
                        <Icon name={'chevron-up'} type={'material-community'} color={'white'} size={18} />
                    </View>
                </TouchableOpacity>
            )
        }
    }

    renderColorsContainer() {
        if (this.state.expanded) {
            return (
                <View style={{top: 0, left: 0, bottom: 0, right: 0, position: 'absolute'}}>
                    <View style={{height: 70, width: '100%', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', paddingHorizontal: 20}}>
                        <Text style={{color: 'white', fontSize: 18, fontWeight: '600'}}>{this.props.option.colors[0].display_color}</Text>
                        <Icon name={'chevron-down'} type={'material-community'} color={'white'} size={18} />
                    </View>
                    <View style={{padding: 20, flex: 1, width: '100%', flexWrap: 'wrap', flexDirection: 'row'}}>
                        {this.props.option.colors.map((color, index) => {
                            if (index > 11) {
                                return null;
                            } else {
                                return (
                                    <View style={{height: 55, width: 55, backgroundColor: color.swatch_hex_color}}/>
                                )
                            }
                        })}
                    </View>
                </View>
            )
        } else {
            return null;
        }
    }

    render() {
        return (
            <ImageBackground source={{uri: this.props.option.colors[0].image_url}} style={{width: (width/2) - 22.5, height: 300, padding: 20, paddingBottom: 0, backgroundColor: 'brown', marginBottom: 15}}>
                <Text style={{color: 'white', fontSize: 26, fontWeight: '600'}}>{this.props.option.display_style.toUpperCase()}</Text>
                <Text style={{color: 'white', fontSize: 20}}>{this.props.option.colors[0].display_color}</Text>
                {this.renderViewAllColors()}
                <TouchableWithoutFeedback onPress={() => this.openColors()} style={{ zIndex: 10000}}>
                    <View style={{paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',backgroundColor: 'black', position: 'absolute', bottom: 0, left: 0, right: 0, height: this.state.layoutHeight,}}>
                        {this.renderColorsContainer()}
                    </View>
                </TouchableWithoutFeedback>
            </ImageBackground>
        )
    }
}

export default ShingleOption;