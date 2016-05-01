var NewMessage = React.createClass({
    propTypes: {
        current_user: React.PropTypes.object,
        all_users: React.PropTypes.array,
        createIndividualMessage: React.PropTypes.func,
    },

    getInitialState: function() {
        return {
            selectedUser: null,
            messageContent: "",
            searchContent: "",
            searchedUsers: []
        };
    },

    componentDidMount: function() {
        $("#messages > #newMessageBox > #messageForm > form > input").prop("disabled", true);
        $("#newMessageBox").hide();
    },

    render: function() {
        return (
            <div id="newMessageBox">
                <div id="messageHeader">
                    <b>New Message</b>
                    <a href="#" onClick={this.closeNewMessage} id="messageClose">&#215;</a>
                </div>
                <div id="searchUser">
                    <form autocomplete="off">
                        <label for="searchUser">To: </label>
                        <input name="searchUser" id="search" type="text" onChange={this.userResults} value={this.state.searchContent}/>
                    </form>
                </div>
                <div id="searchResults">
                    {this.state.searchedUsers}
                    <div id="sendingPrompt">
                        {this.sendingPrompt()}
                    </div>
                </div>
                <div id="messageForm">
                    <form autocomplete="off">
                        <input id="message" type="text" onChange={this.updateMessageContent} onKeyDown={this.handleSend} data-behavior="room_speaker" value={this.state.messageContent}/>
                    </form>
                </div>
            </div>
        );
    },

    // Non-React Methods

    clickHeader: function(e) {
        $(e.target).parent().click();
    },

    updateMessageContent: function(e) {
        this.setState({messageContent: e.target.value});
    },

    handleSend: function(event) {
        var _this = this;
        if (event.keyCode == 13 && _this.state.selectedUser != null) { // Enter key
            var room = "" + _this.state.selectedUser.id;
            App.room.speak(room, _this.state.messageContent);
            _this.setState({messageContent: ""});
            $("input.room_channel_" + _this.state.selectedUser.id).prop("disabled", true);
            event.preventDefault();
            this.props.createIndividualMessage(_this.state.selectedUser);
            this.closeNewMessage();
        }
    },

    closeNewMessage: function() {
        this.setState({
            selectedUser: null,
            messageContent: "",
            searchContent: "",
            searchedUsers: []
        });
        $("#messages > #newMessageBox > #messageForm > form > input").prop("disabled", true);
        $("#messages > #newMessageBox").hide();
    },

    userResults: function(e) {
        var searchedUsers = [];
        var _this = this;
        this.setState({searchContent: e.target.value});
        this.props.all_users.forEach(function(user){
            if (e.target.value != "" && user.email.indexOf(e.target.value) != -1 && user.id != _this.props.current_user.id) {
                searchedUsers.push(<UserSearchResult user={user} setUser={_this.setUser} />);
            }
        });
        this.setState({searchedUsers: searchedUsers});
    },

    setUser: function(u) {
        this.setState({selectedUser: u});
        $("#messages > #newMessageBox > #messageForm > form > input").prop("disabled", false);
    },

    sendingPrompt: function() {
        if (this.state.selectedUser) {
            return "To: " + this.state.selectedUser.email;
        } else {
            return "";
        }
    }
});
