var Message = React.createClass({
    propTypes: {
        message_class: React.PropTypes.string,
        author: React.PropTypes.number,
        content: React.PropTypes.string
    },

    render: function() {
        return (
            <div className={this.props.message_class} id="message">
                {this.content()}
            </div>
        );
    },

    // Non-React function

    getMessageClass: function() {
        var authorIsCurrentUser;
        if (this.props.current_user.id == this.props.author) {
            authorIsCurrentUser = true;
        } else {
            authorIsCurrentUser = false;
        }
        if (authorIsCurrentUser) {
            return "you";
        } else {
            return "them";
        }
    },

    content: function() {
        if (this.props.author == -1) {
            if (this.props.content == "create") {
                return "Group Chat Created";
            }
            if (this.props.content == "add") {
                return "User Has Joined the Chat";
            }
        } else {
            return this.props.content;
        }
    }
});
