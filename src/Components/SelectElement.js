import React, {forwardRef, useState, useImperativeHandle, useEffect, useRef} from "react";
import './SelectElement.css';
import {isEmpty, head} from 'lodash'

export default forwardRef((props, ref) => {

    const [selectedItem, setSelectedItem] = useState();
    const [items, setItems] = useState();
    const [showItems, setShowItems] = useState();
    const textElementRef = useRef();

    useImperativeHandle(ref, () => ({
        updateSelectItems(items, update) {
            setItems(items)
        },
        clearSelectionText() {
            setSelectedItem();
        }
    }));

    useEffect(() => {
        setShowItems(false);
        selectedItem && props.onItemSelected && props.onItemSelected(selectedItem);
    }, [selectedItem])

    const onItemSelect = (e) => {
        setSelectedItem(items.filter((item) => item.name === e.target.textContent));
    };

    const showItemsSelect = () => setShowItems(!showItems);
    const getColor = () => 'button_color_' + (props.color ? props.color : 'red');
    const getItemColor = () => 'item_color_' + (props.color ? props.color : 'red');
    const getVisibility = () => 'select_div_' + (showItems ? 'visible' : 'hidden');
    const getElementText = () => !isEmpty(selectedItem) ? head(selectedItem).name : 'Select ' + (props.text ? props.text : '');

    return <div>
        <div className={'button ' + getColor()}
             onClick={!isEmpty(items) ? showItemsSelect : () => {
             }}>
            <span ref={textElementRef}>{getElementText()}</span>
        </div>
        <div className={'select_div ' + getVisibility()}>
            {!isEmpty(items) && items.map((item) =>
                <div key={item.id}
                     className={'select_item ' + getItemColor()}
                     onClick={onItemSelect}>
                    {item.name}
                </div>)}
        </div>
    </div>;
})