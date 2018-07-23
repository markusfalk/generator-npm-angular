# ng-npm-generator

A yeoman generator used to create angular packages for npm

## Prerequisits

* Angular ^6

## Quick Start

```javascript
npm i -g npm-angular
yo npm-angular
npm run tsc -w
```

## Testing

## *.spec.ts in external module

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

after angular setup you need to add a new context for the external specs.

```javascript
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
const contextExternal = require.context('./../../src/', true, /\.spec\.ts$/) // new;

// And load the modules.
context.keys().map(context);
contextExternal.keys().map(contextExternal); // new
```

### tsconfig.spec.json in angular project

Add the external folder to the angular setup

```javascript
"include": [
  "../../src/**/*.spec.ts", //  new
  "**/*.spec.ts",
  "**/*.d.ts"
]
```
## Convenience setup

You can also add the external module to the path of the angular project to resolve short and readable imports

```javascript
"paths": {
  "@your-module-name": [
    "./../src/index.ts"
  ]
}
```
