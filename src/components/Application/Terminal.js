"use strict"
import React from "react";
import styles from "./Terminal.module.css";

class Terminal extends React.Component {
  constructor(props) {
    super(props);

    const initialWhoAmIOutput = this.getInitialWhoAmIOutput();

    this.state = {
      command: "",
      output: initialWhoAmIOutput,
    };

    this.commands = {
      'whoami': this.whoAmI,
      'ls': this.listDirectory,
      'help': this.showHelp,
      'about': this.aboutMe,
      'easter_egg': this.easterEgg,
    };

  }

  getInitialWhoAmIOutput = () => {
    return [`maxence@maxOS:~$ whoami`, this.whoAmI()];
  }

  executeCommand = (command) => {
    const execute = this.commands[command.toLowerCase()];

    if (!execute) {
      this.setState(prevState => ({
        output: [...prevState.output, `maxence@maxOS:~$ ${command}`, "Command not found. Try 'help' for more information."],
        command: "",
      }));
      return;
    }

    let result = execute.call(this);

    this.setState(prevState => ({
      output: [...prevState.output, `maxence@maxOS:~$ ${command}`, result],
      command: "",
    }));
  };


  whoAmI = () => "Name: Maxence\nAge: 22\nJob: Student at CESI engineer school";
  listDirectory = () => "file1.txt  file2.txt  folder1  folder2";
  showHelp = () => "Commands: whoami, ls, help, about, easter_egg";
  aboutMe = () => "I am Maxence, a software engineering student with a passion for AI and development.";
  easterEgg = () => "You found an easter egg! 🥚";

  handleCommandChange = (event) => {
    this.setState({ command: event.target.value });
  };

  handleKeyDown = (event) => {
    if (event.key === "Enter") {
      this.executeCommand(this.state.command);
    }
  };


  render() {
    const { command, output } = this.state;

    return (
      <div className={styles.terminal}>
        <div className={styles.output}>
          {output.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
        <div className={styles.commandLine}>
          <span className={styles.prompt}>maxence@maxOS:~$</span>
          <input
            type="text"
            value={command}
            onChange={this.handleCommandChange}
            onKeyDown={this.handleKeyDown}
            className={styles.commandInput}
            autoFocus
          />
        </div>
      </div>
    );
  }
}

export default Terminal;
