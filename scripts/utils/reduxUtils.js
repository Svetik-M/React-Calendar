export function createReducer(initialState, handlers) {
  return (state = initialState, action) =>
    action
    && action.type
    && Object.prototype.hasOwnProperty.call(handlers, action.type)
    && handlers[action.type](state, action)
    || state;
}
