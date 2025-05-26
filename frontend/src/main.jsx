import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ApolloClient,InMemoryCache,ApolloProvider } from '@apollo/client'

const client = new ApolloClient({
  uri: 'https://starwars-1-nvqt.onrender.com',
  cache: new InMemoryCache(),
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={client}>
    <App />
    </ApolloProvider>
  </StrictMode>,
)
