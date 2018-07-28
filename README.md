# npm-angular

## What is npm-angular

> A generator used to scaffold Angular modules as npm packages.

### tl;dr

This generator can be used to create npm packages that contain Angular modules, services, components and so on. 

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

##### ./angular

Contains an Angular project that imports your package module so that you can develop and test it in the Angular environment.

## Quick Start

```javascript
npm i -g npm-angular
yo npm-angular
npm run tsc -w
```

## Testing

To not have to setup and maintain another test environment npm-angular uses Angular's existing setup in `./angular/`

To make this work tests created for your npm package need some extra setup. 

## *.spec.ts in external module

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
