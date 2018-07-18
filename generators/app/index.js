'use strict';
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  prompting() {
    const prompts = [
      {
        type: 'input',
        name: 'moduleName',
        message: 'What is the modules name?'
      },
      {
        type: 'input',
        name: 'developerName',
        message: 'What is your name?'
      },
      {
        type: 'input',
        name: 'description',
        message: 'Description?'
      },
      {
        type: 'input',
        name: 'npmRegistryUrl',
        message: 'What is the NPM Registry URL?',
        default: 'registry.npmjs.org'
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
      this.log(this.props);
    });
  }

  writing() {
    // This.fs.copy(
    //   this.templatePath('dummyfile.txt'),
    //   this.destinationPath('dummyfile.txt')
    // );
    this.fs.copyTpl(
      this.templatePath('src/_index.ts'),
      this.destinationPath('src/index.ts'),
      { moduleName: this.props.moduleName }
    );
  }

  install() {
    // This.installDependencies();
  }
};
