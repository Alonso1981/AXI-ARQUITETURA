import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Styles from './pages/Styles';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Login from './pages/Admin/Login';
import Dashboard from './pages/Admin/Dashboard';
import ProjectDetail from './pages/ProjectDetail';
import StyleDetail from './pages/StyleDetail';
import BlogPostDetail from './pages/BlogPostDetail';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen flex flex-col bg-white text-zinc-900 font-sans">
          <Navbar user={user} />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home user={user} />} />
              <Route path="/portfolio" element={<Portfolio user={user} />} />
              <Route path="/portfolio/:slug" element={<ProjectDetail user={user} />} />
              <Route path="/estilos" element={<Styles user={user} />} />
              <Route path="/estilos/:slug" element={<StyleDetail user={user} />} />
              <Route path="/blog" element={<Blog user={user} />} />
              <Route path="/blog/:slug" element={<BlogPostDetail user={user} />} />
              <Route path="/contato" element={<Contact user={user} />} />
              <Route path="/admin/login" element={<Login user={user} />} />
              <Route 
                path="/admin/*" 
                element={user ? <Dashboard user={user} /> : <Navigate to="/admin/login" />} 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  );
}
