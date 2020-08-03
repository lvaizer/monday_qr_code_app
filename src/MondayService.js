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
        // return new Promise((resolve) => {
        //     const offlineData = '{ "data": { "me": { "id": 15188322, "account": { "id": 6665008, "name": "QRStuff" }, "name": "Liron Vaizer", "email": "lvaizer@gmail.com", "url": "https://qrstuff.monday.com/users/15188322", "title": "Full Stack Developer", "birthday": "1987-12-22", "country_code": "IL", "created_at": "2020-07-26T06:11:50Z", "location": "Sdei Hemed", "mobile_phone": "0545544814", "phone": "", "photo_small": "https://files.monday.com/photos/15188322/small/15188322-data?1595743910" }, "boards": [ { "id": "653539584", "name": "Monday App Challenge" }, { "id": "655705533", "name": "Design Projects Overview" }, { "id": "667636528", "name": "Vaizer_board" } ] }, "account_id": 6665008 }';
        //     resolve(JSON.parse(offlineData))
        // });
    }

    /**
     * Get the board groups, views and items from Monday
     * @param boardId
     * @type {Promise<>}
     */
    this.getBoardData = (boardId) => {
        return sendQuery('boards(ids:' + boardId + ') { id name items(limit:10000){ id name group { id title } } views { id name } groups { id title } }');
        // return new Promise((resolve) => {
        //     const offlineData = '{ "data": { "boards": [ { "id": "655705533", "name": "Design Projects Overview", "items": [ { "id": "655705542", "name": "Project 1", "group": { "id": "topics" } }, { "id": "655705545", "name": "Project 2", "group": { "id": "topics" } }, { "id": "655705548", "name": "Project 3", "group": { "id": "topics" } }, { "id": "655705551", "name": "Project 4", "group": { "id": "next_month" } }, { "id": "655705553", "name": "Project 5", "group": { "id": "next_month" } }, { "id": "655705555", "name": "Project 6", "group": { "id": "upcoming_projects" } } ], "views": [], "groups": [ { "id": "topics", "title": "This Month" }, { "id": "next_month", "title": "Next Month" }, { "id": "upcoming_projects", "title": "Upcoming projects" } ] } ] }, "account_id": 6665008 }';
        //     resolve(JSON.parse(offlineData))
        // });
    }

}

export default new MondayService();
