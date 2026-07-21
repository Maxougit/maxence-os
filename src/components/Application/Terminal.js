'use strict';
import React from 'react';
import styles from './Terminal.module.css';
import TerminalSnake from './TerminalSnake';

const NEOFETCH_ART = `        .:'
    __ :'__
 .'\`__\`-'__\`\`.
:__________.-'
:_________:
 :_________\`-;
  \`.__.-.__.'`;

const NEOFETCH_INFO = [
  ['OS', 'Maxence OS 26.0 « Reims »'],
  ['Host', 'MacBook de Maxence'],
  ['Kernel', 'Ingénieur CESI (2025)'],
  ['Uptime', 'dev depuis 2019'],
  ['Shell', 'zsh (et un peu de café)'],
  ['CPU', 'GenAI · Micro-services · DevOps'],
  ['GPU', 'Kubernetes (AKS) · Docker'],
  ['Memory', 'C# · Python · JS/TS · SQL'],
  ['Contact', 'contact@maxenceleroux.fr'],
];

class Terminal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      command: '',
      output: [{ type: 'command', text: 'whoami' }, this.whoAmI()],
      snakeMode: false,
    };

    this.inputRef = React.createRef();

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
      neofetch: this.neofetch,
      clear: this.clear,
    };
  }

  executeCommand = (command) => {
    const trimmed = command.trim().toLowerCase();
    const execute = this.commands[trimmed];

    if (trimmed === '') {
      this.setState((prev) => ({
        output: [...prev.output, { type: 'command', text: '' }],
        command: '',
      }));
      return;
    }

    if (!execute) {
      this.setState((prev) => ({
        output: [
          ...prev.output,
          { type: 'command', text: command },
          { type: 'text', text: `zsh: command not found: ${trimmed} — essayez « help »` },
        ],
        command: '',
      }));
      return;
    }

    const result = execute.call(this);

    this.setState((prev) => ({
      output:
        result === null
          ? prev.output
          : [...prev.output, { type: 'command', text: command }, result],
      command: '',
    }));
  };

  whoAmI = () => ({
    type: 'text',
    text: "Name: Maxence Leroux\nJob: Ingénieur informatique freelance — Maxadev\nFormation: Diplôme d'ingénieur CESI (2025)",
  });

  listDirectory = () => ({
    type: 'text',
    text: 'CV_Leroux_Maxence.pdf   Projets/   Todo.txt   À propos de moi.txt',
  });

  showHelp = () => ({
    type: 'text',
    text: 'Commandes : whoami, ls, about, contact, linkedin, maxadev, neofetch, snake, clear, easter_egg',
  });

  aboutMe = () => ({
    type: 'text',
    text: 'I am Maxence, a software engineer specialized in GenAI, microservices architecture and DevOps. Currently LeadDev AI & DevOps at ArcelorMittal, freelancing via Maxadev.',
  });

  easterEgg = () => ({ type: 'text', text: 'You found an easter egg! 🥚 (essayez aussi « snake »)' });
  contactMe = () => ({ type: 'text', text: 'You can contact me at contact@maxenceleroux.fr' });
  linkedin = () => ({ type: 'text', text: 'https://www.linkedin.com/in/maxence-leroux123/' });
  maxadev = () => ({ type: 'text', text: 'Freelance & consulting: https://maxadev.fr' });
  neofetch = () => ({ type: 'neofetch' });

  clear = () => {
    this.setState({ output: [], command: '' });
    return null;
  };

  startSnake = () => {
    this.setState({ snakeMode: true });
    return {
      type: 'text',
      text: 'Lancement de snake... Flèches ou ZQSD pour se déplacer, Échap pour quitter.',
    };
  };

  handleSnakeExit = (score, quit) => {
    this.setState((prev) => ({
      snakeMode: false,
      output: [
        ...prev.output,
        {
          type: 'text',
          text: quit ? `Partie quittée — score : ${score}` : `Game over ! Score final : ${score}`,
        },
      ],
    }));
  };

  handleCommandChange = (event) => {
    this.setState({ command: event.target.value });
  };

  handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === 'Return' || event.keyCode === 13) {
      this.executeCommand(this.state.command);
    }
  };

  renderPrompt = () => (
    <span className={styles.prompt}>
      <span className={styles.promptUser}>maxence@maxence-os</span> <span className={styles.promptPath}>~</span> %
    </span>
  );

  renderLine = (line, index) => {
    if (line.type === 'command') {
      return (
        <p key={index}>
          {this.renderPrompt()} {line.text}
        </p>
      );
    }
    if (line.type === 'neofetch') {
      return (
        <div key={index} className={styles.neofetch}>
          <pre className={styles.neofetchArt}>{NEOFETCH_ART}</pre>
          <div className={styles.neofetchInfo}>
            {NEOFETCH_INFO.map(([key, value]) => (
              <p key={key}>
                <span className={styles.neofetchKey}>{key}</span> : {value}
              </p>
            ))}
          </div>
        </div>
      );
    }
    return <p key={index}>{line.text}</p>;
  };

  render() {
    const { command, output, snakeMode } = this.state;

    return (
      <div
        className={styles.terminal}
        onClick={() => this.inputRef.current?.focus()}
        role="presentation"
      >
        {/* Comme un vrai terminal : le jeu prend tout l'écran, l'historique revient en quittant */}
        {!snakeMode && (
          <div className={styles.output}>{output.map(this.renderLine)}</div>
        )}
        {snakeMode ? (
          <TerminalSnake onExit={this.handleSnakeExit} />
        ) : (
          <div className={styles.commandLine}>
            {this.renderPrompt()}
            <input
              ref={this.inputRef}
              type="text"
              value={command}
              onChange={this.handleCommandChange}
              onKeyDown={this.handleKeyDown}
              className={styles.commandInput}
              aria-label="Ligne de commande"
              autoFocus
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
            />
          </div>
        )}
      </div>
    );
  }
}

export default Terminal;
