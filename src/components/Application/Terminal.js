import React from 'react';
import styles from './Terminal.module.css';

class Terminal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            command: '',
            output: [
                "maxence@maxOS:~$ who-am-i",
                "Name: Maxence ",
                "Age: 21",
                "Job: Student at CESI engineer school https://www.cesi.fr/",
            ],
        };
    }

    handleCommandChange = (event) => {
        this.setState({ command: event.target.value });
    };

    handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            this.executeCommand();
        }
    };

    executeCommand = () => {
        const { command, output } = this.state;
        let result = '';
        switch (command.toLowerCase()) {
            case 'ls':
                result = 'file1.txt  file2.txt  folder1  folder2';
                break;
            case 'pwd':
                result = '/home/user';
                break;
            case 'help':
                result = 'ls, pwd, help';
                break;
            default:
                result = 'Command not found try help for more information';
        }
        this.setState({ output: [...output, `maxence@maxOS:~$ ${command}`, result], command: '' });
    };

    render() {
        const { command, output } = this.state;

        return (
            <div className={styles.terminal}>
                <div className={styles.output}>
                    {output.map((line, index) => (
                        <pre key={index}>
                            {/* Traite les lignes spécifiques et applique le style aux mots clés */}
                            <span>
                                {line.split(' ').map((word, wordIndex) => {
                                    if (['Name:', 'Age:', 'Job:'].includes(word)) {
                                        // Si le mot est un mot clé, applique la classe keyword
                                        return <span key={wordIndex} className={styles.keyword}>{word} </span>;
                                    } else if (word.startsWith('http')) {
                                        // Si le mot est un lien, applique la classe linkText et ouvre dans un nouvel onglet
                                        return <a href={word} key={wordIndex} className={styles.linkText} target="_blank">{word} </a>;
                                    } else {
                                        // Sinon, retourne le mot sans style supplémentaire
                                        return word + ' ';
                                    }
                                })}
                            </span>
                        </pre>
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
                        autoFocus // Automatically focus this input
                    />
                </div>  
            </div>
        );
    }
}

export default Terminal;
