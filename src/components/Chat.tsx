import { Component, ChangeEvent } from "react";
import { w3cwebsocket as W3CWebSocket, IMessageEvent } from "websocket";
import { Card, Avatar, Input, Typography } from "antd";

const { Search } = Input;
const { Text } = Typography;
const { Meta } = Card;

const client = new W3CWebSocket("ws://localhost:8001");

interface Message {
  msg: string;
  user: string;
}

interface DataFromServer {
  type: string;
  msg: string;
  user: string;
}

interface ChatState {
  userName: string;
  isLoggedIn: boolean;
  messages: Message[];
  searchVal: string;
}

export default class Chat extends Component<{}, ChatState> {
  state: ChatState = {
    userName: "",
    isLoggedIn: false,
    messages: [],
    searchVal: "",
  };

  onButtonClicked = (value: string): void => {
    client.send(
      JSON.stringify({
        type: "message",
        msg: value,
        user: this.state.userName,
      })
    );
    this.setState({ searchVal: "" });
  };

  componentDidMount(): void {
    client.onopen = (): void => {
      console.log("WebSocket Client Connected");
    };

    client.onmessage = (message: IMessageEvent): void => {
      const dataFromServer: DataFromServer = JSON.parse(
        message.data.toString()
      );
      console.log("got reply! ", dataFromServer);
      if (dataFromServer.type === "message") {
        this.setState((prevState) => ({
          messages: [
            ...prevState.messages,
            {
              msg: dataFromServer.msg,
              user: dataFromServer.user,
            },
          ],
        }));
      }
    };
  }

  handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ searchVal: e.target.value });
  };

  handleSearchSubmit = (value: string): void => {
    this.onButtonClicked(value);
  };

  handleLoginSubmit = (value: string): void => {
    this.setState({ isLoggedIn: true, userName: value });
  };

  render() {
    return (
      <div className="main" id="wrapper">
        {this.state.isLoggedIn ? (
          <div>
            <div className="title">
              <Text
                id="main-heading"
                type="secondary"
                style={{ fontSize: "36px" }}
              >
                Websocket Chat: {this.state.userName}
              </Text>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                paddingBottom: 50,
              }}
              id="messages"
            >
              {this.state.messages.map((message) => (
                <Card
                  key={message.msg}
                  style={{
                    width: 300,
                    margin: "16px 4px 0 4px",
                    alignSelf:
                      this.state.userName === message.user
                        ? "flex-end"
                        : "flex-start",
                  }}
                  loading={false}
                >
                  <Meta
                    avatar={
                      <Avatar
                        style={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
                      >
                        {message.user[0].toUpperCase()}
                      </Avatar>
                    }
                    title={message.user + ":"}
                    description={message.msg}
                  />
                </Card>
              ))}
            </div>
            <div className="bottom">
              <Search
                placeholder="input message and send"
                enterButton="Send"
                value={this.state.searchVal}
                size="large"
                onChange={this.handleSearchChange}
                onSearch={this.handleSearchSubmit}
              />
            </div>
          </div>
        ) : (
          <div style={{ padding: "200px 40px" }}>
            <Search
              placeholder="Enter Username"
              enterButton="Login"
              size="large"
              onSearch={this.handleLoginSubmit}
            />
          </div>
        )}
      </div>
    );
  }
}
