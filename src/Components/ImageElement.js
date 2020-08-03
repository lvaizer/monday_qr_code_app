import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import './ImageElement.css';

let autoDownload;

export default forwardRef((props, ref) => {
    const [hide, setHide] = useState();
    const [image, setImage] = useState('preview.png');

    useEffect(() => {
        autoDownload && downloadImageClicked();
        autoDownload = false;
    }, [image]);

    useImperativeHandle(ref, () => ({
        hide(hide) {
            setHide(hide);
        },
        setImage(image) {
            setImage(image);
        },
        getImage() {
            return image;
        }
    }));

    const downloadImageClicked = () => {
        if (image === 'preview.png') {
            autoDownload = true;
            triggerPropsFunction(props.generateImage);
        } else {
            triggerPropsFunction(props.downloadImage)
        }
    }

    const triggerPropsFunction = (propsFunction) => propsFunction && propsFunction();

    return <div className={'center'}>
        <h2>PREVIEW</h2>
        <img className={'preview_image ' + (hide ? 'scale_out' : '')}
             alt={'previewImage'} src={image}/>
        <div className={'download_button'} onClick={downloadImageClicked}>DOWNLOAD
        </div>
        <a className={'footer_small_link'} href={'https://www.visualead.com/'}
           target={'_blank'}>Powered by Visualead</a>
    </div>;
});