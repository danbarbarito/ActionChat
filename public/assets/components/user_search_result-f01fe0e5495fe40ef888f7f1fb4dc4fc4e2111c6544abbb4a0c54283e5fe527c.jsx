var UserSearchResult = React.createClass({
    propTypes: {
        user: React.PropTypes.object,
        setUser: React.PropTypes.func
    },

    getInitialState: function() {
        return {
        };
    },

    componentDidMount: function() {
    },

    render: function() {
        return (
            <div id="userResult">
                <a onClick={this.props.setUser.bind(null, this.props.user)}>{this.props.user.email}</a>
            </div>
        );
    },

    // Non-React Methods



});
