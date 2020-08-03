import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import SelectElement from "./Components/SelectElement";
import MondayService from "./MondayService";
import {isEmpty, head} from 'lodash'
import {useAlert} from "react-alert";
import Input from './Components/InputElement';
import Image from './Components/ImageElement';

let userDataAndBoards, boards, boardSelected, viewSelected, groupSelected, itemSelected, qrcode_id;

function App() {
    //Alert message element
    const alert = useAlert();
    //show loading state
    const [showLoading, setShowLoading] = useState();
    //input element ref
    const inputRef = useRef();
    //image element ref
    const imageRef = useRef();
    //board button element ref
    const boardButtonRef = useRef();
    //view button element ref
    const viewButtonRef = useRef();
    //group button element ref
    const groupButtonRef = useRef();
    //item button element ref
    const itemButtonRef = useRef();

    useEffect(() => {
        //get the user and board data on app start
        getUserDataAndBoards();
    }, []);

    /**
     * Get The user data and boards and set them on the relevant targets
     */
    const getUserDataAndBoards = () => {
        //show loading
        setShowLoading(true);
        MondayService.getUserDataAndBoards().then((data) => {
            userDataAndBoards = data.data;
            if (userDataAndBoards && userDataAndBoards.boards) {
                //update the board button with the boards list
                isRefExist(boardButtonRef) && boardButtonRef.current.updateSelectItems(userDataAndBoards.boards, true);
                //update the views button with the views list
                isRefExist(viewButtonRef) && viewButtonRef.current.updateSelectItems(getViewsFromBoard());
            }
        }).catch(() => {
            console.error('err')
        }).finally(() => {
            //hide loading
            setShowLoading(false)
        });
    }

    /**
     * Get the board data by board id and set the data at the relevant targets
     * @param boardId
     */
    const getBoardData = (boardId) => {
        //show loading
        setShowLoading(true);
        MondayService.getBoardData(boardId).then((data) => {
            if (!data.data.boards) return;
            boards = data.data.boards;
            //fix the group names
            fixGroupsNames(boards);
            //update the view button with the views list
            isRefExist(viewButtonRef) && viewButtonRef.current.updateSelectItems(getViewsFromBoard());
            //update the group button with the groups list
            isRefExist(groupButtonRef) && groupButtonRef.current.updateSelectItems(getGroupsFromBoard());
        }).catch(() => {
            console.error('err')
        }).finally(() => {
            //hide loading
            setShowLoading(false);
        })
    }

    /**
     * Fix the groups names by setting the "name" param from "title"
     * @param board
     */
    const fixGroupsNames = (board) => !isEmpty(board) && head(board).groups && head(board).groups.forEach((group) => group.name = group.title);

    /**
     * Get the views list from the first selected board
     * @return {[views]}
     */
    const getViewsFromBoard = () => !isEmpty(boards) && head(boards).views ? head(boards).views : [];

    /**
     * Get the groups list from the first selected board
     * @return {[groups]}
     */
    const getGroupsFromBoard = () => !isEmpty(boards) && head(boards).groups ? head(boards).groups : [];

    /**
     * Get the items list by the selected group id
     * @return {boolean|[items]}
     */
    const getItemsBySelectedGroup = () => !isEmpty(groupSelected) && !isEmpty(boards) && head(boards).items && head(boards).items.filter((item) => item.group.id === head(groupSelected).id);

    /**
     * Clear the element items and clear his selected text
     * @param element
     */
    const clearElementTextAndItems = (element) => {
        setElementItems(element);
        clearElementText(element);
    }

    /**
     * Set items to element
     * @param element
     * @param items
     */
    const setElementItems = (element, items) => isRefExist(element) && element.current.updateSelectItems(items ? items : []);

    /**
     * Clear the element selected text
     * @param element
     */
    const clearElementText = (element) => isRefExist(element) && element.current.clearSelectionText();

    /**
     * On board selected the view,group and item elements will be cleared and start request the board data
     * @param i_boardSelected - board object in array ( [boardObject] )
     */
    const onBoardSelected = (i_boardSelected) => {
        //set the selected board
        boardSelected = i_boardSelected;
        //clear the old selected params
        viewSelected = null;
        itemSelected = null;
        //clear all the relevant elements
        clearElementTextAndItems(viewButtonRef);
        clearElementTextAndItems(groupButtonRef);
        clearElementTextAndItems(itemButtonRef);
        //clear the url input
        setInputURL();
        //get the selected board data
        !isEmpty(boardSelected) && getBoardData(head(boardSelected).id);
    };

    /**
     * On view selected the group and item elements will be cleared and update the url
     * @param i_viewSelected - view object in array ( [viewObject] )
     */
    const onViewSelected = (i_viewSelected) => {
        //set the selected view
        viewSelected = i_viewSelected;
        //clear the old selected params
        itemSelected = null;
        groupSelected = null;
        //clear all the relevant elements
        clearElementText(groupButtonRef);
        clearElementTextAndItems(itemButtonRef);
        //generate new url
        setInputURL();
    }

    /**
     * On group selected the view and item elements will be cleared and set up new items for item element
     * @param i_groupSelected - group object in array ( [groupObject] )
     */
    const onGroupSelected = (i_groupSelected) => {
        //set the selected group
        groupSelected = i_groupSelected;
        //clear the old selected params
        viewSelected = null;
        itemSelected = null;
        //clear all the relevant elements
        clearElementText(viewButtonRef);
        clearElementText(itemButtonRef);
        //set new items to the item element
        setElementItems(itemButtonRef, getItemsBySelectedGroup());
    }

    /**
     * On item selected update the url
     * @param i_itemSelected - item object in array ( [itemObject] )
     */
    const onItemSelected = (i_itemSelected) => {
        //set the selected item
        itemSelected = i_itemSelected;
        //generate new url
        setInputURL();
    }

    /**
     * Generate and set new URL into the input element
     */
    const setInputURL = () => !isEmpty(getSubDomain()) && isRefExist(inputRef) && inputRef.current.setInputURL(generateURL());

    /**
     * Check if the ref element is exist and contains current
     * @param refElement
     * @return boolean
     */
    const isRefExist = (refElement) => refElement && refElement.current;

    /**
     * Generate URL by the selected objects
     * @return {string}
     */
    const generateURL = () => getSubDomain() + 'boards/' + getSelectedBoardId() + getSelectedViewOrItemURL();

    /**
     * Get sub domain by the user data and return the full url
     * @return {string} - ('https://<account_name>.monday.com/')
     */
    const getSubDomain = () => {
        if (!userDataAndBoards || !userDataAndBoards.me || !userDataAndBoards.me.account || !userDataAndBoards.me.account.name) return '';
        return 'https://' + userDataAndBoards.me.account.name.toLowerCase() + '.monday.com/'
    }

    /**
     * Get the selected board id
     * @return string
     */
    const getSelectedBoardId = () => !isEmpty(boardSelected) && head(boardSelected).id ? head(boardSelected).id : '';

    /**
     * Get the selected view or item url by the selected object
     * @return string - ('/views/<view_id>' or '/pulses/<item_id>')
     */
    const getSelectedViewOrItemURL = () => !isEmpty(viewSelected) && head(viewSelected).id ? '/views/' + head(viewSelected).id : !isEmpty(itemSelected) && head(itemSelected).id ? '/pulses/' + head(itemSelected).id : ''

    /**
     * Get the URL prepare params and send request for QRCode
     */
    const generateClicked = () => {
        //get the URL
        let url = isRefExist(inputRef) && inputRef.current.getURL();
        if (isEmpty(url)) {
            alert.show("Please select Board / View / Item or input a URL");
            return;
        }
        //prepare params for request
        let data = {
            user: userDataAndBoards.me,
            target_url: url
        };
        //send request for QRCode
        sendQRCodeRequest(data);
    }

    /**
     * Send server request for QRCode and update the relevant views
     * @param data
     */
    const sendQRCodeRequest = (data) => {
        //show loading
        setShowLoading(true);
        const options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        };
        const server_URL = '';
        fetch(server_URL, options).then(response => response.json()).then((response) => {
            if (isRefExist(imageRef)) {
                //hide the image
                imageRef.current.hide(true);
                //update the image src with the response from the server
                imageRef.current.setImage('data:image/png;base64,' + response.data.image);
                qrcode_id = response.data.qrcode_id;
            }
            scrollToBottom();
            //whit till the hide animation ends
            setTimeout(() => {
                //show the image
                isRefExist(imageRef) && imageRef.current.hide(false);
            }, 300)
        }).catch((err) => {
            console.error(err)
        }).finally(() => {
            //hide loading
            setShowLoading(false);
        });
    }

    /**
     * Scroll the screen to bottom
     */
    const scrollToBottom = () => window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });

    /**
     * Start downloading the image
     */
    const downloadImage = () => {
        //show loading
        setShowLoading(true);
        fetch(isRefExist(imageRef).getImage())
            .then(response => {
                response.blob().then(blob => {
                    let element = document.createElement('a');
                    element.href = window.URL.createObjectURL(blob);
                    element.download = 'Visual_QR_Code_' + qrcode_id + '.png';
                    element.click();
                });
            }).finally(() => {
            //hide loading
            setShowLoading(false)
        });
    }

    return (
        <div className="App">
            {showLoading && <div className="loading_div">
                <div className="loader"/>
            </div>}
            <div className={'container'}>
                <div>
                    <div className={'container center-mobile'}><SelectElement
                        key='boardButton'
                        ref={boardButtonRef}
                        color='red'
                        text='Board'
                        onItemSelected={onBoardSelected}/>
                    </div>
                    <div className={'container center-mobile'}>
                        <div className='grey_box'>
                            <SelectElement
                                key='viewButton'
                                ref={viewButtonRef}
                                color='yellow'
                                text='View'
                                onItemSelected={onViewSelected}/>
                        </div>
                        <div className={'center'}>
                            <div className={'vl'}/>
                            <h3>OR</h3>
                            <div className={'vl'}/>
                        </div>
                        <div className='grey_box'>
                            <SelectElement
                                key='groupButton'
                                ref={groupButtonRef}
                                color='red'
                                text='Group'
                                onItemSelected={onGroupSelected}/>
                            <h3>AND</h3>
                            <SelectElement
                                key='itemButton'
                                ref={itemButtonRef}
                                color='green'
                                text='Item'
                                onItemSelected={onItemSelected}/>
                        </div>
                    </div>
                    <Input ref={inputRef} generateClicked={generateClicked}/>
                    <div><a className={'footer_link'} href={'https://www.visualead.com/'}
                            target={'_blank'}>Get more QR Code benefits</a></div>
                </div>
                <Image ref={imageRef} downloadImage={downloadImage}
                       generateImage={generateClicked}/>
            </div>
        </div>
    );
}

export default App;
