import * as React from 'react'
import { createContext } from 'react'
import { Action, Store, Unsubscribe } from 'redux'

/**
 * Create Consumer and Provider components using the given store.
 */
export default function createReduxContext<
  S = any,
  A extends Action<any> = Action<any>,
  M = S
>(
  store: Store<S, A>,
  defaultState?: M,
  mapper: (storeState: S) => M = storeState => (storeState as any) as M
) {
  const initialState = mapper(store.getState())
  const { Consumer, Provider } = createContext(defaultState || initialState)

  return {
    /**
     * This Consumer component will have the store's state tree as its `value`.
     *
     * @example
     * <Consumer>
     *   {value => (
     *     <div>...{value.something.something}...</div>
     *   )}
     * </Consumer>
     */
    Consumer,

    /**
     * This Provider component doesn't need (or want) a `value` manually
     * specified, as it will automatically pass down the store's state tree as
     * its `value` for the context.
     *
     * @example
     * <Provider>
     *   <div>...</div>
     * </Provider>
     */
    Provider: class extends React.Component<
      {},
      { value: M; unsubscribe: Unsubscribe }
    > {
      static displayName = 'Provider'
      static propTypes = {}
      state = {
        value: initialState,
        unsubscribe: store.subscribe(() => {
          const newValue = mapper(store.getState())
          if (newValue === this.state.value) {
            return
          }

          this.setState(state => ({
            ...state,
            value: newValue
          }))
        })
      }

      componentWillUnmount() {
        this.state.unsubscribe()
      }

      render() {
        return (
          <Provider value={this.state.value}>{this.props.children}</Provider>
        )
      }
    }
  }
}
