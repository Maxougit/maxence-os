'use strict';
import React from 'react';
import styles from './Terminal.module.css';
import TerminalSnake from './TerminalSnake';

class Terminal extends React.Component {
  constructor(props) {
    super(props);

    const initialWhoAmIOutput = this.getInitialWhoAmIOutput();

    this.state = {
      command: '',
      output: initialWhoAmIOutput,
      snakeMode: false,
    };

    this.commands = {
      whoami: this.whoAmI,
      ls: this.listDirectory,
      help: this.showHelp,
      about: this.aboutMe,
      easter_egg: this.easterEgg,
      contact: this.contactMe,
      linkedin: this.linkedin,
      maxadev: this.maxadev,
      snake: this.startSnake,
    };
  }

  getInitialWhoAmIOutput = () => {
    return [`maxence@maxOS:~$ whoami`, this.whoAmI()];
  };

  executeCommand = (command) => {
    const execute = this.commands[command.toLowerCase()];

    if (!execute) {
      this.setState((prevState) => ({
        output: [
          ...prevState.output,
          `maxence@maxOS:~$ ${command}`,
          "Command not found. Try 'help' for more information.",
        ],
        command: '',
      }));
      return;
    }

    let result = execute.call(this);

    this.setState((prevState) => ({
      output: [...prevState.output, `maxence@maxOS:~$ ${command}`, result],
      command: '',
    }));
  };

  whoAmI = () =>
    'Name: Maxence Leroux\nJob: Ingénieur informatique freelance — Maxadev\nFormation: Diplôme d\'ingénieur CESI (2025)';
  listDirectory = () => 'file1.txt  file2.txt  folder1  folder2';
  showHelp = () =>
    'Commands: whoami, ls, help, about, easter_egg, contact, linkedin, maxadev, snake';
  aboutMe = () =>
    "I am Maxence, a software engineer specialized in GenAI, microservices architecture and DevOps. Currently LeadDev AI & DevOps at ArcelorMittal, freelancing via Maxadev.";
  easterEgg = () => 'You found an easter egg! 🥚';
  contactMe = () => 'You can contact me at contact@maxenceleroux.fr';
  linkedin = () => 'https://www.linkedin.com/in/maxence-leroux123/';
  maxadev = () => 'Freelance & consulting: https://maxadev.fr';

  startSnake = () => {
    this.setState({ snakeMode: true });
    return 'Lancement de snake... Flèches ou ZQSD pour se déplacer, Échap pour quitter.';
  };

  handleSnakeExit = (score, quit) => {
    this.setState((prevState) => ({
      snakeMode: false,
      output: [
        ...prevState.output,
        quit
          ? `Partie quittée — score : ${score}`
          : `Game over ! Score final : ${score}`,
      ],
    }));
  };

  handleCommandChange = (event) => {
    this.setState({ command: event.target.value });
  };

  handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      this.executeCommand(this.state.command);
    }
  };

  render() {
    const { command, output, snakeMode } = this.state;

    return (
      <div className={styles.terminal}>
        {/* Comme un vrai terminal : le jeu prend tout l'écran, l'historique revient en quittant */}
        {!snakeMode && (
          <div className={styles.output}>
            {output.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        )}
        {snakeMode ? (
          <TerminalSnake onExit={this.handleSnakeExit} />
        ) : (
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
        )}
      </div>
    );
  }
}

export default Terminal;
