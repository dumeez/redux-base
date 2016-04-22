export default function fetch_component_data (dispatch, components, params) {

  const actions = components.reduce( (prev, current) => {
    return current ? (current.container && current.container.initialActions || []).concat(prev) : prev;
  }, []);

  const promises = actions.map((action) => {
    dispatch(action);
  });

  return Promise.all(promises);
}
