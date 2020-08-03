import React, {forwardRef, useState, useImperativeHandle} from "react";
import './InputElement.css';

export default forwardRef((props, ref) => {

    const [url, setURL] = useState('');

    useImperativeHandle(ref, () => ({
        setInputURL(url) {
            setURL(url);
        },
        getURL() {
            return url;
        }
    }));


    const inputValueChanged = (e) => setURL(e.target.value);

    return <div className={'container'}>
        <h2>URL</h2>
        <input className={'url_input'} type={'text'} value={url}
               onChange={inputValueChanged}/>
        <div className={'generate_button'} onClick={props.generateClicked}>Generate
        </div>
    </div>;
});