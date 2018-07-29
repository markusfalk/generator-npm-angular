'use strict';

const Generator = require('yeoman-generator');
const _ = require('lodash');
var mkdir = require('mkdirp');
var chalk = require('chalk');

const hiddenConfigFiles = ['editorconfig', 'gitignore', 'npmignore'];

const configFiles = ['tsconfig.json'];

module.exports = class extends Generator {
  prompting() {
    const questions = [
      {
        type: 'input',
        name: 'moduleName',
        message: `What is the module's name?`
      },

      {
        type: 'confirm',
        name: 'scope',
        message: 'Do you want to publish your package with a scope?',
        store: true
      },
      {
        type: 'input',
        name: 'scopeName',
        message: `What is the module's scope?`,
        store: true,
        when: answers => {
          return answers.scope;
        }
      },

      {
        type: 'input',
        name: 'developerName',
        message: 'What is your name?',
        store: true
      },
      {
        type: 'input',
        name: 'description',
        message: 'Description?'
      },

      {
        type: 'confirm',
        name: 'noneDefaultRegistry',
        message: 'Do you want to publish your package to your own registry?',
        store: true
      },
      {
        type: 'input',
        name: 'npmRegistryUrl',
        message: 'What is your npm registry URL?',
        default: 'http://registry.npmjs.org/',
        store: true,
        when: answers => {
          return answers.noneDefaultRegistry;
        }
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
        default: 'MIT',
        store: true
      }
    ];

    return this.prompt(questions).then(answers => {
      this.props = answers;
      this.props.moduleNameCamelCased = _.camelCase(this.props.moduleName);
      this.props.moduleName = this.props.moduleNameCamelCased;
      this.props.moduleName = _.upperFirst(this.props.moduleName);
      this.props.path = _.kebabCase(this.props.moduleName);
      this.props.scopeName = _.kebabCase(this.props.scopeName);
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

    // Module
    this.fs.copyTpl(
      this.templatePath('./src/foo-module/foo.module.ts.template'),
      this.destinationPath(`./src/${this.props.path}/${this.props.path}.module.ts`),
      {
        moduleName: this.props.moduleName,
        path: this.props.path
      }
    );

    this.fs.copyTpl(
      this.templatePath('./src/foo-module/foo.module.spec.ts.template'),
      this.destinationPath(`./src/${this.props.path}/${this.props.path}.module.spec.ts`),
      {
        moduleName: this.props.moduleName,
        moduleNameCamelCased: this.props.moduleNameCamelCased,
        path: this.props.path
      }
    );

    // Component
    this.fs.copyTpl(
      this.templatePath('./src/foo-module/foo-components/foo/foo.component.ts.template'),
      this.destinationPath(
        `./src/${this.props.path}/components/${this.props.path}/${
          this.props.path
        }.component.ts`
      ),
      {
        moduleName: this.props.moduleName,
        path: this.props.path,
        scope: this.props.scope,
        scopeName: this.props.scopeName
      }
    );

    this.fs.copyTpl(
      this.templatePath(
        './src/foo-module/foo-components/foo/foo.component.spec.ts.template'
      ),
      this.destinationPath(
        `./src/${this.props.path}/components/${this.props.path}/${
          this.props.path
        }.component.spec.ts`
      ),
      {
        moduleName: this.props.moduleName,
        path: this.props.path
      }
    );

    // Package.json
    this.fs.copyTpl(
      this.templatePath('package.json.template'),
      this.destinationPath(`package.json`),
      {
        description: this.props.description,
        developerName: this.props.developerName,
        license: this.props.license,
        moduleName: this.props.moduleName,
        noneDefaultRegistry: this.props.noneDefaultRegistry,
        npmRegistryUrl: this.props.npmRegistryUrl,
        path: this.props.path,
        repoUrl: this.props.repoUrl,
        scope: this.props.scope,
        scopeName: this.props.scopeName
      }
    );

    mkdir.sync('./angular');
  }

  install() {
    this.npmInstall();
  }

  end() {
    var successMessage = `Successfully created Angular Module ${this.props.moduleName}`;
    this.log(chalk.green(successMessage));

    var configMessage = `
add this to your ./angular/tsconfig.json:

"paths": {
  "@${this.props.path}": ["./../src/index.ts"], // convenience setup for angular project
  "@angular/*": ["./node_modules/@angular/*"]  // only use local angular to avoid circular dependecy
}

    `;
    this.log(configMessage);

    var angularMessage = `ng new angular --skip-git --directory ./angular/`;
    this.log(chalk.inverse(angularMessage));
  }
};
