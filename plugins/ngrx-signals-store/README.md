# NgRx Signal Store Generator

An Nx generator for creating NgRx Signal Stores with TypeScript support.

## Installation

```bash
npm install @kav-khalsa/ngrx-signal-store --save-dev
```

## Usage

```bash
nx generate @kav-khalsa/ngrx-signal-store:signals-store
```

You will be prompted for:
- Store name
- Target project
- Path for the store
- Prefix (default: "app")
- Angular Service to integrate with
- Method in Angular service to retrieve data from
- Whether to skip tests
- State properties with their types

Example:
```bash
nx generate @kav-khalsa/ngrx-signal-store:signals-store todo --path=libs/todo-feature --stateProperties="selectedId:string"
```

This will generate a `todo.store.ts` file with:
- Typed state interface
- Initial state
- Computed properties
- Methods for state updates



## License

MIT