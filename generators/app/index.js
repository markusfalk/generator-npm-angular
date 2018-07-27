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
        message: 'Do you want to publish your package under a scope?',
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
        type: 'input',
        name: 'npmRegistryUrl',
        message: 'What is the NPM Registry URL?',
        default: 'http://registry.npmjs.org/',
        store: true
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
        path: this.props.path
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
        moduleName: this.props.moduleName,
        path: this.props.path,
        description: this.props.description,
        npmRegistryUrl: this.props.npmRegistryUrl,
        repoUrl: this.props.repoUrl,
        developerName: this.props.developerName,
        license: this.props.license,
        scope: this.props.scope,
        scopeName: this.props.scopeName
      }
    );

    mkdir.sync('./angular');
  }

  install() {
    // This.npmInstall();
  }

  end() {
    var successMessage = `Successfully created Angular Module ${this.props.moduleName}`;
    this.log(chalk.green(successMessage));

    var configMessage = `
add this to your ./angular/tsconfig.json for easy imports

"paths": {
  "@${this.props.path}": [
    "./../src/index.ts"
  ]
}
    `;
    this.log(configMessage);

    var angularMessage = `Now run 'ng new angular --directory ./angular/' `;
    this.log(chalk.inverse(angularMessage));
  }
};
