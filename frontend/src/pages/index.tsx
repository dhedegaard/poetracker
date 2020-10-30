import { Provider } from 'react-redux'
import MainContainer from '../containers/main'
import store from '../store'

const Index = () => (
  <Provider store={store}>
    <MainContainer />
  </Provider>
)

export default Index
