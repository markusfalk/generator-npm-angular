# npm-angular

> A generator used to scaffold Angular modules to be published to npm.

## Features

* :package: Quickly create npm packages that contain Angular modules
* :gem: Publish with or without scope
* :postbox: Use official or your own registry
* :open_file_folder: Clean project structure 
* :broken_heart: Seperated Angular development environment 
* :no_entry: Uses strictest typescript setup possible
* :de: Made in Germany

### tl;dr

This generator can be used to create npm packages that contain Angular modules, services, components and so on. 

It is a biased set of conventions and configurations that you should bend to your needs.

It seperates and includes your module to an Angular CLI installation so that you can develop and test your module in the target environment before publishing.

## Quick Start

### Setup a new npm angular project

```bash
npm i -g yo # install yeoman if you have not already
npm i -g npm-angular # install npm-angular
yo npm-angular # start npm-angular
ng new your-angular --skip-git --directory ./angular/ # add angular
```

See Mandatory Angular Setup after successful installation.

### Start package development

```bash
tsc -w
```

### Start Angular with your integrated module

```bash
cd ./angular
ng serve
ng test
```

## Mandatory Angular configuration

### ./angular/tsconfig.json

```jsonc
"paths": {
  "@your-module-name": ["./../src/index.ts"], // convenience setup for angular project
  "@angular/*": ["./node_modules/@angular/*"]  // only use local angular to avoid circular dependecy
}
```

### Tests

To not have to setup and maintain another seperate test environment npm-angular uses Angular's existing setup in `./angular/`

To make this work tests created for your npm package need some extra setup. 

#### ./src/*.spec.ts

Reset and initialize Angular's test environment with every new `TestBed`.

```javascript
import { TestBed, async } from '@angular/core/testing';
import { TestedComponent } from './tested.component';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing'; // new

describe('TestedComponent', () => {

  beforeEach(async(() => {

    TestBed.resetTestEnvironment(); // new
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting()); // new

    TestBed.configureTestingModule({
      declarations: [
        TestedComponent
      ],
    }).compileComponents();

  }));

  it('should create TestedComponent', async(() => {
    const fixture = TestBed.createComponent(TestedComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

});
```

#### ./angular/test.ts

After installing Angular in `./angular/` you need to add an additional context to Angular's `test.ts`.

```javascript
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
const contextNpmAngular = require.context('./../../src/', true, /\.spec\.ts$/) // new;

// And load the modules.
context.keys().map(context);
contextNpmAngular.keys().map(contextNpmAngular); // new
```

#### ./angular/tsconfig.spec.json

Add npm-angular's folder to the Angular testing setup.

```jsonc
"include": [
  "../../src/**/*.spec.ts", //  new - ng test your module in ./angular
  "**/*.spec.ts",
  "**/*.d.ts"
]
```

## Project structure

```
|- src
    |- index.ts
    |- module-name
        |- module-name.module.ts
        |- components
        |- services
        |- directives
        |- ...
|- angular
...
```

### ./src

Contains what will be published with the package. 

In here you are free to create any structure of angular components as you wish. Initially it contains the packages main file `index.ts` and one module folder. 

### ./angular

Contains an Angular project that imports your package module so that you can develop and test it in the Angular environment.

## Styles and Templates in Components

When creating a new component, note that npm-angular will not publish or compile `SCSS/CSS` or `HTML`. 

You need to add styles and templates *inline*. 

```javascript
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'your-componente',
  template: `
    <p>YourComponent works</p>
  `,
  styles: [`
    p { color: paleturquoise };
  `]
})
export class YourComponent implements OnInit {
  constructor() { }
  ngOnInit() { }
}
```
