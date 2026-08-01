'use client';
import React from 'react';
import { useTranslations } from 'next-intl';
import { useSiteData } from '@/data/SiteDataProvider';
import styles from './Terminal.module.css';
import TerminalSnake from './TerminalSnake';

const NEOFETCH_ART = `        .:'
    __ :'__
 .'\`__\`-'__\`\`.
:__________.-'
:_________:
 :_________\`-;
  \`.__.-.__.'`;

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
          { type: 'text', text: this.props.t('errorNotFound', { cmd: trimmed }) },
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

  whoAmI = () => {
    const { t, cv } = this.props;
    return {
      type: 'text',
      text: [
        `${t('whoamiName')}: ${cv.profile.name}`,
        `${t('whoamiJob')}: ${t('whoamiJobValue')}`,
        `${t('whoamiEducation')}: ${t('whoamiEducationValue')}`,
      ].join('\n'),
    };
  };

  // La liste reprend les noms réels de l'arborescence, donc déjà localisés.
  listDirectory = () => {
    const { fs } = this.props;
    const projectsFolder = fs.FILE_TREE.children[2];
    return {
      type: 'text',
      text: [
        fs.FILES.cvPdf.name,
        `${projectsFolder.name}/`,
        fs.FILES.todo.name,
        fs.FILES.about.name,
      ].join('   '),
    };
  };

  showHelp = () => ({ type: 'text', text: this.props.t('help') });

  aboutMe = () => ({ type: 'text', text: this.props.t('about') });

  easterEgg = () => ({ type: 'text', text: this.props.t('easterEgg') });
  contactMe = () => ({ type: 'text', text: this.props.t('contact') });
  linkedin = () => ({ type: 'text', text: 'https://www.linkedin.com/in/maxence-leroux123/' });
  maxadev = () => ({ type: 'text', text: this.props.t('maxadev') });
  neofetch = () => ({ type: 'neofetch' });

  clear = () => {
    this.setState({ output: [], command: '' });
    return null;
  };

  startSnake = () => {
    this.setState({ snakeMode: true });
    return { type: 'text', text: this.props.t('snakeStart') };
  };

  handleSnakeExit = (score, quit) => {
    this.setState((prev) => ({
      snakeMode: false,
      output: [
        ...prev.output,
        {
          type: 'text',
          text: quit
            ? this.props.t('snakeQuit', { score })
            : this.props.t('snakeGameOver', { score }),
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

  // Étiquettes façon neofetch (non traduites), valeurs issues du catalogue.
  neofetchInfo = () => {
    const { t, fs } = this.props;
    return [
      ['OS', t('neofetchOs')],
      ['Host', fs.FILE_TREE.name],
      ['Kernel', t('neofetchKernel')],
      ['Uptime', t('neofetchUptime')],
      ['Shell', t('neofetchShell')],
      ['CPU', t('neofetchCpu')],
      ['GPU', 'Kubernetes (AKS) · Docker'],
      ['Memory', 'C# · Python · JS/TS · SQL'],
      ['Contact', 'contact@maxenceleroux.fr'],
    ];
  };

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
            {this.neofetchInfo().map(([key, value]) => (
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
              aria-label={this.props.t('ariaCommandLine')}
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

// Le composant historique est une classe : l'i18n et les données localisées
// lui sont injectées par ce wrapper, seul endroit où les hooks sont permis.
const TerminalApp = (props) => {
  const t = useTranslations('terminal');
  const { cv, fs } = useSiteData();
  return <Terminal {...props} t={t} cv={cv} fs={fs} />;
};

export default TerminalApp;
