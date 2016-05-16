var IndividualMessage = React.createClass({
    propTypes: {
        current_user: React.PropTypes.object,
        all_users: React.PropTypes.array,
        user: React.PropTypes.object,
        toggleMessage: React.PropTypes.func,
        closeMessage: React.PropTypes.func,
        messages: React.PropTypes.array,
    },

    getInitialState: function() {
        return {
            messages: this.props.messages,
            messageContent: "",

            selectedUser: null,
            searchContent: "",
            searchedUsers: []
        };
    },

    componentDidMount: function() {
        $("#individualMessage").hide();
        $("#conversation").children().hide();
    },

    render: function() {
        return (
            <div className={"room_channel_" + this.props.user.id} id="individualMessage">
                <div id="addToChatBox">
                    <div id="messageHeader">
                        <b>Invite User to Chat</b>
                        <a href="#" onClick={this.closeNewMessage} id="messageClose">&#215;</a>
                    </div>
                    <div id="searchUser">
                        <form autocomplete="off">
                            <label for="searchUser">Invite: </label>
                            <input name="searchUser" id="search" type="text" onChange={this.userResults} value={this.state.searchContent}/>
                        </form>
                    </div>
                    <div id="gcSearchResults">
                        {this.state.searchedUsers}
                    </div>
                </div>
                <div id="messageHeader" onClick={this.props.toggleMessage}>
                    {this.getOnlineStatus(this.props.user.online)}
                    <b>{this.props.user.email}</b>
                    <a href="#" onClick={this.props.closeMessage.bind(null, "room_channel_" + this.props.user.id)} id="messageClose">&#215;</a>
                    <br />
                    <a href="#" id="addToChat" onClick={this.addToChat}>Invite to Chat</a>
                </div>
                <div className={"room_channel_" + this.props.user.id} id="messageList">
                    {this.messages()}
                </div>
                <div id="messageForm">
                    <form>
                        <input id="message" type="text" className={"room_channel_" + this.props.user.id} onChange={this.updateMessageContent} onKeyDown={this.handleSend} data-behavior="room_speaker" value={this.state.messageContent}/>
                        <input id="room" type="hidden" data-behavior="room_speaker" value={this.props.user.id}/>
                    </form>
                </div>
            </div>
        );
    },

    // Non-React Methods

    getOnlineStatus: function(online) {
        var status = online
                   ? "Online"
                   : "Offline";
        return status;
    },

    messages: function() {

        var messages = [];
        var _this = this;
        this.props.messages.forEach(function(message) {
            var message_class;
            if (_this.props.current_user.id == message.author) {
                message_class = "to";
            } else {
                message_class = "from";
            }
            messages.push(<Message message_class={message_class} author={message.author} content={message.content} />);
        });
        return messages;
    },

    updateMessageContent: function(e) {
        this.setState({messageContent: e.target.value});
    },

    handleSend: function(event) {
        var _this = this;
        if (event.keyCode == 13) { // Enter key
            var room = "" +  _this.props.user.id;
            App.room.speak(room, _this.state.messageContent);
            _this.setState({messageContent: ""});
            $("input.room_channel_" + _this.props.user.id).prop("disabled", true);
            event.preventDefault();
        }
    },

    getOnlineStatus: function(online) {
        var status = online
                   ? "online"
                   : "offline";
        return (<span id="onlineStatus" className={status}></span>);
    },

    updateMessageContent: function(e) {
        this.setState({messageContent: e.target.value});
    },

    closeNewMessage: function() {
        this.setState({
            selectedUser: null,
            messageContent: "",
            searchContent: "",
            searchedUsers: []
        });
        $(".room_channel_" + this.props.user.id + " > #addToChatBox").hide();
    },

    userResults: function(e) {
        var searchedUsers = [];
        var _this = this;
        this.setState({searchContent: e.target.value});
        this.props.all_users.forEach(function(user){
            if (e.target.value != "" && user.email.indexOf(e.target.value) != -1 && user.id != _this.props.current_user.id && user.id != _this.props.user.id) {
                searchedUsers.push(<UserSearchResult onClick={this.sendChatInvite} user={user} setUser={_this.setUser} />);
            }
        });
        this.setState({searchedUsers: searchedUsers});
    },

    setUser: function(u) {
        this.setState({searchContent: "", selectedUser: u});
        $.ajax({
            method: "POST",
            url: "/users/create_group_chat/" + this.props.user.id + "/" + u.id
        });
        this.closeNewMessage();
    },

    sendingPrompt: function() {
        if (this.state.selectedUser) {
            return "To: " + this.state.selectedUser.email;
        } else {
            return "";
        }
    },

    addToChat: function(e) {
        e.stopPropagation();
        $(".room_channel_" + this.props.user.id + " > #addToChatBox").toggle();
    },

});
