import React from 'react';
import PropTypes from 'prop-types';
import { constants } from '../../util/constants';

class ImageBox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            imageData: '',
            imageSelected: false
        };
    }

    onImageSelected = ($event) => {
        if ($event.target.files && $event.target.files.length > 0) {
            this.showTempImage($event.target.files[0]);

            if (this.props.onChange) {
                this.props.onChange(this.props.id, $event.target.files[0]);
            }
        }
    };


    showTempImage = (image) => {
        var reader = new FileReader();
        var that = this;
        reader.onload = function (e) {
            that.setState({
                imageData: e.target.result,
                imageSelected: true
            });
        }

        reader.readAsDataURL(image);
    };


    render() {
        const { image } = this.props;
        const imageData = this.state.imageData || image || constants.API_URL + '/uploads/default.png';

        console.log('imgdata : ', imageData);

        return (
            <div className='sane-margin-from-top'>
                <input
                    className='hide'
                    accept="image/*"
                    id="file-browse"
                    multiple={this.props.multiple}
                    type="file"
                    onChange={this.onImageSelected}
                />
                <img id='profilePicture' className='small-square sane-margin-from-top same-row' src={imageData} />
                 {
                     
                    (image || this.state.imageSelected) ?
                    <p className="same-row" style={{ position:'Absolute', marginLeft: '-18px', marginTop: '12px' }}><i title='Clear Image' style={{ color:'gray', fontSize:'17px', cursor: 'pointer'}} className="material-icons">
                    cancel
                    </i></p> : ''
                }
                <div className='overlay no-margin text-middle' style={{ width: '100px', marginTop: '0px', zIndex: '1000' }}>
                    <label htmlFor="file-browse" >
                        <a className='links text-middle small-font full-width'><span style={{ width: '100px'}} >Select Picture</span></a>
                    </label>
                </div>
            </div>
        )
    }
}

ImageBox.propTypes = {
    onChange: PropTypes.func.isRequired,
    image: PropTypes.any
};

export default ImageBox
