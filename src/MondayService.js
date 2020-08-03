import mondaySdk from "monday-sdk-js";

const monday = mondaySdk();

function MondayService() {
    /**
     * Execute query Using Monday SDK
     * @param query
     * @return {Promise<>}
     */
    const sendQuery = (query) => new Promise((resolve, reject) => {
        monday.api('query { ' + query + ' }')
            .then((res) => resolve(res))
            .catch((err) => reject());
    });

    /**
     * Get the users data and boards from Monday
     * @type {Promise<>}
     */
    this.getUserDataAndBoards = () => {
        return sendQuery('me { id account{ id name } name email url title birthday country_code created_at email location mobile_phone phone photo_small} boards(limit:10000) { id name}');
    }

    /**
     * Get the board groups, views and items from Monday
     * @param boardId
     * @type {Promise<>}
     */
    this.getBoardData = (boardId) => {
        return sendQuery('boards(ids:' + boardId + ') { id name items(limit:10000){ id name group { id title } } views { id name } groups { id title } }');
    }

}

export default new MondayService();
