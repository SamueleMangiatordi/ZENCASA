import {
  BrowserRouter as Router, //definisce il contesto del router
  Routes, //contiene tutti i percorsi delel'app
  Route //definisce singole rotte e pagine corrispondenti
} from 'react-router-dom'; //gestisce la navigazione
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import Register from './pages/Register';
import CompletaProfilo from './pages/CompletaProfilo';
import ProductsCatalog from './pages/Catalog';
import Cart from './pages/Cart';
import Catalog from './pages/Catalog';
import User from './pages/User';
import ServicePage from './pages/ServicePage';

import {AuthProvider} from "./data/authContext";


function App() {
  //const [cartItems, setCartItems] = useState([]); //mantiene lo stato per il carrello, cartItems mantiene gli elementi.
  //const [products, setProducts] = useState([]); // Stato per i prodotti
  //const [loading, setLoading] = useState(true); // Stato di caricamento
  //const [error, setError] = useState(null); // Stato per gli errori

  return (
    <AuthProvider> {/* Avvolgiamo in authProvider l'app che fornisce contesto navigazione*/ }
    <Router>  {/* Definisce il router per gestire la navigazione dell'app. */ }
      <div>
        <Routes> {/* Contiene tutte le rotte */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="/products" element={<ProductsCatalog/>}/>
          <Route path="/products/:documentId" element={<Catalog />} />
          <Route path="/register" element={<Register />} />
          <Route path="/completa-profilo" element={<CompletaProfilo />} />
          <Route path="/cart" element={<Cart/>} />
          <Route path="/cart?session_id={CHECKOUT_SESSION_ID}" element={<Cart />} /> {/* Utilizzato per gestire il ritorno dal pagamento stripe*/}
          <Route path="/user" element={<User/>} />
          <Route path="/service" element={<ServicePage />} />
        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;