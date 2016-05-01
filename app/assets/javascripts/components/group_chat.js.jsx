var GroupChat = React.createClass({
    propTypes: {
        current_user: React.PropTypes.object,
        all_users: React.PropTypes.array,
        groupChat: React.PropTypes.object,
        toggleMessage: React.PropTypes.func,
        closeMessage: React.PropTypes.func,
        messages: React.PropTypes.array,
        addToChat: React.PropTypes.func
    },

    getInitialState: function() {
        return {
            messages: this.props.messages,
            messageContent: "",

            selectedUser: null,
            searchContent: "",
            searchedUsers: [],
            groupChatUsers: this.props.groupChat.users
        };
    },

    componentDidMount: function() {
        $("#messages").children().hide();
        $("#conversation").children().hide();
        $("#messageList").scrollTop(99999);
    },

    render: function() {
        return (
            <div className={"room_channel_group_" + this.props.groupChat.id} id="groupChat">
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
                <div id="listUsersBox">
                    {this.groupChatUsers()}
                </div>
                <div id="messageHeader" onClick={this.props.toggleMessage}>
                    <b onClick={this.clickHeader}>{this.props.groupChat.id}</b>
                    <a href="#" id="listUsers" onClick={this.listUsers}>Show Users</a>
                    <a href="#" onClick={this.props.closeMessage.bind(null, "room_channel_group_" + this.props.groupChat.id)} id="messageClose">&#215;</a>
                    <br />
                    <a href="#" id="addToChat" onClick={this.addToChat}>Invite to Chat</a>
                </div>
                <div className={"room_channel_group_" + this.props.groupChat.id} id="messageList">
                    {this.messages()}
                </div>
                <div id="messageForm">
                    <form>
                        <input id="message" type="text" className={"room_channel_group_" + this.props.groupChat.id} onChange={this.updateMessageContent} onKeyDown={this.handleSend} data-behavior="room_speaker" value={this.state.messageContent}/>
                        <input id="room" type="hidden" data-behavior="room_speaker" value={"group_" + this.props.groupChat.id}/>

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

    clickHeader: function(e) {
        $(e.target).parent().click();
    },

    messages: function() {
        var messages = [];
        var _this = this;
        this.props.messages.forEach(function(message) {
            var message_class;
            if (_this.props.current_user.id == message.author) {
                message_class = "to";
            } else if (message.author == -1) {
                message_class = "system";
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
            var room = "group_" +  _this.props.groupChat.id;
            App.room.speak(room, _this.state.messageContent);
            _this.setState({messageContent: ""});
            $("input.room_channel_group_" + _this.props.groupChat.id).prop("disabled", true);
            event.preventDefault();
        }
    },

    getOnlineStatus: function(online) {
        var status = online
                   ? "online"
                   : "offline";
        return (<span id="onlineStatus" className={status}></span>);
    },

    addToChat: function(e) {
        e.stopPropagation();
        $(".room_channel_group_" + this.props.groupChat.id + " > #addToChatBox").toggle();
    },

    clickHeader: function(e) {
        $(e.target).parent().click();
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
        $(".room_channel_group_" + this.props.groupChat.id + " > #addToChatBox").hide();
    },

    userResults: function(e) {
        var searchedUsers = [];
        var _this = this;
        var alreadyInChat = false;
        this.setState({searchContent: e.target.value});
        this.props.all_users.forEach(function(user){
            if (e.target.value != "" && user.email.indexOf(e.target.value) != -1 && user.id != _this.props.current_user.id) {
                _this.props.groupChat.users.forEach(function(gc_user, index) {
                    if (gc_user.id == user.id) {
                        alreadyInChat = true;
                    }
                });
                if (!alreadyInChat) {
                    searchedUsers.push(<UserSearchResult user={user} setUser={_this.setUser} />);
                }
            }
            alreadyInChat = false;
        });
        this.setState({searchedUsers: searchedUsers});
    },

    setUser: function(u) {
        var groupChatUsers = this.state.groupChatUsers;
        groupChatUsers.push(u);
        this.setState({groupChatUsers: groupChatUsers});
        this.setState({searchContent: "", selectedUser: u});
        $.ajax({
            method: "POST",
            url: "/users/add_to_group_chat/" + this.props.groupChat.id + "/" + u.id
        });
        this.closeNewMessage();
    },

    listUsers: function(e) {
        e.stopPropagation();
        $(".room_channel_group_" + this.props.groupChat.id + " > #listUsersBox").toggle();
    },

    groupChatUsers: function() {
        var usersList = [];
        var _this = this;
        this.state.groupChatUsers.forEach(function(user, index) {
            usersList.push(
                <div key={user.id} id="friend">{_this.getOnlineStatus(user.online)} <div id="userName"> {user.email} </div> </div>
            );
        });
        return usersList;
    },

    getOnlineStatus: function(online) {
        var status = online
                   ? "online"
                   : "offline";
        return (<span id="onlineStatus" className={status}></span>);
    },


});
