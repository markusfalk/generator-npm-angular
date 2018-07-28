# npm-angular

## What is npm-angular

> A generator used to scaffold Angular modules to be published to npm.

### Features

* Quickly create npm packages that contain Angular modules
* Publish with or without scope
* Use official or your own registry
* Clean project structure 
* Seperated Angular development environment 
* Uses strictest typescript setup possible

### tl;dr

This generator can be used to create npm packages that contain Angular modules, services, components and so on. 

It is a biased set of conventions and configurations that you should bend to your needs.

It seperates and includes your module from an Angular CLI installation so that you can develop and test your module in the target environment before publishing.

#### Project structure

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

##### ./src

Contains what will be published with the package. 

In here you are free to create any structure of angular components as you wish. Initially it contains the packages main file `index.ts` and one module folder. 

##### ./angular

Contains an Angular project that imports your package module so that you can develop and test it in the Angular environment.

## Quick Start

```javascript
npm i -g npm-angular
yo npm-angular
npm run tsc -w
```

## Styles and Templates in Components

When creating a new component, note that npm-angular will not publish or compile `SCSS/CSS` or `HTML`. 

You need to add styles and templates *inline*. 

```javascript
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'your-module',
  template: `
    <p>YourModule works</p>
  `,
  styles: [`
    p { color: paleturquoise }
  `]
})
export class AsdfComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
```

## Testing

To not have to setup and maintain another seperate test environment npm-angular uses Angular's existing setup in `./angular/`

To make this work tests created for your npm package need some extra setup. 

## *.spec.ts in your module

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

### test.ts in angular project

After installing Angular in `./angular/` you need to add an additional context to Angular's `test.ts`.

```javascript
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
const contextNpmAngular = require.context('./../../src/', true, /\.spec\.ts$/) // new;

// And load the modules.
context.keys().map(context);
contextNpmAngular.keys().map(contextNpmAngular); // new
```

### tsconfig.spec.json in angular project

Add npm-angular's folder to the Angular testing setup in `tsconfig.spec.json`.

```json
"include": [
  "../../src/**/*.spec.ts", //  new
  "**/*.spec.ts",
  "**/*.d.ts"
]
```
## Convenience setup

You can also add the external module to the path of the Angular project to resolve short and readable imports.

```json
"paths": {
  "@your-module-name": [
    "./../src/index.ts"
  ]
}
```
## What else

Made in :de:
