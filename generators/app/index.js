'use strict';

const Generator = require('yeoman-generator');
const _ = require('lodash');

const hiddenConfigFiles = ['editorconfig', 'gitignore', 'npmignore'];

const configFiles = ['tsconfig.json'];

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
        default: 'http://registry.npmjs.org/'
      },
      {
        type: 'input',
        name: 'repoUrl',
        message: 'What is the repository URL?'
      },
      {
        type: 'input',
        name: 'license',
        message: 'License?',
        default: 'MIT'
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = props;
      this.props.moduleName = _.camelCase(this.props.moduleName);
      this.props.moduleName = _.upperFirst(this.props.moduleName);
      this.props.path = _.kebabCase(this.props.moduleName);
    });
  }

  writing() {
    // Static files
    hiddenConfigFiles.forEach(file => {
      this.fs.copy(
        this.templatePath(`${file}.template`),
        this.destinationPath(`.${file}`)
      );
    });

    configFiles.forEach(file => {
      this.fs.copy(
        this.templatePath(`${file}.template`),
        this.destinationPath(`${file}`)
      );
    });

    // Dynamic templates
    this.fs.copyTpl(
      this.templatePath('README.md.template'),
      this.destinationPath('README.md'),
      {
        moduleName: this.props.moduleName,
        description: this.props.description
      }
    );

    this.fs.copyTpl(
      this.templatePath('./src/index.ts.template'),
      this.destinationPath('./src/index.ts'),
      {
        moduleName: this.props.moduleName,
        path: this.props.path
      }
    );

    this.fs.copyTpl(
      this.templatePath('./src/foo-module/foo.module.ts.template'),
      this.destinationPath(`./src/${this.props.path}/${this.props.path}.module.ts`),
      {
        moduleName: this.props.moduleName,
        path: this.props.path
      }
    );

    this.fs.copyTpl(
      this.templatePath('./src/foo-module/foo-components/foo.component.ts.template'),
      this.destinationPath(
        `./src/${this.props.path}/components/${this.props.path}.component.ts`
      ),
      {
        moduleName: this.props.moduleName,
        path: this.props.path
      }
    );

    this.fs.copyTpl(
      this.templatePath('package.json.template'),
      this.destinationPath(`package.json`),
      {
        moduleName: this.props.moduleName,
        path: this.props.path,
        description: this.props.description,
        npmRegistryUrl: this.props.npmRegistryUrl,
        repoUrl: this.props.repoUrl,
        developerName: this.props.developerName,
        license: this.props.license
      }
    );
  }

  install() {
    this.npmInstall();
  }
};
