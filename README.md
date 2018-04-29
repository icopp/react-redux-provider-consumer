# `react-redux-provider-consumer`

This is a small library meant to serve as an alternative to
[React Redux](https://github.com/reactjs/react-redux) for people who want to cut
down on the number of HOCs they're using. It uses the new React Context API
(React 16.3+ only) to supply Redux state values via context, letting you
reference them inside your other components using a Consumer render prop instead
of needing to wrap the entire component in a HOC.

Keep in mind that right now, this doesn't offer any of the advanced features of
React Redux, and doesn't even offer many of the basic ones (like mapping state
and dispatch props). This initial version is meant to be a proof of concept
rather than immediately covering all bases.

## API

### `createReduxContext`

```js
createReduxContext(
  store: Redux.Store<S>,
  defaultState?: S
): {
  Provider: React.Component<{}>,
  Consumer: React.Consumer<S>
}
```

Returns a `Provider` and `Consumer` usable as noted below.

If `defaultState` is given, that will be the default `value` for any use of
`Consumer` outside of a tree with `Provider` (for example, for testing
components in isolation). If it isn't, the default `value` for `Consumer` will
be the first loaded state from `store` (which should usually be your initial
state if you're setting up everything synchronously, but might not be if you
have async loading going on).

#### Example of use

```js
import { createReduxContext } from 'react-redux-provider-consumer'
import store from '../store' // or wherever your store is exported

const { Provider, Consumer } = createReduxContext(store)

export const UserId = () => (
  <span>
    Your user ID is: <Consumer>{state => state.userId}</Consumer>
  </span>
)

export const App = () => (
  <Provider>
    <div>
      <p>Welcome to the app!</p>
      <p>
        <UserId />
      </p>
    </div>
  </Provider>
)
```
