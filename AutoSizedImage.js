import React from 'react';
import {
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal
} from 'react-native';

const width =  Dimensions.get('window').width -30;

const baseStyle = {
  backgroundColor: 'transparent',
};

export default class AutoSizedImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      preview: false,
      width: this.props.style.width || 0,
      height: this.props.style.height || 0,
    };
  }

  componentDidMount() {
    //avoid repaint if width/height is given
    if (this.props.style.width || this.props.style.height) {
      return;
    }
    Image.getSize(this.props.source.uri, (w, h) => {
      this.setState({width: w, height: h});
    });
  }

  switchPreview= ()=>{
    const preview =!this.state.preview
    this.setState({preview});
  }

  render() {
    const screenWidth =Dimensions.get('window').width;
    const screenHeight =Dimensions.get('window').height;
    
    const finalSize = {};
    if (this.state.width > width) {
      finalSize.width = width;
      const ratio = width / this.state.width;
      finalSize.height = this.state.height * ratio;
    }
    const style = Object.assign(
      baseStyle,
      this.props.style,
      {width: this.state.width, height: this.state.height},
      finalSize
    );
    let source = {};
    if (!finalSize.width || !finalSize.height) {
      source = Object.assign(source, this.props.source, this.state);
    } else {
      source = Object.assign(source, this.props.source, finalSize);
    }

    return (
      <View style={{width:style.width, height:style.height}}>
        <TouchableOpacity activeOpacity={1} onPress={this.switchPreview}>
          <Image style={style} source={source} ref='img'/>
        </TouchableOpacity>
        <Modal visible={this.state.preview} transparent={false} animationType='fade' onRequestClose={()=>{}}>
          <TouchableOpacity activeOpacity={1} onPress={this.switchPreview} style={{width:screenWidth, height:screenHeight, flex:1, justifyContent:'center', backgroundColor:'#000'}}>
           <Image style={{width: screenWidth, height: this.state.height * screenWidth/this.state.width}} source={source}/>
           </TouchableOpacity>
        </Modal>
      </View>
    )
  }
}
